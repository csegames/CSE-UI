/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface PlayerStatInfo {
  id: string;
  playerName: string;
  championName: string;
  previewImage: string;
  kills: number;
  killStreak: number;
  longestLife: number;
  totalDamage: number;
  damageTaken: number;
}

export const playerStats: PlayerStatInfo[] = [
  {
    id: 'player1',
    playerName: 'Jonminoes Pizza',
    championName: 'Berserker',
    previewImage: 'images/fullscreen/character-select/face.png',
    kills: 7500,
    killStreak: 552,
    longestLife: 1000,
    totalDamage: 540000,
    damageTaken: 3000,
  },
  {
    id: 'player2',
    playerName: 'CSE jamkoo',
    championName: 'Amazon',
    previewImage: 'images/fullscreen/character-select/face.png',
    kills: 5000,
    killStreak: 45,
    longestLife: 900,
    totalDamage: 50000,
    damageTaken: 323000,
  },
  {
    id: 'player3',
    playerName: 'DEEZY',
    championName: 'Cleric',
    previewImage: 'images/fullscreen/character-select/face.png',
    kills: 2500,
    killStreak: 548,
    longestLife: 1100,
    totalDamage: 50000,
    damageTaken: 33000,
  },
  {
    id: 'player4',
    playerName: 'Turbosound',
    championName: 'Assassin',
    previewImage: 'images/fullscreen/character-select/face.png',
    kills: 400,
    killStreak: 5,
    longestLife: 1200,
    totalDamage: 14000,
    damageTaken: 33000,
  },
  {
    id: 'player5',
    playerName: 'InfraredSnipe',
    championName: 'Barbarian',
    previewImage: 'images/fullscreen/character-select/face.png',
    kills: 200,
    killStreak: 320,
    longestLife: 1500,
    totalDamage: 16000,
    damageTaken: 35000,
  },
];
