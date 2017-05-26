/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 17:07:56
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-10 14:25:11
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {connect} from 'react-redux';
import {events} from 'camelot-unchained';
import Chat from 'cu-xmpp-chat';

import Animate from '../../lib/Animate';

import {patcher, Channel} from '../../services/patcher';

// Session
import reducer, {GlobalState} from '../../services/session';
import {changeRoute, Routes} from '../../services/session/routes';
import {HeroContentState, fetchHeroContent, validateHeroContent} from '../../services/session/heroContent';
import {NewsState, fetchPage} from '../../services/session/news';
import {SoundsState, muteMusic, unMuteMusic, muteSounds, unMuteSounds} from '../../services/session/sounds';
import {ChatState, showChat, hideChat} from '../../services/session/chat';

// Components
import Hero from '../Hero';
import Sound from '../Sound';
import Header from '../Header';
import WindowHeader from '../WindowHeader';

import OverlayView, {view} from '../OverlayView';

// Widgets
import Controller from '../../widgets/Controller';

function select(state: GlobalState): PatcherAppProps {
  return {
    currentRoute: state.routes.current,
    heroContentState: state.heroContent,
    newsState: state.news,
    soundsState: state.sounds,
    chatState: state.chat,
  };
}

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

    let chat: any = null;
    if (this.props.chatState.showChat) {
      chat = (
        <div id='chat-window' key='0'>
          <Chat hideChat={this.hideChat} loginToken={patcher.getLoginToken()} />
        </div>
      );
    }

    return (
      <div className='PatcherApp'>
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

        <Controller onLogIn={this.onLogIn} />
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

    events.on('view-content', (v: view) => {
      if (this.props.currentRoute === Routes.NEWS && v !== view.NEWS) {
        this.props.dispatch(changeRoute(Routes.HERO));
      }
    });

    events.on('logged-in', () => {
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
    if (route === Routes.HERO) {
      events.fire('view-content', view.NONE, null);
      events.fire('resume-videos');
    } else if (route === Routes.NEWS) {
      events.fire('view-content', view.NEWS, {
        news:this.props.newsState,
        fetchPage:this.fetchNewsPage,
      });
      events.fire('pause-videos');
    } else if (route === Routes.CHAT) {
      events.fire('view-content', view.CHAT, null);
      events.fire('pause-videos');
    }
    this.props.dispatch(changeRoute(route));
    events.fire('play-sound', 'select');
  }

  private hideChat = () => {
    this.props.dispatch(hideChat());
    events.fire('play-sound', 'select');
  }

  private showChat = () => {
    this.props.dispatch(showChat());
    events.fire('play-sound', 'select');
  }

  private fetchNewsPage = (page: number) => {
    this.props.dispatch(fetchPage(page));
    events.fire('play-sound', 'select');
  }

  private onPatcherAPIUpdate = () => {
    this.setState({});
  }

  private onLogIn = () => {
    setTimeout(() => this.setState({}), 500);
  }

}

export default connect(select)(PatcherApp);


          // <Animate animationEnter='slideInRight' animationLeave='slideOutRight'
          //   durationEnter={400} durationLeave={500}>
          //   {chat}
          // </Animate>
