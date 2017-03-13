/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AxiosRequestConfig, Promise } from 'axios';

import * as CharactersAPI from './controllers/Characters';
import * as ContentAPI from './controllers/Content';
import * as GameDataAPI from './controllers/GameData';
import * as GroupsAPI from './controllers/Groups';
import * as OrdersAPI from './controllers/Orders';
import * as PlotsAPI from './controllers/Plots';
import * as PresenceAPI from './controllers/Presence';
import * as ServerListHelperAPI from './controllers/ServerListHelper';
import * as TraitsAPI from './controllers/Traits';
import * as WarbandsAPI from './controllers/Warbands';


// directly export definitions and helpers
export * from './definitions';
export * from './helpers';

import * as Errors from './apierrors';

export {
  CharactersAPI,
  ContentAPI,
  GameDataAPI,
  GroupsAPI,
  OrdersAPI,
  PlotsAPI,
  PresenceAPI,
  ServerListHelperAPI,
  TraitsAPI,
  WarbandsAPI,
  Errors,
}
