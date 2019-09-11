/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface ScreenContextState {
  screenWidth: number;
  screenHeight: number;
}

const defaultScreenContextState: ScreenContextState = {
  screenWidth: 0,
  screenHeight: 0,
}

export const ScreenContext = React.createContext(defaultScreenContextState);

export class ScreenContextProvider extends React.Component<{}, ScreenContextState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      ...defaultScreenContextState,
    }
  }

  public render() {
    return (
      <ScreenContext.Provider value={this.state}>
        {this.props.children}
      </ScreenContext.Provider>
    );
  }

  public componentDidMount() {
    window.addEventListener('optimizedResize', this.setScreenDimensions);
  }

  public componentWillUnmount() {
    window.removeEventListener('optimizedResize', this.setScreenDimensions);
  }

  private setScreenDimensions = () => {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
  }
}

