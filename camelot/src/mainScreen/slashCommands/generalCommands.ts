/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { RootState } from '../redux/store';
import { consolePrint } from './utils';

export function registerGeneralSlashCommands(registry: SlashCommandRegistry<RootState>): ListenerHandle[] {
  return [
    registry.add('help', 'show available slash commands', (state: RootState, argv: string[]) => {
      for (const entry of registry.list()) {
        consolePrint(`${entry.command} : ${entry.helpText}`);
      }
    }),

    registry.add('respawn', 'respawn your character', (state: RootState, argv: string[]) => {
      state.player.respawn();
    }),

    registry.add('togglecamera', 'toggles the camera mode', (state: RootState, argv: string[]) => {
      // COHERENT TODO should this be something else?
      game.triggerKeyAction(state.keyActions.PlayerCameraFreeToggle);
    })
  ];
}
