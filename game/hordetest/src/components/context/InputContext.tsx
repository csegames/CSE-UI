/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface InputContextState {
  isConsole: boolean;
}

const defaultInputContextState: InputContextState = {
  isConsole: true,
}

export const InputContext = React.createContext(defaultInputContextState);

export class InputContextProvider extends React.Component<{}, InputContextState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      ...defaultInputContextState,
    }
  }

  public render() {
    return (
      <InputContext.Provider value={this.state}>
        {this.props.children}
      </InputContext.Provider>
    );
  }
}

