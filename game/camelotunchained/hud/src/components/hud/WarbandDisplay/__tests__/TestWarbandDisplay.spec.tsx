/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import { WarbandDisplayView } from '../WarbandDisplayView';
import { uiContextFromGame } from 'services/session/UIContext';
import {
  GroupMemberState,
  Archetype,
  Race,
} from 'gql/interfaces';

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

function testWarbandMembers(): GroupMemberState[] {
  return [{
    type: 'player',
    entityID: '1',
    characterID: '1',
    faction: Faction.Arthurian,
    classID: Archetype.BlackKnight,
    name: 'Player One',
    isAlive: true,
    position: { x: 0, y: 0, z: 0 },
    statuses: [],
    race: Race.HumanMaleA,
    gender: Gender.Female,
    health: [{
      current: 9000,
      max: 10000,
      wounds: 0
    }],
    stamina: {
      current: 90,
      max: 100,
    },
    blood: {
      current: 75,
      max: 100,
    },
    displayOrder: 0,
    warbandID: '1',
    isLeader: true,
    canInvite: true,
    canKick: true,
    rankLevel: 100,
    isReady: false,
  },{
    type: 'player',
    entityID: '2',
    characterID: '2',
    faction: Faction.Arthurian,
    classID: Archetype.BlackKnight,
    name: 'Player Two',
    isAlive: true,
    position: { x: 0, y: 0, z: 0 },
    statuses: [],
    race: Race.HumanMaleA,
    gender: Gender.Female,
    health: [{
      current: 9000,
      max: 10000,
      wounds: 0
    }],
    stamina: {
      current: 90,
      max: 100,
    },
    blood: {
      current: 75,
      max: 100,
    },
    displayOrder: 1,
    warbandID: '1',
    isLeader: false,
    canInvite: true,
    canKick: false,
    rankLevel: 100,
    isReady: false,
  }];
}

describe('Renders elements', () => {
  it('renders container', () => {
    const members = testWarbandMembers();
    const mounted = mount(
      <UIContext.Provider value={uiContextFromGame()}>
        <WarbandDisplayView activeMembers={members} />
      </UIContext.Provider>
    
    );
    expect(mounted.find('.warbandDisplayView_Container')).toBeTruthy();
  });

  it('renders correct number of warband members', () => {
    const members = testWarbandMembers();
    const mounted = mount(
      <UIContext.Provider value={uiContextFromGame()}>
        <WarbandDisplayView activeMembers={members} />
      </UIContext.Provider>
    
    );
    expect(mounted.find('.warbandMemberDisplay_Container').length).toEqual(2);
  });
});
