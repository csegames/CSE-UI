/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface InputContextState {
  isConsole: boolean;
}

const getDefaultInputContextState = (): InputContextState => ({
  isConsole: game.usingGamepadState ? game.usingGamepadState.usingGamepad : false,
});

export const InputContext = React.createContext(getDefaultInputContextState());

export class InputContextProvider extends React.Component<{}, InputContextState> {
  private eventHandle: EventHandle;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultInputContextState();
  }

  public render() {
    return (
      <InputContext.Provider value={this.state}>
        {this.props.children}
      </InputContext.Provider>
    );
  }

  public componentDidMount() {
    this.eventHandle = game.usingGamepadState.onUpdated(this.handleUsingGamepadStateUpdate);
  }

  public componentWillUnmount() {
    this.eventHandle.clear();
  }

  private handleUsingGamepadStateUpdate = (usingGamepadState: UsingGamepadState) => {
    this.setState({ isConsole: usingGamepadState.usingGamepad });
  }
}

