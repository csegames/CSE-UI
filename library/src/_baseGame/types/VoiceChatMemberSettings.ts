/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export enum VoiceChatMemberStatus {
  Disabled = 0,
  Enabled = 1,
  Speaking = 2,
  Muted = 3
}

export interface VoiceChatMemberSettings {
  status: VoiceChatMemberStatus;
  volume: number; // 0-1
}
