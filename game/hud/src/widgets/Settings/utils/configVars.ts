/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client, DisplayModeConfig, Bindable, Binding } from '@csegames/camelot-unchained';
import sampleKeybinds from './samples/keybindsConfig';
import input from './samples/inputConfig';
import audio from './samples/audioConfig';
import graphics from './samples/graphicsConfig';
import resolutions from './samples/resolutionsConfig';
import { sendSystemMessage } from 'services/actions/system';
import { updateKeybind, Keybinds, getKeybinds, NameMap, getButtonNameFromId, setButtonMap, clearKeybinds } from './keyboard';

function isNotClient() {
  return !!(window['cuOverrides']);
}

interface Task {
  type: ConfigIndex;
  onconfig: (configs: any, type: ConfigIndex) => void;
}
const configQueue: Task[] = [];
let currentTask: Task;

export const SELECT_RESOLUTION_ID = 'Select Resolution';
export const FULL_SCREEN_WIDTH_ID = 'Full Screen Resolution Width';
export const FULL_SCREEN_HEIGHT_ID = 'Full Screen  Resolution Height';    // client is broken, has 2 spaces
export const FULL_SCREEN_TOGGLE_ID = 'Full screen';

export enum ConfigIndex {
  KEYBIND_DEPRECATED = 2,
  RENDERING = 3,
  INPUT = 6,
  AUDIO = 8,
  KEYBIND = 97,
  KEYBIND_CHANGED = 98,
  RESOLUTIONS = 99,
}

