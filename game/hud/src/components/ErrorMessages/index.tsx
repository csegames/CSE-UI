/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ErrorMessagesProps {}

interface ErrorMessagesState {
  messages: string[];
}


class ErrorMessages extends React.Component<ErrorMessagesProps, ErrorMessagesState> {
  private eventHandles: EventHandle[] = [];
  private timeouts: NodeJS.Timer[] = [];

  public state = {
    messages: [] as string[],
  };

  public render() {
    return (
      <ul id='messages'>
        {this.state.messages.map((message, index) => (
          <li className='message' key={index}>{message}</li>
        ))}
      </ul>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.onCombatEvent((events: CombatEvent[]) => {
      const messages = events.reduce((errors: string[], event) => {
        if (event.errors) {
          return errors.concat(event.errors.map(item => item.msg));
        }
        return errors;
      }, [] as string[]);
      this.setState((prevState: ErrorMessagesState) => ({
        messages: messages.concat(prevState.messages),
      }));
      this.timeouts.push(setTimeout(() => {
        this.setState((prevState: ErrorMessagesState) => {
          const nextMessages = [].concat(prevState.messages);
          for (let i = 0; i < messages.length; i++) {
            nextMessages.pop();
          }
          return {
            messages: nextMessages,
          };
        });
      }, 3000));
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }
}

export default ErrorMessages;
