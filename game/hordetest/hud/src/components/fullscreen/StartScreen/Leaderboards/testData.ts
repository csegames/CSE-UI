/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface TopPlayer {
  userName: string;
  championInfo: {
    id: string;
    name: string;
    iconUrl: string;
  };
  rank: number;
  statNumber: number;
}

export const players: TopPlayer[] = [
  {
    userName: 'Deezy',
    championInfo: {
      id: 'amazon-1',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 1,
    statNumber: 123445,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'amazon-2',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 2,
    statNumber: 123445,
  },
  {
    userName: 'Ultraman',
    championInfo: {
      id: 'amazon-3',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 3,
    statNumber: 123445,
  },
  {
    userName: 'GODzilla',
    championInfo: {
      id: 'amazon-4',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 4,
    statNumber: 123445,
  },
  {
    userName: 'JAMKOO',
    championInfo: {
      id: 'amazon-5',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 5,
    statNumber: 123445,
  },
  {
    userName: 'Blur3',
    championInfo: {
      id: 'amazon-6',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 6,
    statNumber: 123445,
  },
  {
    userName: 'Photoshopper',
    championInfo: {
      id: 'amazon-7',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 7,
    statNumber: 123445,
  },
  {
    userName: 'MonkeyMouse',
    championInfo: {
      id: 'amazon-4',
      name: 'Amazon',
      iconUrl: '',
    },
    rank: 4,
    statNumber: 123445,
  },
];
