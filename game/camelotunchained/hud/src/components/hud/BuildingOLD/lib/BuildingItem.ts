/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum BuildingItemType {
  Block = 0,
  Blueprint = 1,
  Droplight = 2,
}

export interface BuildingItem {
  id: string;
  type: BuildingItemType;
  matElement: JSX.Element;
  element: JSX.Element;
  name: string;
  description: string;
  select: () => void;
}
