/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

// Session
import { GlobalState } from '../../services/session';
import { changeRoute, Routes } from '../../services/session/routes';
import { HeroContentState, fetchHeroContent, validateHeroContent } from '../../services/session/heroContent';
import { NewsState, fetchPage } from '../../services/session/news';
import { SoundsState, muteMusic, unMuteMusic, muteSounds, unMuteSounds } from '../../services/session/sounds';
import { ChatState, showChat } from '../../services/session/chat';
import { TopVeil, TopLeftVeil, BottomVeil, BottomLeftVeil, BottomRightVeil } from '../Viels';

// Components
import Hero from '../Hero';
import Sound from '../Sound';
import Header from '../Header';
import WindowHeader from '../WindowHeader';

import OverlayView, { view } from '../OverlayView';

// Widgets
import Controller from '../../widgets/Controller';

export interface PatcherAppProps {
  dispatch?: (action: any) => void;
  currentRoute: Routes;
  heroContentState: HeroContentState;
  newsState: NewsState;
  soundsState: SoundsState;
  chatState: ChatState;
}

export class PatcherApp extends React.Component<PatcherAppProps, {}> {
  public name = 'cse-patcher';
  private heroContentInterval: any = null;

  public render() {
    return (
      <div className='PatcherApp'>
        <TopVeil />
        <TopLeftVeil />
        <BottomVeil />
        <BottomLeftVeil />
        <BottomRightVeil />
        <WindowHeader soundsState={this.props.soundsState}
          onMuteSounds={() => this.props.dispatch(this.props.soundsState.playSound ?
            muteSounds(this.props.soundsState) : unMuteSounds(this.props.soundsState))}
          onMuteMusic={() => this.props.dispatch(this.props.soundsState.playMusic ?
            muteMusic(this.props.soundsState) : unMuteMusic(this.props.soundsState))}/>
        <Header changeRoute={this.onRouteChanged}
                activeRoute={this.props.currentRoute}
                openChat={this.showChat} />

        <div className='PatcherApp__content'>
          <Hero isFetching={this.props.heroContentState.isFetching}
                lastUpdated={this.props.heroContentState.lastFetchSuccess}
                items={this.props.heroContentState.items} />
        </div>

        <Controller onLogIn={this.onLogIn} activeRoute={this.props.currentRoute} />
        <Sound soundsState={this.props.soundsState} />
        <OverlayView />
      </div>
    );
  }

  public componentDidMount() {
    // fetch initial hero content and then every 30 minutes validate & fetch hero content.
    if (!this.props.heroContentState.isFetching) this.props.dispatch(fetchHeroContent());
    this.heroContentInterval = setInterval(() => {
      this.props.dispatch(validateHeroContent());
      if (!this.props.heroContentState.isFetching) this.props.dispatch(fetchHeroContent());
    }, 60000 * 30);

    game.on('view-content', (v: view) => {
      if ((this.props.currentRoute === Routes.NEWS && v !== view.NEWS) ||
        (this.props.currentRoute === Routes.PATCHNOTES && v !== view.PATCHNOTES)) {
        this.props.dispatch(changeRoute(Routes.HERO));
      }
    });

    game.on('logged-in', () => {
      this.setState({} as any);
    });
  }

  public componentWillUnmount() {
    // unregister intervals
    clearInterval(this.heroContentInterval);
  }

  public componentDidUpdate() {
  }

  private onRouteChanged = (route: Routes) => {
    switch (route) {
      case Routes.HERO: {
        game.trigger('view-content', view.NONE, null);
        game.trigger('resume-videos');
        break;
      }
      case Routes.NEWS: {
        game.trigger('view-content', view.NEWS, {
          news: this.props.newsState,
          fetchPage: this.fetchNewsPage,
        });
        game.trigger('pause-videos');
        break;
      }
      case Routes.CHAT: {
        game.trigger('view-content', view.CHAT, null);
        game.trigger('pause-videos');
        break;
      }
      case Routes.PATCHNOTES: {
        game.trigger('view-content', view.PATCHNOTES, null);
        game.trigger('pause-videos');
        break;
      }
    }
    this.props.dispatch(changeRoute(route));
    game.trigger('play-sound', 'select');
  }

  private showChat = () => {
    this.props.dispatch(showChat());
    game.trigger('play-sound', 'select');
  }

  private fetchNewsPage = (page: number) => {
    this.props.dispatch(fetchPage(page));
    game.trigger('play-sound', 'select');
  }

  private onLogIn = () => {
    setTimeout(() => this.setState({}), 500);
  }

}

function select(state: GlobalState): PatcherAppProps {
  return {
    currentRoute: state.routes.current,
    heroContentState: state.heroContent,
    newsState: state.news,
    soundsState: state.sounds,
    chatState: state.chat,
  };
}

export default connect(select)(PatcherApp);
