/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ConfigVar from './ConfigVar';
import configCategory from './configCategory';
import KeyBind from './KeyBind';

class KeyBindConfigVar extends ConfigVar {
  public _value: KeyBind;

  public get value(): KeyBind {
    return this._value;
  }

  public set value(v: KeyBind) {
    this._value = v;
  }

  constructor(config: KeyBindConfigVar = <KeyBindConfigVar> {}) {
    super(<ConfigVar> config);
  }

  public create() {
    const c = new KeyBindConfigVar();
    return c;
  }
}

export default KeyBindConfigVar;
