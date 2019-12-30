/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

function onUpdateProgressBar(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  percent: number
) => void) {
  engine.on('updateProgressBar', callback);
}

function onUpdateWorldUI(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  html: string,
) => void) {
  engine.on('updateWorldUI', callback);
}

function onRemoveWorldUI(callback: (cell: number) => void) {
  engine.on('removeWorldUI', callback);
}

function onUpdateHealthBar(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  isEnemy: boolean,
  currentHealth: number,
  maxHealth: number,
) => void) {
  engine.on('updateHealthBar', callback);
}

function onUpdateInteractable(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  description: string,
  gameplayType: ItemGameplayType,
) => void) {
  engine.on('updateInteractable', callback);
}

function onUpdateInteractionBar(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  description: string,
  gameplayType: ItemGameplayType,
  iconClass: string,
  iconURL: string,
  progress?: number,
  keybind?: Binding,
) => void) {
  engine.on('updateInteractionBar', callback);
}

function onUpdatePlayerDifferentiator(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  matchDifferentiator: number,
) => void) {
  engine.on('updatePlayerDifferentiator', callback);
}

function onUpdateObjective(callback: (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  objectiveState: ObjectiveEntityState,
) => void) {
  engine.on('updateObjective', callback);
}

export const engineEvents = {
  onUpdateProgressBar,
  onUpdateWorldUI,
  onRemoveWorldUI,
  onUpdateHealthBar,
  onUpdateInteractable,
  onUpdateInteractionBar,
  onUpdatePlayerDifferentiator,
  onUpdateObjective,
};
