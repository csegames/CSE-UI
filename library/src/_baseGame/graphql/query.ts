/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { request as httpRequest, RequestOptions } from '../utils/request';
import { DocumentNode } from 'graphql';
import * as Raven from 'raven-js';
import { print } from 'graphql/index.js';
import { isValidUrl } from '../utils/index';


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

export function getMockModeUrl(defaultUrl: string) {
  switch (game.uiMockMode) {
    case MockMode.TotalNetworkFailure: {
      return `${defaultUrl}:1234`;
    }

    case MockMode.PartialNetworkFailure: {
      const shouldUseDefault = Math.round(Math.random());
      return shouldUseDefault ? defaultUrl : `${defaultUrl}:1234`;
    }

    default: {
      return defaultUrl;
    }
  }
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

  const opts = withDefaults(options, game.graphQL.defaultOptions());
  const body = requests
    .map(r => withDefaults(r.query, defaultQuery))
    .map(q => ({
      ...q,
      query: parseQuery(q.query),
      variables: opts.stringifyVariables ? JSON.stringify(q.variables) : q.variables,
    }));

  console.log(`executing batched graphql with ${requests.length} batched requests to ${opts.url}.`);
  if (!isValidUrl(opts.url)) {
    console.log('invalid url: ' + opts.url);
    return;
  }

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
      console.error(`GraphQL Batch request response ok. Got back ${results.length} out of expected ${requests.length} results...`);

      // NOTE: We assume same order of responses to requests
      for (let i = 0; i < requests.length; ++i) {

        if (i >= results.length) {
          break;
        }

        const result = results[i];
        var requestItem = requests[i];

        try {
          var requestShortDescription = parseQuery(requestItem.query.query).slice(0, 30).replace("\n", "\\n");

          console.error(`Sent request ${requestShortDescription} and got back response ${result.data}`);

          requestItem.resolve({
            data: result.data,
            ok: result.data !== undefined && result.errors === undefined,
            statusText: result.errors ? result.errors.map(getMessage).join(' ') : 'OK',
            statusCode: result.status,
          });
        } catch (ex) {
          Raven.captureException(ex);
          console.error(`Failed to process response to request ${requestShortDescription}`);
        }
      }
    }

    // TODO log sentry error here?
    const errorMessage = response.statusText || response.data;
    if (response.statusText != "OK") {
      console.error(
        `Batch GraphQL Request Error on ${requests.length} requests:`,
        {
          errors: errorMessage,
        },
      );
      console.error(response.statusText);
      console.error(response.data.slice(0, 500));
      console.error(response.data.slice(-500));
      console.error(new Error().stack)
      for (let i = 0; i < requests.length; ++i) {
        var requestItem = requests[i];
        requestItem.reject(errorMessage)
      }
    }

  } catch (err) {
    Raven.captureException(err);
    console.error(err)
  }
}

export async function query<T>(query: GraphQLQuery, options?: Partial<QueryOptions>): Promise<GraphQLQueryResult<T>> {
  const opts = withDefaults(options, game.graphQL.defaultOptions());

  // disable all batching globally for now
  if (false && opts.disableBatching == false) {
    // batch the query.

    if (batchHandle === null) {
      batchHandle = window.setTimeout(() => batchedQuery(opts), Batching_Interval);
    }

    return new Promise<GraphQLQueryResult<T>>((resolve, reject) => {
      queryQueue.push({
        query,
        resolve,
        reject
      });
    });
  }

  if (!isValidUrl(opts.url)) {
    console.trace();
    console.log('invalid url: ' + opts.url);
    return;
  }

  const q = withDefaults(query, defaultQuery);
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
          `GraphQL ${q.operationName} Server Error:`,
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
        `GraphQL '${q.operationName}' Request Error: ${errorMessage}`,
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
      console.error(new Error().stack);
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
    console.error(err)
    return errorResult(err, 400);
  }
}


