/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { MediaBreakpoints } from './lib/MediaBreakpoints';

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
    window.addEventListener('resize', this.onWindowResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
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
