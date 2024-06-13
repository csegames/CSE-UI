/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { game } from '@csegames/library/dist/_baseGame';
import * as React from 'react';

interface StateDef<TState> {
  key: string;
  state: TState;
  setters: React.Dispatch<React.SetStateAction<TState>>[];
  reducer: (currentState: TState, action: { type: string }) => TState;
}

const sharedStates: Dictionary<StateDef<any>> = {};

export function createSharedState<TState>(
  key: string,
  initialState: TState,
  resetState?: (currentState: TState) => TState
): () => [TState, (state: TState) => TState, () => void] {
  if (sharedStates[key]) {
    console.warn(`Attempted to create a new shared state with key ${key} when a state with this key already exits.`);
    return;
  }

  sharedStates[key] = {
    key,
    state: initialState,
    setters: [],
    reducer: null
  };

  return function () {
    const def = sharedStates[key] as StateDef<TState>;
    if (!def) {
      throw `Failed to find shared state with key ${key} when using created State method.`;
    }
    const [state, set] = React.useState(def.state);

    React.useEffect(
      () => () => {
        def.setters = def.setters.filter((setter) => setter !== set);
      },
      []
    );

    if (!def.setters.includes(set)) {
      def.setters.push(set);
    }

    function setState(newState: TState) {
      def.state = newState;
      def.setters.forEach((setter) => setter(def.state));
      return def.state;
    }

    function reset() {
      if (resetState) {
        setState(resetState(def.state));
      }
    }

    return [state, setState, reset];
  };
}

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
    const [state, set] = React.useState(def.state);

    React.useEffect(
      () => () => {
        def.setters = def.setters.filter((setter) => setter !== set);
      },
      []
    );

    if (!def.setters.includes(set)) {
      def.setters.push(set);
    }

    function dispatch(action: TActions) {
      if (game.debug) {
        console.group(`${key} : dispatching action ${JSON.stringify}`);
        console.log(`state before : ${JSON.stringify(def.state)}`);
      }
      def.state = def.reducer(def.state, action);
      def.setters.forEach((setter) => setter(def.state));
      if (game.debug) {
        console.log(`state after : ${JSON.stringify(def.state)}`);
        console.groupEnd();
      }
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
