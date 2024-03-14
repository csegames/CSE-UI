/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { primary as graphql } from './graphql'; // webapi doesn't export some of the necessary types (?)
import { RequestConfig, RequestResult, legacyRequest as xhrRequest } from './request';

type ClassDefRef = graphql.ClassDefRef;
type PerkDefRef = graphql.PerkDefRef;
type PurchaseDefRef = graphql.PurchaseDefRef;
type RaceDefRef = graphql.RaceDefRef;
type QuestDefRef = graphql.QuestDefRef;

interface CurrentMax {
  current: any | null;
  max: any | null;
}

interface CurrentMaxValue {
  current: number;
  maximum: number;
}

interface Temperature {
  current: number;
  freezingThreshold: number;
  burndingThreshold: number;
}

export {
  CurrentMax,
  CurrentMaxValue,
  ClassDefRef,
  PerkDefRef,
  PurchaseDefRef,
  RaceDefRef,
  RequestConfig,
  RequestResult,
  Temperature,
  QuestDefRef,
  xhrRequest
};
