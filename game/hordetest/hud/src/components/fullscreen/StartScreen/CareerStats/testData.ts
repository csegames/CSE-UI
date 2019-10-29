/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum StatType {
  Kills,
  KillStreak,
  LongestLife,
  DamageTaken,
  TotalDamage,
}

export interface TopPlayer {
  userName: string;
  championInfo: {
    id: string;
    name: string;
    iconUrl: string;
  };
  rank: number;
  statType: StatType;
  statNumber: number;
}

export const topPlayers: TopPlayer[] = [
  // Kills
  {
    userName: 'Deezy',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.Kills,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.Kills,
    statNumber: 999999,
  },
  {
    userName: 'Ultraman',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 3,
    statType: StatType.Kills,
    statNumber: 999998,
  },
  {
    userName: 'GODzilla',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 4,
    statType: StatType.Kills,
    statNumber: 999997,
  },
  {
    userName: 'JAMKOO',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 5,
    statType: StatType.Kills,
    statNumber: 999996,
  },
  {
    userName: 'Blur3',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 6,
    statType: StatType.Kills,
    statNumber: 999995,
  },
  {
    userName: 'Photoshopper',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 7,
    statType: StatType.Kills,
    statNumber: 999994,
  },
  {
    userName: 'MonkeyMouse',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 8,
    statType: StatType.Kills,
    statNumber: 999993,
  },
  {
    userName: 'wellsf4rg0',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 9,
    statType: StatType.Kills,
    statNumber: 999992,
  },
  {
    userName: 'AOMGsquad',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 10,
    statType: StatType.Kills,
    statNumber: 999991,
  },
  {
    userName: 'Boycold',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 11,
    statType: StatType.Kills,
    statNumber: 999990,
  },
  {
    userName: 'Codekunst',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 12,
    statType: StatType.Kills,
    statNumber: 999989,
  },
  {
    userName: 'Deezy',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.Kills,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'berserker-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.Kills,
    statNumber: 999999,
  },

  // Kill Streak
  {
    userName: 'Deezy',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.KillStreak,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.KillStreak,
    statNumber: 999999,
  },
  {
    userName: 'Deezy',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.KillStreak,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.KillStreak,
    statNumber: 999999,
  },

  // Longest Life
  {
    userName: 'Deezy',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.LongestLife,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.LongestLife,
    statNumber: 999999,
  },
  {
    userName: 'Deezy',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.LongestLife,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.LongestLife,
    statNumber: 999999,
  },

  // Damage Taken
  {
    userName: 'Deezy',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.DamageTaken,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.DamageTaken,
    statNumber: 999999,
  },
  {
    userName: 'Deezy',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.DamageTaken,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.DamageTaken,
    statNumber: 999999,
  },

  // Total Damage
  {
    userName: 'Deezy',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.TotalDamage,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'amazon-id',
      name: 'Amazon',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.TotalDamage,
    statNumber: 999999,
  },
  {
    userName: 'Deezy',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 1,
    statType: StatType.TotalDamage,
    statNumber: 10000000,
  },
  {
    userName: 'Jonminoes',
    championInfo: {
      id: 'berserker-id',
      name: 'Berserker',
      iconUrl: 'images/fullscreen/character-select/face.png',
    },
    rank: 2,
    statType: StatType.TotalDamage,
    statNumber: 999999,
  },
]
