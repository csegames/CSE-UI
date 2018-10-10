/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { registerSlashCommand, getSlashCommands } from '@csegames/camelot-unchained';
import { systemMessage } from './utils';

export default () => {
  /**
   * Print registered slash command help
   */
  registerSlashCommand('help', 'show available slash commands', () => {
    const commands = getSlashCommands();
    for (let i = 0; i < commands.length; ++i) {
      systemMessage(`${commands[i].command} : ${commands[i].helpText}`);
    }
  });

  /**
   * Unstuck! (kills you and respawns for now)
   */
  registerSlashCommand('stuck', 'get your character unstuck', () => game.selfPlayerState.stuck());

  /**
   * Change your zone -- Only works on Hatchery / Debug & Internal builds
   */
  registerSlashCommand('zone', 'change your zone', (params: string) => game.selfPlayerState.changeZone(
    parseInt(params, 10),
  ));

  /**
   * Change camera mode
   */
  registerSlashCommand('togglecamera', 'toggles the camera mode', () => game.triggerKeyAction(
    game.keyActions.PlayerCameraFreeToggle, // COHERENT TODO should this be something else?
  ));

  /**
   * Get your characters current x, y, z coordinates -- ONLY DURING DEVELOPMENT
   */
  registerSlashCommand('loc', 'tells you your current location', () => {
    setTimeout(() => systemMessage(
      `${game.selfPlayerState.position.x},${game.selfPlayerState.position.y},${game.selfPlayerState.position.z}`,
    ), 100);
  });
};
