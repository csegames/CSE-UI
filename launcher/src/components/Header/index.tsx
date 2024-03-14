/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import { Routes } from '../../services/session/routes';
import { Sound, playSound } from '../../lib/Sound';
import { ContentPhase } from '../../services/ContentPhase';

interface HeaderLink {
  label: string;
  url: string;
  logo: string;
}

const CSELink: HeaderLink = {
  label: 'City State Entertainment',
  url: 'https://citystateentertainment.com/',
  logo: 'images/cse/cse-logo.png'
};

const CULink: HeaderLink = {
  label: 'CamelotUnchained.com',
  url: 'https://camelotunchained.com/',
  logo: 'images/cu_logo_metal.png'
};

const CUStoreLink: HeaderLink = {
  label: 'CU Store',
  url: 'https://store.camelotunchained.com/',
  logo: ''
};

const FSRLink: HeaderLink = {
  label: 'FinalStandGame.com',
  url: 'https://finalstandgame.com/',
  logo: 'images/colossus/logo-ragnarok.png'
};

const FSRStoreLink: HeaderLink = {
  label: 'FSR Store',
  url: 'https://store.camelotunchained.com/?campaign=fsr',
  logo: ''
};

const FSRNewsLink: HeaderLink = {
  label: 'News',
  url: 'https://finalstandgame.com/news/',
  logo: ''
};

export interface HeaderProps {
  changeRoute: (route: Routes) => void;
  phase: ContentPhase;
  activeRoute: Routes;
}

export function Header(props: HeaderProps) {
  let logo: JSX.Element = null;
  let productLink: HeaderLink = null;
  let storeLink: HeaderLink = null;
  let newsLink: HeaderLink = null;

  switch (props.phase) {
    case ContentPhase.Camelot:
    case ContentPhase.Cube:
      logo = <img src={CULink.logo} />;
      productLink = CULink;
      storeLink = CUStoreLink;
      break;
    case ContentPhase.Colossus:
      logo = <img src={FSRLink.logo} />;
      productLink = FSRLink;
      storeLink = FSRStoreLink;
      newsLink = FSRNewsLink;
      break;
    case ContentPhase.Login:
    case ContentPhase.Tools:
      logo = <img className='cse' src={CSELink.logo} />;
      productLink = CSELink;
      break;
  }

  const externalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
      playSound(Sound.Select);
    }
  };

  const internalLink = (route: Routes) => {
    props.changeRoute(route);
  };

  var logoElement: JSX.Element = null;
  if (logo != null) {
    if (productLink.url.length > 0) {
      logoElement = (
        <a className='Header__logo cu-logo' onClick={() => externalLink(productLink.url)}>
          {logo}
        </a>
      );
    } else {
      logoElement = <span className='Header__logo cu-logo'>{logo}</span>;
    }
  }

  let headerMenuItems: JSX.Element[] = [
    <div
      className={`Header__menu__item ${props.activeRoute === Routes.HERO ? 'active' : ''}`}
      onClick={() => internalLink(Routes.HERO)}
    >
      Home
    </div>
  ];

  // News link (internal)
  if (props.phase !== ContentPhase.Login) {
    if (newsLink && newsLink.url) {
      headerMenuItems.push(
        <div className='Header__menu__item' onClick={() => externalLink(newsLink.url)}>
          {newsLink.label} &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
        </div>
      );
    } else {
      headerMenuItems.push(
        <div
          className={`Header__menu__item ${props.activeRoute === Routes.NEWS ? 'active' : ''}`}
          onClick={() => internalLink(Routes.NEWS)}
        >
          News
        </div>
      );
    }
  }

  // Product webpage external link
  headerMenuItems.push(
    <div className='Header__menu__item' onClick={() => externalLink(productLink.url)}>
      {productLink.label} &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
    </div>
  );

  // Product store webpage external link
  if (storeLink && storeLink.url) {
    headerMenuItems.push(
      <div className='Header__menu__item' onClick={() => externalLink(storeLink.url)}>
        {storeLink.label} &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
      </div>
    );
  }

  return (
    <div className='Header'>
      {logoElement}
      <div className='Header__menu'>{headerMenuItems}</div>
    </div>
  );
}

export default Header;
