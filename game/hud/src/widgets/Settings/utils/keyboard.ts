/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { vkKeyCodes } from '@csegames/camelot-unchained';

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

export interface Bind {
  code: number;
  label: string;
}
export interface KeyBinds {
  [key: string]: Bind[];
}

// Maps clients keybinds list to a keyconfig structure
export function keyBinds2KeyConfig(keybinds: any) {
  const binds: KeyBinds = {};
  Object.keys(keybinds).forEach((key) => {
    const suffix = (key.substr(-1) as any) | 0;
    const keyCode = (keybinds[key] as any) | 0;
    const keyLabel = getKeyLabel(keyCode);
    const name = key.substr(0, key.length - 2);
    const bind = binds[name] = binds[name] || [];
    bind[suffix - 1] = { code: keyCode, label: keyLabel };
  });
  return binds;
}
