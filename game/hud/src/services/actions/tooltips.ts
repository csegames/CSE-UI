/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { events } from '@csegames/camelot-unchained';

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
  styles?: Partial<ToolTipStyle>;
}

export function showTooltip(payload: ShowTooltipPayload) {
  events.fire(ACTIVATE_TOOLTIP, payload);
}

export function hideTooltip() {
  events.fire(HIDE_TOOLTIP);
}

export function onShowTooltip(callback: (payload: ShowTooltipPayload) => void) {
  return events.on(ACTIVATE_TOOLTIP, callback);
}

export function offShowTooltip(handle: number) {
  events.off(handle);
}

export function onHideTooltip(callback: () => void) {
  return events.on(HIDE_TOOLTIP, callback);
}

export function offHideTooltip(handle: number) {
  events.off(handle);
}
