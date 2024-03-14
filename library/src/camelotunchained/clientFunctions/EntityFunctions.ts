/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseEntityStateModel, EntityResource } from '../game/GameClientModels/EntityState';
import { EntityResourceIDs } from '../game/types/EntityResourceIDs';

export function getEntityResource(entity: BaseEntityStateModel, resourceID: EntityResourceIDs): EntityResource {
  if (entity == null || entity.resources == null) {
    return null;
  }

  const resource = Object.values(entity.resources).find((r) => r.id === resourceID);
  return resource;
}
