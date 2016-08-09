/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, client, hasClientAPI, signalr} from 'camelot-unchained';
import slashCommands from './slashCommands';

export default () => {
  slashCommands();

  signalr.initializeSignalR();

  if (!hasClientAPI()) return;
  // hook up for console messages to system messages
  client.OnConsoleText((text: string) => events.fire('system_message', text));
}
