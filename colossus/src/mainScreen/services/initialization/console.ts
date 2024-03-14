/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { AnnouncementType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { RootState } from '../../redux/store';
import { initUISlashCommands } from './uiCommands';

export function initializeConsole(registry: SlashCommandRegistry<RootState>): ListenerHandle[] {
  // hook up for console messages to system messages
  game.onConsoleText((text: string) => {
    mockEvents.triggerAnnouncement(AnnouncementType.Text, text, '', '', 0);
  });

  return initUISlashCommands(registry);
}
