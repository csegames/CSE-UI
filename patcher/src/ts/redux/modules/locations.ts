/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum Routes {
  HERO,
  NEWS,
  PATCHNOTES,
  SUPPORT
}

export interface LocationsAction {
  type: string,
  location: Routes
}

const CHANGE_ROUTE = 'cse-patcher/locations/CHANGE_ROUTE';

export function changeRoute(route: Routes): LocationsAction {
  return {
    type: CHANGE_ROUTE,
    location: route
  };
}

const initialState = {
  location: Routes.HERO
}

export default function reducer(state: any = initialState, action: LocationsAction = <LocationsAction>{}) {
  switch(action.type) {
    case CHANGE_ROUTE: return Object.assign({}, state, {location: action.location});
    default: return state;
  }
}
