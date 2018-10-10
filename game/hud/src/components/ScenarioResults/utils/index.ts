/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { find, filter } from 'lodash';
import { TeamInterface } from '../components/ScenarioResultsContainer';
import { ScenarioOutcome } from 'gql/interfaces';

export function hasMiscellaneousOutcome(teams: TeamInterface[]) {
  return find(teams, team => isMiscellaneousOutcome(team.outcome));
}

export function isMiscellaneousOutcome(outcome: ScenarioOutcome) {
  switch (outcome) {
    case 'Invalid':
    case 'Killed':
    case 'Restart':
    case 'Draw': {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function isDrawOutcome(teams: TeamInterface[]) {
  // We only need the first occurence of a draw since all teams will have the same outcome.
  return find(teams, team => team.outcome === 'Draw');
}

export function getMyFactionTeam(teams: TeamInterface[]) {
  const myFactionTeam = find(teams, team => teamIdIsMyFaction(team.teamID));
  return myFactionTeam;
}

export function getOtherTeams(teams: TeamInterface[], teamID: string) {
  const otherTeams = filter(teams, team => team.teamID !== teamID);
  return otherTeams;
}

/*
  This case is very rare, but is very possible and will happen.
  If the player's faction wins, show that faction as the big victorious and put the other victor to the side.
  Otherwise, if the player's faction does not win, order does not really matter.
*/
export function getFilteredWinningTeams(teams: TeamInterface[]) {
  const filteredTeams = filter(teams, team => team.outcome === 'Win');
  return filteredTeams;
}

export function getMainWinningTeam(winningTeams: TeamInterface[]) {
  if (winningTeams.length > 1) {
    const myFactionTeam = getMyFactionTeam(winningTeams);
    return myFactionTeam || winningTeams[0];
  }

  return winningTeams[0];
}

export function teamIdIsMyFaction(teamID: string) {
  switch (teamID) {
    case 'Arthurian': {
      return game.selfPlayerState.faction === Faction.Arthurian;
    }
    case 'Tuatha': {
      return game.selfPlayerState.faction === Faction.TDD;
    }
    case 'Viking': {
      return game.selfPlayerState.faction === Faction.Viking;
    }
    default: {
      return false;
    }
  }
}
