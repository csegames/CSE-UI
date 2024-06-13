/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDHorizontalAnchor, HUDLayer, HUDVerticalAnchor, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import { ChatRoomData, readRoom, sendToRoom } from '../../redux/chatSlice';
import { chatGlobalRoomID } from '../../dataSources/chatService';
import { ChatMessage } from './ChatMessage';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

const Root = 'HUD-Chat-Root';
const Navigation = 'HUD-Chat-Navigation';
const Room = 'HUD-Chat-Room';
const CurrentRoom = 'HUD-Chat-CurrentRoom';
const RoomName = 'HUD-Chat-RoomName';
const RoomUnreadCount = 'HUD-Chat-RoomUnreadCount';
const Content = 'HUD-Chat-Content';
const Messages = 'HUD-Chat-Messages';
const InputContainer = 'HUD-Chat-InputContainer';
const Form = 'HUD-Chat-Form';
const Input = 'HUD-Chat-Input';
const Scroller = 'Scroller-ThumbOnly';

interface ReactProps {}

interface InjectedProps {
  rooms: ChatRoomData[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  currentRoomID: string;
  inputValue: string;
  sentHistory: string[];
  historyIndex: number;
}

class AChat extends React.Component<Props, State> {
  private messagesRef: React.RefObject<HTMLDivElement> = React.createRef();
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private chatHandle: ListenerHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentRoomID: chatGlobalRoomID,
      inputValue: '',
      sentHistory: [],
      historyIndex: -1
    };
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        <div className={Navigation}>
          {this.props.rooms.map((room) => {
            const isCurrentRoom = room.id === this.state.currentRoomID;
            const selectRoom = (): void => {
              this.setState({ currentRoomID: room.id });
            };
            const unreadCount = room.messages.filter((message) => !message.isSeen).length;
            return (
              <div
                onClick={isCurrentRoom ? undefined : selectRoom.bind(this)}
                className={isCurrentRoom ? `${Room} ${CurrentRoom}` : Room}
                key={room.id}
              >
                <span className={RoomName}>{room.id}</span>
                {unreadCount > 0 && <span className={RoomUnreadCount}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </div>
            );
          })}
        </div>
        <div className={Content}>
          <div className={`${Messages} ${Scroller}`} ref={this.messagesRef}>
            {this.getCurrentRoom()?.messages?.map?.((message, messageIndex) => (
              <ChatMessage message={message} key={`${this.state.currentRoomID}-${messageIndex}`} />
            ))}
          </div>
          <div className={InputContainer}>
            <form className={Form} onSubmit={this.handleFormSubmit.bind(this)}>
              <input
                className={Input}
                type='text'
                value={this.state.inputValue}
                onKeyDown={this.handleInputKeydown.bind(this)}
                onChange={this.handleInputValueChange.bind(this)}
                placeholder='Say something!'
                ref={this.inputRef}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.chatHandle = game.onBeginChat(this.focusInput.bind(this));
  }

  componentWillUnmount(): void {
    if (this.chatHandle) {
      this.chatHandle.close();
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (
      this.state.currentRoomID !== prevState.currentRoomID ||
      this.getCurrentRoom()?.messages?.some?.((message) => !message.isSeen)
    ) {
      this.messagesRef.current.scrollTop =
        this.messagesRef.current.scrollHeight - this.messagesRef.current.offsetHeight;
      this.props.dispatch(readRoom(this.state.currentRoomID));
    }
  }

  getCurrentRoom(): ChatRoomData | null {
    return this.props.rooms.find((room) => room.id === this.state.currentRoomID) ?? null;
  }

  handleInputKeydown(e: KeyboardEvent): void {
    switch (e.keyCode) {
      // Up arrow
      case 38: {
        this.navigateHistory(1);
        break;
      }
      // Down arrow
      case 40: {
        this.navigateHistory(-1);
        break;
      }
    }
  }

  handleInputValueChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.setState({ inputValue: target.value });
  }

  handleFormSubmit(e: Event): void {
    e.preventDefault();
    if (this.state.inputValue.startsWith('/')) {
      this.sendSlashCommand();
    } else {
      this.sendMessage();
    }
    this.setState({
      sentHistory: [this.state.inputValue, ...this.state.sentHistory],
      inputValue: '',
      historyIndex: -1
    });
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  navigateHistory(offset: number): void {
    const historyIndex = Math.max(Math.min(this.state.historyIndex + offset, this.state.sentHistory.length - 1), -1);
    const inputValue = this.state.sentHistory[historyIndex] ?? '';
    this.setState({ historyIndex, inputValue });
  }

  sendSlashCommand(): void {
    game.sendSlashCommand(this.state.inputValue.substring(1));
  }

  sendMessage(): void {
    this.props.dispatch(
      sendToRoom({
        contents: this.state.inputValue,
        roomID: this.state.currentRoomID
      })
    );
  }

  focusInput(inputValue: string): void {
    if (this.inputRef.current) {
      this.setState({ inputValue });
      this.inputRef.current.focus();
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    rooms: state.chat.rooms
  };
};

const Chat = connect(mapStateToProps)(AChat);

export const WIDGET_NAME_GAME_MENU = 'Chat';
export const chatRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_GAME_MENU,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Bottom,
    xOffset: 0,
    yOffset: 20
  },
  layer: HUDLayer.HUD,
  render: () => {
    return <Chat />;
  }
};
