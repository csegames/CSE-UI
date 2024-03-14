/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CUQuery, CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import gql from 'graphql-tag';

export interface TeamJoinAPIError {
  type: string;
  fields: Dictionary<any>;
}

// Specify the subset of keys from CUQuery that we are interested in.
export type TeamJoinCurrentStatusQueryResult = Pick<CUQuery, 'group' | 'groupOffers' | 'groupOfferPermissions'>;
export type GroupOffersSubscriptionResult = Pick<CUSubscription, 'groupOffers'>;
export type GroupSubscriptionResult = Pick<CUSubscription, 'group'>;

export const currentStateQuery = gql`
  query TeamJoinCurrentState {
    groupOfferPermissions {
      allowApplications
      allowInvitations
      alwaysAllowed {
        id
        displayName
      }
      blocked {
        id
        displayName
      }
      player {
        id
        displayName
      }
      revision
    }
    group {
      id
      size
      capacity
      leader {
        id
        displayName
      }
      members {
        defaultChampion {
          championID
          costumeID
          portraitID
        }
        id
        displayName
        isOnline
      }
      invitations {
        from {
          id
          displayName
        }
        to {
          id
          displayName
        }
        sent
        expires
      }
      updateLog {
        action
        target {
          id
          displayName
        }
      }
      totalChanges
    }
    groupOffers {
      player {
        id
        displayName
      }
      invitations {
        from {
          id
          displayName
        }
        to {
          id
          displayName
        }
        sent
        expires
      }
    }
  }
`;

export const groupSubscription = gql`
  subscription TeamJoinGroupSubscription {
    group {
      id
      size
      capacity
      leader {
        id
        displayName
      }
      members {
        defaultChampion {
          championID
          costumeID
          portraitID
        }
        id
        displayName
        isOnline
      }
      invitations {
        from {
          id
          displayName
        }
        to {
          id
          displayName
        }
        sent
        expires
      }
      updateLog {
        action
        target {
          id
          displayName
        }
      }
      totalChanges
    }
  }
`;

export const groupOffersSubscription = gql`
  subscription TeamJoinGroupOffersSubscription {
    groupOffers {
      expires
      from {
        id
        displayName
      }
      groupSize
      hasEnded
      isInvite
      sent
      status
      to {
        id
        displayName
      }
    }
  }
`;
