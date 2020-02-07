/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Mock } from './index';
import { EE_OnPlayerDirectionUpdate } from '../engineEvents';

const playerDirections: PlayerDirection[] = [
  {
    id: 0,
    angle: 0,
    screenPos: { x: 0, y: 0 },
    scale: 1,
  },
  {
    id: 1,
    angle: 0,
    screenPos: { x: 0.1, y: 0 },
    scale: 1,
  },
  {
    id: 2,
    angle: 0,
    screenPos: { x: 0.2, y: 0 },
    scale: 1,
  },
  {
    id: 3,
    angle: 0,
    screenPos: { x: 0.3, y: 0 },
    scale: 1,
  },
  {
    id: 4,
    angle: 0,
    screenPos: { x: 0.4, y: 0 },
    scale: 1,
  },
  {
    id: 5,
    angle: 0,
    screenPos: { x: 0.5, y: 0 },
    scale: 1,
  },
  {
    id: 6,
    angle: 0,
    screenPos: { x: 0.6, y: 0 },
    scale: 1,
  },
  {
    id: 7,
    angle: 0,
    screenPos: { x: 0.7, y: 0 },
    scale: 1,
  },
  {
    id: 8,
    angle: 0,
    screenPos: { x: 0.8, y: 0 },
    scale: 1,
  },
  {
    id: 9,
    angle: 0,
    screenPos: { x: 0.9, y: 0 },
    scale: 1,
  }
];

export const mock: Mock = {
  name: 'Normal',
  expectedOutcomeDescription: '9 player indicators should show up',
  function: () => {
    console.log('Mock expected player directions update');
    engine.trigger(EE_OnPlayerDirectionUpdate, playerDirections);
  },
}

export const mockNull: Mock = {
  name: 'Null data',
  expectedOutcomeDescription: `We should always receive an empty array if there are no other
    players indicators. Regardless, UI needs to handle this case gracefully.`,
  function: () => {
    console.log('Mock null player directions update');
    engine.trigger(EE_OnPlayerDirectionUpdate, null);
  },
}

export const mockTooMany: Mock = {
  name: 'Too many player indicators',
  expectedOutcomeDescription: `If we hit this case, expect the UI to limit the amount of player indicators on the screen
    to how many are allowed in the match.`,
  function: () => {
    console.log('Mock too many player directions');

    // Get long list of player directions
    let playerDirectionsClone = cloneDeep(playerDirections);
    for (var i = 0; i < 15; i++) {
      playerDirectionsClone = [
        ...playerDirectionsClone,
        ...playerDirections,
      ];
    }

    playerDirectionsClone = playerDirectionsClone.map((direction, i) => {
      return {
        ...direction,
        screenPos: { x: i / 100, y: 0 },
      }
    });

    engine.trigger(EE_OnPlayerDirectionUpdate, playerDirectionsClone);
  }
}
