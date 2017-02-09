/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-20 18:08:12
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 22:04:37
 */
import * as React from 'react';
import { Module } from 'redux-typed-modules'
import { Map } from 'immutable';
import { utils, ql } from 'camelot-unchained';
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag';

import { LinkAddress,
         SocialCategory,
         CategoryNav,
         NavSection,
         CategoryAddress,
         categoryAddressEquals,
         linkAddressEquals } from './nav/navTypes';

import testNav from './nav/testNav';


/*
 * STATE
 */
export interface NavigationState {
  currentView: LinkAddress;
  categories: Map<SocialCategory, CategoryNav>;
}

function initialState() {
  return testNav();
}

function toggleCollapsed(state: Readonly<NavigationState>, address: CategoryAddress): Partial<NavigationState> {
  return {
    categories: state.categories.update(address.category, value => {
      switch (address.kind) {
        case 'Primary':
          value.collapsed = !value.collapsed;
          return value;
        case 'Sub':
          switch (value.category) {
            case SocialCategory.Warbands:
              value.warbands = value.warbands.update(address.subKey, subValue => {
                subValue.collapsed = !subValue.collapsed;
                return subValue;
              });
              return value;
            case SocialCategory.Campaigns:
              value.campaigns = value.campaigns.update(address.subKey, subValue => {
                subValue.collapsed = !subValue.collapsed;
                return subValue;
              });
              return value;
          }
        // should never hit this!!
        default: return value;
      }
    })
  };
}

/*
 * MODULE ACTIONS
 */
var module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date(),
    };
  },
});

export const initialize = module.createAction({
  type: 'social/navigation/initialize',
  action: (apollo: ApolloClient) => {
    return (dispatch: (action: any) => any) => {
      // apollo.query({
      //   query: ql.queries.MySocial,
      // });
    }
  }
})


export const selectLink = module.createAction({
  type: 'social/navigation/selectLink',
  action: (address: LinkAddress) => {
    return {
      address: address
    };
  },
  reducer: (s, a) => {
    return {
      currentView: a.address
    };
  }
});

export const toggleCollapsedCategory = module.createAction({
  type: 'social/navigation/toggleCollapsedCategory',
  action: (address: CategoryAddress) => {
    return {
      address: address
    };
  },
  reducer: (s, a) => {
    return toggleCollapsed(s, a.address);
  }
});

export default module.createReducer();
