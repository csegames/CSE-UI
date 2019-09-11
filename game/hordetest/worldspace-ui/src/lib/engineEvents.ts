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
  html: HTMLElement,
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

export const engineEvents = {
  onUpdateProgressBar,
  onUpdateWorldUI,
  onRemoveWorldUI,
  onUpdateHealthBar,
};
