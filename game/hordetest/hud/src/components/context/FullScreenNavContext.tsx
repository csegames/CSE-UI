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

interface ContextState {
  currentRoute: Route;
  hasPlayedInGameMusic: boolean;
}

interface ContextFunctions {
  navigateTo: (route: Route) => void;
}

export type FullScreenNavContextState = ContextState & ContextFunctions;

export interface Props {

}

const getDefaultFullScreenNavContextState = (): FullScreenNavContextState => ({
  currentRoute: Route.Start,
  navigateTo: () => {},
  hasPlayedInGameMusic: false
});

export const FullScreenNavContext = React.createContext(getDefaultFullScreenNavContextState());

export class FullScreenNavContextProvider extends React.Component<Props, ContextState> {
  private navigateEVH: EventHandle;
  constructor(props: Props) {
    super(props);

    this.state = {
      hasPlayedInGameMusic: false,
      currentRoute: this.getDefaultRoute(),
    };
  }

  public render() {
    return (
      <FullScreenNavContext.Provider
        value={{
          ...this.state,
          navigateTo: this.navigateTo,
        }}>
        {this.props.children}
      </FullScreenNavContext.Provider>
    );
  }

  public componentDidMount() {
    this.navigateEVH = game.on('fullscreen-navigate', this.navigateTo);
    this.tryPlayInGameMusic();
  }

  public componentWillUnmount() {
    this.navigateEVH.clear();
  }

  private navigateTo = (route: Route) => {
    this.setState({ currentRoute: route }, this.tryPlayInGameMusic);
  }

  private tryPlayInGameMusic = () => {
    console.log(`Has Played Music? ${this.state.hasPlayedInGameMusic}`);
    if (this.state.currentRoute == Route.Start && !this.state.hasPlayedInGameMusic)
    {
      console.log("Playing in game music");
      game.playGameSound(SoundEvents.PLAY_MUSIC_IN_GAME);
      this.setState({hasPlayedInGameMusic: true})
    }
  }

  private getDefaultRoute = () => {
    if (this.shouldPlayIntroVideo()) {
      return Route.IntroVideo;
    }

    return Route.Start;
  }

  private shouldPlayIntroVideo = () => {
    // Temporarily disable intro video for now since we can't play videos atm.
    // return false;

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
