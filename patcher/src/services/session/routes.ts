/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseAction, defaultAction, merge } from '../../lib/reduxUtils';

export enum Routes {
  HERO,
  NEWS,
  PATCHNOTES,
  SUPPORT,
  CHAT,
}

export interface RoutesAction extends BaseAction {
  current: Routes;
}

const CHANGE_ROUTE = 'cse-patcher/routes/CHANGE_ROUTE';

export function changeRoute(route: Routes): RoutesAction {
  return {
    type: CHANGE_ROUTE,
    when: new Date(),
    current: route,
  };
}

export interface RoutesState {
  current: Routes;
}

function getInitialState(): RoutesState {
  return {
    current: Routes.HERO,
  };
}

export default function reducer(state: RoutesState = getInitialState(), action: RoutesAction = defaultAction): RoutesState {
  switch (action.type) {
    default: return state;
    case CHANGE_ROUTE: {
      return merge(state, { current: action.current });
    }
  }
}
