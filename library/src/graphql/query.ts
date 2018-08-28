/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { request as httpRequest, RequestOptions } from '../utils/request';
import { withDefaults } from '../utils/withDefaults';
import { ObjectMap } from '../utils/ObjectMap';
import { DocumentNode } from 'graphql';

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
  operationName: string | null;
  namedQuery: string | null;
  query: string | LegacyGraphqlDocumentNode | DocumentNode;
  variables: ObjectMap<any> | null;
}

export const defaultQuery: GraphQLQuery = {
  operationName: null,
  namedQuery: null,
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

function errorResult(msg: string) {
  return {
    data: <null>null,
    ok: false,
    statusText: msg,
  };
}

function getMessage(obj: { message: string }) {
  return obj.message;
}

export async function query<T>(query: GraphQLQuery, options?: Partial<QueryOptions>) {

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
          'GraphQL Error:',
          {
            errors: result.errors.map(getMessage).join(' '),
            query: q.query,
            operationName: q.operationName,
            namedQuery: q.namedQuery,
            variables: JSON.stringify(q.variables),
          },
        );
      }
      return {
        data: result.data as T,
        ok: result.data !== undefined && result.errors === undefined,
        statusText: result.errors === undefined ? 'OK' : result.errors.map(getMessage).join(' '),
      };

    }

    // TODO log sentry error here?
    console.error(
      'GraphQL Error:',
      {
        errors: response.statusText,
        query: q.query,
        operationName: q.operationName,
        namedQuery: q.namedQuery,
        variables: JSON.stringify(q.variables),
      },
    );
    return errorResult(response.statusText);

  } catch (err) {
    return errorResult(err);
  }
}
