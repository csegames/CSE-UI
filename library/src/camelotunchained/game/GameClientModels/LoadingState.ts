/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from '../../../_baseGame/GameClientModels/_Updatable';
import engineInit from '../../../_baseGame/GameClientModels/_Init';

export interface LoadingStateModel {
  percent: number;
  message: string;
  visible: boolean;
}

declare global {
  type LoadingState = LoadingStateModel & Updatable;
  type ImmutableLoadingState = DeepImmutableObject<LoadingState>;
}

export const LoadingState_Update = 'loadingState.update';

function initDefault(): LoadingState {
  return {
    percent: 0,
    message: '',
    visible: false,
    isReady: false,
    updateEventName: LoadingState_Update,
    onUpdated: createDefaultOnUpdated(LoadingState_Update),
    onReady: createDefaultOnReady(LoadingState_Update),
  };
}

export default function() {

  engineInit(
    LoadingState_Update,
    initDefault,
    () => camelotunchained.game.loadingState,
    (model: LoadingStateModel) => camelotunchained._devGame.loadingState = model as LoadingState);

}
