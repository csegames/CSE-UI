/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as graphql from '../graphql/schema';
import { RequestConfig, RequestResult } from '../../_baseGame/types/Request';
import { legacyRequest as xhrRequest } from '../../_baseGame/utils/request';

type CurrentMax = graphql.CurrentMax;

interface CurrentMaxValue {
  current: number;
  maximum: number;
}

interface Temperature {
  current: number;
  freezingThreshold: number;
  burndingThreshold: number;
}

export { CurrentMax, CurrentMaxValue, graphql, RequestConfig, RequestResult, Temperature, xhrRequest };
