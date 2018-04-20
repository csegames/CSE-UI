/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { client, registerSlashCommand, emotes } from '@csegames/camelot-unchained';

export default () => {
  /**
   * Play the Dance 1 emote
   */
  registerSlashCommand('dance1', 'Dance!', () => client.Emote(emotes.DANCE1));

  /**
   * Play the Dance 2 emote
   */
  registerSlashCommand('dance2', 'Dance!', () => client.Emote(emotes.DANCE2));

  /**
   * Play the Wave 1 emote
   */
  registerSlashCommand('wave1', 'Wave!', () => client.Emote(emotes.WAVE1));

  /**
   * Play the Wave 2 emote
   */
  registerSlashCommand('wave2', 'Wave!', () => client.Emote(emotes.WAVE2));


  /**
   * Stop your repeating emote
   */
  registerSlashCommand('stop', 'Stop!', () => client.Emote(emotes.STOP));

};
