/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 21:57:23
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 18:19:53
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

function parseVoxStatus(response: any, lines: string[]) {
  console.log('VOX STATUS');
  const vox: any = response.status = {
    type: null,
    status: 'idle',
    recipe: null,
    template: null,
    ingredients: [],
  };
  let line;
  let id;
  console.log('VOX LINES: ' + JSON.stringify(lines));
  while ((line = lines.shift()) || line === '') {
    console.log('VOX STATUS LINE: ' + line);
    if (line.match(/^Found vox with /)) {
      vox.vox = line.split(' ')[5];
    } else if (line === 'No current Job') {
      vox.status = 'idle';
    } else if (line.match(/^Started At: /)) {
      vox.started = line.substr(12);
    } else if (line.match(/^Ends In: /)) {
      vox.endin = line.substr(10);
    } else if (line.match(/^Type: /)) {
      vox.type = VoxType[line.split(' ')[1].split('+')[0]];
    } else if (line.match(/^Status: /)) {
      vox.status = line.split(' ')[1].toLowerCase();
    } else if (line.match(/^Recipe: /)) {
      id = line.split(' ')[1];
      vox.recipe = id ? { id, name: '' } : null;
    } else if (line.match(/^Template: /)) {
      id = line.split(' ')[1];
      vox.template = id ? { id, name: '' } : null;
    } else if (line.match(/^Custom Name: /)) {
      vox.name = line.substr(13);
    } else if (line.match(/^Ingredients:/)) {
      // Consume ingredients
      while ((line = lines.shift()) || line === '') {
        console.log('VOX INGREDIENT LINE: ' + line);
        const ingredient = line.split(/\.[ ]*/);
        if (ingredient.length < 2) {
          lines.unshift(line);
          break;
        }

        let material = ingredient[1].split(/ -/)[0];
        console.log('MATERIAL ' + material);
        const x = material.lastIndexOf('x');
        let qty = 1;
        if (x > -1 && material.substr(x + 1).match(/[0-9]+/)) {
          qty = parseInt(material.substr(x + 1),10);
          material = material.substr(0,x);
        }
        vox.ingredients.push({ id: ingredient[0], name: ingredient[1], qty: 1 });
      }
    } else if (line.match(/^Output:/)) {
      vox.output = lines.shift();
    }
  }
}

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
        case 'Block Recipies:':
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
            const parsed = lines[i].match(/^([0-9]+)\.[ ]+(?:Sub )(.*) x([0-9]+) - ([0-9.]+)kg @ ([0-9]+)%$/);
            if (parsed) {
              if (parsed.length > 2) {
                console.log('INGREDIENT: ' + JSON.stringify(parsed));
                list.push({
                  id: parsed[1], name: parsed[2],
                  stats: { unitCount: (parsed[3] as any) | 0, weight: +(parsed[4]), quality: +(parsed[4]) },
                });
              } else {
                // probably an error message
                console.warn(parsed);
              }
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

          // ERROR: prefixed errors
          if (text.match(/^ERROR: /)) {
            response.type = 'error';
            const errors = text.substr(7).split('\n');
            response.errors = (response.errors || []).concat(errors);
            console.log('ADD ERROR ' + JSON.stringify(response.errors));
            return;
          }

          // Errors which are still not ERROR: prefixed
          if (text.match(/^No vox /)) {
            response.type = 'error';
            (response.errors = response.errors || []).push(text);
            console.log('ADD ERROR ' + JSON.stringify(response.errors));
            return;
          }

          // Errors possibly
          if (text.match(/^Tried /)
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
            (response.errors = response.errors || []).push('STILL USED? ' + text);
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
            parseVoxStatus(response, lines);
            console.log('PARSED VOX STATUS IS ' + JSON.stringify(response));
            return;
          }

          // Partial VOX status
          if (text.match(/^Type: World/)) {
            parseVoxStatus(response, lines);
            console.log('PARSED VOX STATUS IS ' + JSON.stringify(response));
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
