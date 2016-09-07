/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 17:07:56
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 15:41:38
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
import News from '../News';
import Sound from '../Sound';
import Header from '../Header';
import WindowHeader from '../WindowHeader';

// Widgets
import Sidebar from '../../widgets/Sidebar';

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

  onRouteChanged = (route: Routes) => {
    this.props.dispatch(changeRoute(route));
    events.fire('play-sound', 'select');
  }

  hideChat = () => {
    this.props.dispatch(hideChat());
    events.fire('play-sound', 'select');
  }

  showChat = () => {
    this.props.dispatch(showChat());
    events.fire('play-sound', 'select');
  }

  fetchNewsPage = (page: number) => {
    this.props.dispatch(fetchPage(page));
    events.fire('play-sound', 'select');
  }

  onPatcherAPIUpdate = () => {
    this.setState({});
  }
  
  onLogIn = () => {
    setTimeout(() => this.setState({}), 500);
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    // fetch initial hero content and then every 30 minutes validate & fetch hero content.
    if (!this.props.heroContentState.isFetching) this.props.dispatch(fetchHeroContent());
    this.heroContentInterval = setInterval(() => {
      this.props.dispatch(validateHeroContent());
      if (!this.props.heroContentState.isFetching) this.props.dispatch(fetchHeroContent());
    }, 60000 * 30);
  }

  componentDidUnMount() {
    // unregister intervals
    clearInterval(this.heroContentInterval);
  }

  render() {
    let content: any = null;
    switch(this.props.currentRoute) {
      case Routes.HERO:
        content = (
          <div key='0'>
            <Hero isFetching={this.props.heroContentState.isFetching}
                  lastUpdated={this.props.heroContentState.lastFetchSuccess}
                  items={this.props.heroContentState.items} />
          </div>
        );
        break;
      case Routes.NEWS:
        content = (
          <div key='1'>
            <News news={this.props.newsState}
                  fetchPage={this.fetchNewsPage}/>
          </div>
        );
        break;
    }

    let chat: any = null;
    if (this.props.chatState.showChat) {
      chat = (
        <div id="chat-window" key='0'>
          <Chat hideChat={this.hideChat} loginToken={patcher.getLoginToken()} />
        </div>
      );
    }

    return (
      <div id={this.name}>
        <WindowHeader soundsState={this.props.soundsState}
          onMuteSounds={() => this.props.dispatch(this.props.soundsState.playSound ? muteSounds() : unMuteSounds())}
          onMuteMusic={() => this.props.dispatch(this.props.soundsState.playMusic ? muteMusic() : unMuteMusic())}/>
        <Header changeRoute={this.onRouteChanged} activeRoute={this.props.currentRoute} openChat={this.showChat} />
        <Sidebar onLogIn={this.onLogIn} />
        <div className='main-content'>
        <Animate animationEnter='fadeIn' animationLeave='fadeOut'
          durationEnter={400} durationLeave={500}>
          {content}
        </Animate>
        </div>
        <Animate animationEnter='slideInRight' animationLeave='slideOutRight'
          durationEnter={400} durationLeave={500}>
          {chat}
        </Animate>
        <Sound soundsState={this.props.soundsState} />
      </div>
    );
  }
};

export default connect(select)(PatcherApp);
