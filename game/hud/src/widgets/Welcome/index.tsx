/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events, webAPI, legacyAPI} from 'camelot-unchained';
import * as React from 'react';

export interface WelcomeProps {
  setVisibility: (vis: boolean) => void;
};

export interface WelcomeState {
  message: JSX.Element[];
};

export interface WelcomeData {
  id: string;
  message: string;
  duration: number;
}

declare const cuAPI: any;

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  public name: string = 'Welcome';

  constructor(props: WelcomeProps) {
    super(props);

    const defaultMessage: JSX.Element[] = [<div key='0'>Welcome to Camelot Unchained! Loading welcome message...</div>];
    this.state = {
      message: defaultMessage
    };
  }

  onMessage = (data: WelcomeData) => {
    if (data.message == '') return;
    const welcomeMessage: JSX.Element = <div key='100' dangerouslySetInnerHTML={{__html: data.message}} />;
    this.setState({ message: welcomeMessage } as any);
  }

  onMessageFailed = (error: any) => {
    //**TODO: Proper logging?
    console.log(error);
  }

  hide = (): void => {
    this.props.setVisibility(false);
  }

  hideDelay = (): void => {
    this.hide();
    const hideDelayStart: Date = new Date();
    localStorage.setItem('cse-welcome-hide-start', JSON.stringify(hideDelayStart));
  }

  componentWillMount() {
    webAPI.ContentAPI.messageOfTheDayV1().then((response) => {
      if (response.ok) {
        this.onMessage(response.data);
        return;
      }
      this.onMessageFailed(response.problem);
    });
  }

  render() {
    return (
      <div className='frame cu-window cu-window-transparent Welcome'>
        <div className="cu-window-header"><div className="cu-window-title Welcome__title">Welcome to Camelot Unchained</div></div>
        <div className="cu-window-content">
          {this.state.message}
          <div className='Welcome__btnBar'>
            <a className='Welcome__btnBar__dismiss' onClick={this.hide}>Dismiss</a>
            <a className='Welcome__btnBar__dismiss-delay' onClick={this.hideDelay}>Dismiss For 24h</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
