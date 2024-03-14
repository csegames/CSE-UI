/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';
import { groupMemberFragment } from './fragments';

// Specify the subset of keys from CUQuery that we are interested in.
export type WarbandQueryResult = Pick<CUQuery, 'myActiveWarband'>;
export type WarbandSubscriptionResult = Pick<CUSubscription, 'activeGroupUpdates'>;
export type MyWarbandSubscriptionResult = Pick<CUSubscription, 'myGroupNotifications'>;

export const warbandQuery = gql`
  query WarbandContextQuery {
    myActiveWarband {
      info {
        id
      }
      members {
        ...GroupMember
      }
    }
  }
  ${groupMemberFragment}
`;

export const warbandSubscription = gql`
  subscription WarbandSubscription {
    activeGroupUpdates {
      updateType
      groupID

      ... on GroupMemberUpdate {
        memberState
      }

      ... on GroupMemberRemovedUpdate {
        characterID
      }
    }
  }
`;

export const myWarbandSubscription = gql`
  subscription MyWarbandSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;
