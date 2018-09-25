/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import RoomId from './RoomId';
import ChatRoomInfo, { ChatRoomInfoMessage } from './ChatRoomInfo';
import ChatLine from './ChatLine';

export class ChatTextState {
}

export interface ChatTextProps {
  room: ChatRoomInfo;
}

const AUTOSCROLL_FUZZYNESS: number = 12;

class ChatText extends React.Component<ChatTextProps, ChatTextState> {
  public SCROLLBACK_PAGESIZE: number = 50;
  public autoScroll: boolean = true;
  public lazyLoadTop: HTMLElement = null;
  public currentRoom: RoomId;
  constructor(props: ChatTextProps) {
    super(props);
    this.state = new ChatTextState();
    this.handleScroll = this.handleScroll.bind(this);
    this.handleAutoScroll = this.handleAutoScroll.bind(this);
  }

  public autoScrollToBottom = (): void => {
    const chatBox: HTMLHtmlElement = this.refs['chatbox'] as HTMLHtmlElement;
    if (this.autoScroll && chatBox.lastElementChild) {
      chatBox.scrollTop = (chatBox.scrollHeight - chatBox.offsetHeight);
    }
  }

  public componentDidUpdate() {
    this.autoScrollToBottom();
    if (this.lazyLoadTop) {
      // after a lazy load, reposition the element that was at the top
      // back at the top
      this.lazyLoadTop.scrollIntoView(true);
      this.lazyLoadTop = undefined;
    }
  }

  public componentDidMount() {
    this.autoScrollToBottom();
    this.registerEvents();
  }

  public componentWillUnmount() {
    this.unregisterEvents();
  }

  public render() {
    const room: ChatRoomInfo = this.props.room;
    let messages: ChatRoomInfoMessage[];
    let lazy: JSX.Element = undefined;
    if (room) {
      if (!this.currentRoom || !room.roomId.same(this.currentRoom)) {
        this.newRoom();
      }
      if (room.scrollback > 0) {
        lazy = <div ref='lazyload' className='chat-lazyload' style={{ height: (room.scrollback * 1.7) + 'em' }}></div>;
      }
      if (room.messages) {
        messages = room.messages.slice(room.scrollback);
      }
    }
    return (
      <div ref='chatbox' className='chat-text allow-select-text'>
      {lazy}
      {messages && messages.map((msg, i) => {
        return <ChatLine key={i} message={msg.message} />;
      })}
      </div>
    );
  }

  private registerEvents = () => {
    const el: HTMLDivElement = this.refs['chatbox'] as HTMLDivElement;
    el.addEventListener('scroll', this.handleScroll);
    el.addEventListener('auto-scroll', this.handleAutoScroll);
  }

  private unregisterEvents = () => {
    const el: HTMLElement = this.refs['chatbox'] as HTMLElement;
    el.removeEventListener('scroll', this.handleScroll);
    el.removeEventListener('auto-scroll', this.handleAutoScroll);
  }

  private handleScroll = (e: MouseEvent) => {
    // auto-scroll is enabled when the scroll bar is at or very near the bottom
    const chatBox: HTMLDivElement = this.refs['chatbox'] as HTMLDivElement;
    this.autoScroll = chatBox.scrollHeight - (chatBox.scrollTop + chatBox.offsetHeight) < AUTOSCROLL_FUZZYNESS;

    // if lazy loading is active, and we have scrolled up to where the lazy loaded
    // content should be then lazy load the next page of content
    const lazy: HTMLDivElement = this.refs['lazyload'] as HTMLDivElement;
    if (lazy) {
      if (chatBox.scrollTop < lazy.offsetHeight) {
        this.lazyLoadTop = lazy.nextElementSibling as HTMLElement;
        this.props.room.nextScrollbackPage();
        this.forceUpdate();
      }
    }
  }

  private handleAutoScroll = () => {
    this.autoScrollToBottom();
  }

  private newRoom = (): void => {
    this.currentRoom = this.props.room.roomId;
    this.autoScroll = true;
  }
}

export default ChatText;
