/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { ChampionCostumeInfo, ChampionInfo } from '@csegames/library/lib/hordetest/graphql/schema';
import {
  ChampionInfoContextProvider,
  getDefaultChampionInfoContextState,
} from '../ChampionInfoContext';

const defaultContextState = getDefaultChampionInfoContextState();

beforeEach(() => {
  jest.resetModules();
});

describe('ChampionInfoProvider Initialization', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('ChampionInfoProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    const graphql: { data: { champions: ChampionInfo, championCostumes: ChampionCostumeInfo } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    const graphql: { data: { champions: ChampionInfo, championCostumes: ChampionCostumeInfo } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    const graphql: { data: { champions: ChampionInfo, championCostumes: ChampionCostumeInfo } } = {
      data: {
        championCostumes: null,
        champions: null,
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    const graphql = {
      data: {
        championCostumes: "",
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Partially invalid graphql data', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    const graphql: { data: { champions: ChampionInfo[], championCostumes: ChampionCostumeInfo[] } } = {
      data: {
        championCostumes: [],
        champions: [],
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
  });

  it ('Good data', () => {
    const wrapper = shallow(<ChampionInfoContextProvider></ChampionInfoContextProvider>);
    const graphql: { data: { champions: ChampionInfo[], championCostumes: ChampionCostumeInfo[] } } = {
      data: {
        champions: [],
        championCostumes: []
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });
});
