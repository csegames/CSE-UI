/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import {
  StatusContextProvider,
  getDefaultStatusContextState,
} from '../StatusContext';
import { StatusDef } from '@csegames/library/lib/hordetest/graphql/schema';

const defaultContextState = getDefaultStatusContextState();

beforeEach(() => {
  jest.resetModules();
});

describe('StatusContextProvider', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('StatusContextProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
    const graphql: { data: { status: { statuses: StatusDef[] } } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
    const graphql: { data: { status: { statuses: StatusDef[] } } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
    const graphql: { data: { status: { statuses: StatusDef[] } } } = {
      data: {
        status: {
          statuses: null,
        },
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
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
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
    const graphql: { data: { status: { statuses: StatusDef[] } } } = {
      data: {
        status: {
          statuses: [],
          this123: null,
          is123: null,
          bad123: null,
        } as any,
      }
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });

  it ('Good data', () => {
    const wrapper = shallow(<StatusContextProvider></StatusContextProvider>);
    const graphql: { data: { status: { statuses: StatusDef[] } } } = {
      data: {
        status: {
          statuses: [],
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
