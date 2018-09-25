/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import configCategory from './configCategory';

class ConfigVar {
  public id: number;
  public category: configCategory;
  public description: string;
  public value: any;

  constructor(config: ConfigVar = <ConfigVar> {}) {
    this.id = config.id || -1;
    this.category = config.category || <configCategory> 0;
    this.description = config.description || 'empty';
    this.value = config.value || null;
  }

  public create() {
    const c = new ConfigVar();
    return c;
  }
}

export default ConfigVar;
