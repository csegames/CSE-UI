
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference> ../coherent.d.ts
import { PlotState_Update } from '../GameClientModels/Plot';

export function mockPlot() {
  console.log('MOCK.plot', 'initialize');
  _devGame.plot.setBuildingMode = (mode: BuildingMode) => {
    _devGame.plot.buildingMode = mode;
    engine.trigger(PlotState_Update, _devGame.plot);
    _devGame.trigger('building-mode', { mode });
    return { success: true };
  };
  _devGame.plot.countBlocks = () => 42;
  _devGame.plot.getBlueprints = () => {
    return {
      success: true,
      blueprints: [],
    };
  };
  _devGame.plot.createBlueprintFromSelection = (name: string) => {
    const result = _devGame.plot.getBlueprints();
    if (result.success) {
      const blueprint = {
        id: result.blueprints.length,
        icon: '',
        tags: [],
        name,
      };
      engine.trigger(PlotState_Update, _devGame.plot);
      return {
        success: true,
        blueprint,
      };
    } else {
      return {
        success: false,
        reason: '',
      };
    }
  };
  _devGame.on('_mock_.keyAction', (id: number) => {
    if (id === _devGame.keyActions.UIToggleBuildingMode) {
      if (_devGame.plot.buildingMode === window.BuildingMode.NotBuilding) {
        _devGame.plot.setBuildingMode(window.BuildingMode.PlacingPhantom);
      } else {
        _devGame.plot.setBuildingMode(window.BuildingMode.NotBuilding);
      }
    }
  });
  engine.trigger(PlotState_Update, _devGame.plot);
}
