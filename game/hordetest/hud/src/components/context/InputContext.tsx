/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface InputContextState {
  isConsole: boolean;
}

export interface Props {
  // Disabling is used by the full screen input context provider
  // since we don't have any controller support in the full screen.
  disabled?: boolean;
}

const getDefaultInputContextState = (): InputContextState => ({
  isConsole: game.usingGamepadState ? game.usingGamepadState.usingGamepad : false,
});

export const InputContext = React.createContext(getDefaultInputContextState());

export class InputContextProvider extends React.Component<Props, InputContextState> {
  private eventHandle: EventHandle;
  constructor(props: Props) {
    super(props);

    this.state = props.disabled ? { isConsole: false } : getDefaultInputContextState();
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
    if (this.props.disabled) return;
    this.setState({ isConsole: usingGamepadState.usingGamepad });
  }
}
