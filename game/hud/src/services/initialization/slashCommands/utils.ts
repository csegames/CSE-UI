/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
let yargs = require('yargs-parser');
import {events} from 'camelot-unchained';

export const parseArgs = (args: string): any => yargs(args);
export const systemMessage = (message: string): void => events.fire('system_message', message);
