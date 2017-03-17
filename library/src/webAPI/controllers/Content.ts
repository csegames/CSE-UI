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

export function messageOfTheDayV1() {
  return create(createOptions()).get('v1/messageoftheday', {
  });
}

export function patcherHeroContentV1() {
  return create(createOptions()).get('v1/patcherherocontent', {
  });
}

export function patcherAlertsV1() {
  return create(createOptions()).get('v1/patcheralerts', {
  });
}

