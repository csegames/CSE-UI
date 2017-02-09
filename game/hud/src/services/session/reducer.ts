/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import layout, { LayoutState} from './layout';
import invites, { InvitesState} from './invites';
import ApolloClient, { createNetworkInterface, toIdValue } from 'apollo-client';
import { crashReporterMiddleware, thunkMiddleware } from '../../lib/reduxUtils';
import { client } from 'camelot-unchained';
// Apollo Setup

// define network address
const networkInterface = createNetworkInterface({
  uri: `${client.apiHost}/graphql`,
});

// middleware to send variables as string - required for graphql-dotnet for now (should be changed in future)
const stringifyVariables = {
  applyMiddleware(req: any, next: any) {
    req.request.variables = JSON.stringify(req.request.variables);
    next();
  }
}

// middleware to pass auth info
const authHeaders = {
  applyMiddleware(req: any, next: any) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers['loginToken'] = client.loginToken;
    req.options.headers['shardID'] = client.shardID;
    req.options.headers['characterID'] = client.characterID;
    next();
  }
}

// use middleware
networkInterface.use([stringifyVariables, authHeaders]);


// define where and how to get a unique id
const dataIdFromObject = (result: any) => {
  if (result.__typename && result.id) {
    return result.__typename + result.id;
  }
  return null;
};

// custom resolvers help find cached data that is retrieved using
// a different query
const customResolvers = {
  Query: {
    order: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'Order', id: args['id']})),
    myOrder: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'Order', id: args['id']})),
    orderMember: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'OrderMember', id: args['id']})),
    warband: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'Warband', id: args['id']})),
    myWarbands: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'Warband', id: args['id']})),
    warbandMember: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'WarbandMember', id: args['id']})),
    character: (_: any, args: any) => toIdValue(dataIdFromObject({ __typename: 'Character', id: args['id']})),
  }
}

export const apollo = new ApolloClient({
  addTypename: true,
  customResolvers,
  dataIdFromObject,
  networkInterface,
  queryDeduplication: true,
});


const reducer =  combineReducers({
  apollo: apollo.reducer() as any,
  layout: layout,
  invites: invites,
});
export default reducer;

export interface SessionState {
  apollo : any;
  layout: LayoutState;
  invites: InvitesState;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, composeEnhancers(applyMiddleware(apollo.middleware(), thunkMiddleware, crashReporterMiddleware)));
