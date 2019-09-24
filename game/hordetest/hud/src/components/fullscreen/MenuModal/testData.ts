/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum PlayerStatus {
  Offline,
  Online,
  Away,
}

export interface Friend {
  id: string;
  name: string;
  status: PlayerStatus;
}

function getRandomID() {
  return Math.random().toString();
}

export const friends: Friend[] = [
  { id: getRandomID(), name: 'Player 1', status: PlayerStatus.Online },
  { id: getRandomID(), name: 'Player 2', status: PlayerStatus.Online },
  { id: getRandomID(), name: 'Player 3', status: PlayerStatus.Away },
  { id: getRandomID(), name: 'Player 4', status: PlayerStatus.Away },
  { id: getRandomID(), name: 'Player 5', status: PlayerStatus.Online },

  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
  { id: getRandomID(), name: 'Test Offline Player', status: PlayerStatus.Offline },
];
