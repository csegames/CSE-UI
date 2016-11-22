/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Map} from 'immutable';
import {Module} from 'redux-typed-modules';
import {client, webAPI, DEBUG_ASSERT, RUNTIME_ASSERT} from 'camelot-unchained';

import {generateID} from '../../lib/cseUtils';

export interface TODO {
  id: string
  added: Date,
  task: string,
}

export interface TODOState {
  todos: Map<string, TODO>;
}

interface O extends Object {}

function foo<T extends Object>(v: T) {
  return {
    ...(v as Object),
    space: 'space'
  };
}

function initialState() {
  try {
    const saved = JSON.parse(localStorage.getItem('todoState')) as TODOState;
    if (typeof saved === 'object' && typeof saved.todos === 'object') return saved;
  } catch (e) {}
  return {
    todos: Map<string, TODO>() 
  };
}

var module = new Module({

  initialState: initialState(),

  actionExtraData: () => {
    return {
      when: new Date()
    }
  },

  postReducer: (state) => {
    localStorage.setItem('todoState', JSON.stringify(state));
    return state;
  }
});

export const addTodo = module.createAction({
  type: 'addTodo',
  action: (todo: string) => {
    return {
      id: generateID(7),
      task: todo,
    };
  },
  reducer: (s, a) => {
    return {
      ...s,
      foo: '',
      todos: s.todos.set(a.id, {
        id: a.id,
        added: a.when,
        task: a.task
      })
    };
  }
});

export const removeTodo = module.createAction({
  type: 'removeTodo',
  action: (id: string) => {
    return {
      id: id
    };
  },
  reducer: (s, a) => {
    return {
      ...s,
      todos: s.todos.remove(a.id)
    };
  }
});

export default module.createReducer();
