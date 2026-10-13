/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SimpleRect } from '../redux/dragAndDropSlice';

export interface MouseRelativePosition {
  type: 'mouse';
  xOffset: number;
  yOffset: number;
}

export interface SourceRelativePosition {
  type: 'source';
  sourceRect: SimpleRect;
  xOffset: number;
  yOffset: number;
}

type TooltipPosition = MouseRelativePosition | SourceRelativePosition;
export type TooltipPositionType = TooltipPosition['type'];

export interface TooltipParams {
  // An ID is required so we can close the tooltip if the TooltipSource gets unmounted.
  id: string | null;
  content: React.ReactNode;
  position: TooltipPosition;
  maxWidth?: string;
  // When true, TooltipPane skips its default FactionBorder wrap, letting content supply its own border(s).
  noOuterBorder?: boolean;
}

export interface TooltipState extends TooltipParams {}

function buildDefaultTooltipState(): TooltipState {
  return {
    id: null,
    content: null,
    position: {
      type: 'mouse',
      xOffset: 0,
      yOffset: 0
    }
  };
}

// Skips Redux on purpose - dispatching on every hover would make every connected component in
// the app re-check itself, even though only TooltipPane actually cares about this.
let currentState: TooltipState = buildDefaultTooltipState();
const listeners: Set<(state: TooltipState) => void> = new Set();

export function getTooltipState(): TooltipState {
  return currentState;
}

export function subscribeTooltip(listener: (state: TooltipState) => void): ListenerHandle {
  listeners.add(listener);
  return {
    close: () => listeners.delete(listener)
  };
}

function notify(): void {
  for (const listener of listeners) {
    listener(currentState);
  }
}

export function showTooltip(params: TooltipParams): void {
  // Completely replace the existing state when starting a new tooltip.
  currentState = params;
  notify();
}

export function hideTooltip(id?: string): void {
  // leave content for exit animation, but flag no active tooltip by nulling the id
  if (id === undefined || currentState.id === id) {
    currentState = { ...currentState, id: null };
    notify();
  }
}
