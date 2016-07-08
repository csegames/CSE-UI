/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { client, restAPI, buildUIMode } from 'camelot-unchained';
import {Blueprint, UNCLASSIFIED} from '../../lib/Blueprint';

class BlueprintLoader {


  public loadBlueprints(callback: (print: Blueprint) => void) {
    client.OnNewBlueprint((index: number, fullName: string) => {
      //special case, this is not a real blueprint
      if (fullName == "Small Control Island")
        return;

      let catAndName = this.splitCategoryAndName(fullName);
      let blueprint = {
        index: index,
        id: fullName,
        name: catAndName.name,
        category: catAndName.cat,
      } as Blueprint;
      callback(blueprint);
    });
    client.RequestBlueprints();
  }

  public loadBlueprintIcon(blueprint: Blueprint, callback: (blueprint: Blueprint, icon: string) => void) {
    restAPI.getBlueprintIcon(blueprint.index).then((icon: string): void => {
      callback(blueprint, icon);
    }, (): void => {
      callback(blueprint, undefined);
    })
  }

  public listenForModeChange(callback: (selected: boolean) => void) {
    
  /* mode is defined as a boolean, it is actually a number */

    client.OnBuildingModeChanged((mode: number) => {
      callback(mode==buildUIMode.BLOCKSELECTED);
    });
  }

  public listenForCopy(callback: () => void) {
    client.OnCopyBlueprint(() => {
      callback();
    });
    client.OnBlueprintSelected(() => {
      console.log("OnBlueprintSelected");
    });
  }

  public changeBlueprintSelection(blueprint: Blueprint) {
    client.SelectBlueprint(blueprint.index);
  }

  public select(blueprint: Blueprint)
  {
    client.SelectBlueprint(blueprint.index);
  }

  public save(name: string) {
    client.SaveBlueprint(name);
  }

  public remove(blueprint: Blueprint) {
    //no feedback on this delete, we just call it and cross our fingers
    client.DeleteLocalBlueprint(blueprint.id);
  }

  public copy() {
    client.CopyBlueprint();
  }

  public paste() {
    client.PasteBlueprint();
  }

  private listenBlueprints = (): void => {
    client.OnDownloadBlueprints((charId: string) => {
      console.log("OnDownloadBlueprints " + charId);
    });

    client.OnUploadBlueprint((charId: string, name: string, data: any) => {
      console.log("OnUploadBlueprint");
    });
  }

  private splitCategoryAndName(fullName: string) {
    var category = UNCLASSIFIED;
    var name = fullName;
    var index = fullName.indexOf('-');
    if (index > 0) {
      category = fullName.substring(0, index);
      name = fullName.substring(index + 1);
    }
    return { cat: category, name: name, fullName: fullName };
  }
}


export default new BlueprintLoader();
