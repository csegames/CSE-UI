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
import buildUIMode from './core/constants/buildUIMode';
import channelId from './core/constants/channelId';
import emotes from './core/constants/emotes';
import soundEvents from './core/constants/soundEvents';
import tagConstraintType from './core/constants/tagConstraintType';
import gearSlot from './core/constants/gearSlot';
import plotPermissions from './core/constants/plotPermissions';
import attributeType from './core/constants/attributeType';
import warbandRoles from './core/constants/warbandRoles';
import warbandRanks from './core/constants/warbandRanks';
import warbandPermissions from './core/constants/warbandPermissions';

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
export * from './core/core';

import * as legacyAPI from './restapi/RestAPI';

import * as webAPI from './webAPI';
export * from './webAPI/definitions';

export * from './groups';

export * from './building';

import events from './events';
import * as eventExports from './events'

import * as signalr from './signalr';
import {DEBUG_ASSERT,RUNTIME_ASSERT} from './core/core';

export * from './slashCommands';
import * as slashCommandsExports from './slashCommands';

// utils
import * as utils from './util';

// graphql
import * as ql from './graphql';


// components
import * as components from './components';
export * from './components';

export default {

  // core
  CoreSettings,
  client,

  // core constants - #TODO: remove these (shouldn't be using them)
  abilityTags,
  buildUIMode,
  channelId,
  emotes,
  soundEvents,
  tagConstraintType,
  gearSlot,
  plotPermissions,
  attributeType,
  warbandRoles,
  warbandRanks,
  warbandPermissions,

  // core classes - #TODO: remove these (shouldn't be using them)
  Ability,
  Combatant,
  Player,
  Character,
  ControlGame,
  Injury,
  Population,
  Inventory,
  EquippedGear,
  LogMessage,
  ChatMessage,
  ConsoleMessage,

  // RestAPI
  legacyAPI,

  components,

 ...eventExports,
 ...slashCommandsExports

};

export {

  webAPI,

  // cu
  utils,

  // core
  CoreSettings,
  clientInterface,
  client,

  // core constants
  abilityTags,
  buildUIMode,
  channelId,
  emotes,
  soundEvents,
  tagConstraintType,
  gearSlot,
  plotPermissions,
  attributeType,
  warbandRanks,
  warbandRoles,
  warbandPermissions,

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

  // Legacy RestAPI
  legacyAPI,

  // misc
  signalr,
  DEBUG_ASSERT,
  RUNTIME_ASSERT,

  ql,
}
