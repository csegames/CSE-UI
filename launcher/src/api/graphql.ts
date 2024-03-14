/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as shard from './shard-graphql';
import * as primary from './primary-graphql';

export { shard, primary };

// NOTE : this is *not* the right way to bind to the network and is only here until
// it can be replaced with the type of redux store + data source model we use for
// our game clients.

import { GraphQLQueryRequest, GraphQLQueryResult, query } from './query';
import { RequestConfig } from './request';

export class GraphQLClient<T> {
  private conf: RequestConfig;
  public lastQuery: GraphQLQueryRequest;

  constructor(conf: RequestConfig) {
    this.conf = conf;
  }

  public query = async (query: GraphQLQueryRequest) => {
    this.lastQuery = query;
    return await this.refetch();
  };

  public refetch = async (): Promise<GraphQLQueryResult<T>> => {
    if (!this.lastQuery) {
      return Promise.resolve({
        data: <T>null,
        ok: false,
        status: 404,
        statusText: 'No query to refetch.'
      });
    }
    return await query<T>(this.lastQuery, this.conf);
  };
}
