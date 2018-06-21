/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { building, BuildingBlueprint } from '@csegames/camelot-unchained';
import faker from './requester_fake';

class BlueprintRequests {
  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  public requestBlueprints() {
    if (this.fake) {
      return faker.requestBlueprints();
    }

    // delaying loading blueprints to give the materials a little time to load
    setTimeout(() => building.requestBlueprints(), 1000);
  }

  public loadIcon(blueprint: BuildingBlueprint) {
    if (this.fake) {
      return faker.requestBlueprintIcon(blueprint);
    }

    building.requestBlueprintIcon(blueprint);
  }

  public select(blueprint: BuildingBlueprint) {
    if (this.fake) {
      return faker.requestBlueprintSelect(blueprint);
    }

    building.requestBlueprintSelect(blueprint);
  }

  public save(name: string) {
    if (this.fake) {
      return faker.requestBlueprintSave(name);
    }

    building.requestBlueprintSave(name);
  }

  public remove(blueprint: BuildingBlueprint) {
    if (this.fake) {
      return faker.requestBlueprintDelete(blueprint);
    }

    building.requestBlueprintDelete(blueprint);
  }

  public copy() {
    if (this.fake) {
      return faker.requestBlueprintCopy();
    }

    building.requestBlueprintCopy();
  }

  public paste() {
    if (this.fake) {
      return faker.requestBlueprintPaste();
    }

    building.requestBlueprintPaste();
  }
  /*
    const UNCLASSIFIED: string = 'Unclassified';
    private splitCategoryAndName(fullName: string) {
      let category = UNCLASSIFIED;
      let name = fullName;
      const index = fullName.indexOf('-');
      if (index > 0) {
        category = fullName.substring(0, index);
        name = fullName.substring(index + 1);
      }
      return { cat: category, name: name, fullName: fullName };
    }
  */
}


export default new BlueprintRequests();
