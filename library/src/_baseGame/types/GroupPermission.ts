/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum GroupPermission {
  None = 0,
  Accept = 1 << 0,
  Invite = 1 << 1,
  Promote = 1 << 2,
  Demote = 1 << 3,
  Kick = 1 << 4,
  Enqueue = 1 << 5,
  Dequeue = 1 << 6,
  ChangeSubgroup = 1 << 7,
  ChangeRanks = 1 << 8,
  ChangeMOTD = 1 << 9,
  ChangeName = 1 << 10,
  ChangeCrest = 1 << 11,

  All = (1 << 12) - 1
}
