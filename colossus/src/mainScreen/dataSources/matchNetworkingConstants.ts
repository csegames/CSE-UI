/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type MatchQueryResult = Pick<CUQuery, 'matchmaking' | 'serverTimestamp'>;
export type MatchSubscriptionResult = Pick<CUSubscription, 'matchmaking'>;

export const matchSubscription = gql`
  subscription MatchSubscription {
    matchmaking {
      type
      ... on GameModeRemoved {
        activityID
      }
      ... on GameModeUpdated {
        mode {
          activityID
          playCriteria {
            criterionID
            restrictions {
              fields {
                name
                value
              }
              type
            }
          }
          scenarios {
            id
            weight
          }
          teams {
            maxSize
            maxStartSize
            roles {
              id
              maxSize
              maxStartSize
              minSize
              joinCriteria {
                criterionID
                restrictions {
                  fields {
                    name
                    value
                  }
                  type
                }
              }
            }
            teamID
          }
          viewCriteria {
            criterionID
            restrictions {
              fields {
                name
                value
              }
              type
            }
          }
        }
      }
      ... on MatchRemoved {
        roundID
      }
      ... on MatchUpdated {
        match {
          activityID
          completed
          configured
          created
          error {
            system
            type
            fields {
              name
              value
            }
          }
          revision
          rosters {
            members {
              champion {
                championID
                costumeID
                portraitID
              }
              displayName
              id
            }
            teamID
          }
          roundID
          scenarioID
          gameServerAddress
          chatServerAddress
          started
          ended
        }
      }
      ... on QueueEntryRemoved {
        queueID
        entryID
        userTag
        error {
          system
          type
          fields {
            name
            value
          }
        }
      }
      ... on QueueEntryUpdated {
        entry {
          enteredBy {
            displayName
            id
          }
          entryID
          queuedTime
          queueID
          userTag
        }
      }
      ... on QueueRemoved {
        queueID
      }
      ... on QueueUpdated {
        queue {
          displayAlias
          enabled
          nextStatusChange
          maxEntrySize
          maxWaitBySize {
            durationSec
            playerCount
          }
          minEntrySize
          queueID
          strategy
          targets {
            activityID
            teamID
          }
        }
      }
      ... on SelectionRemoved {
        reservationID
      }
      ... on SelectionUpdated {
        selection {
          activityID
          created
          durationSeconds
          players {
            displayName
            id
            locked
            champion {
              championID
              costumeID
              portraitID
            }
          }
          revision
          reservationID
          roundID
          scenarioID
        }
      }
      ... on AccessChanged {
        access
      }
    }
  }
`;

export const matchQuery = gql`
  query MatchStatusQuery {
    serverTimestamp
    matchmaking {
      modes {
        activityID
        playCriteria {
          criterionID
          restrictions {
            fields {
              name
              value
            }
            type
          }
        }
        scenarios {
          id
          weight
        }
        teams {
          maxSize
          maxStartSize
          roles {
            id
            maxSize
            maxStartSize
            minSize
            joinCriteria {
              criterionID
              restrictions {
                fields {
                  name
                  value
                }
                type
              }
            }
          }
          teamID
        }
        viewCriteria {
          criterionID
          restrictions {
            fields {
              name
              value
            }
            type
          }
        }
      }
      currentMatches {
        activityID
        completed
        configured
        created
        ended
        error {
          system
          type
          fields {
            name
            value
          }
        }
        revision
        rosters {
          members {
            champion {
              portraitID
              championID
              costumeID
            }
            displayName
            id
          }
          teamID
        }
        roundID
        scenarioID
        gameServerAddress
        chatServerAddress
        started
        ended
      }
      currentQueues {
        enteredBy {
          id
          displayName
        }
        entryID
        queuedTime
        queueID
      }
      currentSelections {
        activityID
        created
        durationSeconds
        players {
          displayName
          id
          locked
          champion {
            championID
            costumeID
            portraitID
          }
        }
        revision
        reservationID
        roundID
        scenarioID
      }
      matchAccess
      queues {
        displayAlias
        enabled
        nextStatusChange
        maxEntrySize
        maxWaitBySize {
          durationSec
          playerCount
        }
        minEntrySize
        queueID
        strategy
        targets {
          activityID
          teamID
        }
      }
    }
  }
`;
