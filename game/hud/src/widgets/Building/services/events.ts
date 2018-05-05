/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fire } from '@csegames/camelot-unchained/lib/events';
import { BuildingItem } from '../lib/BuildingItem';

const ITEM_SELECTED_EVENT = 'building/selection/ITEM_SELECTED_EVENT';

export function fireBuildingItemSelected(item: BuildingItem) {
  fire(ITEM_SELECTED_EVENT, { item });
}

