/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';
import engineInit from './_Init';

export interface OfflineZoneSelectStateModel {
  zones: ArrayMap<{
    name: string;
    id: number;
  }>;
  visible: Boolean;

  selectZone: (id: number) => void;
}

declare global {
  type OfflineZoneSelectState = OfflineZoneSelectStateModel & Updatable;
  type ImmutableOfflineZoneSelectState = DeepImmutableObject<OfflineZoneSelectState>;
}

export const OfflineZoneSelectState_Update = 'offlineZoneSelectState.update';

function initDefault(): OfflineZoneSelectState {
  return {
    zones: {},
    visible: false,
    isReady: false,
    selectZone: () => null,
    updateEventName: OfflineZoneSelectState_Update,
    onUpdated: createDefaultOnUpdated(OfflineZoneSelectState_Update),
    onReady: createDefaultOnReady(OfflineZoneSelectState_Update),
  };
}

export default function() {

  engineInit(
    OfflineZoneSelectState_Update,
    initDefault,
    () => game.offlineZoneSelectState,
    (model: OfflineZoneSelectStateModel) => _devGame.offlineZoneSelectState = model as OfflineZoneSelectState);

}
