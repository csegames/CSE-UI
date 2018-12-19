/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

function cuAPIShim() {
  return {
    initialized: true,

    SendSlashCommand: (command: string): void => {
      game.sendSlashCommand(command);
    },

    Stuck: (): void => {
      game.sendSlashCommand('/stuck');
    },

    Respawn: (id: string): void => {
      game.selfPlayerState.respawn(id + '');
    },

    ReloadUI: (name: string): void => {
      game.reloadUI();
    },

    ReloadAllUI: (): void => {
      game.reloadUI();
    },

    OnServerConnected: (c: (isConnected: boolean) => void): number => {
      c(false);
      return -1;
    },

    OnInitialized: (c: () => void): number => {
      c();
      return -1;
    },
  };
}

export default function() {
  (window as any).cuAPI = new Proxy(cuAPIShim(), {
    get: (obj, key) => {

      if (key === 'characterID') {
        return game.selfPlayerState.characterID;
      }

      if (key === 'shardID') {
        return game.shardID;
      }

      if (key in game) {
        return game[key];
      }

      if (key in obj) {
        return obj[key];
      }

      return function() {
        const args = Array.prototype.slice.call(arguments);
        console.warn(
          `A method was called on cuAPI shim that has not been implemented | ${String(key)} : ${args.join(', ')}`);
        return -1;
      };
    },
  });
}
