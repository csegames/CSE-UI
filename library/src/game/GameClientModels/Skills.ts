/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { initUpdatable, Updatable, executeUpdateCallbacks } from './_Updatable';

declare global {
  interface SkillStateModel {
    id: number;
    type: SkillButtonType;
    track: SkillTrack;
    keybind: number;
    boundKeyName: string;
    status: SkillButtonState;
    error?: SkillButtonErrorFlag;
    timing?: Timing;
    disruption?: Timing;
  }

  type SkillState = SkillStateModel & Updatable;
  type ImmutableSkillState = DeepImmutableObject<SkillState>;
}

export const SkillState_Update = 'skillState.update';

function onReceiveSkillStateUpdate(state: SkillState) {

  if (!_devGame.skillStates[state.id]) {
    _devGame.skillStates[state.id] = state as SkillState;
    _devGame.skillStates[state.id].updateEventName = SkillState_Update;
    // init Updatable.
    initUpdatable(state);
  }
  executeUpdateCallbacks(_devGame.skillStates[state.id]);
}

export default function() {
  engine.on(SkillState_Update, onReceiveSkillStateUpdate);
}
