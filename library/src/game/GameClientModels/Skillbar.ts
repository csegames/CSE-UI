/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createDefaultOnUpdated, createDefaultOnReady, Updatable } from './_Updatable';

import engineInit from './_Init';

declare global {
  interface SkillBarItem {
    id: number;
    keybind: number;
    boundKeyName: string;
  }

  interface SkillBarStateModel {
    skills: SkillBarItem[];
  }

  type SkillBarState = SkillBarStateModel & Updatable;
  type ImmutableSkillBarState = DeepImmutable<SkillBarState>;
}

export const SkillBarState_Update = 'skillBarState.update';

function initDefault(): SkillBarState {
  return {
    skills: [],

    isReady: false,
    updateEventName: SkillBarState_Update,
    onUpdated: createDefaultOnUpdated(SkillBarState_Update),
    onReady: createDefaultOnReady(SkillBarState_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
export default function() {

  engineInit(
    SkillBarState_Update,
    () => _devGame.skillBarState = initDefault(),
    () => game.skillBarState,
    (model: SkillBarState) => {
      _devGame.skillBarState = model;
    });

}
