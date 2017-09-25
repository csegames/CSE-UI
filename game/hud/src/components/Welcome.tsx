/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { webAPI, utils } from 'camelot-unchained';
import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

export interface WelcomeStyles extends StyleDeclaration {
  Welcome: React.CSSProperties;
  welcomeHeader: React.CSSProperties;
  welcomeContent: React.CSSProperties;
  welcomeFooter: React.CSSProperties;
  dismissButton: React.CSSProperties;
  close: React.CSSProperties;
}

export const defaultWelcomeStyles: WelcomeStyles = {
  Welcome: {
    pointerEvents: 'all',
    userSelect: 'none',
    webkitUserSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '450px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    border: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  welcomeHeader: {
    width: '100%',
    padding: '5px 0',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#202020',
    borderBottom: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  welcomeContent: {
    flex: 1,
    color: 'white',
    padding: '5px',
    overflow: 'auto',
  },

  welcomeFooter: {
    padding: '5px 0',
    backgroundColor: '#202020',
    textAlign: 'center',
    borderTop: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  dismissButton: {
    cursor: 'pointer',
  },

  close: {
    position: 'fixed',
    top: 2,
    right: 5,
    color: '#cdcdcd',
    fontSize: '20px',
    marginRight: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },
};

export interface WelcomeProps {
  styles?: Partial<WelcomeStyles>;
  setVisibility: (vis: boolean) => void;
}

export interface WelcomeState {
  message: JSX.Element[];
}

export interface WelcomeData {
  id: string;
  message: string;
  duration: number;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  public name: string = 'Welcome';

  constructor(props: WelcomeProps) {
    super(props);
    const defaultMessage: JSX.Element[] = [<div key='0'>Welcome to Camelot Unchained! Loading welcome message...</div>];
    this.state = {
      message: defaultMessage,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultWelcomeStyles);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.Welcome, custom.Welcome)}>
        <div className={css(ss.welcomeHeader, custom.welcomeHeader)}>
          <div className=''>Welcome to Camelot Unchained</div>
          <div className={css(ss.close, custom.close)} onClick={this.hide}>
            <i className='fa fa-times click-effect'></i>
          </div>
        </div>
        <div className={css(ss.welcomeContent, custom.welcomeContent)}>
          {this.state.message}
        </div>
        <div className={css(ss.welcomeFooter, custom.welcomeFooter)}>
          <a className={css(ss.dismissButton, custom.dismissButton)} onClick={this.hideDelay}>Dismiss For 24h</a>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.getMessageOfTheDay();
  }

  private async getMessageOfTheDay() {
    try {
      const res = await webAPI.ContentAPI.MessageOfTheDayV1(webAPI.defaultConfig);
      if (res.ok) {
        const data = JSON.parse(res.data);
        this.onMessage(data);
      }
    } catch (err) {
      webAPI.handleWebAPIError(err);
    }
  }

  private onMessage = (data: WelcomeData) => {
    if (data.message === '') return;
    const welcomeMessage: JSX.Element = <div key='100' dangerouslySetInnerHTML={{ __html: data.message }} />;
    this.setState({ message: welcomeMessage } as any);
  }

  private hide = (): void => {
    this.props.setVisibility(false);
  }

  private hideDelay = (): void => {
    this.hide();
    const hideDelayStart: Date = new Date();
    localStorage.setItem('cse-welcome-hide-start', JSON.stringify(hideDelayStart));
  }
}

export default Welcome;
