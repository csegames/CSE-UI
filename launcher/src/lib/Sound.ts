/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { globalEvents } from './EventEmitter';

// New sounds can be added by inserting new ogg files into the build and then
// updating this enumeration.
export enum Sound {
  Select = 'sounds/UI_Menu_GenericSelect_v1_02.ogg',
  LaunchGame = 'sounds/UI_Patcher_PlayButton.ogg',
  PatchComplete = 'sounds/patch-complete.ogg',
  SelectChange = 'sounds/UI_Menu_CharacterSelect_Change_v1_01.ogg',
  CreateCharacter = 'sounds/UI_Menu_CreateNewCharacter_v1_01.ogg',
  RealmSelect = 'sounds/UI_Menu_SelectRealm_v1_01.ogg',
  ResetTraits = 'sounds/UI_AbilityCrafting_Reset_v1_01.ogg',
  BoonSelect = 'sounds/UI_Menu_BoonSelect_v1_01.ogg',
  BaneSelect = 'sounds/UI_Menu_BaneSelect_v1_01.ogg'
}

export function playSound(sound: Sound): void {
  globalEvents.trigger('play-sound', sound.toString());
}
