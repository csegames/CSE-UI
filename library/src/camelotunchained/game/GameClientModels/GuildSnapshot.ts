/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GroupPermission } from '../../../_baseGame/types/GroupPermission';

export interface GuildMember {
  accountID: string;
  rank: number; // Index into ranks array
  isOnline: boolean;
  lastOnlineTime: number; // Correct units for new Date(lastOnlineTime)
  name: string;
}

export interface GuildRank {
  name: string;
  permissions: GroupPermission;
}

export interface GuildSnapshot {
  groupID: string;
  name: string;
  crest: string;
  motd: string;
  members: GuildMember[];
  ranks: GuildRank[];
}
