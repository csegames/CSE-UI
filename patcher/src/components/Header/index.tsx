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

  let logo: JSX.Element = null;
  let logoUrl = '';

  if (state.loggedIn) {
    switch (state.selectedProduct) {
      case Product.CamelotUnchained:
      case Product.Cube:
        logo = <img src='images/cu_logo_metal.png' />;
        logoUrl = 'https://camelotunchained.com/';
        break;
      case Product.Colossus:
        logo = <img src='images/colossus/logo-ragnarok.png' />;
        logoUrl = ''; //TODO: Add FSR url here once it has one
        break;
      case Product.Tools:
        logo = <img className='cse' src='images/cse/cse-logo.png' />;
        logoUrl = 'https://citystateentertainment.com/';
        break;
      default:
        break;
    }
  } else {
    // login screen
    logo = <img className='cse' src='images/cse/cse-logo.png' />;
    logoUrl = 'https://citystateentertainment.com/';
  }

  const externalLink = (url: string) => {
    window.open(url, '_blank');
    game.trigger('play-sound', 'select');
  }

  const internalLink = (route: Routes) => {
    props.changeRoute(route);
  }

  var logoElement: JSX.Element = null;
  if (logo != null) {
    if (logoUrl.length > 0) {
      logoElement = <a className='Header__logo cu-logo' onClick={() => externalLink(logoUrl)}>{logo}</a>;
    } else {
      logoElement = <span className='Header__logo cu-logo'>{logo}</span>;
    }
  }

  return (
    <div className='Header'>
      {logoElement}
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
