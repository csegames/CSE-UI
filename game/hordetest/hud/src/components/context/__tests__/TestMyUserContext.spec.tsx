/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { User } from '@csegames/library/lib/hordetest/graphql/schema';
import {
  MyUserContextProvider,
  getDefaultMyUserContextState,
} from '../MyUserContext';

const defaultContextState = getDefaultMyUserContextState();
const stringifiedDefaultContextState = JSON.stringify(defaultContextState);

beforeEach(() => {
  jest.resetModules();
});

describe('MyUserProvider Initialization', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });
});

describe('MyUserProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    const graphql: { data: { myUser: User } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    const graphql: { data: { myUser: User } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    const graphql: { data: { myUser: User } } = {
      data: {
        myUser: null,
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    const graphql = {
      data: {
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });

  it ('Malformed Context State - Partially invalid graphql data', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    const graphql: { data: { myUser: User } } = {
      data: {
        myUser: null,
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });

    Object.keys(defaultContextState.myUser).forEach((myUserKey) => {
      expect((state as any).myUser).toHaveProperty(myUserKey);
    });
  });

  it ('Good data', () => {
    const wrapper = shallow(<MyUserContextProvider></MyUserContextProvider>);
    const graphql: { data: { myUser: User } } = {
      data: {
        myUser: {
          ...defaultContextState.myUser,
        }
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });
});
