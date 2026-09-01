/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Store from '../lib/local-storage';

const keyLastSelectedServerKey: string = 'last-selected-server-key';
const keyLastSelectedProduct: string = 'last-selected-product';
const keyLastPlayedServerKey: string = 'last-played-server-key';
const localStore = new Store('LauncherNavigation');

function persistSelectedContext(product: Product, key: string | null) {
  if (!key) {
    localStore.remove(`${product}-${keyLastSelectedServerKey}`);
  } else {
    localStore.set(`${product}-${keyLastSelectedServerKey}`, key);
  }
}

function loadSelectedContext(product: Product): string | null {
  return localStore.get<string>(`${product}-${keyLastSelectedServerKey}`) ?? null;
}

function persistPlayedContext(product: Product, key: string | null) {
  if (!key) {
    localStore.remove(`${product}-${keyLastPlayedServerKey}`);
  } else {
    localStore.set(`${product}-${keyLastPlayedServerKey}`, key);
  }
}

function loadPlayedContext(product: Product): string | null {
  return localStore.get<string>(`${product}-${keyLastPlayedServerKey}`) ?? null;
}

export enum Product {
  CamelotUnchained = 0,
  Tools = 2
}

interface MainRoute {
  type: 'main';
}

interface NewsRoute {
  type: 'news';
  selected?: number;
}

interface PatchNotesRoute {
  type: 'patch-notes';
  selected?: number;
}

export type BlogRoute = NewsRoute | PatchNotesRoute;
export type BlogType = BlogRoute['type'];

export function isBlogRoute(value: unknown): value is BlogRoute {
  return (
    value !== null && typeof value === 'object' && ['news', 'patch-notes'].includes((value as Route)['type'] as string)
  );
}

export type Route = MainRoute | NewsRoute | PatchNotesRoute;

interface NavigationReduxState {
  route: Route;
  product: Product;
  selections: Record<Product, string | null>; // group keys for each product
  lastPlayed: Record<Product, string | null>; // group keys for each product
}

type SelectionKey = string;

function isSelectionKey(value: unknown): value is SelectionKey {
  return typeof value === 'string' && (value.startsWith('g-') || value.startsWith('s-') || value.startsWith('c-'));
}

const DefaultState: NavigationReduxState = {
  route: { type: 'main' },
  product: localStore.get<number>(keyLastSelectedProduct) ?? Product.CamelotUnchained,
  selections: {
    0: loadSelectedContext(Product.CamelotUnchained),
    2: loadSelectedContext(Product.Tools)
  },
  lastPlayed: {
    0: loadPlayedContext(Product.CamelotUnchained),
    2: loadPlayedContext(Product.Tools)
  }
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: DefaultState,
  reducers: {
    changeRoute: (state: NavigationReduxState, action: PayloadAction<Route>) => {
      state.route = action.payload;
    },
    changeProduct: (state: NavigationReduxState, action: PayloadAction<Product>) => {
      state.product = action.payload;
      localStore.set(keyLastSelectedProduct, action.payload);
    },
    initializeCamelotSelection: (state: NavigationReduxState, action: PayloadAction<string>) => {
      if (!isSelectionKey(state.selections[Product.CamelotUnchained])) {
        state.selections[Product.CamelotUnchained] = action.payload;
      }
    },
    updateSelection: (state: NavigationReduxState, action: PayloadAction<{ product: Product; key: string }>) => {
      const { product, key } = action.payload;
      state.selections[product] = key;
      persistSelectedContext(product, key);
    },
    updateLastPlayed: (state: NavigationReduxState, action: PayloadAction<{ product: Product; key: string }>) => {
      const { product, key } = action.payload;
      state.selections[product] = key;
      persistPlayedContext(product, key);
    }
  }
});

export const { changeRoute, changeProduct, initializeCamelotSelection, updateLastPlayed, updateSelection } =
  navigationSlice.actions;
