/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createStore, combineReducers } from 'redux';
const assign = require('object-assign');
import { client } from 'camelot-unchained';

// ==== ShapeState =====

export interface SelectionState {
  shape: string;      // selected shape
  type: string;       // selected type
  block: number;      // selected block (id)
  blueprint: number;  // selected blueprint (id)
}

const initialSelection: SelectionState = {
  shape: "cube",
  type: undefined,
  block: undefined,
  blueprint: undefined
}

const selection = (state: SelectionState = initialSelection, action: any): SelectionState => {
  switch(action.type) {
    case 'SELECT_SHAPE':
      return assign({}, state, { shape: state.shape === action.shape ? undefined : action.shape });
    case 'SELECT_TYPE':
      return assign({}, state, { type: state.type === action.type ? undefined : action.type });
    case 'SELECT_BLOCK':
      return assign({}, state, {
        block: state.block === action.id ? undefined : action.id,
        blueprint: undefined
      });
    case 'SELECT_BLUEPRINT':
      return assign({}, state, {
        blueprint: state.blueprint === action.id ? undefined : action.id,
        block: undefined
      });
  }
  return state;
};

// ==== FilterState ====

export interface FilterState {
  words: string[];            // selected filter words
  blueprints: string;
}

const initialFilter: FilterState = {
  words: [],
  blueprints: undefined
}

const filter = (state: FilterState = initialFilter, action: any): FilterState => {
  switch(action.type) {
    case 'ADD_KEYWORD':
      return assign({}, state, {
          words: state.words.concat(action.word)
      });
    case 'REMOVE_KEYWORD':
      return assign({}, state, {
        words: state.words.filter((word: string): boolean => {
          return action.word !== word;
        })
      });
    case 'CLEAR_FILTER':
      return assign({}, state, { words: [] });
    case 'BLUEPRINT_FILTER':
      return assign({}, state, { blueprints: action.filter });
  }
  return state;
}

// ==== UIState =====

export interface UIState {
  mode: number;               // Current building mode (0 = inactive)
  edge: string;               // which edge is UI docked to (only right is supported atm)
  expanded: boolean;          // is building UI visible (expanded)
  tab: string;                // current tab
  filterOpen: boolean;        // is block filter menu open?
  saving: boolean;     // are we saving a blueprint?
}

const initialUIState: UIState = {
  mode: 0,
  edge: 'right',
  expanded: false,
  tab: 'BLOCKS',
  filterOpen: false,
  saving: false
};

const buildingMode = (state: UIState, action: any): UIState => {
  /* 0 = building mode off */
  /* 1 placing phantom, 2 = phantom placed, 4 = selecting block, 8 = block selected */
  let expanded: boolean = state.expanded;
  if (!expanded) {
    if (state.mode === 0 && action.mode > 0) {
      // if not curently expanded and going from building mode 0 to 1+
      // then expand the UI
      expanded = true;

      // temp hack - close other obsolete building UIs
      setTimeout(() => {
        client.CloseUI("blockselector");
        // client.CloseUI("buildblueprints");
      },250);
    }
  } else {
    if (state.mode > 0 && action.mode === 0) {
      // if currently expanded, and disabling building
      // collaps the UI
      expanded = false;
    }
  }
  return assign({}, state, { mode: action.mode, expanded: expanded });
}

const ui = (state: UIState = initialUIState, action: any): UIState => {
  switch(action.type) {
    case 'SET_BUILDING_MODE':
      return buildingMode(state, action);
    case 'SET_EDGE':
      return assign({}, state, { edge: action.edge });
    case 'SET_EXPANDED':
      return assign({}, state, { expanded: action.expanded });
    case 'SELECT_TAB':
      return assign({}, state, { expanded: true, tab: action.tab });
    case 'TOGGLE_FILTER':
      return assign({}, state, { filterOpen: !state.filterOpen });
    case 'SAVE_BLUEPRINT_MODE':
      return assign({}, state, { saving: action.save });
  }
  return state;
};

// ==== BlocksState =====

export interface BlocksState {
  blocksLoaded: number;       // block loaded state (timestamp)
  blueprintsLoaded: number;   // blueprint loaded state (timestamp)
  blueprintCopied: number;   // blueprint copy state (timestamp)
}

const initialBlocksState: BlocksState = {
  blocksLoaded: 0,
  blueprintsLoaded: 0,
  blueprintCopied: 0
}

const blocks = (state: BlocksState = initialBlocksState, action: any): BlocksState => {
  switch(action.type) {
    case 'LOAD_BLOCKS':
      return assign({}, state, { blocksLoaded: 0 });
    case 'RECV_BLOCKS':
      return assign({}, state, { blocksLoaded: action.when });
    case 'LOAD_BLUEPRINTS':
      return assign({}, state, { blueprintsLoaded: 0 });
    case 'RECV_BLUEPRINTS':
      return assign({}, state, { blueprintsLoaded: action.when });
    case 'COPY_BLUEPRINT':
      return assign({}, state, { blueprintCopied: action.when });
  }
  return state;
}

// ==== BuildingState =====

export interface BuildingState {
  ui: UIState;
  selection: SelectionState;
  blocks: BlocksState;
  filter: FilterState;
}

const building = combineReducers({ ui, selection, blocks, filter });

// ==== store ====

export const store = createStore(building);
export default store;
