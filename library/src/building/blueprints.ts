/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import BuildingBlueprint from './classes/BuildingBlueprint';
import client from '../core/client';
import * as events  from '../events';
import * as restApi from '../restapi';

let blueprintsLoaded: boolean = false;
let blueprintsRequested: boolean = false;
const blueprintsList: BuildingBlueprint[] = [];

function loadBlueprints() {
  client.OnNewBlueprint((index: number, name: string) => {
    const current = new Date().getTime();

    // special case, this is not a real blueprint
    if (name === 'Small Control Island')
      return;

    const blueprint = new BuildingBlueprint({
      index,
      name,
    } as BuildingBlueprint);

    blueprintsList.push(blueprint);

    if (blueprintsLoaded) {
      events.fire(events.buildingEventTopics.handlesBlueprints, { blueprints: blueprintsList });
    }

  });

  client.RequestBlueprints();
}

function requestBlueprintCopy() {
  client.CopyBlueprint();
}

function requestBlueprintPaste() {
  client.PasteBlueprint();
}

function fireHandleBlueprints() {
  events.fire(events.buildingEventTopics.handlesBlueprints, { blueprints: blueprintsList });
}

function requestBlueprintDelete(blueprint: BuildingBlueprint) {
  // no feedback on this delete, we just call it and cross our fingers
  client.DeleteLocalBlueprint(blueprint.name);

  // there is no client.OnDeleteBlueprint
  // so we will just remove the blueprint and hope the delete really worked
  for (let index = 0; index <= blueprintsList.length; index++) {
    const bp: BuildingBlueprint = blueprintsList[index];
    if (bp.name === blueprint.name) {
      blueprintsList.splice(index, 1);
      fireHandleBlueprints();
      return;
    }
  }
}

function requestBlueprintSave(name: string) {
  client.SaveBlueprint(name);
}

function requestBlueprintSelect(blueprint: BuildingBlueprint) {
  client.SelectBlueprint(blueprint.index);
  events.fire(events.buildingEventTopics.handlesBlueprintSelect, { blueprint });
}

function requestBlueprintIcon(blueprint: BuildingBlueprint) {  
  restApi.blueprints.getBlueprintIcon(blueprint.index).then((icon: string): void => {
    blueprint.icon = icon;
    fireHandleBlueprints();
  }, (): void => {
    fireHandleBlueprints();
  });
}

function requestBlueprints() {
  if (!blueprintsRequested) {
    blueprintsRequested = false;
    loadBlueprints();
  }

  if (blueprintsLoaded) {
    fireHandleBlueprints();
  } else {
    // we are waiting till the blueprintsList has not updated for 2 seconds before declaring that the blueprints are loaded 
    // we are only firing off the event periodically to avoid re-rendering the list possibly 100s of times on startup.
    // The blueprints are loaded using the client.OnNewBlueprint() event which fires for every blueprint
    waitForBlueprintsToLoad();
  }
}

function waitForBlueprintsToLoad() {
  const lastSize = blueprintsList.length;
  setTimeout(() => {
    if (lastSize === blueprintsList.length) {
      blueprintsLoaded = true;
      fireHandleBlueprints();
    } else {
      waitForBlueprintsToLoad();
    }
  }, 2000);
}

export {
  requestBlueprints, requestBlueprintIcon, requestBlueprintSelect,
  requestBlueprintSave, requestBlueprintDelete,
  requestBlueprintCopy, requestBlueprintPaste,
};
