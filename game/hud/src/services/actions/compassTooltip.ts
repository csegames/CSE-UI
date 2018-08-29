/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CompassTooltipData } from 'components/CompassTooltip';
import { events } from '@csegames/camelot-unchained';

export function showCompassTooltip(tooltip: CompassTooltipData) {
  events.fire('compass-tooltip--show', tooltip);
}

export function updateCompassTooltip(tooltip: CompassTooltipData) {
  events.fire('compass-tooltip--update', tooltip);
}

export function hideCompassTooltip(id: string) {
  events.fire('compass-tooltip--hide', id);
}
