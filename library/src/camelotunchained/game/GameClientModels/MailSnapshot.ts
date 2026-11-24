/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface MailSnapshot {
  messages: MailMessage[];
}

export interface MailMessage {
  id: number;
  sequenceNumber: number,
  senderName: string | null;
  sentFromKing: boolean;
  sentAt: number; // Correct units for new Date(sentAt)
  wasRead: boolean;
  wasCollected: boolean;
  templateID: number;
  attachmentIDs: number[];
  money: number;
  resolvedStringTokens: Record<string, string>;
  participationEvents: Record<number, number>;
}
