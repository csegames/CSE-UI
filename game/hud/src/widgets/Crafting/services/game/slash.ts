/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 21:57:23
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 22:38:43
 */

import { client, hasClientAPI } from 'camelot-unchained';

const VoxType = {
  'World.VoxJobPurify': 'purify',
  'World.VoxJobRefine': 'refine',
  'World.VoxJobGrind': 'grind',
  'World.VoxJobShape': 'shape',
  'World.VoxJobBlock': 'block',
  'World.VoxJobMake': 'make',
};

export function slash(command: string, callback?: (response: any) => void) {
  if (hasClientAPI()) {
    console.log('CRAFTING: command: ' + command);

    // If the / command includes a callback, then send the response
    // back to the caller
    if (callback) listen(callback);

    client.SendSlashCommand(command);
  } else {
    console.log('CRAFTING: would have sent ' + command + ' to server');
    if (callback) callback({ type: 'complete', complete: 'Simulated completion' });
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
      console.log('CRAFTING: OCT: ' + text);
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

          if (text.match(/^ERROR:/)
              || text.match(/^No vox /)
              || text.match(/^Tried /)
              || text.match(/^Nearby vox is not yours/)
              || text.match(/^Ingredient id not found/)
              || text.match(/^Only one/)
              || text.match(/^New Substance quality must /)
              || text.match(/^A higher amount of /)
              || text.match(/^Recipe .* requires /)
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

          if (text.match(/^\*\*READY TO RUN\*\*/)) {
            response.status.ready = true;
          }

          if (text.match(/^Found vox with /)) {
            console.log('VOX STATUS');
            response.status = {
              vox: what.split(' ')[5],
            };
            if (lines[1] === 'No current Job') {
              response.status = Object.assign(response.status, {
                type: null,
                status: lines[1],
                recipe: null,
                template: null,
                ingredients: [],
              });
            } else {
              console.log('JOB DETAILS ' + JSON.stringify(lines));
              response.status = Object.assign(response.status, {
                type: VoxType[lines[1].split(' ')[1]],
                status: lines[2].split(' ')[1].toLowerCase(),
                recipe: { id: lines[3].split(' ')[1], name: '' },
                template: null,
                ingredients: [],
              });
              console.log('VOX STATUS PARSE INGREDS');
              for (let i = 5; i < lines.length - 1; i++) {
                if (lines[i] === 'Output:') {
                  response.status.output = lines[i + 1];
                  break;
                }
                const ingredient = lines[i].split(/\.[ ]*/);
                if (ingredient.length > 1) {
                  let material = ingredient[1].split(/ -/)[0];
                  const x = material.lastIndexOf('x');
                  let qty = 1;
                  if (x > -1 && material.substr(x + 1).match(/[0-9]+/)) {
                    qty = parseInt(material.substr(x + 1),10);
                    material = material.substr(0,x);
                  }
                  response.status.ingredients.push({ id: ingredient[0], name: ingredient[1], qty: 1 });
                }
              }
            }
            console.log('VOX STATUS IS ' + JSON.stringify(response));
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
