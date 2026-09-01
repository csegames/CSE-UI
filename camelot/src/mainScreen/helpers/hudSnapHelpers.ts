/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SimpleRect, simpleRectFromDOMRect } from '../redux/dragAndDropSlice';

// How close (in vmin) a dragged edge/center must get to a target before it snaps.
export const DEFAULT_SNAP_THRESHOLD_VMIN = 2;

/**
 * Reads the on-screen bounds of every other editable widget so we can snap against them. Widget root
 * elements carry their widget ID, so we can look them up directly. Called once at drag start (the
 * targets don't move during the drag), keeping per-frame snapping cheap.
 */
export function gatherSnapTargets(widgetIDs: string[], draggedWidgetID: string): SimpleRect[] {
  const targets: SimpleRect[] = [];
  for (const id of widgetIDs) {
    if (id === draggedWidgetID) {
      continue;
    }
    const element = document.getElementById(id);
    if (element) {
      targets.push(simpleRectFromDOMRect(element.getBoundingClientRect()));
    }
  }
  return targets;
}

// Returns how far to nudge the delta so the nearest dragged line aligns with a target line, or 0 if
// nothing is within the threshold.
function bestSnapAdjust(draggedLines: number[], targetLines: number[], thresholdPx: number): number {
  let best = 0;
  let bestDist = thresholdPx;
  for (const draggedLine of draggedLines) {
    for (const target of targetLines) {
      const adjust = target - draggedLine;
      if (Math.abs(adjust) <= bestDist) {
        best = adjust;
        bestDist = Math.abs(adjust);
      }
    }
  }
  return best;
}

/**
 * Given the dragged widget's pre-drag bounds and the raw drag delta, returns a snapped delta. Snaps
 * each axis independently to the nearest edge/center of another widget or the HUD itself
 * (left/center/right and top/middle/bottom).
 */
export function computeSnap(
  startBounds: SimpleRect,
  rawDelta: [number, number],
  targets: SimpleRect[],
  hudWidth: number,
  hudHeight: number,
  thresholdPx: number
): [number, number] {
  const [dx, dy] = rawDelta;

  // Candidate lines on the dragged widget at its current dragged position.
  const draggedX = [startBounds.left + dx, startBounds.left + startBounds.width / 2 + dx, startBounds.right + dx];
  const draggedY = [startBounds.top + dy, startBounds.top + startBounds.height / 2 + dy, startBounds.bottom + dy];

  // Target lines: HUD edges/center plus every other widget's edges/center.
  const targetX = [0, hudWidth / 2, hudWidth];
  const targetY = [0, hudHeight / 2, hudHeight];
  for (const t of targets) {
    targetX.push(t.left, t.left + t.width / 2, t.right);
    targetY.push(t.top, t.top + t.height / 2, t.bottom);
  }

  return [dx + bestSnapAdjust(draggedX, targetX, thresholdPx), dy + bestSnapAdjust(draggedY, targetY, thresholdPx)];
}
