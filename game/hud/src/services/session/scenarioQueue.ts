/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { query, GraphQLQuery, GraphQLQueryResult } from '@csegames/camelot-unchained/lib/graphql/query';
import { RequestOptions } from '@csegames/camelot-unchained/lib/utils/request';

export function gqlQuery(q: GraphQLQuery, options: RequestOptions = {}) {
  const requestOptions: RequestOptions = {
    headers: Object.assign({
      'api-version': `${game.apiVersion}`,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${game.accessToken}`,
      characterId: game.selfPlayerState.characterID,
      shardId: `${game.shardID}`,
      Accept: 'application/json',
    }, options.headers),
  };
  return query(q, {
    url: game.webAPIHost + '/graphql',
    requestOptions,
  });
}

interface FactionCounts {
  tdd: number;
  viking: number;
  arthurian: number;
}

export interface ScenarioMatch {
  id: string;
  name: string;
  icon: string;
  isQueued: boolean;
  gamesInProgress: number;
  charactersNeededToStartNextGameByFaction: FactionCounts;
  totalBackfillsNeededByFaction: FactionCounts;
}

const scenarioQuery: GraphQLQuery = {
  query: `{
    myScenarioQueue {
      availableMatches {
        id
        name
        icon
        isQueued
        gamesInProgress
        charactersNeededToStartNextGameByFaction {
          tdd
          viking
          arthurian
        }
        totalBackfillsNeededByFaction {
          tdd
          viking
          arthurian
        }
      }
    }
  }`,
};

export let scenarios: ScenarioMatch[];
let watchers = 0;
let timer: NodeJS.Timer;

function onload(results: any) {
  if (results.ok && results.data) {
    const myScenarioQueue = results.data.myScenarioQueue;
    if (myScenarioQueue && myScenarioQueue.availableMatches) {
      scenarios = myScenarioQueue.availableMatches;
      game.trigger('scenario-queue--update', scenarios);
    }
  } else {
    onerror(results);
  }
}

function onerror(reason: GraphQLQueryResult<any>) {
  console.error(reason);
}

export function poll() {
  gqlQuery(scenarioQuery).then(onload, onerror);
}

// Cancel current poll interval and start a new one. Sometimes we just want to get the
// information now, not in N seconds time.
export function pollNow() {
  if (timer) clearInterval(timer);
  poll();
  timer = setInterval(poll, 10000);
}

// Incrememnt watchers, and also return the current scenario data
// immediately if we have any.
export function startPollingScenarioQueue() {
  watchers++;
  pollNow();
  return scenarios;
}

// Decrement watchers, if watchers goes to zero, stop polling
export function stopPollingScenarioQueue() {
  watchers --;
  if (watchers === 0) {
    clearInterval(timer);
    timer = null;
  }
}

export function scenarioIsAvailable(scenario: ScenarioMatch) {
  const needed = scenario.gamesInProgress ? scenario.totalBackfillsNeededByFaction :
    scenario.charactersNeededToStartNextGameByFaction;
  switch (game.selfPlayerState.faction) {
    case Faction.TDD:
      if (needed.tdd > 0) return needed;
      break;
    case Faction.Viking:
      if (needed.viking > 0) return needed;
      break;
    case Faction.Arthurian:
      if (needed.arthurian > 0) return needed;
      break;
  }
}
