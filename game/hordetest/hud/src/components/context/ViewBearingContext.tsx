/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface ViewBearingContextState {
  viewBearing: number;
}

const getDefaultViewBearingContextState = (): ViewBearingContextState => ({
  viewBearing: 0,
});

export const ViewBearingContext = React.createContext(getDefaultViewBearingContextState());

export class ViewBearingContextProvider extends React.Component<{}, ViewBearingContextState> {
  private eventHandle: EventHandle;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultViewBearingContextState();
  }

  public render() {
    return (
      <ViewBearingContext.Provider value={this.state}>
        {this.props.children}
      </ViewBearingContext.Provider>
    );
  }

  public componentDidMount() {
    this.eventHandle = hordetest.game.selfPlayerState.onUpdated(this.handleSelfPlayerStateUpdate);
  }

  public componentWillUnmount() {
    this.eventHandle.clear();
  }

  private handleSelfPlayerStateUpdate = () => {
    if (!this.state.viewBearing.floatEquals(hordetest.game.selfPlayerState.viewBearing)) {
      this.setState({ viewBearing: hordetest.game.selfPlayerState.viewBearing });
    }
  }
}
