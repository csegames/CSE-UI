/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimpleRect } from './dragAndDropSlice';

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

function buildDefaultTooltipState() {
  const DefaultTooltipState: TooltipState = {
    id: null,
    content: null,
    position: {
      type: 'mouse',
      xOffset: 0,
      yOffset: 0
    }
  };

  return DefaultTooltipState;
}

export const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState: buildDefaultTooltipState(),
  reducers: {
    showTooltip: (state: TooltipState, action: PayloadAction<TooltipParams>) => {
      // Completely replace the existing state when starting a new tooltip.
      return action.payload;
    },
    hideTooltip: (state: TooltipState, action: PayloadAction<string | undefined>) => {
      // leave content for exit animation, but flag no active tooltip by nulling the id
      if (action.payload === undefined || state.id === action.payload) {
        state.id = null;
      }
    }
  }
});

export const { showTooltip, hideTooltip } = tooltipSlice.actions;
