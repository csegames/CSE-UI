/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { RootState } from '../../redux/store';
import { Dispatch } from 'redux';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

export function initUISlashCommands(registry: SlashCommandRegistry<RootState, Dispatch>): ListenerHandle[] {
  return [
    registry.add(
      'reloadui',
      'reload the ui, or a single module if a name is provided',
      (state: RootState, dispatch: Dispatch, argv: string[]) => {
        clientAPI.reloadUI();
      }
    ),

    registry.add('debugui', 'Toggle UI debug logging', (state: RootState, dispatch: Dispatch, argv: string[]) => {
      game.setDebug(!game.debug);
    })
  ];
}
