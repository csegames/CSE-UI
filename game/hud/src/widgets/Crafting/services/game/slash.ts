/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function slash(command: string, callback?: (response: any) => void) {
  if (callback) listen(callback);
  game.sendSlashCommand(command);
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
        callbacks[key](Object.assign({}, response));
        response = {};
        delete callbacks[key];
      }
    }
    response = {};
  }, 50);
}

export function listen(cb: any) {
  callbacks[++listening] = cb;
  function cancel() {
    delete callbacks[this.id];
  }
  const res = {
    id: listening,
    cancel,
  };
  if (listening > 1) return res;
  game.onConsoleText((text: string) => {
    const lines = text.split(/[\r\n]/g);
    const what = lines[0];
    switch (what) {
      default:
        // ERROR: prefixed errors
        if (text.match(/^ERROR: /)) {
          response.type = 'error';
          const errors = text.substr(7).split('\n');
          response.errors = (response.errors || []).concat(errors);
          return;
        }

        // Errors possibly
        if (text.match(/^Tried /)
          || text.match(/^No nearby /)                    // for /harvest
          || text.match(/^Failed /)
        ) {
          response.type = 'error';
          (response.errors = response.errors || []).push(text);
          return;
        }

        // Signals the end of the / command
        if (text.match(/^Running /)) {
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

export const isClient = () => {
  return true;
};
