/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { client, registerSlashCommand } from '@csegames/camelot-unchained';

export default () => {
  /**
   * Reload the UI or a single UI Module
   */
  registerSlashCommand('reloadui', 'reload the ui, or a single module if a name is provided', (params: string = '') => {
    client.ReleaseInputOwnership();
    if (params.length > 0) {
      client.ReloadUI(params);
    } else {
      client.ReloadAllUI();
    }
  });

  /**
   * Open a UI Module
   */
  registerSlashCommand('openui', 'open a ui module', (params: string) => {
    if (params.length > 0) client.OpenUI(params);
  });

  /**
   * Close a UI Module
   */
  registerSlashCommand('closeui', 'close a ui module', (params: string) => {
    if (params.length > 0) {
      client.ReleaseInputOwnership();
      client.CloseUI(params);
    }
  });

  /**
   * Show a hidden UI module
   */
  registerSlashCommand('showui', 'show a hidden ui module', (params: string) => {
    if (params.length > 0) client.ShowUI(params);
  });

  /**
   * Hide a UI module
   */
  registerSlashCommand('hideui', 'hide a ui module', (params: string) => {
    if (params.length > 0) client.HideUI(params);
  });
};
