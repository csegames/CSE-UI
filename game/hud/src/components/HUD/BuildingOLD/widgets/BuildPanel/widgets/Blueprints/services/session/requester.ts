/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { building } from '../../../../../../lib/old-library';

class BlueprintRequests {

  public requestBlueprints() {
    setTimeout(() => building.requestBlueprints(), 1000);
  }

  public loadIcon(blueprint: Blueprint) {
    building.requestBlueprintIcon(blueprint);
  }

  public select(blueprint: Blueprint) {
    building.requestBlueprintSelect(blueprint);
  }

  public save(name: string) {
    building.requestBlueprintSave(name);
  }

  public remove(blueprint: Blueprint) {
    building.requestBlueprintDelete(blueprint);
  }

  public copy() {
    building.requestBlueprintCopy();
  }

  public paste() {
    building.requestBlueprintPaste();
  }
}


export default new BlueprintRequests();
