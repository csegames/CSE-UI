/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSharedStateWithReducer } from '../../lib/sharedState';
import { patcher } from '../patcher';


declare global {
  enum Product {
    CamelotUnchained = 0,
    Colossus = 1,
    Tools = 2,
    Cube = 3,
  }
  interface Window {
    Product: typeof Product;
  }
}
enum Product {
  CamelotUnchained = 0,
  Colossus = 1,
  Tools = 2,
  Cube = 3,
}
window.Product = Product;

export interface PatcherState {
  selectedProduct: Product;
  loggedIn: boolean;
  chatEnabled: boolean;
}


function initialState(): PatcherState {

  // quick hacky local storage for remembering this stuff.
  var lastPlayed = Number.parseInt(localStorage.getItem('selected_product'));
  if (isNaN(lastPlayed) || lastPlayed > Product.Tools || lastPlayed < 0) {
    lastPlayed = Product.CamelotUnchained;
  }

  return Object.freeze({
    selectedProduct: lastPlayed,
    loggedIn: false,
    chatEnabled: false,
  });
}

export const usePatcherState = createSharedStateWithReducer('patcher-state', initialState(), patcherStateReducer);

// BAD BAD HAX TO GET THIS DONE QUICK WITHOUT CHANGING EVERYTHING!!
// this is initialized in th Header component

declare global {
  interface Window {
    patcherState: PatcherState;
  }
}
if (!window.patcherState) {
  window.patcherState = initialState();
}

export function initEventsForBadBadHacks(dispatch: React.Dispatch<Actions>) {
  return [
    game.on('product-selection-changed', (product: Product) => dispatch({type: 'select-product', product})),
    game.on('logged-in', () => dispatch({type: 'set-logged-in', loggedIn: patcher.hasAccessToken()})),
  ];
}

// Actions

interface SelectProduct {
  type: 'select-product';
  product: Product;
}

function selectProduct(state: PatcherState, action: SelectProduct) {
  // do nothing if nothing is changing
  if (state.selectedProduct === action.product) return state;

  localStorage.setItem('selected_product', Number(action.product).toString());
  return {
    ...state,
    selectedProduct: action.product,
  };
}

interface SetLoggedIn {
  type: 'set-logged-in';
  loggedIn: boolean,
}

function setLoggedIn(state: PatcherState, action: SetLoggedIn) {
  // do nothing if nothing is changing
  if (state.loggedIn === action.loggedIn) return state;

  return {
    ...state,
    loggedIn: action.loggedIn,
  };
}

// Reducer

export type Actions =
  SelectProduct |
  SetLoggedIn;

function patcherStateReducer(state: PatcherState, action: Actions) {
  if (!state) {
    window.patcherState = cloneDeep(initialState());
    return window.patcherState;
  }

  switch (action.type) {
    case 'select-product': 
      window.patcherState = selectProduct(state, action);
      game.trigger('update');
      return window.patcherState;
    case 'set-logged-in': 
      window.patcherState = setLoggedIn(state, action);
      game.trigger('update');
      return window.patcherState;
    default: return state;
  }
}
