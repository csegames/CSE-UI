/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// core
import CoreSettings from './core/CoreSettings';
import clientInterface from './core/clientInterface';
import client from './core/client';

// constants
import abilityTags from './core/constants/abilityConstants/abilityTags';
import archetype from './core/constants/archetype';
import buildUIMode from './core/constants/buildUIMode';
import channelId from './core/constants/channelId';
import emotes from './core/constants/emotes';
import race from './core/constants/race';
import soundEvents from './core/constants/soundEvents';
import tagConstraintType from './core/constants/tagConstraintType';
import gearSlot from './core/constants/gearSlot';
import plotPermissions from './core/constants/plotPermissions';
import attributeType from './core/constants/attributeType';
import faction from './core/constants/faction';
import gender from './core/constants/gender';

// classes
import Ability from './core/classes/Ability';
import Combatant from './core/classes/Combatant';
import Player from './core/classes/Player';
import Character from './core/classes/Character';
import ControlGame from './core/classes/ControlGame';
import Injury from './core/classes/Injury';
import Population from './core/classes/Population';
import Inventory from './core/classes/Inventory';
import Item from './core/classes/Item';
import EquippedGear from './core/classes/EquippedGear';
import LogMessage from './core/classes/LogMessage';
import ChatMessage from './core/classes/ChatMessage';
import ConsoleMessage from './core/classes/ConsoleMessage';

// libraries
import * as core from './core/core';
import stores from './stores/stores';
import components from './components/components';


import * as restAPI from './restapi/RestAPI';

import api from './api';

import * as groups from './groups';
export * from './groups';

import events from './events';
import * as eventExports from './events'

export * from './signalr';
import * as signalrExports from './signalr';
import signalr from './signalr';

let cu = Object.assign({

  // api
  api,

  // core
  CoreSettings : CoreSettings,
  client : client,

  // core constants
  abilityTags : abilityTags,
  archetype : archetype,
  buildUIMode : buildUIMode,
  channelId : channelId,
  emotes : emotes,
  race : race,
  soundEvents : soundEvents,
  tagConstraintType : tagConstraintType,
  gearSlot : gearSlot,
  plotPermissions : plotPermissions,
  attributeType : attributeType,
  faction : faction,
  gender : gender,

  // core classes
  Ability : Ability,
  Combatant : Combatant,
  Player : Player,
  Character : Character,
  ControlGame : ControlGame,
  Injury : Injury,
  Population : Population,
  Inventory : Inventory,
  Item : Item,
  EquippedGear : EquippedGear,
  LogMessage : LogMessage,
  ChatMessage : ChatMessage,
  ConsoleMessage : ConsoleMessage,

  // RestAPI
  restAPI : restAPI
}, groups, eventExports, signalrExports);

export default cu;

export {

  // cu
  cu,

  // core
  CoreSettings,
  clientInterface,
  client,

  // core constants
  abilityTags,
  archetype,
  buildUIMode,
  channelId,
  emotes,
  race,
  soundEvents,
  tagConstraintType,
  gearSlot,
  plotPermissions,
  attributeType,
  faction,
  gender,

  // core classes
  Ability,
  Combatant,
  Player,
  Character,
  ControlGame,
  Injury,
  Population,
  Inventory,
  Item,
  EquippedGear,
  LogMessage,
  ChatMessage,
  ConsoleMessage,

  // libraries
  core,
  events,
  stores,
  components,

  // RestAPI
  restAPI,

  signalr,
}
