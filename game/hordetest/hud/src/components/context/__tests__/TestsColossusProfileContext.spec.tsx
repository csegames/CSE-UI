/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import {
  ColossusProfileProvider,
  ColossusProfileModel,
  ColossusProfileState,
  getDefaultColossusProfileState,
} from '../ColossusProfileContext';

const defaultContextState: Readonly<ColossusProfileState> = getDefaultColossusProfileState();

beforeEach(() => {
  jest.resetModules();
});

describe('ColossusProfileProvider', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('ColossusProfileProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    const graphql: { data: { colossusProfile: ColossusProfileModel | null } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    const graphql: { data: { colossusProfile: ColossusProfileModel | null } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    const graphql: { data: { colossusProfile: ColossusProfileModel | null } } = {
      data: {
        colossusProfile: null,
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    const graphql = {
      data: {
        colossusProfile: {
          lifetimeStats: null,
          this123: null,
          is123: null,
          bad123: null,
        } as any,
      }
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Partially invalid graphql data', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    const graphql: { data: { colossusProfile: ColossusProfileModel | null } } = {
      data: {
        colossusProfile: {
          defaultChampion: null,
          lifetimeStats: [],
          champions: [],
          this123: null,
          is123: null,
          bad123: null,
        } as ColossusProfileModel,
      }
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });

  it ('Good data', () => {
    const wrapper = shallow(<ColossusProfileProvider></ColossusProfileProvider>);
    const graphql: { data: { colossusProfile: ColossusProfileModel | null } } = {
      data: {
        colossusProfile: {
          defaultChampion: null,
          lifetimeStats: [],
          champions: [],
        },
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });
});
