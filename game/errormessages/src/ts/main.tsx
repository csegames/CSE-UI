/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events} from 'camelot-unchained'
import * as React from 'react';
import * as ReactDom from 'react-dom';

interface ErrorMessageAppProps { }

class ErrorMessagesAppState {
  public items: Array<string>;

  constructor() {
    this.items = new Array<string>();
  }
}

class ErrorMessagesApp extends React.Component<ErrorMessageAppProps, ErrorMessagesAppState> {
  constructor(props: any) {
    super(props);

    this.state = new ErrorMessagesAppState();

    this.init = this.init.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
    events.on('init', this.init);
  }

  init() {
    client.OnAbilityError((message: any) => {
      const newErrorMessage = this.getMessageText(parseInt(message));

      if (!newErrorMessage) {
        return;
      }

      //add the new error to the top of the array
      let nextItems = new Array<string>(newErrorMessage).concat(this.state.items);
      this.setState({ items: nextItems });

      setTimeout(this.removeMessage, 3000);
    });
  }

  removeMessage() {
    //remove the bottom item from the array
    if (0 == this.state.items.length) {
      return;
    }

    let nextItems = this.state.items;
    let startIndex = nextItems.length - 1;
    nextItems.splice(startIndex, 1);
    this.setState({ items: nextItems });
  }

  getMessageText(mId: number): string {
    switch (mId) {
      case 1: return 'Your target is out of range.';
      case 2: return 'Your target is invalid.';
      case 3: return 'Your target is not in line of sight.';
      case 4: return 'That ability is still on cooldown.';
      case 5: return 'You don\'t have a target.';
      case 6: return 'You were interrupted!';
      case 7: return 'You do not have enough stamina.';
      case 8: return 'You aren\'t in the right stance.';
      default: return '';
    }
  }

  getMessageNodes(message: string, index: number) {
    return (
      <li className='message' key={index}>{message}</li>
      );
  }

  render() {
    return (
      <ul id='messages'>
        {this.state.items.map(this.getMessageNodes)}
      </ul>
    );
  }
}

ReactDom.render(<ErrorMessagesApp />, document.getElementById('content'));


