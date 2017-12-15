/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import CoreSettings from './CoreSettings';
import clientInterface from './clientInterface';

export * from './clientInterface';
import client from './client';

export * from './client';

// constants
import abilityTags from './constants/abilityConstants/abilityTags';
import announcementType from './constants/announcementType';
import buildUIMode from './constants/buildUIMode';
import channelId from './constants/channelId';
import emotes from './constants/emotes';
import soundEvents from './constants/soundEvents';
import tagConstraintType from './constants/tagConstraintType';
import gearSlot from './constants/gearSlot';
import plotPermissions from './constants/plotPermissions';
import attributeType from './constants/attributeType';
import warbandRanks from './constants/warbandRanks';
import warbandRoles from './constants/warbandRoles';
import warbandPermissions from './constants/warbandPermissions';

export * from './constants/bodyParts';
export * from './constants/damageTypes';
export * from './constants/resourceTypes';
export * from './constants/skillTracks';
export * from './constants/activeEffectActions';

// config
export * from './config/config';

// classes
import Announcement from './classes/Announcement';
import Combatant from './classes/Combatant';
import Item from './classes/Item';
import Player from './classes/Player';
import Ability from './classes/Ability';
export * from './classes/CombatLog';

import { DEBUG_ASSERT, RUNTIME_ASSERT } from './utils/assert';

export {
  // core
  CoreSettings,
  clientInterface,
  client,

  // core constants
  abilityTags,
  announcementType,
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
  Announcement,
  Combatant,
  Item,
  Player,
  Ability,

  // misc
  DEBUG_ASSERT,
  RUNTIME_ASSERT,
};
