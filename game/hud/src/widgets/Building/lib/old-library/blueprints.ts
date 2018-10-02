/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BuildingEventTopics from './events/BuildingEventTopics';

function requestBlueprintCopy() {
  game.triggerKeyAction(game.keyActions.CubeBuildingCopy);
  game.trigger('building-copy');
}

function requestBlueprintPaste() {
  game.triggerKeyAction(game.keyActions.CubeBuildingPaste);
  game.trigger('building-paste');
}

function fireHandleBlueprints() {
  const result = game.plot.getBlueprints();
  if (result.success) {
    game.trigger(BuildingEventTopics.handlesBlueprints, { blueprints: result.blueprints });
  }
}

function requestBlueprintDelete(blueprint: Blueprint) {
  game.plot.deleteBlueprint(blueprint.id);
  fireHandleBlueprints();
}

function requestBlueprintSave(name: string) {
  game.plot.createBlueprintFromSelection(name);
  fireHandleBlueprints();
}

function requestBlueprintSelect(blueprint: Blueprint) {
  game.plot.selectBlueprint(blueprint.id);
  game.trigger(BuildingEventTopics.handlesBlueprintSelect, { blueprint });
}

function requestBlueprintIcon(blueprint: Blueprint) {
  fireHandleBlueprints();
}

function requestBlueprints() {
  fireHandleBlueprints();
}

export {
  requestBlueprints,
  requestBlueprintIcon,
  requestBlueprintSelect,
  requestBlueprintSave,
  requestBlueprintDelete,
  requestBlueprintCopy,
  requestBlueprintPaste,
};
