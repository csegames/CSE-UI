/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { query, QueryOptions, QuickQLQuery, parseQuery, defaultQueryOpts, defaultQuickQLQuery } from './query';
import { ObjectMap, Omit, withDefaults } from './utils';

export interface WithGraphQLOptions extends QueryOptions {
  // if set to a number greater than 0, in ms, the component will poll the server on an interval
  // skipping the cache (default: 0)
  pollInterval: number;
  
  // No cache support yet
  // Should we use the GraphQL cache? (default: true)
  // useCache: boolean;
}

const defaultWithGraphQLOptions : WithGraphQLOptions = {
  ...defaultQueryOpts,
  pollInterval: 0,
  // useCache: true,
};

export class GraphQLClient {
  private conf: QueryOptions;
  public lastQuery: {
    query: string;
    variables: ObjectMap<any>;
    headers?: ObjectMap<string> | null;
    apiHost?: string;
  };

  constructor(options: QueryOptions) {
    this.conf = options;
  }

  public query = async (query: QuickQLQuery) => {
    this.lastQuery = query as any;
    this.lastQuery.query = parseQuery(query.query);
    return await this.refetch();
  }

  public refetch = async () => {
    if (!this.lastQuery) {
      return {
        data: null,
        ok: false,
        statusText: 'No query to refetch.',
      };
    }
    return await query({
      query: this.lastQuery.query,
      operationName: null,
      namedQuery: null,
      variables: this.lastQuery.variables,
    }, this.conf);
  }
}

export interface GraphQLConfig extends QueryOptions {
}

let conf = withDefaults(null, defaultQueryOpts);

function getOptions() {
  return {
    ...defaultWithGraphQLOptions,
    url: conf.url,
    requestOptions: conf.requestOptions,
  };
}

export interface GraphQLData<T> {
  data: T;
  loading: boolean;
  lastError: string;
}

export interface GraphQLProps<T> extends GraphQLData<T> {
  client: GraphQLClient;
  refetch: () => void;
}

export interface GraphQLInjectedProps<T> {
  graphql: GraphQLProps<T>;
}

export function useConfig(config: Partial<GraphQLConfig>) {
  conf = withDefaults(config, conf);
}

export function withGraphQL<PropsType extends GraphQLInjectedProps<QueryDataType | null>,
    QueryDataType = any>(query: string | Partial<QuickQLQuery>, options?: Partial<WithGraphQLOptions>) {
  
  return (WrappedComponent: React.ComponentClass<PropsType> | React.StatelessComponent<PropsType>) => {
    return class extends React.Component<Omit<PropsType, keyof GraphQLInjectedProps<QueryDataType>>,
      GraphQLData<QueryDataType | null>> {
      
      public client: GraphQLClient;
      public query: QuickQLQuery;
      public opts: WithGraphQLOptions;
      public pollingTimeout: number | null = null;
      
      constructor(props: Omit<PropsType, keyof GraphQLInjectedProps<QueryDataType>>) {
        super(props);
        this.state = {
          data: null,
          loading: true,
          lastError: '',
        };

        this.query = withDefaults(typeof query === 'string' ? {query} : query, defaultQuickQLQuery);
        this.opts = withDefaults(options, getOptions());

        this.client = new GraphQLClient({
          url: this.opts.url,
          requestOptions: this.opts.requestOptions,
          stringifyVariables: this.opts.stringifyVariables,
        });
      }

      public componentDidMount() {
        if (this.opts.pollInterval > 0) {
          this.pollingRefetch();
        } else if (this.state.data === null) {
          this.refetch();
        }
      }

      public componentWillUnmount() {
        if (this.pollingTimeout) {
          clearTimeout(this.pollingTimeout);
          this.pollingTimeout = null;
        }
      }

      public refetch = async () => {
        if (this.state.loading === false) {
          this.setState({
            loading: true,
          });
        }
        const result = await this.client.query(this.query);
        this.setState({
          data: result.data as QueryDataType,
          loading: false,
          lastError: result.statusText,
        });
      }

      public pollingRefetch = async () => {
        await this.refetch();
        this.pollingTimeout = setTimeout(this.pollingRefetch, this.opts.pollInterval);
      }

      public render() {
        return (
          <WrappedComponent
            graphql={{
              client: this.client,
              refetch: this.refetch,
              ...this.state,
            }}
            {...this.props}
          />
        );
      }
    };
  };
}
