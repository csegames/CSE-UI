/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { request as httpRequest } from '../utils/request';
import { DocumentNode } from 'graphql';
import * as Raven from 'raven-js';
import { print } from 'graphql/index.js';
import { Dictionary } from '../types/ObjectMap';
import { RequestConfig } from '../types/Request';

export interface GraphQLQueryRequest {
  query: DocumentNode;
  variables?: Dictionary<any>;
}

export interface GraphQLQueryResult<T> {
  data: T;
  ok: boolean;
  status: number;
  statusText: string;
}

export async function query<T>(request: GraphQLQueryRequest, getConfig: RequestConfig): Promise<GraphQLQueryResult<T>> {
  const config = getConfig();
  const body = { query: print(request.query) };
  if (request.variables) body['variables'] = request.variables;
  const response = await httpRequest('post', config.url, config.headers, {}, body);

  try {
    const result = response.ok ? JSON.parse(response.data) : {};
    return {
      data: result.data as T,
      ok: result.data !== undefined && result.errors === undefined,
      status: result.status,
      statusText: result.statusText
    };
  } catch (ex) {
    Raven.captureException(ex);
    console.error(ex);
    return {
      data: <T>null,
      ok: false,
      status: response.status,
      statusText: ex
    };
  }
}
