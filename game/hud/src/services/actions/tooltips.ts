/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// BASIC MANAGEMENT

export const ACTIVATE_TOOLTIP = 'active-tooltip';
export const HIDE_TOOLTIP = 'hide-tooltip';

export interface ToolTipStyle {
  Tooltip: string;
  tooltip: string;
  tooltipFixed: string;
}

export interface ShowTooltipPayload {
  content: JSX.Element | JSX.Element[] | string;
  event: MouseEvent | React.MouseEvent;
  shouldAnimate?: boolean;
  styles?: Partial<ToolTipStyle>;
}

export function showTooltip(payload: ShowTooltipPayload) {
  game.trigger(ACTIVATE_TOOLTIP, payload);
}

export function hideTooltip() {
  game.trigger(HIDE_TOOLTIP);
}

export function onShowTooltip(callback: (payload: ShowTooltipPayload) => void) {
  return game.on(ACTIVATE_TOOLTIP, callback);
}

export function onHideTooltip(callback: () => void) {
  return game.on(HIDE_TOOLTIP, callback);
}
