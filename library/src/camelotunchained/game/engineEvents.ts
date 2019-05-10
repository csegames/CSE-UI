/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CoherentEventHandle } from '../../_baseGame/coherent';

/**
 * Mapping of Engine Event name => GameInterface callback registration method name for creating
 * event forwarding methods on the GameInterface upon initialization
 */
const regMap: {[key: string]: string} = {};

/**
 * Begin chat is fired by the game client to tell the UI that the user wishes to begin sending a chat message.
 *
 * Expected behavior: The chat input element will gain focus and accept text input.
 *
 * @param {String} message Optional: A message to auto-populate into the chat input.
 */
export const EE_BeginChat = 'beginChat';
regMap[EE_BeginChat] = 'onBeginChat';

/**
 * Push chat is fired by the game client to tell the UI to append a string to the chat box, used for linking items or
 * any other types of dynamic content into the chat window.
 *
 * Expected behavior: The chat input element will gain focus and accept text input and append the provided content.
 *
 * @param {String} content Optional: Content to append into the chat input.
 */
export const EE_PushChat = 'pushChat';
regMap[EE_PushChat] = 'onPushChat';

/**
 * A scenario round that the current player is in has ended.
 *
 * Expected behavior: Displays a notificaiton of win/loss for the round and if the
 * scenario has ended, displays the scoreboard
 *
 * @param {String} scenarioID An identifer for the scenario
 * @param {String} roundID An identifer for a scenario round
 * @param {Boolean} didEnd Whether the scenario ended, this was the last round
 * @param {Boolean} didWin Whether the player's team has won the scenario
 */
export const EE_ScenarioRoundEnd = 'scenarioRoundEnd';
regMap[EE_ScenarioRoundEnd] = 'onScenarioRoundEnded';

/**
 * Client requests UI navigation for a specific target.
 *
 * Expected behavior: UI toggles element requested by the navigation trigger.
 * eg. navigation request is to 'inventory.open', the UI will open the inventory if it is not open.
 *
 * @param {String} target Navigation target
 */
export const EE_OnNavigate = 'navigate';
regMap[EE_OnNavigate] = 'onNavigate';

/**
 * Called when an option is changed.
 *
 * @param {GameOption} option The changed option
 */
export const EE_OnOptionChanged = 'optionChanged';
regMap[EE_OnOptionChanged] = 'onOptionChanged';

/**
 * Called when the BuildingMode is changed.
 *
 * @param {BuildingMode} mode The new mode
 */
export const EE_OnBuildingModeChanged = 'buildingModeChanged';
regMap[EE_OnBuildingModeChanged] = 'onBuildingModeChanged';

/**
 * Called when the ItemPlacementMode is changed.
 *
 * @param {ItemPlacementMode} mode The new mode
 */
export const EE_OnItemPlacementModeChanged = 'itemPlacementModeChanged';
regMap[EE_OnItemPlacementModeChanged] = 'onItemPlacementModeChanged';

/**
 * Called when the client wants the UI to send the API request for item placement
 */
export const EE_OnSendItemPlacementCommitRequest = 'sendItemPlacementCommitRequest';
regMap[EE_OnSendItemPlacementCommitRequest] = 'onSendItemPlacementCommitRequest';

/**
 * Called when the active plot is changed.
 *
 * @param {String} plotID The new plot id
 * @param {Boolean} canEdit Whether the player can edit the active plot
 */
export const EE_OnActivePlotChanged = 'activePlotChanged';
regMap[EE_OnActivePlotChanged] = 'onActivePlotChanged';

/**
 * Called when the selected block is changed.
 *
 * @param {Number} blockID The new block id
 */
export const EE_OnSelectedBlockChanged = 'selectedBlockChanged';
regMap[EE_OnSelectedBlockChanged] = 'onSelectedBlockChanged';

/**
 * Called when the selected material is changed.
 *
 * @param {Number} id The new material id
 */
export const EE_OnSelectedMaterialChanged = 'selectedMaterialChanged';
regMap[EE_OnSelectedMaterialChanged] = 'onSelectedMaterialChanged';

/**
 * Called when the selected blueprint is changed.
 *
 * @param {Number} id The new blueprint id
 */
export const EE_OnSelectedBlueprintChanged = 'selectedBlueprintChanged';
regMap[EE_OnSelectedBlueprintChanged] = 'onSelectedBlueprintChanged';

/**
 * Called when the client keybind for "Toggle Build Selection Interface" is registered.
 */
export const EE_OnToggleBuildSelector = 'toggleBuildSelector';
regMap[EE_OnToggleBuildSelector] = 'onToggleBuildSelector';

/**
 * Called when the client keybind for "Create Blueprint From Selection" is registered.
 */
export const EE_OnWantCreateBlueprintFromSelection = 'wantCreateBlueprintFromSelection';
regMap[EE_OnWantCreateBlueprintFromSelection] = 'onWantCreateBlueprintFromSelection';

/**
 * Called when the client keybind for "Replace Material" is registered.
 */
export const EE_OnWantReplaceMaterial = 'wantReplaceMaterial';
regMap[EE_OnWantReplaceMaterial] = 'onWantReplaceMaterial';

/**
 * Initialize engine event forwarding
 */
export function initEventForwarding() {
  for (const key in regMap) {
    createForwardingMethod(key, regMap[key]);
    if (typeof engine !== 'undefined') {
      engine.on(key, (...args: any[]) => game.trigger(key, ...args));
    }
  }
}

function createForwardingMethod(engineEvent: string, methodName: string) {
  camelotunchained._devGame[methodName] = function(callback: (...args: any[]) => any): CoherentEventHandle {
    return engine.on(engineEvent, callback);
  };
}
