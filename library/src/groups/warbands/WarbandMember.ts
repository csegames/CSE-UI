/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import race from '../../core/constants/race';
import gender from '../../core/constants/gender';
import archetype from '../../core/constants/archetype';


export enum WarbandMemberRole {
  Temporary,
  Permanent,
  Owner,
}

export enum WarbandMemberRank {
  None,
  Member,
  Leader,
}

export enum WarbandMemberPermissions {
  Join,
  Invite,
  Kick,
  ManagePrivacy,
  ManagePermanent,
  ManageBanner,
  ManageName,
}

export interface WarbandMember {
  name: string,
  race: race,
  gender: gender,
  archetype: archetype,
  characterID: string;
  joined: string;
  role: WarbandMemberRole;
  rank: WarbandMemberRank;
  health: [{
    current: number,
    maximum: number
  }];
  stamina: {
    current: number,
    maximum: number
  };
  additionalPermissions: [WarbandMemberPermissions];
}

/**
 * {
 *   "AdditionalPermissions":[],
 *   "Role":0,
 *   "Rank":2,
 *   "IsActive":true,
 *   "Health":[],
 *   "Stamina":0,
 *   "IsPermanent":false,
 *   "CharacterID":"KCt3dNCC6dKPyNzD0SR200",
 *   "Joined":"0001-01-01T00:00:00",
 *   "Parted":"0001-01-01T00:00:00",
 *   "ID":{"ObjectID":"000000000000000000000000","ShardID":0}
 * }
 */
