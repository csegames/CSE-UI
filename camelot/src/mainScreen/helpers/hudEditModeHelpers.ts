/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { AppDispatch } from '../redux/store';
import { hideHUDEditor, showHUDEditor } from '../redux/hudSlice';
import { WIDGET_ID_ABILITY_BOOK } from '../components/abilityBook/AbilityBook';

// Toggles HUD edit mode on/off. Lives here (rather than in a component) so any menu can trigger it
// without creating import cycles between the HUD components.
export function onToggleUIEditMode(
  isEditingHUD: boolean,
  activeConditionalWidgetIDs: string[],
  dispatch: AppDispatch
): void {
  clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
  if (isEditingHUD) {
    dispatch(hideHUDEditor());
    if (!activeConditionalWidgetIDs.includes(WIDGET_ID_ABILITY_BOOK)) {
      clientAPI.requestEditMode(false);
    }
  } else {
    clientAPI.requestEditMode(true);
    dispatch(showHUDEditor());
  }
}
