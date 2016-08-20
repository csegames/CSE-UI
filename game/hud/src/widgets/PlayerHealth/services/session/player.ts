/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events, race, gender, archetype, faction, hasClientAPI, Player} from 'camelot-unchained';
import {PlayerStatus, BodyParts} from '../../../../lib/PlayerStatus';

const DO_THING = 'testthing';

const INIT = 'playerhealth/player/INIT';
const STAMINA_UPDATED = 'playerhealth/player/STAMINA_UPDATED';
const HEALTH_UPDATED = 'playerhealth/player/HEALTH_UPDATED';

const RACE_CHANGED = 'playerhealth/player/RACE_CHANGED';
const NAME_CHANGED = 'playerhealth/player/NAME_CHANGED';
const FACTION_CHANGED = 'playerhealth/player/FACTION_CHANGED';
const PLAYER_UPDATE = 'playerhealth/player/PLAYER_UPDATE';

export interface PlayerAction {
  type: string;
  error?: string;
  current?: number;
  max?: number;
  part?: BodyParts;
  text?: string;
  race?: race;
  faction?: faction;
  player?: Player;
}

function init(): PlayerAction {
  return {
    type: INIT,
  };
}

function staminaChanged(current: number, max: number): PlayerAction {
  return {
    type: STAMINA_UPDATED,
    current: current,
    max: max,
  };
}

function healthChanged(current: number, max: number, part: BodyParts): PlayerAction {
  return {
    type: HEALTH_UPDATED,
    current: current,
    max: max,
    part: part,
  };
}

function nameChanged(name: string): PlayerAction {
  return {
    type: NAME_CHANGED,
    text: name,
  };
}


function raceChanged(race: race): PlayerAction {
  return {
    type: RACE_CHANGED,
    race: race,
  };
}

function factionChanged(faction: faction): PlayerAction {
  return {
    type: FACTION_CHANGED,
    faction: faction,
  };
}

function characterUpdate(player: Player): PlayerAction {
  return {
    type: PLAYER_UPDATE,
    player: player,
  }
}

export function DoThing(): PlayerAction {
  return {
    type: DO_THING
  }
}

export function initializePlayerSession() {
  return (dispatch: (action: any) => any) => {
    dispatch(init());

    if (!hasClientAPI()) return;

    // init handlers / events
    client.OnCharacterStaminaChanged((current: number, max: number) => dispatch(staminaChanged(current, max)));
    client.OnCharacterHealthChanged((current: number, max: number) => dispatch(healthChanged(current, max, BodyParts.Torso)));

    client.OnCharacterNameChanged((name: string) => dispatch(nameChanged(name)));
    client.OnCharacterRaceChanged((race: race) => dispatch(raceChanged(race)));
    client.OnCharacterFactionChanged((faction: faction) => dispatch(factionChanged(faction)));

    events.on(events.clientEventTopics.handlesCharacter, (player: Player) => dispatch(characterUpdate(player)));

  };
}


function fakePlayer(): PlayerStatus {
  return {
    name: 'CSE-JB',
    avatar: 'http://camelotunchained.com/upload/jb.png',
    race: race.HUMANMALEV,
    gender: gender.MALE,
    archetype: archetype.WINTERSSHADOW,
    characterID: '',
    health: [{
      current: 10000,
      maximum: 10000,
      wounds: 0,
    },{
      current: 10000,
      maximum: 10000,
      wounds: 0,
    },{
      current: 10000,
      maximum: 10000,
      wounds: 0,
    },{
      current: 10000,
      maximum: 10000,
      wounds: 0,
    },{
      current: 10000,
      maximum: 10000,
      wounds: 0,
    },{
      current: 10000,
      maximum: 10000,
      wounds: 0,
    }],
    stamina: {
      current: 1000,
      maximum: 2000
    },
    blood: {
      current: 15000,
      maximum: 15000
    },
    panic: {
      current: 1,
      maximum: 3
    },
    temperature: {
      current: 50,
      freezingThreshold: 0,
      burningThreshold: 100
    }
  }
}

function fakeEvents() {
  return [{
    key: 0,
    value: '1000',
    textType: 'damage',
    iconType: 'slashing',
    timestamp: Date.now(),
  },{
    key: 1,
    value: '500',
    textType: 'damage',
    iconType: 'slashing',
    timestamp: Date.now(),
  },{
    key: 2,
    value: '1000',
    textType: 'heal',
    iconType: 'spirit',
    timestamp: Date.now(),
  }];
}

