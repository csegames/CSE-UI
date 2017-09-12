/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';

export const GroupMemberFragment = gql`
  fragment GroupMember on GroupMemberState {
    entityID
    type
    warbandID
    characterID
    faction
    name
    isAlive
    race
    gender
    classID
    statuses {
      id
      icon
      description
      name
    }
    health {
      current
      max
      wounds
    }
    stamina {
      current
      max
    }
    blood {
      current
      max
    }
    position {
      x
      y
      z
    }
    isLeader
    canKick
    rankLevel
  }
`;
