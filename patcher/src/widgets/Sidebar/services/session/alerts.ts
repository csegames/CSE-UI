/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {axiosResponse} from 'apisauce';
import api from '../api';
import {BaseAction, defaultAction, AsyncAction, merge, hashMerge, FetchStatus, defaultFetchStatus, clone, findIndex, findIndexWhere, addOrUpdate} from '../../../../lib/reduxUtils';

const patcherAlertsUrl = 'http://api.camelotunchained.com/patcheralerts';

export interface PatcherAlert {
  id: string,
  message: string,
  utcDateStart: string,
  utcDateEnd: string,
}

const FETCH_PATCHER_ALERTS = 'cse-patcher/patcheralerts/FETCH_PATCHER_ALERTS';
const FETCH_PATCHER_ALERTS_SUCCESS = 'cse-patcher/patcheralerts/FETCH_PATCHER_ALERTS_SUCCESS'
const FETCH_PATCHER_ALERTS_FAILED = 'cse-patcher/patcheralerts/FETCH_PATCHER_ALERTS_FAILED'

export interface AlertsAction extends BaseAction {
  alerts?: PatcherAlert[];
}

type ModuleAction = AlertsAction | AsyncAction<AlertsAction>;

let intervalID: any = null;
export function initAlerts(interval: number): AsyncAction<AlertsAction> {
  return (dispatch: (action: ModuleAction) => any) => {
    dispatch(beginFetchAlerts());
    intervalID = setInterval(() => {
      dispatch(beginFetchAlerts());
    }, interval);
  }
}

export function stopAlertsInterval() {
  if (intervalID) clearInterval(intervalID);
  intervalID = null;
}

// INTERNAL ACTIONS
function fetchAlerts() {
  return (dispatch: (action: any) => any) => {
    dispatch(beginFetchAlerts());
    return api.fetchAlerts()
      .then((response: axiosResponse) => dispatch(fetchAlertsSuccess(response.data)))
      .catch((response: any) => dispatch(fetchAlertsFailed(response.problem)));
      
  }
}

function beginFetchAlerts(): AlertsAction {
  return {
    type: FETCH_PATCHER_ALERTS,
    when: new Date(),
  };
}

function fetchAlertsSuccess(alerts: PatcherAlert[]): AlertsAction {
  return {
    type: FETCH_PATCHER_ALERTS_SUCCESS,
    when: new Date(),
    alerts: alerts,
  };
}

function fetchAlertsFailed(error: string) {
  return {
    type: FETCH_PATCHER_ALERTS_FAILED,
    error: error
  };
}

// reducer
export interface AlertsState extends FetchStatus {
  alerts?: PatcherAlert[];
}

function getInitialState(): AlertsState {
  return merge(defaultFetchStatus, {
    alerts: []
  });
}

export default function reducer(state: AlertsState = getInitialState(), action: AlertsAction = defaultAction): AlertsState {
  switch(action.type) {
    default: return state;

    case FETCH_PATCHER_ALERTS:
      return merge(state, {
        isFetching: true,
        lastFetchStart: action.when,
      });

    case FETCH_PATCHER_ALERTS_SUCCESS:
      const now = action.when.getDate();
      let alerts = hashMerge(a => a.id, state.alerts, action.alerts).filter(a => Date.parse(a.utcDateEnd) > now);
      return merge(state, {
        isFetching: false,
        lastFetchSuccess: action.when,
        alerts: alerts,
      });

    case FETCH_PATCHER_ALERTS_FAILED:
      return merge(state, {
        isFetching: false,
        lastFetchFailed: action.when,
        lastError: action.error
      });

  }
}
