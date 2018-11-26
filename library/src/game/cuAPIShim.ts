/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

function cuAPIShim() {
  return {
    initialized: true,

    /* Client Options */
    muteVolume: false,
    mainVolume: 1,

    /* Shared */

    patchResourceChannel: 4,
    loginToken: 'developer',
    accessToken: 'developer',
    ACCESS_TOKEN_PREFIX: 'Bearer',
    pktHash: '0000',
    webAPIHost: 'hatcheryd.camelotunchained.com',
    apiHost: 'https://api.camelotunchained.com',
    serverURL: '',
    serverTime: 1,
    vsync: 1,
    playerState: {
      id: 'TestPlayer',
      name: 'CSEaj',
      type: 'player',
      isAlive: true,
      race: 2,
      faction: 1,
      class: 9,
      gender: 1,
      health: [
        { current: 500, max: 500, wounds: 0 },
        { current: 500, max: 500, wounds: 0 },
        { current: 500, max: 500, wounds: 0 },
        { current: 500, max: 500, wounds: 0 },
        { current: 500, max: 500, wounds: 0 },
        { current: 500, max: 500, wounds: 0 },
      ],
      stamina: { current: 500, max: 1000 },
      blood: { current: 500, max: 1000 },
    },

    placedBlockCount: 0,
    blockTypes: 0,

    /* Stats */

    fps: 0,
    frameTime: 0,
    netstats_udpPackets: 0,
    netstats_udpBytes: 0,
    netstats_tcpMessages: 0,
    netstats_tcpBytes: 0,
    netstats_players_updateBits: 0,
    netstats_players_updateCount: 0,
    netstats_players_newCount: 0,
    netstats_players_newBits: 0,
    netstats_lag: 0,
    netstats_delay: 0,
    netstats_selfUpdatesPerSec: 0,
    netstats_syncsPerSec: 0,
    particlesRenderedCount: 0,
    characters: 0,
    terrain: 0,
    perfHUD: '',

    /* Physics Debugging */

    locationX: 0,
    locationY: 0,
    locationZ: 0,
    serverLocationX: 0,
    serverLocationY: 0,
    serverLocationZ: 0,
    facing: 0,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    speed: 0,
    horizontalSpeed: 0,
    velFacing: 0,
    downCollisionAngle: 0,
    terrainCollisionAngle: 0,
    apiVersion: 1,
    debug: false,
    signalRHost: 'https://api.camelotunchained.com/signalr',

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
