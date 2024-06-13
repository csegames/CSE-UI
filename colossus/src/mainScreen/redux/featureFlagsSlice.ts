/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

class Flag {
  private readonly tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  hasLoaded(source: FeatureFlags.Source | FeatureFlagsState): boolean {
    const flags: FeatureFlagsState = isSource(source) ? source.featureFlags : source;
    return flags?.isInitialized === true;
  }

  isEnabled(source: FeatureFlags.Source | FeatureFlagsState): boolean {
    const flags: FeatureFlagsState = isSource(source) ? source.featureFlags : source;
    return flags?.isInitialized && flags.value.indexOf(this.tag) >= 0;
  }

  isDisabled(source: FeatureFlags.Source | FeatureFlagsState): boolean {
    const flags: FeatureFlagsState = isSource(source) ? source.featureFlags : source;
    return flags?.isInitialized === true && flags.value.indexOf(this.tag) < 0;
  }
}

function isSource(value: any): value is FeatureFlags.Source {
  return typeof value === 'object' && typeof value.featureFlags === 'object' && Array.isArray(value.featureFlags.value);
}

// BEGIN FLAG LISTING
// Adding new feature flags can be done by inserting a new exported const into the namespace below.
// Flags should use specific, concrete strings internally.
//
// To test a flag, pass a FeatureFlagState or any object containing a FeatureFlagState to `isEnabled(x)`
// and the correct value will be extracted.
export namespace FeatureFlags {
  export const Store: Flag = new Flag('ColossusPerkStore');
  export const FFA: Flag = new Flag('FreeForAll');

  export interface Source {
    featureFlags: FeatureFlagsState;
  }
}

// END FLAG LISTING

export interface FeatureFlagsState {
  isInitialized: boolean;
  clientBuild: number;
  serverBuild: number | null;
  value: string[];
}

const defaultFeatureFlagsState: FeatureFlagsState = {
  isInitialized: false,
  clientBuild: 0,
  serverBuild: null,
  value: []
};

export const featureFlagsSlice = createSlice({
  name: 'featureFlags',
  initialState: defaultFeatureFlagsState,
  reducers: {
    updateFeatureFlags: (
      state: FeatureFlagsState,
      action: PayloadAction<{ clientBuild: number; serverBuild: number | null; flags: string[] }>
    ) => {
      state.isInitialized = true;
      state.clientBuild = action.payload.clientBuild;
      state.serverBuild = action.payload.serverBuild;
      state.value = action.payload.flags;
    }
  }
});

export const { updateFeatureFlags } = featureFlagsSlice.actions;
