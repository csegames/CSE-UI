/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export type PlayOnceOnlyAudioContextState = {
  hasPlayedInGameMusicAtScenarioStartEver: boolean;
  markHasAPlayedInGameMusicAtScenarioStart: () => void;
}

const getDefaultState = (): PlayOnceOnlyAudioContextState => ({
  hasPlayedInGameMusicAtScenarioStartEver: false,
  markHasAPlayedInGameMusicAtScenarioStart: () => {}
});

export const PlayOnceOnlyAudioContext = React.createContext(getDefaultState());

export class PlayOnceOnlyAudioContextProvider extends React.Component<{}, PlayOnceOnlyAudioContextState> {
  constructor(props: {}) {
    super(props);
    this.state = getDefaultState();
  }

  public render() {
    return (
      <PlayOnceOnlyAudioContext.Provider value={{
        ...this.state,
        markHasAPlayedInGameMusicAtScenarioStart: this.markHasAPlayedInGameMusicAtScenarioStart
      }}>
        {this.props.children}
      </PlayOnceOnlyAudioContext.Provider>
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
