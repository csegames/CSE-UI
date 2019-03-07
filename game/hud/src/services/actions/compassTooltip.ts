/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CompassTooltipData } from 'hud/CompassTooltip';

export function showCompassTooltip(tooltip: CompassTooltipData) {
  game.trigger('compass-tooltip--show', tooltip);
}

export function updateCompassTooltip(tooltip: CompassTooltipData) {
  game.trigger('compass-tooltip--update', tooltip);
}

export function hideCompassTooltip(id: string) {
  game.trigger('compass-tooltip--hide', id);
}
