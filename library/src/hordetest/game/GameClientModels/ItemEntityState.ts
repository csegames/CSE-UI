/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseEntityStateModel } from './EntityState';

export interface ItemEntityStateModel extends BaseEntityStateModel {
  itemDefID: number;
  iconClass: string;
  iconClassColor: number;
}

export function isItem(entity: BaseEntityStateModel): entity is ItemEntityStateModel {
  return entity && typeof (entity as any).itemDefID === 'number';
}
