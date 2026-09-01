/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { ConsumableItem } from '../types/Consumables';

export interface ConsumableItemsState {
  activeIndex: number;
  items: ArrayMap<ConsumableItem>;
  timestamp?: number;
}
