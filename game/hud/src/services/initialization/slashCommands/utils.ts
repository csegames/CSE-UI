/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yargs from 'yargs-parser';

export const parseArgs = (args: string): any => yargs(args);
export const systemMessage = (message: string | Object): void => {
  if (typeof message === 'string') {
    game.trigger('systemMessage', message);
  } else {
    game.trigger('systemMessage', JSON.stringify(message));
  }
};
