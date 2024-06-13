/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type NotificationsSubscriptionResult = Pick<CUSubscription, 'notifications'>;

export const notificationsSubscription = (shardID: number) => gql`
  subscription NotificationsSubscription {
    notifications(tags: ["shard-${shardID}"]) {
      broadcastDuration
      content
      counter
      displayDuration
      displayHints
      displayTime
      mimeType
      purpose
      sequenceID
      tags
    }
  }
`;
