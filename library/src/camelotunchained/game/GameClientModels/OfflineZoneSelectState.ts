/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from '../../../_baseGame/GameClientModels/Updatable';
import { DeepImmutable } from '../../../_baseGame/types/DeepImmutable';
import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { engineInit } from '../../../_baseGame/GameClientModels/_Init';
import { BaseDevGameInterface, BaseGameInterface } from '../../../_baseGame/BaseGameInterface';
import { CamelotUnchainedModel } from '../CamelotUnchainedModel';
export interface OfflineZoneSelectStateModel {
  zones: ArrayMap<{
    name: string;
    id: number;
  }>;
  visible: Boolean;

  selectZone: (id: number) => void;
}

export type OfflineZoneSelectState = OfflineZoneSelectStateModel & Updatable;
export type ImmutableOfflineZoneSelectState = DeepImmutable<OfflineZoneSelectState>;

export const OfflineZoneSelectState_Update = 'offlineZoneSelectState.update';

function initDefault(): OfflineZoneSelectState {
  return {
    zones: {},
    visible: false,
    isReady: false,
    selectZone: () => null,
    updateEventName: OfflineZoneSelectState_Update,
    onUpdated: (game: BaseGameInterface) => createDefaultOnUpdated(game, OfflineZoneSelectState_Update),
    onReady: (game: BaseGameInterface) => createDefaultOnReady(game, OfflineZoneSelectState_Update)
  };
}

export default function (game: BaseDevGameInterface, camelot: CamelotUnchainedModel) {
  engineInit(
    game,
    OfflineZoneSelectState_Update,
    initDefault,
    () => camelot.game.offlineZoneSelectState,
    (model: OfflineZoneSelectStateModel) => (camelot._devGame.offlineZoneSelectState = model as OfflineZoneSelectState)
  );
}
