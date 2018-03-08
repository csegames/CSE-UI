/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { query, QueryOptions, QuickQLQuery, parseQuery, defaultQueryOpts, defaultQuickQLQuery } from './query';
import { ObjectMap, Omit, withDefaults } from './utils';
import { ErrorBoundary } from '../components/ErrorBoundary';

export interface GraphQLOptions extends QueryOptions {
  // if set to a number greater than 0, in ms, the component will poll the server on an interval
  // skipping the cache (default: 0)
  pollInterval: number;
  
  // No cache support yet
  // Should we use the GraphQL cache? (default: true)
  // useCache: boolean;
}

const defaultGraphQLOptions : GraphQLOptions = {
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
    ...defaultGraphQLOptions,
    ...conf,
  };
}

export interface GraphQLData<T> {
  data: T;
  loading: boolean;
  lastError: string;
}

export interface GraphQLResult<T> extends GraphQLData<T> {
  client: GraphQLClient;
  refetch: () => void;
}

export interface GraphQLInjectedProps<T> {
  graphql: GraphQLResult<T>;
}

export function useConfig(config: Partial<GraphQLConfig>) {
  conf = withDefaults(config, conf);
}


export interface GraphQLProps<QueryDataType> extends Partial<GraphQLOptions> {
  query?: string | Partial<QuickQLQuery>;
  onQueryResult?: (result: GraphQLResult<QueryDataType>) => void;
}

export interface GraphQLState<T> extends GraphQLData<T> {

}

export class GraphQL<QueryDataType> extends React.Component<GraphQLProps<QueryDataType>, GraphQLState<QueryDataType>> {
  private client: GraphQLClient;
  private query: QuickQLQuery | undefined;
  private options: GraphQLOptions;
  private pollingTimeout: number | null = null;

  constructor(props: GraphQLProps<QueryDataType>) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      lastError: null,
    };

    if (props.query) {
      const q = typeof props.query === 'string' ? { query: props.query } : props.query;
      this.query = withDefaults(q, defaultQuickQLQuery);
    }

    this.options = withDefaults(props, getOptions());

    this.client = new GraphQLClient({
      url: this.options.url,
      requestOptions: this.options.requestOptions,
      stringifyVariables: this.options.stringifyVariables,
    });
  }

  public render() {
    return (
      <ErrorBoundary renderError={error => <span>GraphQL Component Error: {error}</span>}>
        {
          this.props.children ? (this.props.children as any)({
            ...this.state,
            client: this.client,
            refetch: this.refetch,
          }) : null
        }
      </ErrorBoundary>
    );
  }

  public componentDidMount() {
    if (this.options.pollInterval > 0) {
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

  private refetch = async () => {
    if (!this.query) return;
    if (this.state.loading === false) {
      this.setState({
        loading: true,
      });
    }
    const result = await this.client.query(this.query);
    const state = {
      data: result.data as QueryDataType,
      loading: false,
      lastError: result.statusText,
    };
    this.setState(state);
    this.props.onQueryResult && this.props.onQueryResult({
      ...state,
      client: this.client,
      refetch: this.refetch,
    });
  }

  private pollingRefetch = async () => {
    await this.refetch();
    this.pollingTimeout = setTimeout(this.pollingRefetch, this.options.pollInterval);
  }
}

export function withGraphQL<
  PropsType extends GraphQLInjectedProps<QueryDataType | null>,
  QueryDataType = any>(
  query?: string | Partial<QuickQLQuery> | ((props: PropsType) => Partial<QuickQLQuery>),
  options?: Partial<GraphQLOptions> | ((props: PropsType) => Partial<GraphQLOptions>)) {
  
  return (WrappedComponent: React.ComponentClass<PropsType> | React.StatelessComponent<PropsType>) => {
    return class extends React.Component<Omit<PropsType, keyof GraphQLInjectedProps<QueryDataType>>,
      GraphQLData<QueryDataType | null>> {
      public render() {
        return (
          <GraphQL query={query} {...options}>
            {
              (graphql: GraphQLResult<QueryDataType>) => <WrappedComponent graphql={graphql} {...this.props} />
            }
          </GraphQL>
        );
      }
    };
  };
}
