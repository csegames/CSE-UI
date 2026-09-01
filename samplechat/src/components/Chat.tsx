import * as React from 'react';
import { ChatService } from '@csegames/library/dist/chat/ChatService';
import { ChatServiceListener } from '@csegames/library/dist/chat/ChatServiceListener';
import { RootState, store } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { Credentials } from '../redux/authSlice';
import { RoomRecord, ReceivedResponse, ErroredResponse } from '@csegames/library/dist/chat/generated/uce-chat-v3';
import { RoomChangedLine } from './lines/RoomChangedLine';
import { ConnectionChangedLine } from './lines/ConnectionChangedLine';
import { Line } from './Line';
import { ErrorLine } from './lines/ErrorLine';
import { MessageLine } from './lines/MessageLine';
import { EntryForm } from './EntryForm';
import { CharacterList } from './CharacterList';
import { ConnectionFailedLine } from './lines/ConnectionFailedLine';

import './Chat.css';
import { chatService } from './chatSetup';
import { MessageRenderer } from '@csegames/library/dist/chat/MessageRenderer';

const MAX_LINES = 40;

function binarySearch<T>(value: T, array: T[], comp: (l?: T, r?: T) => number): number {
  let low = 0;
  let high = array.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const diff = comp(array[mid], value);
    if (diff === 0) return mid;
    else if (diff < 0) low = mid + 1;
    else high = mid - 1;
  }
  return -low - 1;
}

interface ReactProps {
  service: ChatService;
  renderer: MessageRenderer<React.ReactChild>;
}

interface InjectedProps {
  credentials: Credentials | null;
}

type Props = ReactProps & InjectedProps;

interface State {
  lines: Line[];
  lastTimestamp: number;
  numConnections: number; // used to prevent server swap from breaking message sort
}

interface Snapshot {
  shouldScroll: boolean;
}

class AChat extends React.Component<Props & DispatchProp, State, Snapshot> implements ChatServiceListener {
  private scroller: HTMLElement | null = null;

  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = { lastTimestamp: 0, numConnections: 0, lines: [] };
  }

  render(): React.ReactNode {
    const entries = this.state.lines.map((line) => <div key={line.id}>{line.render()}</div>);
    return (
      <div className='chat'>
        <CharacterList />
        <div className='chatBox'>
          {entries}
          <div ref={(s) => (this.scroller = s)} style={{ height: '1px' }}></div>
        </div>
        <EntryForm rooms={chatService.rooms} service={chatService} />
      </div>
    );
  }

  componentDidMount(): void {
    chatService.addListener(this);
    if (chatService.connected) {
      this.onConnected();
    } else if (this.props.credentials?.characterID) {
      chatService.open();
    }
  }

  componentWillUnmount(): void {
    chatService.removeListener(this);
  }

  getSnapshotBeforeUpdate(): Snapshot | null {
    const bounds = this.scroller?.getBoundingClientRect();
    const parentBounds = this.scroller?.parentElement?.getBoundingClientRect();
    const shouldScroll = !bounds || !parentBounds || bounds.top < parentBounds.bottom;
    return { shouldScroll };
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: Snapshot): void {
    if (prevState.lines !== this.state.lines) {
      if (this.scroller && snapshot.shouldScroll) this.scroller.scrollIntoView();
    }

    if (prevProps.credentials?.characterID === this.props.credentials?.characterID) {
      return;
    }
    if (this.props.credentials?.characterID) {
      chatService.reset();
    } else if (chatService.connected) {
      chatService.close();
    }
  }

  addLine(line: Line, update: Partial<State> = {}): void {
    const lines = this.state.lines.slice();

    let index = binarySearch(
      line,
      lines,
      (l?: Line, r?: Line) =>
        (l?.numConnections ?? 0) - (r?.numConnections ?? 0) ||
        (l?.timestamp ?? 0) - (r?.timestamp ?? 0) ||
        (l?.id ?? 0) - (r?.id ?? 0) ||
        0
    );
    if (index < 0) {
      lines.splice(-index - 1, 0, line);
    } else {
      while (lines.length >= index && lines[index]?.timestamp === line.timestamp) {
        ++index;
      }
      if (lines.length < index) {
        lines.push(line);
      } else {
        lines.splice(index, 0, line);
      }
    }

    if (lines.length > MAX_LINES) lines.shift();
    const result: any = { lines };
    if (update.lastTimestamp) result.lastTimestamp = update.lastTimestamp;
    if (update.numConnections) result.numConnections = update.numConnections;
    this.setState(result);
  }

  onJoined(room: RoomRecord) {
    const { numConnections, lastTimestamp } = this.state;
    this.addLine(new RoomChangedLine(room, numConnections, lastTimestamp, true));
    this.forceUpdate();
  }
  onLeft(room: RoomRecord) {
    const { numConnections, lastTimestamp } = this.state;
    this.addLine(new RoomChangedLine(room, numConnections, lastTimestamp, false));
    this.forceUpdate();
  }
  onReceived(message: ReceivedResponse) {
    const { numConnections } = this.state;
    this.addLine(new MessageLine(numConnections, message, this.props.renderer.render(message)), {
      lastTimestamp: message.sentAt
    });
  }
  onError(error: ErroredResponse) {
    this.addLine(new ErrorLine(error, this.state.numConnections, this.state.lastTimestamp));
  }
  onConnected() {
    const { service } = this.props;
    const { numConnections, lastTimestamp } = this.state;
    const timestamp = service.serverTime ?? lastTimestamp;
    this.addLine(new ConnectionChangedLine(true, numConnections, timestamp, service.server), {
      lastTimestamp: timestamp,
      numConnections: numConnections + 1
    });
  }
  onConnectionFailure(reconnecting: boolean) {
    const { service } = this.props;
    const { numConnections, lastTimestamp } = this.state;
    this.addLine(new ConnectionFailedLine(true, numConnections, lastTimestamp, service.server));
    if (!reconnecting) service.open();
  }
  onDisconnected(reconnecting: boolean) {
    const { service } = this.props;
    const { numConnections, lastTimestamp } = this.state;
    this.addLine(new ConnectionChangedLine(false, numConnections, lastTimestamp, service.server));
    if (!reconnecting) service.open();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { credentials } = state.auth;
  return {
    ...ownProps,
    credentials
  };
};

export const Chat = connect(mapStateToProps)(AChat);
