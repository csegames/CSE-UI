/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface AudioContextState {
  hasPlayedInGameMusicAtScenarioStartEver: boolean;
  markHasAPlayedInGameMusicAtScenarioStart: () => void;
}

const getDefaultState = (): AudioContextState => ({
  hasPlayedInGameMusicAtScenarioStartEver: false,
  markHasAPlayedInGameMusicAtScenarioStart: () => {}
});

export const AudioContext = React.createContext(getDefaultState());

export class AudioContextProvider extends React.Component<{}, AudioContextState> {
  constructor(props: {}) {
    super(props);
    this.state = getDefaultState();
  }

  public render() {
    return (
      <AudioContext.Provider 
      value={{
        ...this.state,
        markHasAPlayedInGameMusicAtScenarioStart: this.markHasAPlayedInGameMusicAtScenarioStart
      }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }

  private markHasAPlayedInGameMusicAtScenarioStart = () => {
    this.setState({hasPlayedInGameMusicAtScenarioStartEver: true})
  }

  public componentDidMount() {

  }

  public componentWillUnmount() {

  }
}
