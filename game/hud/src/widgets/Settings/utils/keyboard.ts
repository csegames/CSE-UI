/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client, vkKeyCodes, Binding } from '@csegames/camelot-unchained';

// Returns a clean keyname from keycode table
export function getKeyLabel(keyCode: number) {
  let label = vkKeyCodes[keyCode];
  if (label) {
    label = label.substr(3);
  } else if (keyCode) {
    label = `VK_{${keyCode}}`;
  }
  return label;
}

export interface BoundKey {
  name: string;
  value: number;
}

export interface Bind {
  button: number;
  boundKeys: BoundKey[];
}

export interface Keybinds {
  [key: string]: Bind;
}

export const UNBOUND_KEY: BoundKey = { name: '', value: 0 };

export interface NameMap {
  [id: number]: string;
}
let buttonNameMap: NameMap = {};

export function setButtonMap(map: NameMap) {
  buttonNameMap = map;
}

export function getButtonNameFromId(id: number) {
  return keyBindName(buttonNameMap[id]);
}

let keybinds: Keybinds = {};

export function getKeybinds() {
  return keybinds;
}

export function keyBindName(buttonName: string) {
  const match = buttonName.match(/Key([^_]*)/);
  return match ? match[1] : buttonName;
}

export function clearKeybinds() {
  keybinds = {};
}

export function updateKeybind(name: string, keybind: Binding) {
  const { id, alias, boundKeyName, boundKeyValue } = keybind;
  const bind = keybinds[name] || (keybinds[name] = { button: id, boundKeys: <BoundKey[]> [] });
  const boundKeys = bind.boundKeys;
  boundKeys[alias] = { name: boundKeyName, value: boundKeyValue };
  while (boundKeys.length < 3) {
    boundKeys.push(UNBOUND_KEY);       // add unbound keys
  }
}

const PERSISTED_KEYBINDS_KEY = 'cse-settings-keybinds-v3';
const PERSISTED_CHAR_KEYBIND_KEY = 'cse-settings-char-keybind';

interface PersistedBinds {
  [key: number]: number[];
}

function keyName(name: string) {
  return `${PERSISTED_KEYBINDS_KEY}-${name || 'default'}`;
}

function characterKeyName() {
  return `${PERSISTED_CHAR_KEYBIND_KEY}-${client.characterID}`;
}

export function linkCharacterToKeybinds(name?: string) {
  if (name) {
    if (client.debug) console.log('link char to keybind ' + name);
    localStorage.setItem(characterKeyName(), name);
  } else {
    if (client.debug) console.log('unlink char from keybind ' + name);
    localStorage.removeItem(characterKeyName());
  }
}

export function persistKeybinds(keybinds: Keybinds, name?: string) {
  const saved: PersistedBinds = {};
  for (const key in keybinds) {
    const binds = keybinds[key].boundKeys;
    const save: number[] = saved[keybinds[key].button] = [];
    for (let i = 0; i < binds.length; i++) {
      save.push(binds[i].value);
    }
  }
  if (!name) name = localStorage.getItem(characterKeyName());
  localStorage.setItem(keyName(name), JSON.stringify(saved));
  linkCharacterToKeybinds(name);
}

export function restoreKeybinds(name?: string, ondone?: () => void) {
  if (!name) name = localStorage.getItem(characterKeyName());
  if (client.debug) console.log(`restore keybinds ${name}`);
  const keybinds: PersistedBinds = JSON.parse(localStorage.getItem(keyName(name)) || '{}');
  if (keybinds) {
    for (const key in keybinds) {
      const binds: number[] = keybinds[key];
      for (let i = 0; i < binds.length; i++) {
        const button = (key as any) | 0;
        client.SetKeybind(button, i, binds[i]);
      }
    }
    if (ondone) ondone();
  }
}

// Client's CEF doesn'k know String.startsWith
function startsWith(s: string, w: string) {
  const l = w.length;
  return s.length >= l && s.substr(0,l) === w;
}

export function removeKeybinds(name?: string) {
  if (name) {
    if (client.debug) console.log(`remove keybinds ${name}`);
    // Remove the keybind definitions
    localStorage.removeItem(keyName(name));
    // and any character links to them
    for (const key in localStorage) {
      if (startsWith(key, PERSISTED_CHAR_KEYBIND_KEY + '-')) {
        if (localStorage[key] === name) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}

export function getKeybindNames() {
  const names = [];
  for (const key in localStorage) {
    if (startsWith(key, PERSISTED_KEYBINDS_KEY + '-')) {
      names.push(key.substr(PERSISTED_CHAR_KEYBIND_KEY.length));
    }
  }
  if (client.debug) console.log(`keybind names ${names.join(', ')}`);
  return names;
}

export function getCharacterKeybindsName() {
  return localStorage.getItem(characterKeyName());
}
