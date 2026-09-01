/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseEntityState } from './EntityState';

export interface ItemEntityState extends BaseEntityState {
  itemDefID: number;
  iconClass: string;
  iconClassColor: number;
}

export function isItem(entity: BaseEntityState): entity is ItemEntityState {
  return entity && typeof (entity as any).itemDefID === 'number';
}
