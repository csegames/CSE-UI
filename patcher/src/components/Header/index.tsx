/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';

import { Routes } from '../../services/session/routes';
import { patcher } from '../../services/patcher';

export interface HeaderProps {
  changeRoute: (route: Routes) => void;
  openChat: () => void;
  activeRoute: Routes;
}

class Header extends React.Component<HeaderProps, {}> {

  public name = 'cse-patcher-header';

  public render() {
    return (
      <div className='Header'>
        <a
          className='Header__logo cu-logo'
          onClick={() => this.externalLink('http://camelotunchained.com/v2/')}>
          <img src='images/cu_logo_metal.png' />
        </a>
        <div className='Header__menu'>
          <div
            className={`Header__menu__item ${this.props.activeRoute === Routes.HERO ? 'active' : ''}`}
            onClick={() => this.internalLink(Routes.HERO)}>Home</div>
          <div
            className={`Header__menu__item ${this.props.activeRoute === Routes.NEWS ? 'active' : ''}`}
            onClick={() => this.internalLink(Routes.NEWS)}>News</div>
          <div className='Header__menu__item' onClick={() => this.externalLink('https://camelotunchained.com/')}>
              CamelotUnchained.com &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
          </div>
          <div className='Header__menu__item' onClick={() => this.externalLink('https://store.camelotunchained.com/')}>
              CSE Store &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
          </div>
          {patcher.hasLoginToken() ?
            <div
              className={`Header__menu__item ${this.props.activeRoute === Routes.CHAT ? 'active' : ''}`}
              onClick={() => this.internalLink(Routes.CHAT)}>Chat</div> : null}
        </div>
      </div>
    );
  }

  private externalLink = (url: string) => {
    window.open(url, '_blank');
    events.fire('play-sound', 'select');
  }
  
  private internalLink = (route: Routes) => {
    this.props.changeRoute(route);
  }
}

export default Header;
