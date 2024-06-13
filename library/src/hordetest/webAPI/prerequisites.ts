/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestConfig, RequestResult } from '../../_baseGame/types/Request';
import { legacyRequest as xhrRequest } from '../../_baseGame/utils/request';

type ClassDefRef = string;
type PerkDefRef = string;
type PurchaseDefRef = string;
type QuestDefRef = string;

export {
  ClassDefRef,
  PerkDefRef,
  PurchaseDefRef,
  RequestConfig,
  RequestResult,
  QuestDefRef,
  xhrRequest
};
