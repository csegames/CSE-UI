/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { registerSlashCommand } from '@csegames/library/lib/_baseGame';
import { parseArgs } from './utils';
import { webAPI } from '@csegames/library/lib/hordetest';

export default () => {
  /**
   * calls to an endpoint on the api server
   */
  registerSlashCommand('api', 'call to an endpoint on the api server', 
    (params: string = '') => {
      if (params.length === 0) return;

      const argv = parseArgs(params);
      
      if (argv._.length > 1) {
        const controller = argv._[0];
        const endpoint = argv._[1];
        if (controller === 'matchmaking' && endpoint === 'forcestart')
        {
          if (argv._.length > 2)
          {
            const gameMode = argv._[2];
            const request = {
              mode: gameMode,
            };
            return webAPI.MatchmakingAPI.ForceStartMatch(webAPI.defaultConfig, request as any);
          }
        }
        return;
      }
    });
};
