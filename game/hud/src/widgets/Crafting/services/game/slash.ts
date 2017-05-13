/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 21:57:23
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-13 22:53:36
 */

import { client, hasClientAPI } from 'camelot-unchained';

export function slash(command: string, callback?: (response: any) => boolean) {
  if (hasClientAPI()) {
    console.log('CRAFTING: command: ' + command);

    // If the / command includes a callback, then send any responses
    // back to the caller until the return false;
    if (callback) {
      const listener = listen((response: any) => {
        if (callback(response) === false) {
          listener.cancel();
        }
      });
    }

    client.SendSlashCommand(command);
  } else {
    console.log('CRAFTING: would have sent ' + command + ' to server');
  }
}

let listening = 0;
const callbacks = {};

export function listen(cb: any) {
  if (hasClientAPI()) {
    callbacks[++listening] = cb;
    function cancel() {
      console.log('CRAFTING: LISTENER: CENCEL: ' + this.id);
      callbacks[this.id] = null;
    }
    function send(response: any) {
      for (const key in callbacks) {
        if (callbacks[key]) {
          console.log('CRAFTING: LISTENER: CALLBACK: ' + response.type);
          callbacks[key](response);
        }
      }
    }
    const res = {
      id: listening,
      cancel,
    };
    if (listening > 1) return res;
    client.OnConsoleText((text: string) => {
      const lines = text.split(/[\r\n]/g);
      const what = lines[0];
      switch (what) {
        case 'Purify Recipies:':
        case 'Refine Recipies:':
        case 'Grind Recipies:':
        case 'Shape Recipies:':
        case 'Blocks Recipies:':
          lines.shift();
          const list = [];
          for (let i = 0; i < lines.length; i++) {
            const args = lines[i].split(' - ');
            if (args.length === 2) {
              list.push({ id: args[0], name: args[1] });
            } else {
              // probably an error message
              console.warn(args[0]);
            }
          }
          const type = what.split(' ')[0].toLowerCase();
          send({ type, list });
          break;
      default:
        if (text.match(/^No vox /) || text.match(/^Tried /)) {
          send({ type: 'error', text });
          return;
        }
        if (text.match(/^Running cr /)) {
          send({ type: 'complete', text });
          return;
        }
        send({ type: 'unkown', text });
      }
    });
    return res;
  }
}

export const isClient = () => {
  return hasClientAPI();
};
