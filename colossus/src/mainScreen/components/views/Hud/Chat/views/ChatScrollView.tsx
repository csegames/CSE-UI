/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ChatLine } from './ChatLine';
import { useChat } from '../state/chat';
import { chat } from '@csegames/library/dist/_baseGame/chat/chat_proto';
import { RoomState, TabState } from '../../../../../redux/chatSlice';
import { TimedMessage } from '@csegames/library/dist/_baseGame/chat/CSEChat';
import { game } from '@csegames/library/dist/_baseGame';
import { RootState } from '../../../../../redux/store';
import { connect } from 'react-redux';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { AnnouncementType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { GameOptionIDs } from '../../../../../redux/gameOptionsSlice';

const ListViewContainer = 'Chat-Views-ChatScrollView-ListViewContainer';

const ScrollContainer = 'Chat-Views-ChatScrollView-ScrollContainer';

interface ReactProps {
  minLineHeight: number;
  tab: TabState;
}

interface InjectedProps {
  rooms: Dictionary<RoomState>;
  systemMessages: TimedMessage[];
  gameOptions: Dictionary<GameOption>;
  blockedList: Dictionary<number>;
}

type Props = ReactProps & InjectedProps;

interface State {
  show: boolean;
}

class AChatScrollView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: true
    };
  }

  private listRef = React.createRef<HTMLDivElement>();

  private timeoutHandle: number;
  private autoscrollTimeoutHandle: number;
  private eventHandles: ListenerHandle[] = [];

  render(): JSX.Element {
    const messages = this.getSortedMessages();
    return (
      <div
        className={ListViewContainer}
        style={{ opacity: this.state.show ? '1' : '0' }}
        ref={this.listRef}
        onScroll={this.onScrollEvent.bind(this)}
        onClick={this.onMouseEvent.bind(this)}
        onMouseMove={this.onMouseEvent.bind(this)}
      >
        <div className={ScrollContainer}>
          {messages.map((message: TimedMessage, index: number) => this.getChatLine(message, index))}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const chat = useChat(game);
    // When the user starts typing into Chat, we need to show this widget.
    this.eventHandles.push(game.onBeginChat(this.updateTimeout.bind(this, true)));
    // When a system message arrives, we need to show this widget.
    this.eventHandles.push(clientAPI.bindAnnouncementListener(this.onAnnouncement.bind(this)));
    // When a chat message arrives, we need to show this widget.
    this.eventHandles.push(chat.onChatMessage(this.updateTimeout.bind(this, true)));
  }

  componentWillUnmount() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    if (this.autoscrollTimeoutHandle) {
      clearTimeout(this.autoscrollTimeoutHandle);
      this.autoscrollTimeoutHandle = null;
    }

    this.eventHandles.forEach((h) => h.close());
  }

  private getChatLine(message: TimedMessage, index: number): JSX.Element {
    const optMuteTextChat = this.props.gameOptions[GameOptionIDs.MuteTextChat]?.value ?? false;
    const isAnnouncement = message.type === chat.ChatMessage.MessageTypes.Announcement;
    const isFromTextChatBlockedSender = !!this.props.blockedList[message.senderAccountID];

    if (isAnnouncement == false && (optMuteTextChat || isFromTextChatBlockedSender)) {
      return null;
    }

    return <ChatLine key={`${message.when.getTime()}__${index}`} message={message} />;
  }

  private getSortedMessages(): TimedMessage[] {
    let allMessages: TimedMessage[] = [];
    this.props.tab.filter.rooms.forEach((roomID) => {
      if (this.props.rooms[roomID]) {
        const { messages } = this.props.rooms[roomID];
        for (let i = 0; i < messages.length; ++i) {
          allMessages.push(messages.get(i));
        }
      }
    });

    if (this.props.tab.filter.system) {
      this.props.systemMessages.forEach((m) => allMessages.push(m));
    }

    // TODO: What about filter.local and filter.combat?  Are those in FSR, or only CU?

    allMessages = allMessages.sort((a, b) => a.when.getTime() - b.when.getTime());
    return allMessages;
  }

  private setVisible(isVisible: boolean): void {
    this.setState({
      show: isVisible
    });
  }

  private onAnnouncement(type: AnnouncementType) {
    if (type === AnnouncementType.Text) {
      this.updateTimeout(true);
    }
  }

  private updateTimeout(autoScroll: boolean): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    if (autoScroll) {
      // We delay this until the next frame in order to ensure that the widget ref is valid.
      this.autoscrollTimeoutHandle = window.setTimeout(this.performAutoscroll.bind(this), 1);
    }

    this.setVisible(true);

    // If nothing changes, we will hide this scrollview after 10 seconds.
    this.timeoutHandle = window.setTimeout(this.setVisible.bind(this, false), 10000);
  }

  private performAutoscroll() {
    if (this.listRef.current) {
      this.listRef.current.scrollTop = this.listRef.current.scrollHeight - this.listRef.current.clientHeight;
    }
  }

  private onMouseEvent(e: React.MouseEvent<HTMLDivElement>): void {
    // If the scroll view was already visible and we got a mouse event, refresh the timer to keep it visible for a bit longer.
    if (this.state.show) {
      this.updateTimeout(false);
    }
  }

  private onScrollEvent(e: React.UIEvent<HTMLDivElement>): void {
    // If the scroll view was already visible and we got a scroll event, refresh the timer to keep it visible for a bit longer.
    if (this.state.show) {
      this.updateTimeout(false);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  // mapStateToProps is called basically every frame, so avoid heavy calculations.
  return {
    ...ownProps,
    rooms: state.chat.rooms,
    systemMessages: state.chat.systemMessages,
    gameOptions: state.gameOptions.gameOptions,
    blockedList: state.localStorage.blockedList
  };
}

export const ChatScrollView = connect(mapStateToProps)(AChatScrollView);
