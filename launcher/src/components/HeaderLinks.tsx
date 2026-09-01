/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import { Sound, playSound } from '../lib/Sound';
import { changeRoute, Product, Route } from '../redux/navigationSlice';
import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';

import UCELogo from '../images/uce/uce-logo.png';
import CULogoMetal from '../images/cu-logo-metal.png';
import CULogoWhite from '../images/unchained-entertainment-white-logo.png';

const Root = 'Header-Root';
const Logo = 'Header-Logo';
const Menu = 'Header-Menu';
const MenuItem = 'Header-Menu-Item';

interface LinkData {
  label: string;
  url: string;
}

interface HeaderData {
  hasPatchNotes: boolean;
  logos: string[];
  productLink: LinkData;
  storeLink?: LinkData;
  newsLink?: LinkData;
}

const uceHeader: HeaderData = {
  hasPatchNotes: false,
  logos: [UCELogo, ''],
  productLink: {
    label: 'Unchained Entertainment',
    url: 'https://www.unchained-entertainment.com/'
  }
};

const cuHeader: HeaderData = {
  hasPatchNotes: true,
  logos: [CULogoMetal, CULogoWhite],
  productLink: {
    label: 'CamelotUnchained.com',
    url: 'https://camelotunchained.com/'
  }
};

interface ReactProps {}

interface InjectedProps {
  product: Product;
  route: Route;
  accessToken: string | null;
}

type Props = ReactProps & InjectedProps;

class AHeaderLinks extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    const { route, accessToken } = this.props;
    const isLogin = accessToken === null;
    let data: HeaderData = this.getHeaderData();

    let headerMenuItems: JSX.Element[] = [];

    if (!isLogin) {
      // Home / Main
      headerMenuItems.push(
        <div
          className={`${MenuItem} ${route.type === 'main' ? 'active' : ''}`}
          onClick={this.internalLink.bind(this, { type: 'main' })}
        >
          Home
        </div>
      );

      // News

      if (data.newsLink) {
        headerMenuItems.push(
          <div className={MenuItem} onClick={this.externalLink.bind(this, data.newsLink.url)}>
            {data.newsLink.label} &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
          </div>
        );
      } else {
        headerMenuItems.push(
          <div
            className={`${MenuItem} ${route.type === 'news' ? 'active' : ''}`}
            onClick={this.internalLink.bind(this, { type: 'news' })}
          >
            News
          </div>
        );
      }

      // PatchNotes

      if (data.hasPatchNotes) {
        headerMenuItems.push(
          <div
            className={`${MenuItem} ${route.type === 'patch-notes' ? 'active' : ''}`}
            onClick={this.internalLink.bind(this, { type: 'patch-notes' })}
          >
            Patch Notes
          </div>
        );
      }
    }

    // Product webpage external link
    headerMenuItems.push(
      <div className={MenuItem} onClick={this.externalLink.bind(this, data.productLink.url)}>
        {data.productLink.label} &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
      </div>
    );

    // Product store webpage external link
    if (data.storeLink) {
      headerMenuItems.push(
        <div className={MenuItem} onClick={this.externalLink.bind(this, data.storeLink.url)}>
          {data.storeLink.label} &nbsp;<i className='fa fa-external-link' aria-hidden='true'></i>
        </div>
      );
    }

    return (
      <div className={Root}>
        {data.logos[0] && (
          <a className={Logo} onClick={this.externalLink.bind(this, data.productLink.url)}>
            <img src={data.logos[0]} />
          </a>
        )}
        <div className={Menu}>{headerMenuItems}</div>
        {data.logos[1] && (
          <a className={Logo} onClick={this.externalLink.bind(this, data.productLink.url)}>
            <img src={data.logos[1]} />
          </a>
        )}
      </div>
    );
  }

  private getHeaderData(): HeaderData {
    const { product, accessToken } = this.props;
    if (accessToken === null) {
      return cuHeader;
    }

    switch (product) {
      case Product.CamelotUnchained:
        return cuHeader;
      case Product.Tools:
      default:
        return uceHeader;
    }
  }

  private externalLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
      playSound(Sound.Select);
    }
  }

  private internalLink(route: Route): void {
    this.props.dispatch(changeRoute(route));
    playSound(Sound.Select);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { product, route } = state.navigation;
  const { accessToken } = state.login;
  return {
    ...ownProps,
    accessToken,
    product,
    route
  };
};

export const HeaderLinks = connect(mapStateToProps)(AHeaderLinks);
