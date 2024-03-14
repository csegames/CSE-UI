import { Faction_Int32, ScenarioMatch } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';

export const getScenarioFactionData = (match: ScenarioMatch): Faction_Int32 => {
  return match.gamesInProgress ? match.totalBackfillsNeededByFaction : match.charactersNeededToStartNextGameByFaction;
};

export const isScenarioMatchAvailable = (match: ScenarioMatch, faction: Faction): boolean => {
  if (match.isInScenario || match.isQueued) {
    return true;
  }
  const factionData = getScenarioFactionData(match);
  let value: Faction | null = null;
  switch (faction) {
    case Faction.TDD:
      value = factionData.tdd;
      break;
    case Faction.Viking:
      value = factionData.viking;
      break;
    case Faction.Arthurian:
      value = factionData.arthurian;
      break;
  }
  return value > 0;
};
