/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PlayerEntityStateModel, SnapshotFlags } from './game/GameClientModels/EntityState';
import { PartyMember, PartySnapshot } from './game/GameClientModels/PartySnapshot';
import { WarbandMember, WarbandSnapshot, WarbandSubgroup } from './game/GameClientModels/WarbandSnapshot';
import { CharacterKind } from './game/types/CharacterKind';
import { Faction, Vec3f } from './webAPI/definitions';

const MOCK_PARTY_MAX_SIZE = 8;
const MOCK_WARBAND_SUBGROUP_COUNT = 4;

interface CamelotMockDataGenerators {
  // By passing in a Partial object, we can override any fields we want, get defaults for the rest,
  // and not need a long list of individual params in the function signature.  Plus, applying the
  // overrides is a one-line Object.assign() call that works even if the underlying model changes!
  createPlayerEntityState: (overrides?: Partial<PlayerEntityStateModel>) => PlayerEntityStateModel;
  createPlayerEntityPosition: () => Vec3f;
  createPartySnapshot: () => PartySnapshot;
  createWarbandSnapshot: () => WarbandSnapshot;
}

export const camelotMocks: CamelotMockDataGenerators = {
  createPlayerEntityState: (overrides?: Partial<PlayerEntityStateModel>) => {
    const mockData: PlayerEntityStateModel = {
      type: 'Player',
      characterKind: CharacterKind.User,
      race: 3,
      gender: 1,
      classID: 9,
      resources: {},
      faction: Faction.TDD,
      entityID: 'MOCK',
      name: 'Plei Solder',
      isAlive: true,
      statuses: {},
      objective: null,
      accountID: '',
      characterID: '',
      groupID: 'mock',
      guildCrest: '',
      guildID: '',
      guildName: '',
      stats: {},
      progression: {},
      characterLevel: 0,
      equipment: {},
      inventory: {},
      wallet: {},
      accountBank: {},
      tags: {},
      flags: SnapshotFlags.None,
      isKeepAvailable: false,
      respawnTimestamp: 0,
      idleRespawnTimestamp: 0
    };

    if (overrides) {
      Object.assign(mockData, overrides);
    }

    return mockData;
  },
  createPlayerEntityPosition: () => {
    return { x: 0, y: 0, z: 0 };
  },
  createPartySnapshot: (): PartySnapshot => {
    const members: PartyMember[] = [];
    for (let i = 0; i < MOCK_PARTY_MAX_SIZE; ++i) {
      members.push({
        characterID: 'character',
        entityID: null,
        name: 'Party Member',
        race: 3,
        gender: 1,
        classID: 9,
        isLeader: members.length == 0,
        isOnline: members.length % 2 == 0
      });
    }
    return {
      groupID: 'mock',
      members
    };
  },
  createWarbandSnapshot: (): WarbandSnapshot => {
    const snapshot: WarbandSnapshot = {
      groupID: 'mock',
      subgroups: []
    };

    for (let i = 0; i < MOCK_WARBAND_SUBGROUP_COUNT; ++i) {
      const subgroup: WarbandSubgroup = {
        members: []
      };
      // Each subgroup will have a different number of members.
      for (let j = 0; j < MOCK_PARTY_MAX_SIZE - i; ++j) {
        const member: WarbandMember = {
          characterID: `mock-sg${i}-m${j}`,
          entityID: '',
          name: 'Party Member',
          race: 3,
          gender: 1,
          classID: 9,
          isLeader: j === 0 && i === 0,
          isDeputy: j === 0 && i === 1,
          isOnline: j % 2 == 0,
          subgroup: i
        };
        subgroup.members.push(member);
      }

      snapshot.subgroups.push(subgroup);
    }

    return snapshot;
  }
};
