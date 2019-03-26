/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { MediaBreakpoints } from './lib/MediaBreakpoints';

/*
  The reason for a CraftingResolutionContext is to provide UHD and MidScreen resolutions specific to the Crafting UI ONLY.
  The Crafting UI's style is very unique to the rest of the UI's, and in it's current state, it isn't practical to
  try to force it to look good with the same breakpoints other UIs use.

  In the future, we can revisit the styles for the Crafting UI and come up with a better way to implement
  those styles to make them work with the rest of the UI.

  MidScreen values are multiplied by 1.3
  UHD values are multiplied by 2

  These values were just what looked the best for this UI and the way the styles were implemented.

  -AJ
*/

export interface ResolutionContextState {
  resolution: Resolution;
  isUHD(): boolean;
  isMidScreen(): boolean;
}

function noOp(...params: any[]): any {}

// Use this to initialize state, then update the object based on events from the client
export function getDefaultCraftingResolutionContext(): ResolutionContextState {
  return Object.freeze({
    resolution: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    isUHD: noOp,
    isMidScreen: noOp,
  });
}

export const CraftingResolutionContext = React.createContext<ResolutionContextState>(getDefaultCraftingResolutionContext());

export class CraftingResolutionContextProvider extends React.Component<{}, ResolutionContextState> {
  constructor(props: ResolutionContextState) {
    super(props);
    this.state = {
      ...getDefaultCraftingResolutionContext(),
      isUHD: this.isUHD,
      isMidScreen: this.isMidScreen,
    };
  }

  public render() {
    return (
      <CraftingResolutionContext.Provider value={this.state}>
        {this.props.children}
      </CraftingResolutionContext.Provider>
    );
  }

  public componentDidMount() {
    window.addEventListener('optimizedResize', this.onWindowResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('optimizedResize', this.onWindowResize);
  }

  private isUHD = () => {
    const { resolution } = this.state;
    return resolution.width > MediaBreakpoints.UHDWidth && resolution.height > MediaBreakpoints.UHDHeight;
  }

  private isMidScreen = () => {
    const { resolution } = this.state;
    return resolution.width > MediaBreakpoints.MidWidth && resolution.height > MediaBreakpoints.MidHeight && !this.isUHD();
  }

  private onWindowResize = () => {
    this.setState((state) => {
      return {
        ...state,
        resolution: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
    });
  }
}
