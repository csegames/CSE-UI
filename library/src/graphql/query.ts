/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { request as httpRequest, RequestOptions } from '../utils/request';
import { DocumentNode } from 'graphql';
import * as Raven from 'raven-js';

// issues with graphql .mjs file usage
// tslint:disable-next-line
const { print } = require('graphql/language/printer.js');

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
}

export const defaultQueryOpts: QueryOptions = {
  url: '/graphql',
  requestOptions: {
    headers: {},
    ignoreCache: false,
    timeout: 5000,
  },
  stringifyVariables: false,
};

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

export async function query<T>(query: GraphQLQuery, options?: Partial<QueryOptions>): Promise<GraphQLQueryResult<T>> {

  const q = withDefaults(query, defaultQuery);
  const opts = withDefaults(options, defaultQueryOpts);

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
