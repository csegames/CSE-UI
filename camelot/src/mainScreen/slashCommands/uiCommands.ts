/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { AppDispatch, RootState } from '../redux/store';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

export function registerUISlashCommands(registry: SlashCommandRegistry<RootState, AppDispatch>): ListenerHandle[] {
  return [
    registry.add('reloadui', 'reload the ui', (state: RootState, dispatch: AppDispatch, argv: string[]) => {
      clientAPI.reloadUI();
    }),

    registry.add('debugui', 'Toggle UI debug logging', (state: RootState, dispatch: AppDispatch, argv: string[]) => {
      game.setDebug(!game.debug);
    })
  ];
}
