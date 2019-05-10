/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSharedStateWithReducer } from '../../../../../shared/lib/sharedState';

export interface AbilityType {
  id: string;
  name: string;
}

export enum Routes {
  AbilityTypeSelect,
  AbilityCreation,
}

export interface State {
  currentRoute: Routes;
  selectedType: AbilityType;
  name: string;
  icon: string;
  abilityComponents: string[];
  isModifying: boolean;
  modifiedAbilityID: number;
}

const defaultAbilityBuilderState: State = {
  currentRoute: Routes.AbilityTypeSelect,
  selectedType: null,
  name: '',
  icon: '',
  abilityComponents: [],
  isModifying: false,
  modifiedAbilityID: null,
};

export const useAbilityBuilderReducer
  = createSharedStateWithReducer('ability-builder-state', defaultAbilityBuilderState, abilityBuilderReducer);

interface SetSelectedType {
  type: 'set-selected-type';
  selectedType: AbilityType;
}

function setSelectedType(state: State, action: SetSelectedType) {
  return {
    ...state,
    selectedType: action.selectedType,
    currentRoute: Routes.AbilityCreation,
  };
}

interface SetName {
  type: 'set-name';
  name: string;
}

function setName(state: State, action: SetName) {
  return {
    ...state,
    name: action.name,
  };
}

interface SetIcon {
  type: 'set-icon';
  icon: string;
}

function setIcon(state: State, action: SetIcon) {
  return {
    ...state,
    icon: action.icon,
  };
}

interface SetAbilityComponents {
  type: 'set-ability-components';
  abilityComponents: string[];
}

function setAbilityComponents(state: State, action: SetAbilityComponents) {
  return {
    ...state,
    abilityComponents: [...action.abilityComponents],
  };
}

interface SetIsModifying {
  type: 'set-is-modifying';
  isModifying: boolean;
  modifiedAbilityID: number;
}

function setIsModifying(state: State, action: SetIsModifying) {
  return {
    ...state,
    isModifying: action.isModifying,
    modifiedAbilityID: action.modifiedAbilityID,
  };
}

interface Reset {
  type: 'reset';
}

function reset(state: State, action: Reset) {
  return {
    ...defaultAbilityBuilderState,
  };
}

export type Actions = SetSelectedType | SetName | SetIcon | SetAbilityComponents | SetIsModifying | Reset;

function abilityBuilderReducer(state: State, action: Actions) {
  switch (action.type) {
    case 'set-selected-type': return setSelectedType(state, action);
    case 'set-name': return setName(state, action);
    case 'set-icon': return setIcon(state, action);
    case 'set-ability-components': return setAbilityComponents(state, action);
    case 'set-is-modifying': return setIsModifying(state, action);
    case 'reset': return reset(state, action);
    default: return state;
  }
}
