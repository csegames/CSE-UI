/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character } from '../definitions';
import { BadRequest, ExecutionError, NotAllowed, ServiceUnavailable, Unauthorized } from '../apierrors';


export function getFactionInfoV1() {
  return create(createOptions()).get('v1/gamedata/factionInfo', {
  });
}

export function getFactionsV1() {
  return create(createOptions()).get('v1/gamedata/factions', {
  });
}

export function getAttributeInfoV1(shard: number) {
  return create(createOptions()).get('v1/gamedata/attributeInfo', {
    shard: shard
  });
}

export function getArchetypesV1() {
  return create(createOptions()).get('v1/gamedata/archetypes', {
  });
}

export function getRacesV1() {
  return create(createOptions()).get('v1/gamedata/races', {
  });
}

export function getAttributeOffsetsV1(shard: number) {
  return create(createOptions()).get('v1/gamedata/attributeOffsets', {
    shard: shard
  });
}

export function getOrderPermissionsV1() {
  return create(createOptions()).get('v1/gamedata/orderPermissions', {
  });
}