export interface PlayerState {
  playerStatus: PlayerStatus;
  events: {
    key: number,
    value: string,
    textType: string,
    iconType: string,
    timestamp: number,
  }[];
}

const initialState = {
  playerStatus: fakePlayer(),
  events: hasClientAPI() ? [] : fakeEvents(),
}

function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

let key = 3;
export default function reducer(state: PlayerState = initialState,
                                action: PlayerAction = {type: null}) : PlayerState {
  switch(action.type) {
    case INIT:
      return Object.assign({}, state, {

      });

    case STAMINA_UPDATED:
    {
      let playerStatus = clone(state.playerStatus);
      playerStatus.stamina.current = action.current;
      playerStatus.stamina.maximum = action.max;
      return Object.assign({}, state, {
        playerStatus: playerStatus
      });
    }

    case HEALTH_UPDATED:
    {
      let playerStatus = clone(state.playerStatus);
      playerStatus.health[action.part].current = action.current;
      playerStatus.health[action.part].maximum = action.max;
      return Object.assign({}, state, {
        playerStatus: playerStatus
      });
    }

    case NAME_CHANGED:
    {
      let playerStatus = clone(state.playerStatus);
      playerStatus.name = action.text;
      return Object.assign({}, state, {
        playerStatus: playerStatus
      });
    }

    case RACE_CHANGED:
    {
      let playerStatus = clone(state.playerStatus);
      playerStatus.race = action.race;
      return Object.assign({}, state, {
        playerStatus: playerStatus
      });
    }

    case PLAYER_UPDATE:
    {
      const doEvent = state.playerStatus.name == action.player.name;
      let playerStatus = clone(state.playerStatus);
      playerStatus.name = action.player.name;
      playerStatus.archetype = action.player.archetype;
      playerStatus.race = action.player.race;
      playerStatus.stamina.current = action.player.stamina;
      playerStatus.stamina.maximum = action.player.maxStamina;

      playerStatus.blood.current = action.player.health; // this is blood not health!
      playerStatus.blood.maximum = action.player.maxHealth > 0 ? action.player.maxHealth : 10000;

      // make an event -- hacky for now
      let index = 0;
      let now = Date.now();
      for (; index < state.events.length; ++index) {
        if (now - state.events[index].timestamp < 1000) break;
      }
      var newEvents = state.events.slice(index);

      action.player.injuries.forEach(e => {
        const valueChange = playerStatus.health[e.part].current - e.health;
        playerStatus.health[e.part].current = e.health;
        playerStatus.health[e.part].maximum = e.maxHealth > 0 ? e.maxHealth : 10000;
        playerStatus.health[e.part].wounds = e.wounds;

        if (!doEvent) return;

        if (valueChange > 0) {
          // damage event!
          newEvents.push({
            key: key++,
            value: Math.abs(valueChange).toFixed(0),
            timestamp: now,
            textType: 'damage',
            iconType: 'piercing',
          });
        } else if (valueChange < 0) {
          // heal event!
          newEvents.push({
            key: key++,
            value: Math.abs(valueChange).toFixed(0),
            timestamp: now,
            textType: 'heal',
            iconType: 'heal',
          });
        }
      });

      return Object.assign({}, state, {
        playerStatus: playerStatus,
        events: newEvents,
      });
    }

    case DO_THING:
    {
      // clean out any old ones
      let index = 0;
      let now = Date.now();
      for (; index < state.events.length; ++index) {
        if (now - state.events[index].timestamp < 1000) break;
      }
      var newEvents = state.events.slice(index);
      let damage  = Math.random() * 2 > .5;
      const e = {
        key: key++,
        value: (Math.random()*2000 + 750).toFixed(0),
        timestamp: now,
        textType: damage ? 'damage' : 'heal',
        iconType: damage ? 'piercing' : 'heal',
      };
      newEvents.push(e);

      let playerStatus = clone(state.playerStatus);
      const part = parseInt((Math.random() * 5).toFixed(0));
      playerStatus.health[part].current = damage ? playerStatus.health[part].current - parseInt(e.value) : playerStatus.health[part].current + parseInt(e.value);
      return Object.assign({}, state, {
        events: newEvents,
        playerStatus: playerStatus,
      })
      // return Object.assign({}, state, {
      //   events: state.events.slice(0, state.events.length -1)
      // });
    }

    default: return state;
  }
}
