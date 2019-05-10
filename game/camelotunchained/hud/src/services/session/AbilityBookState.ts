/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSharedStateWithReducer } from '../../../../../shared/lib/sharedState';

export enum Routes {
  Main,
  Magic,
  Melee,
  Archery,
  Throwing,
  Shout,
  Song,
  Misc,
  Components,
}

export interface State {
  activeRoute: Routes;
}

const defaultAbilityBookState: State = {
  activeRoute: Routes.Components,
};

export const useAbilityBookReducer
  = createSharedStateWithReducer('ability-book-state', defaultAbilityBookState, abilityBookReducer);

interface SetActiveRoute {
  type: 'set-active-route';
  activeRoute: Routes;
}

function setActiveRoute(state: State, action: SetActiveRoute) {
  return {
    ...state,
    activeRoute: action.activeRoute,
  };
}

interface Reset {
  type: 'reset';
}

function reset(state: State, action: Reset) {
  return {
    ...defaultAbilityBookState,
  };
}

export type Actions = SetActiveRoute | Reset;
function abilityBookReducer(state: State, action: Actions) {
  switch (action.type) {
    case 'set-active-route': return setActiveRoute(state, action);
    case 'reset': return reset(state, action);
    default: return state;
  }
}
