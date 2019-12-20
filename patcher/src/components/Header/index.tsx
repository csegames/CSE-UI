/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';

import { Routes } from '../../services/session/routes';
import { patcher } from '../../services/patcher';
import { usePatcherState, initEventsForBadBadHacks } from '../../services/session/patcherState';

export interface HeaderProps {
  changeRoute: (route: Routes) => void;
  openChat: () => void;
  activeRoute: Routes;
}

export function Header(props: HeaderProps) {

  const [state, dispatch] = usePatcherState();

  // lets init hackyness thing here, because why not.
  useEffect(() => {
    const handles = initEventsForBadBadHacks(dispatch);
    return () => handles.forEach(handle => handle.clear());
  }, [dispatch]);

  let logo = <img className='cse' src='images/cse/cse_logo.png' />;
  let logoLink = 'https://camelotunchained.com/v2/';
  if (state.loggedIn) {
    switch (state.selectedProduct) {
      case Product.CamelotUnchained:
        logo = <img src='images/cu_logo_metal.png' />;
        break;
      case Product.Colossus:
        logo = <img src='images/colossus/logo.png' />;
        logoLink = 'https://citystateentertainment.com/';
        break;
      default: break;
    }
  }

  const externalLink = (url: string) => {
    window.open(url, '_blank');
    game.trigger('play-sound', 'select');
  }

  const internalLink = (route: Routes) => {
    props.changeRoute(route);
  }

  return (
    <div className='Header'>
      <a
        className='Header__logo cu-logo'
        onClick={() => externalLink(logoLink)}>
        {logo}
      </a>
      <div className='Header__menu'>
        <div
          className={`Header__menu__item ${props.activeRoute === Routes.HERO ? 'active' : ''}`}
          onClick={() => internalLink(Routes.HERO)}>Home</div>
        <div
          className={`Header__menu__item ${props.activeRoute === Routes.NEWS ? 'active' : ''}`}
          onClick={() => internalLink(Routes.NEWS)}>News</div>
        <div className='Header__menu__item' onClick={() => externalLink('https://camelotunchained.com/')}>
            CamelotUnchained.com &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
        </div>
        <div className='Header__menu__item' onClick={() => externalLink('https://store.camelotunchained.com/')}>
            CSE Store &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
        </div>
        {state.chatEnabled && patcher.hasAccessToken() ?
          <div
            className={`Header__menu__item ${props.activeRoute === Routes.CHAT ? 'active' : ''}`}
            onClick={() => internalLink(Routes.CHAT)}>Chat</div> : null}
      </div>
    </div>
  );
}

export default Header;
