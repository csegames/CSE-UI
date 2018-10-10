/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { registerSlashCommand } from '@csegames/camelot-unchained';

export default () => {
  /**
   * Reload the UI or a single UI Module
   */
  registerSlashCommand('reloadui', 'reload the ui, or a single module if a name is provided', () => {
    game.reloadUI();
  });
};
