/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { AppDispatch, RootState } from '../redux/store';
import { consolePrint } from './utils';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

export function registerGeneralSlashCommands(registry: SlashCommandRegistry<RootState, AppDispatch>): ListenerHandle[] {
  return [
    registry.add('help', 'show available slash commands', (state: RootState, dispatch: AppDispatch, argv: string[]) => {
      for (const entry of registry.list()) {
        consolePrint(`${entry.command} : ${entry.helpText}`);
      }
    }),

    registry.add('respawn', 'respawn your character', (state: RootState, dispatch: AppDispatch, argv: string[]) => {
      clientAPI.respawn();
    }),

    registry.add(
      'togglecamera',
      'toggles the camera mode',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        // COHERENT TODO should this be something else?
        game.triggerKeyAction(state.keyActions.PlayerCameraFreeToggle);
      }
    )
  ];
}
