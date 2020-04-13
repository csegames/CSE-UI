/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import WarbandMemberDisplay from '../WarbandMemberDisplay';
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

function testWarbandMember(): GroupMemberState {
  return {
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
  };
}

describe('Renders element', () => {
  it('renders container', () => {
    const member = testWarbandMember();
    const mounted = mount(
      <UIContext.Provider value={uiContextFromGame()}>
        <WarbandMemberDisplay key={member.entityID} member={member as any} />
      </UIContext.Provider>
    
    );
    expect(mounted.find('.warbandMemberDisplay_Container')).toBeTruthy();
  });

  it('renders a unit frame', () => {
    const member = testWarbandMember();
    const mounted = mount(
      <UIContext.Provider value={uiContextFromGame()}>
        <WarbandMemberDisplay key={member.entityID} member={member as any} />
      </UIContext.Provider>
    
    );
    expect(mounted.find('.unitFrame_Container')).toBeTruthy();
  });
});
