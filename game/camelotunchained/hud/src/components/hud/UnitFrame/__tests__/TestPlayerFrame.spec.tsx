/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import { PlayerFrame } from '../PlayerFrame';
import { uiContextFromGame } from 'services/session/UIContext';

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

function testPlayer(): PlayerState {
  return {
    type: 'player',
    entityID: '1',
    faction: Faction.Arthurian,
    classID: Archetype.BlackKnight,
    name: 'Player One',
    isAlive: true,
    position: { x: 0, y: 0, z: 0 },
    statuses: [] as any,
    race: Race.HumanMaleA,
    gender: Gender.Female,
    characterKind: CharacterKind.User,
    health: [{
      current: 9000,
      max: 10000,
      wounds: 0
    }] as any,
    stamina: {
      current: 90,
      max: 100,
    },
    blood: {
      current: 75,
      max: 100,
    },
    isReady: true,
    entitySpecificResources: [],
    onReady: null,
    onUpdated: null,
    updateEventName: '',
  };
}

describe('Renders element', () => {
  it('renders container', () => {
    const member = testPlayer();
    const mounted = mount(
      <UIContext.Provider value={uiContextFromGame()}>
        <PlayerFrame player={member as any} />
      </UIContext.Provider>
    
    );
    expect(mounted.find('.playerFrame_Container')).toBeTruthy();
  });

  it('renders the player name', () => {
    const member = testPlayer();
    const mounted = mount(
      <UIContext.Provider value={uiContextFromGame()}>
        <PlayerFrame player={member as any} />
      </UIContext.Provider>
    
    );
    expect(mounted.find('.playerFrame_Name')).toBeTruthy();
    expect(mounted.find('.playerFrame_Name').length).toEqual(1);
  });
});
