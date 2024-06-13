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
              defaultChampion {
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
          serverName
          serverPort
          started
          playerStats {
            player {
              displayName
              id
            }
            counts {
              name
              value
            }
            labels {
              name
              value
            }
            scores {
              name
              value
            }
          }
          globalStats {
            counts {
              name
              value
            }
            labels {
              name
              value
            }
            scores {
              name
              value
            }
          }
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
        roundID
      }
      ... on SelectionUpdated {
        selection {
          activityID
          created
          durationSeconds
          players {
            defaultChampion {
              championID
              costumeID
              portraitID
            }
            displayName
            id
            locked
            selectedChampion {
              championID
              costumeID
              portraitID
            }
          }
          revision
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
            displayName
            id
          }
          teamID
        }
        roundID
        scenarioID
        serverName
        serverPort
        started
        playerStats {
          player {
            displayName
            id
          }
          counts {
            name
            value
          }
          labels {
            name
            value
          }
          scores {
            name
            value
          }
        }
        globalStats {
          counts {
            name
            value
          }
          labels {
            name
            value
          }
          scores {
            name
            value
          }
        }
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
          defaultChampion {
            championID
            costumeID
            portraitID
          }
          displayName
          id
          locked
          selectedChampion {
            championID
            costumeID
            portraitID
          }
        }
        revision
        roundID
        scenarioID
      }
      matchAccess
      queues {
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
