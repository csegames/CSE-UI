/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, restAPI} from 'camelot-unchained';
import {Promise} from 'es6-promise';
import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export interface MotdState {
  message: string;
}

export interface MotdProps {}

export interface MotdData {
  id: string;
  message: string;
  duration: number;
}

class Motd extends React.Component<MotdProps, MotdState> {

  private fadeTime: number = 500;

  constructor(props: MotdProps) {
    super(props);
  }

  closeWindow(): void {
    client.CloseUI('motd');
  }

  onMessage = (data: MotdData) => {
    if (data.message == '')
      return;

    this.setState({ message: data.message });
    var timeout = data.duration * 1000;
    setTimeout(() => { this.setState({ message: '' }); }, timeout);
    setTimeout(() => { this.closeWindow(); }, timeout + this.fadeTime);
  }

  onMessageFailed = (error: any) => {
    console.log(error);
    this.setState({ message: '' });
  }

  componentWillMount() {
    this.setState({ message: '' });
    restAPI.getMessageOfTheDay().then(this.onMessage, this.onMessageFailed);
  }

  render() {
    let messageContent: any;
    if (this.state.message) {
      messageContent = (
        <div className="alert">
          <span className='close' onMouseDown={this.closeWindow.bind(this)}></span>
          <div className='body subhead2'>Message of the Day</div>
          {this.state.message}
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName='message' transitionEnterTimeout={this.fadeTime} transitionLeaveTimeout={this.fadeTime}>
        {messageContent}
      </ReactCSSTransitionGroup>
    );
  }
};

export default Motd
