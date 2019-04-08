/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// BASIC MANAGEMENT

export const ACTIVATE_TOOLTIP = 'active-tooltip';
export const UPDATE_TOOLTIP = 'update-tooltip';
export const HIDE_TOOLTIP = 'hide-tooltip';

export interface ToolTipStyle {
  Tooltip: string;
  tooltip: string;
  tooltipFixed: string;
}

export interface ShowTooltipPayload {
  content: JSX.Element | JSX.Element[] | string;
  event: {
    clientX: number;
    clientY: number;
  };
  shouldAnimate?: boolean;
  styles?: Partial<ToolTipStyle> | 'item';
}

export interface UpdateTooltipPayload {
  content: JSX.Element | JSX.Element[] | string;
  styles?: Partial<ToolTipStyle>;
}

export function showTooltip(payload: ShowTooltipPayload) {
  game.trigger(ACTIVATE_TOOLTIP, payload);
}

export function updateTooltip(payload: UpdateTooltipPayload) {
  game.trigger(UPDATE_TOOLTIP, payload);
}

export function hideTooltip() {
  game.trigger(HIDE_TOOLTIP);
}

export function onShowTooltip(callback: (payload: ShowTooltipPayload) => void) {
  return game.on(ACTIVATE_TOOLTIP, callback);
}

export function onUpdateTooltip(callback: (payload: UpdateTooltipPayload) => void) {
  return game.on(UPDATE_TOOLTIP, callback);
}

export function onHideTooltip(callback: () => void) {
  return game.on(HIDE_TOOLTIP, callback);
}
