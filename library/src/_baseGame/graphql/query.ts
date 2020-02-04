/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { request as httpRequest, RequestOptions } from '../utils/request';
import { DocumentNode } from 'graphql';
import * as Raven from 'raven-js';
import { print } from 'graphql/index.js';


const Batching_Interval = 500; // ms time for batching requests from first request.

// Query Definition as defined by apollo-codegen
export interface LegacyGraphqlDefinition {
  kind: string;
  name: {
    value: string,
  };
  loc: {
    source: {
      body: string,
    },
  };
}

export interface LegacyGraphqlDocumentNode {
  definitions: LegacyGraphqlDefinition[];
}

export interface QueryOptions {
  url: string;
  requestOptions: RequestOptions;
  stringifyVariables: boolean;
  disableBatching: boolean;
}

export interface GraphQLQuery {
  operationName?: string | null;
  namedQuery?: string | null;
  useNamedQueryCache?: boolean;
  query?: string | LegacyGraphqlDocumentNode | DocumentNode;
  variables?: Dictionary<any> | null;
}

export interface GraphQLQueryResult<T> {
  data: T;
  ok: boolean;
  statusText: string;
  statusCode: number;
}

export const defaultQuery: GraphQLQuery = {
  operationName: null,
  namedQuery: null,
  useNamedQueryCache: true,
  query: '{}',
  variables: null,
};

export function parseQuery(query: string | LegacyGraphqlDocumentNode | DocumentNode) {
  if (typeof query === 'string') {
    return query;
  }
  if (query.hasOwnProperty('loc') || query.hasOwnProperty('definitions')) {
    return print(query);
  }
  let queryString = '';
  (query as LegacyGraphqlDocumentNode).definitions.forEach((definition: LegacyGraphqlDefinition) => {
    queryString = `${queryString} ${definition.loc.source.body}`;
    return;
  });
  return queryString;
}

function errorResult<T>(msg: string, statusCode: number): GraphQLQueryResult<T> {
  return {
    data: <T> null,
    ok: false,
    statusText: msg,
    statusCode,
  };
}

function getMessage(obj: { message: string }) {
  return obj.message;
}

 let batchHandle = null;
 const queryQueue: {
  query: GraphQLQuery;
  resolve: (data: any) => void;
  reject: (reason: any) => void; 
 }[] = [];


async function batchedQuery<T>(options?: Partial<QueryOptions>): Promise<void> {
  // reset batch Handle
  batchHandle = null;
  const requests = queryQueue.splice(0, queryQueue.length);

  console.log(`executing batched graphql with ${requests.length} batched requests.`);

  const opts = withDefaults(options, game.graphQL.defaultOptions());
  const body = requests
    .map(r => withDefaults(r.query, defaultQuery))
    .map(q => ({
      ...q,
      query: parseQuery(q.query),
      variables: opts.stringifyVariables ? JSON.stringify(q.variables) : q.variables,
    }));

  try {

    const response = await httpRequest('post',
      opts.url,
      {},
      body,
      {
        ...opts.requestOptions,
        headers: {
          ...opts.requestOptions.headers,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    if (response.ok) {

      const results = response.json<any[]>();

      for (let i = 0; i < requests.length; ++i) {

        if (results.length < i) {
          break;
        }

        const result = results[i];
        var requestItem = requests[i];

        requestItem.resolve({
          data: result.data,
          ok: result.data !== undefined && result.errors === undefined,
          statusText: result.errors ? result.errors.map(getMessage).join(' ') : 'OK',
          statusCode: result.status,
        });
      }
    }

    // TODO log sentry error here?
    const errorMessage = response.statusText || response.data;
    if (response.statusText != "OK") {
      console.error(
        'GraphQL Request Error:',
        {
          errors: errorMessage,
        },
      );
      console.error(response.statusText);
      console.error(response.data);
      console.error(new Error().stack)
    }

  } catch (err) {
    Raven.captureException(err);
  }
}

export async function query<T>(query: GraphQLQuery, options?: Partial<QueryOptions>): Promise<GraphQLQueryResult<T>> {

  if (options.disableBatching == false) {
    // batch the query.

    if (batchHandle === null) {
      batchHandle = window.setTimeout(() => batchedQuery(options), Batching_Interval);
    }

    return new Promise<GraphQLQueryResult<T>>((resolve, reject) => {
      queryQueue.push({
        query,
        resolve,
        reject
      });
    });
  }

  const q = withDefaults(query, defaultQuery);
  const opts = withDefaults(options, game.graphQL.defaultOptions());

  try {

    const response = await httpRequest('post',
      opts.url,
      {},
      {
        ...q,
        query: parseQuery(q.query),
        variables: opts.stringifyVariables ? JSON.stringify(q.variables) : q.variables,
      },
      {
        ...opts.requestOptions,
        headers: {
          ...opts.requestOptions.headers,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    if (response.ok) {
      const result = JSON.parse(response.data);
      if (result.errors) {
        // TODO log sentry error here?
        console.error(
          'GraphQL Server Error:',
          {
            errors: result.errors.map(getMessage).join(' '),
            query: q.query,
            operationName: q.operationName,
            namedQuery: q.namedQuery,
            useNamedQueryCache: q.useNamedQueryCache,
            variables: JSON.stringify(q.variables),
          },
        );

        if (game.debug) {
          console.group('GraphQL Request');
          console.log(JSON.stringify(opts));
          console.log(JSON.stringify(q));
          console.log(JSON.stringify(response));
          console.groupEnd();
        }
      }
      return {
        data: result.data as T,
        ok: result.data !== undefined && result.errors === undefined,
        statusText: result.errors === undefined ? 'OK' : result.errors.map(getMessage).join(' '),
        statusCode: result.status,
      } as GraphQLQueryResult<T>;

    }

    // TODO log sentry error here?
    const errorMessage = response.statusText || response.data;
    if (response.statusText != "OK") {
      console.error(
        'GraphQL Request Error:',
        {
          errors: errorMessage,
          query: q.query,
          operationName: q.operationName,
          namedQuery: q.namedQuery,
          useNamedQueryCache: q.useNamedQueryCache,
          variables: JSON.stringify(q.variables),
        },
      );
      console.error(response.statusText);
      console.error(response.data);
      console.error(new Error().stack)
    }
    

    if (game.debug) {
      console.group('GraphQL Request');
      console.log(JSON.stringify(opts));
      console.log(JSON.stringify(q));
      console.log(JSON.stringify(response));
      console.groupEnd();
    }
    return errorResult(errorMessage, 408);

  } catch (err) {
    Raven.captureException(err);
    return errorResult(err, 400);
  }
}


