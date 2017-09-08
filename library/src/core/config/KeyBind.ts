/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import keyboardModifier from './keyboardModifier';
import dxKeyCodes from './dxKeyCodes';

class KeyBind {
  public primaryKeyCode: number;
  public primaryModifiers: keyboardModifier;
  public secondaryKeyCode: number;
  public secondaryModifiers: keyboardModifier;
  public default: number;
  public defaultModifiers: keyboardModifier;


  public primaryToString = (): string => {
    let s = '';
    if (this.primaryModifiers & keyboardModifier.CTRL) s += 'CTRL + ';
    if (this.primaryModifiers & keyboardModifier.ALT) s += 'ALT + ';
    if (this.primaryModifiers & keyboardModifier.SHIFT) s += 'SHIFT + ';
    return s + dxKeyCodes[this.primaryKeyCode];
  }

  public secondaryToString = (): string => {
    let s = '';
    if (this.secondaryModifiers & keyboardModifier.CTRL) s += 'CTRL + ';
    if (this.secondaryModifiers & keyboardModifier.ALT) s += 'ALT + ';
    if (this.secondaryModifiers & keyboardModifier.SHIFT) s += 'SHIFT + ';
    return s + dxKeyCodes[this.secondaryKeyCode];
  }
}

export default KeyBind;
