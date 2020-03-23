/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface StatusContextState {
  statusDefs: StatusDef[];
}

export const getDefaultStatusContextState = (): StatusContextState => ({
  statusDefs: [],
});

export const StatusContext = React.createContext(getDefaultStatusContextState());

export class StatusContextProvider extends React.Component<{}, StatusContextState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      statusDefs: cloneDeep(hordetest.game.statuses) as StatusDef[],
    };
  }

  public render() {
    return (
      <StatusContext.Provider value={this.state}>
        {this.props.children}
      </StatusContext.Provider>
    );
  }
}
