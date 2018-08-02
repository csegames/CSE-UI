/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events } from '../../../';

import ChatSession from './ChatSession';
import { chatState } from './ChatState';
import AtUserList from './AtUserList';
import { ChatRoomInfoUser } from './ChatRoomInfo';

export interface ChatInputState {
  atUsers: string[];
  atUsersIndex: number;
  expanded: boolean;
}

export interface ChatInputProps {
  label: string;
  send: (text: string) => void;
  slashCommand: (command: string) => void;
  scroll: (extra?:number) => void;
}

class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
  private _privateMessageHandler: any;
  private tabUserList: string[] = [];
  private tabUserIndex: number = null;
  private sentMessages: string[] = [];
  private sentMessageIndex: number = null;
  constructor(props: ChatInputProps) {
    super(props);
    this.state = this.initialState();
    this._privateMessageHandler = events.on('cse-chat-private-message', (name: string) => {
      this.privateMessage(name);
    });
  }

  public initialState(): ChatInputState {
    return {
      atUsers: [],
      atUsersIndex: 0,
      expanded: false,
    };
  }

  public componentDidMount() {
    if (client.OnBeginChat) {
      client.OnBeginChat((cmdKind: number, text: string) => {
        this.getInputNode().focus();
        this.getInputNode().value = text;
      });
    }
  }

  public componentWillUnmount() {
    if (this._privateMessageHandler) {
      events.off(this._privateMessageHandler);
    }
  }

  public render() {
    const inputClass: string[] = [
      'chat-input',
      'input-field',
      'chat-' + (this.state.expanded ? 'expanded' : 'normal'),
    ];
    return (
      <div className={inputClass.join(' ')}>
        <AtUserList users={this.state.atUsers} selectedIndex={this.state.atUsersIndex} selectUser={this.selectAtUser}/>
        <textarea className='materialize-textarea'
                  id='chat-text'
                  ref='new-text'
                  placeholder='Say something!'
                  onBlur={() => client.ReleaseInputOwnership()}
                  onClick={() => client.RequestInputOwnership()}
                  onKeyDown={this.keyDown}
                  onKeyUp={this.keyUp}
                  onChange={this.parseInput}>
        </textarea>
      </div>
    );
  }

  private selectAtUser = (user: string) => {
    const input: HTMLInputElement = this.getInputNode();
    const lastWord: RegExpMatchArray = input.value.match(/@([\S]*)$/);
    input.value = input.value.substring(0, lastWord.index + 1) + user + ' ';
    input.focus();
    this.setState({ atUsers: [], atUsersIndex: 0 });
  }

  private getInputNode = (): HTMLInputElement => {
    return this.refs['new-text'] as HTMLInputElement;
  }

  private keyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    // current input field value
    const textArea: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
    const value: string = textArea.value;

    // Complete username on tab key (9 = tab)
    if (e.keyCode === 9) {
      e.preventDefault();
      if (!this.tabUserList.length) {
        const chat: ChatSession = chatState.get('chat');
        const lastWord: string = value.match(/\b([\S]+)$/)[1];
        const endChar: string = lastWord === value ? ': ' : ' ';
        const matchingUsers: string[] = [];
        chat.getRoom(chat.currentRoom).users.forEach((u: ChatRoomInfoUser) => {
          if (u.info.name.substring(0, lastWord.length) === lastWord) {
            matchingUsers.push(u.info.name);
          }
        });
        if (matchingUsers.length) {
          this.tabUserList = matchingUsers;
          this.tabUserIndex = 0;
          textArea.value += matchingUsers[0].substring(lastWord.length) + endChar;
          this.setState({ atUsers: [], atUsersIndex: 0 });
        }
      } else {
        const oldTabIndex: number = this.tabUserIndex;
        const newTabIndex: number = oldTabIndex + 1 > this.tabUserList.length - 1 ? 0 : oldTabIndex + 1;
        const endChar: string = value.slice(-2) === ': ' ? ': ' : ' ';
        textArea.value = value.replace(new RegExp(this.tabUserList[oldTabIndex] + ':? $'),
          this.tabUserList[newTabIndex]) + endChar;
        this.tabUserIndex = newTabIndex;
        this.setState({ atUsers: [], atUsersIndex: 0 });
      }
    } else {
      this.tabUserList = [];
      this.tabUserIndex = null;
    }

    // Handle up-arrow (38)
    if (e.keyCode === 38) {
      e.preventDefault();
      if (this.state.atUsers.length > 0) {
        // If list of @users is displayed, arrow keys should navigate that list
        const newIndex: number = this.state.atUsersIndex - 1 === -1 ?
          this.state.atUsers.length - 1 : this.state.atUsersIndex - 1;
        this.setState({ atUsers: this.state.atUsers, atUsersIndex: newIndex  });
      } else {
        // No lists are visible, arrow keys should navigate sent message history
        if (this.sentMessages.length > 0) {
          if (this.sentMessageIndex === null) {
            this.sentMessageIndex = this.sentMessages.length - 1;
          } else {
            this.sentMessageIndex = this.sentMessageIndex - 1 === -1 ? 0 : this.sentMessageIndex - 1;
          }
          textArea.value = this.sentMessages[this.sentMessageIndex];
        }
      }
    }

    // Handle down-arrow (40)
    if (e.keyCode === 40) {
      e.preventDefault();
      if (this.state.atUsers.length > 0) {
        // If list of @users is displayed, arrow keys should navigate that list
        const newIndex: number = this.state.atUsersIndex + 1 > this.state.atUsers.length - 1 ?
          0 : this.state.atUsersIndex + 1;
        this.setState({ atUsers: this.state.atUsers, atUsersIndex: newIndex });
      } else {
        // No lists are visible, arrow keys should navigate sent message history
        if (this.sentMessageIndex !== null) {
          this.sentMessageIndex = this.sentMessageIndex + 1 > this.sentMessages.length - 1 ?
            null : this.sentMessageIndex + 1;
        }
        textArea.value = this.sentMessageIndex ? this.sentMessages[this.sentMessageIndex] : '';
      }
    }

    // Send message on enter key (13 = enter)
    if (e.keyCode === 13) {
      if (e.shiftKey) {
        // Shift+ENTER = insert ENTER into text, and expand text area
        this.expand(e.target as HTMLTextAreaElement);
      } else if (!e.ctrlKey && !e.altKey) {
        // just ENTER
        e.preventDefault();
        if (this.state.atUsers.length > 0) {
          // complete @name expansion
          this.selectAtUser(this.state.atUsers[this.state.atUsersIndex]);
        } else {
          // Send message on enter key (13)
          this.send();
          this.collapse();
          this.getInputNode().blur();
        }
      }
    }
  }

  private keyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>): void  => {
    const textArea: HTMLTextAreaElement = e.target as HTMLTextAreaElement;

    // if user deletes all the content, shrink the input area again
    const value: string = textArea.value;
    if (value.length === 0) {
      this.collapse();
    }

    // if the user types a line that wraps and causes the text area to
    // scroll and we are not currently expanded, then expand.
    if (textArea.scrollHeight > textArea.offsetHeight && !this.state.expanded) {
      this.expand(textArea);
    }
  }

  private parseInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const textArea: HTMLTextAreaElement = e.target as HTMLTextAreaElement;

    // Handle @name completion
    const lastWord: RegExpMatchArray = textArea.value.match(/(?:^|\s)@([\S]*)$/);
    const userList: string[] = [];
    const userFilter: string = lastWord && lastWord[1] ? lastWord[1] : '';
    if (lastWord) {
      const chat: ChatSession = chatState.get('chat');
      chat.getRoom(chat.currentRoom).users.forEach((u: ChatRoomInfoUser) => {
        if (userFilter.length === 0 || u.info.name.toLowerCase().indexOf(userFilter.toLowerCase()) !== -1) {
          userList.push(u.info.name);
        }
      });
      userList.sort();
    }
    this.setState({ atUsers: userList, atUsersIndex: this.state.atUsersIndex });
  }

  private expand = (input: HTMLTextAreaElement): void => {
    if (!this.state.expanded) {
      const was: number = input.offsetHeight;
      this.setState({ expanded: true });
      setTimeout(() => {
        // pass height of growth of input area as extra consideration for scroll logic
        this.props.scroll(input.offsetHeight - was);
      }, 100);     // queue it?
    }
  }

  private collapse = (): void => {
    this.setState({ expanded: false });
  }

  private send = (): void => {
    const input: HTMLInputElement = this.getInputNode();
    let value: string = input.value;
    // remove leading space (not newline) and trailing white space
    while (value[0] === ' ') value = value.substr(1);
    while (value[value.length - 1] === '\n') value = value.substr(0, value.length - 1);
    if (value[0] !== '/' || !this.props.slashCommand(value.substr(1))) {
      // not a recognised / command, send it
      this.props.send(value);
    }

    // add message to temporary history
    this.sentMessageIndex = null;
    if (value) {
      this.sentMessages.push(value);
      if (this.sentMessages.length > 25) this.sentMessages.shift();
    }

    // reset input field after sending message
    input.value = '';
    input.focus();
  }

  private privateMessage = (name: string) : void => {
    const input: HTMLInputElement = this.getInputNode();
    input.value = '/w ' + name + ' ';
    input.focus();
  }
  
}

export default ChatInput;
