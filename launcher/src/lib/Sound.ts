/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { globalEvents } from './EventEmitter';

import Select from '../sounds/UI_Menu_GenericSelect_v1_02.ogg';
import LaunchGame from '../sounds/UI_Patcher_PlayButton.ogg';
import PatchComplete from '../sounds/patch-complete.ogg';
import SelectChange from '../sounds/UI_Menu_CharacterSelect_Change_v1_01.ogg';
import RealmSelect from '../sounds/UI_Menu_SelectRealm_v1_01.ogg';
import ResetTraits from '../sounds/UI_AbilityCrafting_Reset_v1_01.ogg';
import BoonSelect from '../sounds/UI_Menu_BoonSelect_v1_01.ogg';
import BaneSelect from '../sounds/UI_Menu_BaneSelect_v1_01.ogg';
import Ambient from '../sounds/patcher-ambient.ogg';

export const Sound = {
  Ambient: Ambient,
  Select: Select,
  LaunchGame: LaunchGame,
  PatchComplete: PatchComplete,
  SelectChange: SelectChange,
  RealmSelect: RealmSelect,
  ResetTraits: ResetTraits,
  BoonSelect: BoonSelect,
  BaneSelect: BaneSelect
} as const;

export type Sound = (typeof Sound)[keyof typeof Sound];

export function playSound(sound: Sound): void {
  globalEvents.trigger('play-sound', sound.toString());
}
