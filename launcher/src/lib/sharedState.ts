/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { Dictionary } from './Dictionary';

interface StateDef<TState> {
  key: string;
  state: TState;
  setters: React.Dispatch<React.SetStateAction<TState>>[];
  reducer: (currentState: TState, action: { type: string }) => TState;
}

const sharedStates: Dictionary<StateDef<any>> = {};

export function createSharedStateWithReducer<TState, TActions extends { type: string }>(
  key: string,
  initialState: TState,
  reducer: (currentState: TState, actions: TActions) => TState,
  resetState?: (currentState: TState) => TState
): () => [TState, React.Dispatch<TActions>, () => void] {
  if (sharedStates[key]) {
    console.warn(`Attempted to create a new shared state with key ${key} when a state with this key already exits.`);
    return;
  }

  sharedStates[key] = {
    key,
    state: initialState,
    setters: [],
    reducer
  };

  return function () {
    const def = sharedStates[key] as StateDef<TState>;
    if (!def) {
      throw `Failed to find shared state with key ${key} when using created State method.`;
    }
    const [state, set] = useState(def.state);

    useEffect(
      () => () => {
        def.setters = def.setters.filter((setter) => setter !== set);
      },
      []
    );

    if (!def.setters.includes(set)) {
      def.setters.push(set);
    }

    function dispatch(action: TActions) {
      def.state = def.reducer(def.state, action);
      def.setters.forEach((setter) => setter(def.state));
    }

    function reset() {
      if (resetState) {
        def.state = resetState(def.state);
        def.setters.forEach((setter) => setter(def.state));
      }
    }

    return [state, dispatch, reset];
  };
}
