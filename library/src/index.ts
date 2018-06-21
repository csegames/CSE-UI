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

// libraries
import * as core from './core/core';

export * from './core/core';

import * as webAPI from './webAPI';

import * as restAPI from './restapi';

export * from './webAPI/definitions';

export * from './groups';

export * from './building';

import * as events from './events';

import * as signalr from './signalR';

export * from './slashCommands';
import * as slashCommandsExports from './slashCommands';

// utils
import * as utils from './utils';

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

  components,

  ...slashCommandsExports,

};

export {

  webAPI,
  restAPI,

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

  // libraries
  core,

  // misc
  signalr,
  events,

  ql,
};
