/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Item } from '../types/Items';

export enum TradeState {
  None = 0,
  Invited = 1,
  ModifyingItems = 2,
  Confirmed = 3
}

export interface TradeSnapshot {
  tradeTargetEntityID: string;
  tradeTargetName: string;
  tradeState: TradeState;
  tradeTargetState: TradeState;
  tradeItems: Item[]; // Items we are offering
  tradeTargetItems: Item[]; // Items the other player is offering
  tradeCurrency: Item[]; // Currency we are offering
  tradeTargetCurrency: Item[]; // Currency the other player is offering
  revision: number; // Used when confirming items to avoid race conditions
}
