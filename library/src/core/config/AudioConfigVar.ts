/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ConfigVar from './ConfigVar';
import configCategory from './configCategory';
import { AudioSetting } from './AudioSetting';

class AudioConfigVar extends ConfigVar {
  public _value: AudioSetting;

  public get value(): AudioSetting {
    return this._value;
  }

  public set value(v: AudioSetting) {
    this._value = v;
  }

  constructor(config: AudioConfigVar = <AudioConfigVar> {}) {
    super(<ConfigVar> config);
  }

  public create() {
    const c = new AudioConfigVar();
    return c;
  }
}

export default AudioConfigVar;
