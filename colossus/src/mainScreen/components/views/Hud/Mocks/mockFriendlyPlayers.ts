/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
  EntityResource,
  defaultPlayerEntityStateModel,
  PlayerEntityStateModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { clamp, mapValueRange } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { Mock } from './data';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';

// Returns the input string with the '_' chars replaced with random chars from the replacementChars string.
// eg. makeRandomID("__ab", "12345") == "25ab"
function makeRandomID(str: string, replacementChars = 'abcdef0123456789') {
  return Array.from(str)
    .map((ch) => (ch == '_' ? replacementChars[Math.floor(Math.random() * replacementChars.length)] : ch))
    .join('');
}

declare global {
  interface Window {
    _mockPlayerEntityIDs: string[];
  }
}

function makeRandomPlayerEntityID(pattern: string): string {
  if (!window._mockPlayerEntityIDs) {
    window._mockPlayerEntityIDs = [];
  }

  const entityID = makeRandomID(pattern);
  window._mockPlayerEntityIDs.push(entityID);
  return entityID;
}

function popLastRandomPlayerEntityID(): string {
  if (!window._mockPlayerEntityIDs || window._mockPlayerEntityIDs.length === 0) {
    return null;
  }
  return window._mockPlayerEntityIDs.pop();
}

function randomValueInRange(minVal: number, maxVal: number): number {
  return mapValueRange(Math.random(), 0.0, 1.0, minVal, maxVal);
}

function randomChoice<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function randomEntityResource(name: string, max: number = -1): EntityResource {
  if (max < 0) {
    max = Math.floor(randomValueInRange(1, 8)) * 1000;
  }
  // random value overshoots a bit so some small percentage of mock players will show up as 100%, and no players will show up as 0%
  const currentPct = clamp(randomValueInRange(0.05, 1.15), 0.0, 1.0);
  return {
    id: name,
    name: name,
    current: max * currentPct,
    max: max,
    lastDecreaseTime: 0,
    numericID: 0
  };
}

function makeMockPlayerEntity(name: string, entityID: string, scenarioID: string) {
  let race = 0;
  const className = randomChoice<string>(['Amazon', 'Celt', 'Berserker', 'Knight', 'Ninja']);
  let portraitURL = null;
  switch (className) {
    case 'Amazon':
      race = 23;
      portraitURL = 'images/hud/champions/amazon-profile.png';
      break;
    case 'Celt':
      race = 25;
      portraitURL = 'images/hud/champions/celt-profile.png';
      break;
    case 'Berserker':
      race = 20;
      portraitURL = 'images/hud/champions/berserker-profile.png';
      break;
    case 'Knight':
      race = 24;
      portraitURL = 'images/hud/champions/knight-profile.png';
      break;
    case 'Ninja':
      race = 26;
      portraitURL = 'images/hud/champions/ninja-profile.png';
      break;
    default:
      break;
  }

  let resources: ArrayMap<EntityResource> = {};
  resources[0] = randomEntityResource(EntityResourceIDs.Stamina);
  resources[1] = randomEntityResource(EntityResourceIDs.Blood);
  resources[2] = randomEntityResource(EntityResourceIDs.Barrier);
  resources[2] = randomEntityResource(EntityResourceIDs.Health);

  const model: PlayerEntityStateModel = {
    ...defaultPlayerEntityStateModel(),
    wounds: 2,
    resources: resources,
    currentDeaths: randomChoice<number>([0, 1, 2]),
    maxDeaths: 3,
    race,
    survivedTime: randomValueInRange(50.0, 400.0),
    scenarioRoundState: ScenarioRoundState.Running,
    scenarioRoundStateEndTime: 99999.9,
    scenarioRoundStateStartTime: 0.0,
    scenarioID,
    totalKills: Math.floor(randomValueInRange(0, 500)),
    teamKills: Math.floor(randomValueInRange(0, 4)),
    portraitURL
  };
  return model;
}

const commonFirstNames: string[] = [
  'James',
  'Robert',
  'John',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Thomas',
  'Charles',
  'Christopher',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Steven',
  'Paul',
  'Andrew',
  'Joshua',
  'Kenneth',
  'Kevin',
  'Brian',
  'George',
  'Edward',
  'Ronald',
  'Timothy',
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Barbara',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
  'Nancy',
  'Lisa',
  'Betty',
  'Margaret',
  'Sandra',
  'Ashley',
  'Kimberly',
  'Emily',
  'Donna',
  'Michelle',
  'Dorothy',
  'Amanda',
  'Melissa',
  'Deborah',
  'Stephanie',
  'Rebecca'
];

function randomHumanName(excludeNames: Set<string> = null): string {
  return randomChoice(
    excludeNames === null ? commonFirstNames : commonFirstNames.filter((name) => !excludeNames.has(name))
  );
}

function randomizePlayerName(baseName: string): string {
  let name = baseName;
  if (Math.random() > 0.5) {
    name = name.toLocaleLowerCase();
  } else if (Math.random() > 0.9) {
    name = name.toLocaleUpperCase();
  }

  if ((name.includes('o') || name.includes('O')) && Math.random() > 0.75) {
    name = name.replace('o', '0').replace('O', '0');
  }

  let prefix = '';
  if (Math.random() > 0.85) {
    prefix = 'UCE_';
  }

  let suffix = '';
  if (Math.random() > 0.66) {
    suffix = `${Math.floor(randomValueInRange(1, 99))}`;
    if (Math.random() > 0.66) {
      suffix = '_' + suffix;
    }
  }

  return `${prefix}${name}${suffix}`;
}

const SINGLE_FAKE_PLAYER_SCENARIO_ID = '1234ffff';

export const mockAddSingle: Mock = {
  name: 'Add fake player',
  expectedOutcomeDescription: 'A fake player should appear in the UI',
  function: () => {
    mockEvents.triggerEntityUpdated(
      makeMockPlayerEntity(
        randomizePlayerName(randomHumanName()),
        makeRandomPlayerEntityID('0118_999___________3'),
        SINGLE_FAKE_PLAYER_SCENARIO_ID
      )
    );
  }
};

export const mockRemoveSingle: Mock = {
  name: 'Removes fake player',
  expectedOutcomeDescription: 'The fake player should be removed from the UI',
  function: () => {
    const entityID = popLastRandomPlayerEntityID();
    if (entityID !== null) {
      mockEvents.triggerEntityRemoved(entityID);
    }
  }
};

export const mockAddMultiple: Mock = {
  name: 'Add nine mock players',
  expectedOutcomeDescription: 'Nine mock players should appear in the UI',
  function: () => {
    console.log('-- Mock adding nine friendly players');

    const scenarioID = makeRandomID('00000000________');

    let usedHumanNames = new Set<string>();
    for (let i = 0; i < 9; i++) {
      const name = randomHumanName(usedHumanNames);
      usedHumanNames.add(name);
      mockEvents.triggerEntityUpdated(
        makeMockPlayerEntity(randomizePlayerName(name), makeRandomPlayerEntityID('deadbeef________'), scenarioID)
      );
    }
  }
};

export const mockRemoveAll: Mock = {
  name: 'Removes all fake players',
  expectedOutcomeDescription: 'All fake players should be removed from the UI',
  function: () => {
    let entityID = popLastRandomPlayerEntityID();
    while (entityID !== null) {
      mockEvents.triggerEntityRemoved(entityID);
      entityID = popLastRandomPlayerEntityID();
    }
  }
};
