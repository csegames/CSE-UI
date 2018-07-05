/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from '@csegames/camelot-unchained';
import keybinds from './samples/keybindsConfig';
import input from './samples/inputConfig';
import audio from './samples/audioConfig';
import graphics from './samples/graphicsConfig';
import { sendSystemMessage } from 'services/actions/system';

function isNotClient() {
  return !!(window['cuOverrides']);
}

interface Task {
  type: ConfigIndex;
  onconfig: (configs: string, type: ConfigIndex) => void;
}
const configQueue: Task[] = [];
let currentTask: Task;

export const SELECT_RESOLUTION_ID = 'Select Resolution';
export const FULL_SCREEN_WIDTH_ID = 'Full Screen Resolution Width';
export const FULL_SCREEN_HEIGHT_ID = 'Full Screen Resolution Height';
export const FULL_SCREEN_TOGGLE_ID = 'Full screen';

export enum ConfigIndex {
  KEYBIND = 2,
  RENDERING = 3,
  INPUT = 6,
  AUDIO = 8,
}

function processQueue() {
  const config = currentTask = configQueue.shift();
  if (config) {
    if (config.onconfig) {
      if (isNotClient()) {
        switch (config.type) {
          case ConfigIndex.AUDIO:
            if (client.debug) console.warn('emulating audio settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(audio)), 1);
            break;
          case ConfigIndex.KEYBIND:
            if (client.debug) console.warn('emulating keybind settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(keybinds)), 100);
            break;
          case ConfigIndex.INPUT:
            if (client.debug) console.warn('emulating input settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(input)), 1);
            break;
          case ConfigIndex.RENDERING:
            if (client.debug) console.warn('emulating graphics settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(graphics)), 2);
            break;
        }
      } else {
        client.GetConfigVars(config.type as any);
      }
    } else {
      processQueue();
    }
  }
}

function addQueue(task: Task) {
  configQueue.push(task);
  if (!currentTask) processQueue();
}

function onReceiveConfigVars(configs: string) {
  const config = currentTask;
  if (config) {
    switch (config.type) {
      case ConfigIndex.AUDIO:
      case ConfigIndex.KEYBIND:
      case ConfigIndex.INPUT:
      case ConfigIndex.RENDERING:
        if (config.onconfig) {
          config.onconfig(JSON.parse(configs), config.type);
        }
        break;
    }
  }
  processQueue();
}

client.OnReceiveConfigVars(onReceiveConfigVars);

export function getKeyBinds(onconfig: (configs: string, type: ConfigIndex) => void) {
  if (client.debug) console.log('get keybind settings');
  addQueue({ type: ConfigIndex.KEYBIND, onconfig });
}

export function getInputConfig(onconfig: (configs: string, type: ConfigIndex) => void) {
  if (client.debug) console.log('get input settings');
  addQueue({ type: ConfigIndex.INPUT, onconfig });
}

export function getAudioConfig(onconfig: (configs: string, type: ConfigIndex) => void) {
  if (client.debug) console.log('get audio settings');
  addQueue({ type: ConfigIndex.AUDIO, onconfig });
}

export function getGraphicsConfig(onconfig: (configs: string, type: ConfigIndex) => void) {
  if (client.debug) console.log('get graphics settings');
  addQueue({ type: ConfigIndex.RENDERING, onconfig });
}

export function cancel(config: ConfigIndex) {
  if (client.debug) console.log('cancel loading config type ' + config);
  // we can't cancel a config request, so we just clear its callback
  // which will be removed from the queue eventually
  if (currentTask && currentTask.type === config) {
    currentTask.onconfig = null;
  }
  for (let i = 0; i < configQueue.length; i++) {
    if (configQueue[i].type === config) {
      configQueue[i].onconfig = null;
    }
  }
}

window['cu'].configVarAlertMessage = null;
export function sendConfigVarChangeMessage(id: string, value: string | number) {
  if (window['cu'].configVarAlertMessage) {
    clearTimeout(window['cu'].configVarAlertMessage);
    window['cu'].configVarAlertMessage = null;
  }

  window['cu'].configVarAlertMessage = window.setTimeout(() => sendSystemMessage(`${id} has been changed to ${value}`), 200);
}
