/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { client, restAPI, buildUIMode } from 'camelot-unchained';
import {Blueprint, UNCLASSIFIED} from '../../lib/Blueprint';
import faker from './requester_fake';

class BlueprintLoader {
  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  public loadBlueprints(callback: (print: Blueprint) => void) {
    if (this.fake) {
      return faker.loadBlueprints(callback);
    }

    client.OnNewBlueprint((index: number, fullName: string) => {
      //special case, this is not a real blueprint
      if (fullName == "Small Control Island")
        return;

      const catAndName = this.splitCategoryAndName(fullName);
      const blueprint = {
        index: index,
        id: fullName,
        name: fullName,
        category: catAndName.cat,
      } as Blueprint;
      callback(blueprint);
    });
    client.RequestBlueprints();
  }

  public loadBlueprintIcon(blueprint: Blueprint, callback: (blueprint: Blueprint, icon: string) => void) {
    if (this.fake) {
      return faker.loadBlueprintIcon(blueprint, callback);
    }

    restAPI.getBlueprintIcon(blueprint.index).then((icon: string): void => {
      callback(blueprint, icon);
    }, (): void => {
      callback(blueprint, undefined);
    })
  }

  public listenForSelectionModeChange(callback: (selected: boolean) => void) {
    if (this.fake) {
      return faker.listenForSelectionModeChange(callback);
    }

    client.OnBuildingModeChanged((mode: number) => {
      callback(mode==buildUIMode.BLOCKSELECTED);
    });    
  }

  public listenForCopy(callback: () => void) {
    if (this.fake) {
      return faker.listenForCopy(callback);
    }

    client.OnCopyBlueprint(() => {
      callback();
    });
  }

  public changeBlueprintSelection(blueprint: Blueprint) {
    if (this.fake) {
      return faker.changeBlueprintSelection(blueprint);
    }

    client.SelectBlueprint(blueprint.index);
  }

  public select(blueprint: Blueprint) {
    if (this.fake) {
      return faker.select(blueprint);
    }

    client.SelectBlueprint(blueprint.index);
  }

  public save(name: string) {
    if (this.fake) {
      return faker.save(name);
    }

    client.SaveBlueprint(name);
  }

  public remove(blueprint: Blueprint) {
    if (this.fake) {
      return faker.remove(blueprint);
    }

    //no feedback on this delete, we just call it and cross our fingers
    client.DeleteLocalBlueprint(blueprint.id);
  }

  public copy() {
    if (this.fake) {
      return faker.copy();
    }

    client.CopyBlueprint();
  }

  public paste() {
    if (this.fake) {
      return faker.paste();
    }
    
    client.PasteBlueprint();
  }

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
}


export default new BlueprintLoader();
