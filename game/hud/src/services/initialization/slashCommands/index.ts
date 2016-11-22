/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import clientCommands from './clientCommands';
import generalCommands from './generalCommands';
import uiCommands from './uiCommands';
import emoteCommands from './emoteCommands';
import orderCommands from './orderCommands';

export default () => {
  clientCommands();
  generalCommands();
  uiCommands();
  emoteCommands();
  orderCommands();
}
