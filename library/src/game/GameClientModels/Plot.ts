/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';
import engineInit from './_Init';

export interface PlotModel {
  /**
   * Whether the active character owns this plot
   */
  isOwner: boolean;

  /**
   * Permissions flags for the plot
   */
  permissions: number;

  /**
   * CharacterID of the plot owner
   * TODO: Plots can be owned by groups as well, this api doesn't reflect that well
   */
  ownerCharacterID: string;

  /**
   * EntityID of the plot owner
   */
  ownerEntityID: string;

  /**
   * BuildingMode state of the client
   */
  buildingMode: BuildingMode;

  /**
   * The active selected block
   */
  activeBlock: Block;

  /**
   * An array of material objects that contain associated blocks
   */
  materials: Material[];

  /**
   * Sets the building mode, used to toggle between tools or turn build mode on / off
   * @param {BuildingMode} mode The building mode to change to
   */
  setBuildingMode: (mode: BuildingMode) => Success | Failure;

  /**
   * Select a block by id
   * @param {Number} blockID ID of the block to select
   */
  selectBlock: (blockID: number) => Success | Failure;

  replaceMaterials: (selectedMaterialID: number, replaceWithMaterialID: number) => Success | Failure;

  replaceMaterialsInSelection: (selectedMaterialID: number, replaceWithMaterialID: number) => Success | Failure;

  replaceShapes: (selectedShapeID: number, replaceWithShapeID: number) => Success | Failure;
  replaceShapesInSelection: (selectedShapeID: number, replaceWithShapeID: number) => Success | Failure;

  /**
   * Drops a client-side only point light at the characters current origin position. (At the characters feet)
   * This light exists only as long as the current client session and while they have the zone in which the light
   * was dropped loaded.
   * @param {Number (-10000 - 10000)} brightness How bright the light will be
   * @param {Number (1 - 10000)} radius Radius, in meters, for the spherical dimensions of the point light
   * @param {Number (0 - 255)} red The red byte value of the light's color.
   * @param {Number (0 - 255)} green The green byte value of the light's color.
   * @param {Number (0 - 255)} blue The blue byte value of the light's color.
   */
  dropLight: (brightness: number, radius: number, red: number, green: number, blue: number) => void;

  /**
   * Removes **all** drop lights from the game world.
   */
  resetLights: () => void;

  /**
   * Removes the last drop light added to the game world.
   */
  removeLight: () => void;

  /**
   * Returns the number of blocks placed in the entire scene
   */
  countBlocks: () => number;

  /**
   * Select a blueprint from the pallette by index
   * @param {Number} blueprintID Blueprint ID
   */
  selectBlueprint: (blueprintID: number) => Success | Failure;

  /**
   * Get blueprints
   */
  getBlueprints: () => Success & { blueprints: Blueprint[] } | Failure;

  /**
   * Deletes a single blueprint
   * @param {Number} blueprintID The ID of the blueprint to delete
   */
  deleteBlueprint: (blueprintID: number) => Success | Failure;

  /**
   * Creates a new blueprint and saves it with the given name
   * @param {String} name Name to give the blueprint
   */
  createBlueprintFromSelection: (name: string) => Success & { blueprint: Blueprint } | Failure;
}

export type Plot = PlotModel & Updatable;

export const PlotState_Update = 'plotState.update';

function noOp(...args: any[]): any {}
function noOpSuccess(...args: any[]): Success { return { success: true }; }

function initDefault(): Plot {
  return {
    isOwner: false,
    permissions: 0,
    ownerCharacterID: '',
    ownerEntityID: '',
    buildingMode: window.BuildingMode.NotBuilding,

    materials: [],
    activeBlock: {} as Block,
    setBuildingMode: noOpSuccess,
    selectBlock: noOpSuccess,

    replaceMaterials: noOpSuccess,
    replaceMaterialsInSelection: noOpSuccess,
    replaceShapes: noOpSuccess,
    replaceShapesInSelection: noOpSuccess,

    countBlocks: noOp,

    getBlueprints: noOp,
    selectBlueprint: noOpSuccess,
    createBlueprintFromSelection: noOp,
    deleteBlueprint: noOp,

    dropLight: noOp,
    resetLights: noOp,
    removeLight: noOp,

    // Updatable
    isReady: false,
    _name: PlotState_Update,
    onUpdated: createDefaultOnUpdated(PlotState_Update),
    onReady: createDefaultOnReady(PlotState_Update),
  };
}

export default function() {

  engineInit(
    PlotState_Update,
    () => _devGame.plot = initDefault(),
    () => game.plot,
    (model: PlotModel) => _devGame.plot = model as Plot);

}
