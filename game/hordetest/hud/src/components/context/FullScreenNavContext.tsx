/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

const HAS_PLAYED_INTRO = 'has-played-intro';

export function fullScreenNavigateTo(route: Route) {
  game.trigger('fullscreen-navigate', route);
}

export enum Route {
  IntroVideo,
  Start,
  ChampionSelect,
  EndGameStats,
}

export interface FullScreenNavContextState {
  currentRoute: Route;
}

export interface Props {

}

const getDefaultFullScreenNavContextState = (): FullScreenNavContextState => ({
  currentRoute: Route.Start,
});

export const FullScreenNavContext = React.createContext(getDefaultFullScreenNavContextState());

export class FullScreenNavContextProvider extends React.Component<Props, FullScreenNavContextState> {
  private navigateEVH: EventHandle;
  constructor(props: Props) {
    super(props);

    this.state = {
      currentRoute: this.getDefaultRoute(),
    };
  }

  public render() {
    return (
      <FullScreenNavContext.Provider value={this.state}>
        {this.props.children}
      </FullScreenNavContext.Provider>
    );
  }

  public componentDidMount() {
    this.navigateEVH = game.on('fullscreen-navigate', this.navigateTo);
  }

  public componentWillUnmount() {
    this.navigateEVH.clear();
  }

  private navigateTo = (route: Route) => {
    console.log(`Navigating fullscreen to ${Route[route]}`)
    this.setState({ currentRoute: route });
  }

  private getDefaultRoute = () => {
    if (this.shouldPlayIntroVideo()) {
      return Route.IntroVideo;
    }

    return Route.Start;
  }

  private shouldPlayIntroVideo = () => {
    // First check local storage and then check settings to see if we want to play it
    const hasPlayedIntro = localStorage.getItem(HAS_PLAYED_INTRO);
    if (!hasPlayedIntro) {
      // We have never played the intro for this player, don't even look at settings options.
      localStorage.setItem(HAS_PLAYED_INTRO, 'true');
      return true;
    }

    const optShowIntroVideo = Object.values(game.options).find(o => o.name === 'optShowIntroVideo');
    if (!optShowIntroVideo.value) {
      return false;
    }

    return true;
  }
}
