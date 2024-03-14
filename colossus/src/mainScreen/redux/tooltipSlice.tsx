/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TooltipParams {
  // An ID is required so we can close the tooltip if the TooltipSource gets unmounted.
  id: string;
  content: (() => React.ReactNode) | string | null;
  disableBackground?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export interface TooltipState extends TooltipParams {}

function buildDefaultTooltipState() {
  const DefaultTooltipState: TooltipState = {
    id: null,
    content: null
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
    updateTooltip: (state: TooltipState, action: PayloadAction<Partial<TooltipParams>>) => {
      Object.assign(state, action.payload);
    },
    hideTooltip: (state: TooltipState) => {
      state.content = null;
      state.id = null;
    }
  }
});

export const { showTooltip, updateTooltip, hideTooltip } = tooltipSlice.actions;
