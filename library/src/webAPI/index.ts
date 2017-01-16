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

import * as ServerListHelperAPI from './controllers/ServerListHelper';
import * as WarbandsAPI from './controllers/Warbands';
import * as PlotsAPI from './controllers/Plots';

// ORDERS (GUILDS)
import * as OrdersMainAPI from './controllers/Orders';
import * as OrderInfoAPI from './controllers/OrderInfo';

// directly export definitions and helpers
export * from './definitions';
export * from './helpers';

// combine the two order files into one namespace
export const OrdersAPI = {
  ...OrdersMainAPI,
  ...OrderInfoAPI,
}

export {
  CharactersAPI,
  ContentAPI,
  GameDataAPI,
  GroupsAPI,
  ServerListHelperAPI,
  WarbandsAPI,
  PlotsAPI
}
