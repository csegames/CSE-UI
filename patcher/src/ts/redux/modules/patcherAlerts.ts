/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';

import ResponseError from '../../../../../shared/lib/ResponseError';
import {fetchJSON} from '../../../../../shared/lib/fetchHelpers';

const patcherAlertsUrl = 'http://api.camelotunchained.com/patcheralerts';

export interface PatcherAlert {
  id: string,
  message: string,
  utcDateStart: string,
  utcDateEnd: string,
}

// action types
const FETCH_PATCHER_ALERTS = 'cse-patcher/patcheralerts/FETCH_PATCHER_ALERTS';
const FETCH_PATCHER_ALERTS_SUCCESS = 'cse-patcher/patcheralerts/FETCH_PATCHER_ALERTS_SUCCESS'
const FETCH_PATCHER_ALERTS_FAILED = 'cse-patcher/patcheralerts/FETCH_PATCHER_ALERTS_FAILED'
const VALIDATE_ALERTS = 'cse-patcher/patcheralerts/VALIDATE_ALERTS';

// sync actions
export function requestAlerts() {
  return {
    type: FETCH_PATCHER_ALERTS
  };
}

export function fetchAlertsSuccess(alerts: Array<PatcherAlert>) {
  return {
    type: FETCH_PATCHER_ALERTS_SUCCESS,
    alerts: alerts,
    receivedAt: Date.now()
  };
}

export function fetchAlertsFailed(error: ResponseError) {
  return {
    type: FETCH_PATCHER_ALERTS_FAILED,
    error: error
  };
}

export function validateAlerts() {
  return {
    type: VALIDATE_ALERTS,
    now: Date.now()
  };
}

// async actions
export function fetchAlerts() {
  return (dispatch: (action: any) => any) => {
    dispatch(requestAlerts());
    return fetchJSON(patcherAlertsUrl)
      .then((alerts: Array<PatcherAlert>) => dispatch(fetchAlertsSuccess(alerts)))
      .catch((error: ResponseError) => dispatch(fetchAlertsFailed(error)));
      
  }
}

// reducer
export interface PatcherAlertsState {
  isFetching?: boolean;
  lastUpdated?: Date;
  alerts?: Array<PatcherAlert>;
  error?: string;
}

const initialState = {
  isFetching: false,
  lastUpdated: <Date>null,
  alerts: <Array<PatcherAlert>>[]
}

function mergeAlerts(actionAlerts: Array<PatcherAlert>, stateAlerts: Array<PatcherAlert>) {
  return actionAlerts.filter((a) => stateAlerts.findIndex((sa) => a.id == sa.id) == -1).concat(stateAlerts);
}

function isCurrent(alert: PatcherAlert) {
  return Date.parse(alert.utcDateEnd) < Date.now();
}

export default function reducer(state: any = initialState, action: any = {}) {
  switch(action.type) {
    case FETCH_PATCHER_ALERTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case FETCH_PATCHER_ALERTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        alerts: mergeAlerts(action.alerts, state.alerts)
      });
    case FETCH_PATCHER_ALERTS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case VALIDATE_ALERTS:
      return Object.assign({}, state, {
        alerts: state.alerts.filter((a: PatcherAlert) => Date.parse(a.utcDateEnd) > action.now)
      });
    default: return state;
  }
}