function processQueue() {
  if (client.debug) console.log(`currentTask ${JSON.stringify(currentTask)} queue ${JSON.stringify(configQueue)}`);
  const config = currentTask = configQueue.shift();
  if (config) {
    if (config.onconfig) {
      if (isNotClient()) {
        switch (config.type) {
          case ConfigIndex.AUDIO:
            if (client.debug) console.warn('emulating audio settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(audio)), 1);
            break;
          case ConfigIndex.KEYBIND_DEPRECATED:   // deprecated, will be removed and we are just ignoring it
            // NO-OP
            break;
          case ConfigIndex.KEYBIND:
            if (client.debug) console.warn('emulating keybind settings');
            setTimeout(() => onRequestAllKeybinds(sampleKeybinds.bindables, sampleKeybinds.bindings), 100);
            break;
          case ConfigIndex.INPUT:
            if (client.debug) console.warn('emulating input settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(input)), 1);
            break;
          case ConfigIndex.RENDERING:
            if (client.debug) console.warn('emulating graphics settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(graphics)), 2);
            break;
          case ConfigIndex.RESOLUTIONS:
            if (client.debug) console.warn('emulating resolution settings');
            setTimeout(() => onReceiveConfigVars(JSON.stringify(resolutions)), 2);
        }
      } else {
        switch (config.type) {
          case ConfigIndex.RESOLUTIONS:
            if (client.debug) console.log(`type ${config.type} request display modes`);
            client.RequestDisplayModes();
            break;
          case ConfigIndex.KEYBIND_DEPRECATED:
            // NO-OP
            break;
          case ConfigIndex.KEYBIND:
            // New Keybind API.
            if (client.debug) console.log(`type ${config.type} request all key binds`);
            client.RequestAllKeybinds();
            break;
          case ConfigIndex.KEYBIND_CHANGED:
            // NO-OP, this is requested just prior to a call to StartRecordingKeybind
            break;
          default:
            if (client.debug) console.log(`type ${config.type} config vars`);
            client.GetConfigVars(config.type as any);
            break;
        }
      }
    } else {
      if (client.debug) console.log('current config task is disabled, process queue');
      // for these config types we would have requested data, which would have
      // triggered a handler which would processQueue() but as we are not going
      // to ask for the data, the handler won't fire, so processQueue wont be
      // called, so we need to do it here.
      processQueue();
    }
  }
}

function addQueue(task: Task) {
  configQueue.push(task);
  if (!currentTask) processQueue();
}

function onconfig(match: ConfigIndex[], data: any) {
  const config = currentTask;
  if (config && config.onconfig) {
    if (match.indexOf(config.type) !== -1) {
      config.onconfig(data, config.type);
    }
  }
  processQueue();
}

// handle receiving config
function onReceiveConfigVars(configs: string) {
  if (configs) {
    const filter = [ConfigIndex.AUDIO, ConfigIndex.INPUT, ConfigIndex.RENDERING];
    // Note, KEYBIND_DEPRECATED we just ignore
    onconfig(filter, JSON.parse(configs));
  } else {
    console.error('received empty config vars');
  }
}
client.OnReceiveConfigVars(onReceiveConfigVars);

// handle receiving display modes
function onReceiveDisplayModes(displayModes: DisplayModeConfig[]) {
  onconfig([ConfigIndex.RESOLUTIONS], displayModes);
}
client.OnDisplayModesChanged(onReceiveDisplayModes);

/* New Keybind API */
function onKeyBindRecorded(keybind: Binding) {
  // tell listeners that we have updated keybinds
  onconfig([ConfigIndex.KEYBIND_CHANGED], keybind);
}
client.OnKeybindRecorded(onKeyBindRecorded);

function onRequestAllKeybinds(bindables: Bindable[], bindings: Binding[]) {
  // Build a button map id => name
  const map: NameMap = {};
  bindables.forEach((bindable: Bindable) => map[bindable.id] = bindable.name || '');
  setButtonMap(map);

  // Clear keybind map.  We need to do this because request all keybinds only
  // sends bound keys, it does not send unbound keys, so by clearing we ensure
  // now unbound keys are shown as unbound.
  clearKeybinds();

  // Build a keybind map from existing bindings
  bindings.forEach((binding: Binding) => {
    const name = getButtonNameFromId(binding.id);
    updateKeybind(name, {
      id: binding.id,
      alias: binding.alias,
      boundKeyName: binding.boundKeyName,
      boundKeyValue: binding.boundKeyValue,
    });
  });

  // Include unbound keys in the keybind map
  const keybinds: Keybinds = getKeybinds();
  bindables.forEach((bindable: Bindable) => {
    const name = getButtonNameFromId(bindable.id);
    if (name && !keybinds[name]) {
      updateKeybind(name, {
        id: bindable.id,
        alias: 0,
        boundKeyName: '',
        boundKeyValue: 0,
      });
    }
  });

  // tell listeners that we have updated keybinds
  onconfig([ConfigIndex.KEYBIND], keybinds);
}
client.OnAllKeybindsRequested(onRequestAllKeybinds);

export function getKeyBinds(onconfig: (configs: any, type: ConfigIndex) => void) {
  if (client.debug) console.log('get keybinds');
  addQueue({ type: ConfigIndex.KEYBIND, onconfig });
}

export function recordKeybind(button: number, alias: number, onconfig: (keybind: Binding, type: ConfigIndex) => void) {
  addQueue({ type: ConfigIndex.KEYBIND_CHANGED, onconfig });
  client.StartRecordingKeybind(button, alias);
  if (client.debug) console.log('did start recording keybind (game client is listening)');
}

export function stopRecordingKeybind() {
  client.CancelRecordingKeybind();
  if (client.debug) console.log('did stop recording keybind (not listening now)');
  cancel(ConfigIndex.KEYBIND_CHANGED);
}

export function restoreDefaultKeybinds() {
  if (client.debug) console.log('restore default keybind settings');
  // Note, restoring keybinds using old API triggers a KEYBIND config vars to be sent,
  // so we need to add a handler to catch and ignore them else it buggers up our queue
  // system.
  addQueue({ type: ConfigIndex.KEYBIND_DEPRECATED, onconfig: () => 0 });
  client.RestoreConfigDefaults(ConfigIndex.KEYBIND_DEPRECATED as any);
  client.SaveConfigChanges();
}

export function getInputConfig(onconfig: (configs: any, type: ConfigIndex) => void) {
  if (client.debug) console.log('get input settings');
  addQueue({ type: ConfigIndex.INPUT, onconfig });
}

export function getAudioConfig(onconfig: (configs: any, type: ConfigIndex) => void) {
  if (client.debug) console.log('get audio settings');
  addQueue({ type: ConfigIndex.AUDIO, onconfig });
}

export function getGraphicsConfig(onconfig: (configs: any, type: ConfigIndex) => void) {
  if (client.debug) console.log('get graphics settings');
  addQueue({ type: ConfigIndex.RENDERING, onconfig });
}

export function getResolutions(onconfig: (configs: any, type: ConfigIndex) => void) {
  if (client.debug) console.log('get resolutions');
  addQueue({ type: ConfigIndex.RESOLUTIONS, onconfig });
}

export function cancel(config: ConfigIndex) {
  if (client.debug) console.log('cancel loading config type ' + config);
  // clear the callback for the current task if its for this config
  if (currentTask && currentTask.type === config) {
    currentTask.onconfig = null;
  }
  // clear callbacks for any matching queued requests
  for (let i = 0; i < configQueue.length; i++) {
    if (configQueue[i].type === config) {
      configQueue[i].onconfig = null;
    }
  }
  if (currentTask && currentTask.type === ConfigIndex.KEYBIND_CHANGED) {
    // For KEYBIND_CHANGED requests, we cancel the request,
    // and remove the job from the queue.
    client.CancelRecordingKeybind();
    processQueue();
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
