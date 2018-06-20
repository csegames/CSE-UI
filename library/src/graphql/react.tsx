/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import {
  query,
  QueryOptions,
  GraphQLQuery,
  parseQuery,
  defaultQueryOpts,
  defaultQuery,
} from './query';
import {
  subscribe,
  Subscription,
  defaultSubscription,
  SubscriptionResult,
  SubscriptionManager,
  Options as SubscriptionOptions,
  defaultSubscriptionOpts,
  Options,
} from './subscription';
import { withDefaults } from '../utils/withDefaults';
import { ObjectMap } from '../utils/ObjectMap';
import { Omit } from '../utils/typeUtils';
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
  public lastQuery:  {
    query: string;
    variables: ObjectMap<any>;
    headers?: ObjectMap<string> | null;
    apiHost?: string;
    namedQuery?: string;
    operationName?: string;
  };

  constructor(options: QueryOptions) {
    this.conf = options;
  }

  public query = async (query: GraphQLQuery) => {
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
      operationName: this.lastQuery.operationName,
      namedQuery: this.lastQuery.namedQuery,
      variables: this.lastQuery.variables,
    }, this.conf);
  }
}

export interface GraphQLConfig extends QueryOptions {
}

let queryConf = withDefaults(null, defaultQueryOpts);
function getQueryOptions() {
  return {
    ...defaultGraphQLOptions,
    ...queryConf,
  };
}

let subsConf = withDefaults(null, defaultSubscriptionOpts);
function getSubscriptionOptions() {
  return {
    ...defaultSubscriptionOpts,
    ...subsConf,
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

export function useConfig(queryConfig: Partial<GraphQLConfig>, subscriptionConfig: Partial<Options<any>>) {
  queryConf = withDefaults(queryConfig, queryConf);
  subsConf = withDefaults(subscriptionConfig, subsConf);
}

export type GraphQLQueryOptions = Partial<GraphQLQuery> &  Partial<GraphQLOptions>;
export type GraphQLSubscriptionOptions<DataType> = Partial<Subscription> & Partial<SubscriptionOptions<DataType>>;

export interface GraphQLProps<QueryDataType, SubscriptionDataType> {
  query?: string | GraphQLQueryOptions;
  subscription?: string | GraphQLSubscriptionOptions<SubscriptionDataType>;
  initialData?: QueryDataType;
  onQueryResult?: (result: GraphQLResult<QueryDataType>) => void;
  subscriptionHandler?: (result: SubscriptionResult<SubscriptionDataType>, data: QueryDataType) => QueryDataType;
}

export interface GraphQLState<T> extends GraphQLData<T> {

}

export class GraphQL<QueryDataType, SubscriptionDataType> 
  extends React.Component<GraphQLProps<QueryDataType, SubscriptionDataType>, GraphQLState<QueryDataType>> {
  private client: GraphQLClient;
  private query: GraphQLQuery | undefined;
  private queryOptions: GraphQLOptions;
  private subscription: Subscription | undefined;
  private subscriptionOptions: Options<any>;
  private pollingTimeout: number | null = null;
  private subscriptionID: string;
  private subscriptionManager: SubscriptionManager;

  constructor(props: GraphQLProps<QueryDataType, SubscriptionDataType>) {
    super(props);
    this.state = {
      data: props.initialData || null,
      loading: false,
      lastError: null,
    };

    if (props.query) {
      const q = typeof props.query === 'string' ? { query: props.query } : props.query;
      this.query = withDefaults(q, defaultQuery);
      const qp = typeof props.query === 'string' ? {} : props.query;
      this.queryOptions = withDefaults<GraphQLOptions>(qp, getQueryOptions());

      this.client = new GraphQLClient({
        url: this.queryOptions.url,
        requestOptions: this.queryOptions.requestOptions,
        stringifyVariables: this.queryOptions.stringifyVariables,
      });
    }

    if (props.subscription) {
      const s = typeof props.subscription === 'string' ? { query: props.subscription } : props.subscription;
      this.subscription = withDefaults(s, defaultSubscription);
      this.subscriptionOptions = withDefaults<Options<any>>(s, getSubscriptionOptions());
    }
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

  public shouldComponentUpdate(nextProps: GraphQLProps<QueryDataType, SubscriptionDataType>,
      nextState: GraphQLState<QueryDataType>) {
    if (!_.isEqual(this.state.data, nextState.data)) return true;
    if (!_.isEqual(this.props, nextProps)) return true;
    return false;
  }

  public componentDidMount() {
    if (this.queryOptions.pollInterval > 0) {
      this.pollingRefetch();
    } else if (this.state.data === null) {
      this.refetch();
    }

    if (this.props.subscription) {
      const result = subscribe(this.subscription, this.subscriptionHandler,
        this.subscriptionOptions, this.subscriptionError);
      this.subscriptionID = result.id;
      this.subscriptionManager = result.subscriptions;
    }
  }

  public componentWillReceiveProps(nextProps: GraphQLProps<QueryDataType, SubscriptionDataType>) {
    if (!_.isEqual(this.props.query, nextProps.query)) {
      const q = typeof nextProps.query === 'string' ? { query: nextProps.query } : nextProps.query;
      this.query = withDefaults(q, defaultQuery);
    }
  }

  public componentWillUnmount() {
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
      this.pollingTimeout = null;
    }

    if (this.subscriptionManager) {
      this.subscriptionManager.stop(this.subscriptionID);
    }
  }

  private subscriptionHandler = (result: SubscriptionResult<SubscriptionDataType>) => {
    if (!this.props.subscriptionHandler) return;
    const data = this.props.subscriptionHandler(result, this.state.data);
    this.setState({ data });
    this.props.onQueryResult && this.props.onQueryResult({
      ...this.state,
      data: data as QueryDataType,
      client: this.client,
      refetch: this.refetch,
    });
  }

  private subscriptionError = (e: ErrorEvent) => {
    console.error(e);
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
    this.pollingTimeout = window.setTimeout(this.pollingRefetch, this.queryOptions.pollInterval);
  }
}

export function withGraphQL<
  PropsType extends GraphQLInjectedProps<QueryDataType | null>,
  QueryDataType = any>(
  query?: string | Partial<GraphQLQuery> | ((props: PropsType) => Partial<GraphQLQuery>),
  options?: Partial<GraphQLOptions> | ((props: PropsType) => Partial<GraphQLOptions>)) {

  return (WrappedComponent: React.ComponentClass<PropsType> | React.StatelessComponent<PropsType>) => {
    return class extends React.Component<Omit<PropsType, keyof GraphQLInjectedProps<QueryDataType>>,
      GraphQLData<QueryDataType | null>> {

      public queryProp: Partial<GraphQLQuery> & Partial<GraphQLOptions>;
      constructor(props: any) {
        super(props);
        const q = typeof query === 'function' ? query(props) : query;
        const opts = typeof options === 'function' ? options(props) : options;

        if (typeof q === 'string') {
          this.queryProp = {
            query: q,
            ...opts,
          };
        } else {
          this.queryProp = {
            ...q,
            ...opts,
          };
        }
      }
      public render() {
        return (
          <GraphQL query={this.queryProp}>
            {
              (graphql: GraphQLResult<QueryDataType>) => <WrappedComponent graphql={graphql} {...this.props} />
            }
          </GraphQL>
        );
      }
    };
  };
}
