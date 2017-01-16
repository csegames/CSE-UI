/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-16 16:45:17
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-27 17:18:18
 */

import {Map} from 'immutable';
import {Module, generateID} from 'redux-typed-modules';
import {client, webAPI, DEBUG_ASSERT, RUNTIME_ASSERT, Order, OrderMember, utils} from 'camelot-unchained';

export interface OrderState {
  order: Order | null;
  fetchStatus: utils.FetchStatus;
}

function initialState(): OrderState {
  return {
    order: null,
    fetchStatus: utils.defaultFetchStatus,
  };
}

/*
 * MODULE ACTIONS
 */
var module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date()
    }
  },
});


const getGuildInfo = module.createAction({
  type: 'social/order/getGuildInfo',
  action: () => {
    return {}
  },
  reducer: (s, a) => {
    return {
      fetchStatus: {
        ...s.fetchStatus,
        isFetching: true,
        lastFetchStart: a.when,
      }
    }
  }
});

const fetchGuildInfoSuccess = module.createAction({
  type: 'social/order/fetchGuildInfoSuccess',
  action: (order: Order) => {
    return {
      order: order
    }
  },
  reducer: (s, a) => {
    return {
      order: a.order,
      isFetching: false,
    }
  }
});

const fetchGuildInfoFailed = module.createAction({
  type: 'social/order/fetchGuildInfoFailed',
  action: (err: string) => {
    return {
      error: err
    };
  },
  reducer: (s, a) => {
    return {
      fetchStatus: {
        ...s.fetchStatus,
        lastFetchFailed: a.when,
        lastError: a.error,
        isFetching: false,
      }
    }
  }
});

export const fetchGuildInfo = module.createAction({
  type: 'social/order/fetchGuildInfo',
  action: () => {
    return (dispatch: (action: any) => any) => {
      dispatch(getGuildInfo());
      try {
        webAPI.OrdersAPI.getOrderInfoForCharacterV1(client.shardID, client.characterID)
          .then((response) => {
            if (!response.ok) {
              // fetch failed
              dispatch(fetchGuildInfoFailed(response.problem));
              return;
            }
            dispatch(fetchGuildInfoSuccess(response.data));
          });
      } catch (e) {
        dispatch(fetchGuildInfoFailed(e))
      }
    }
  },
});

export default module.createReducer();
