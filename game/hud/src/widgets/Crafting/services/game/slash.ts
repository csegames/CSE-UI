/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 21:57:23
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 07:01:16
 */

import { client, hasClientAPI } from 'camelot-unchained';

export function slash(command: string, callback?: (response: any) => void) {
  if (hasClientAPI()) {
    console.log('CRAFTING: command: ' + command);

    // If the / command includes a callback, then send the response
    // back to the caller
    if (callback) listen(callback);

    client.SendSlashCommand(command);
  } else {
    console.log('CRAFTING: would have sent ' + command + ' to server');
  }
}

let listening = 0;
const callbacks = {};
let response: any = {};

// send response back to listeners
function delaySend() {
  if (response.timer) clearTimeout(response.timer);
  response.timer = setTimeout(() => {
    // Assume end of this
    delete response.timer;
    for (const key in callbacks) {
      if (callbacks[key]) {
        console.log('CRAFTING: LISTENER: SEND: ' + JSON.stringify(response));
        callbacks[key](response);
        delete callbacks[key];
      }
    }
    response = {};
  }, 50);
}

export function listen(cb: any) {
  if (hasClientAPI()) {
    callbacks[++listening] = cb;
    function cancel() {
      console.log('CRAFTING: LISTENER: CENCEL: ' + this.id);
      delete callbacks[this.id];
    }
    const res = {
      id: listening,
      cancel,
    };
    if (listening > 1) return res;
    client.OnConsoleText((text: string) => {
      const lines = text.split(/[\r\n]/g);
      const what = lines[0];
      let type;
      let list;
      // console.log('CRAFTING: OCT: ' + text);
      switch (what) {
        case 'Purify Recipies:':
        case 'Refine Recipies:':
        case 'Grind Recipies:':
        case 'Shape Recipies:':
        case 'Blocks Recipies:':
          lines.shift();
          list = [];
          for (let i = 0; i < lines.length; i++) {
            const args = lines[i].split(' - ');
            if (args.length === 2) {
              list.push({ id: args[0], name: args[1] });
            } else {
              // probably an error message
              console.warn(args[0]);
            }
          }
          type = what.split(' ')[0].toLowerCase();
          response.type = type;
          response.list = list;
          break;
        case 'Items:':
          lines.shift();
          list = [];
          for (let i = 0; i < lines.length; i++) {
            const args = lines[i].split('. ');
            if (args.length === 2) {
              list.push({ id: args[0], name: args[1] });
            } else {
              // probably an error message
              console.warn(args[0]);
            }
          }
          response.type = 'ingredients';
          response.list = list;
          break;
        default:
          if (text.match(/^Template: /)) {
            response.type = 'templates';
            (response.templates = response.templates || []).push(text.substr(10));
            delaySend();
            return;
          }

          if (text.match(/^No vox /)
              || text.match(/^Tried /)
              || text.match(/^No ingredients /)
              || text.match(/^Make job /)
              || text.match(/^Quality configuration not supported/)
              || text.match(/^Failed /)
          ) {
            response.type = 'error';
            (response.errors = response.errors || []).push(text);
            console.log('ADD ERROR ' + JSON.stringify(response.errors));
            return;
          }

          if (text.match(/^Running cr /)) {
            response.complete = text;
            delaySend();
            return;
          }
          (response.unknown = response.unknown || []).push(text);
          break;
      }
    });
    return res;
  }
}

export const isClient = () => {
  return hasClientAPI();
};
