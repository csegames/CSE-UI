import { ChatService } from '@csegames/library/dist/chat/chatService';
import { RoomRecord } from '@csegames/library/dist/chat/generated/uce-chat-v3';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Credentials } from '../redux/authSlice';
import { RootState } from '../redux/store';

import './EntryForm.css';

interface ReactProps {
  service: ChatService;
  rooms: RoomRecord[];
}

interface InjectedProps {
  credentials: Credentials | null;
}

type Props = ReactProps & InjectedProps;

interface State {
  selectedRoom: RoomRecord | null;
  whisperTarget: string;
  text: string;
}

export class AEntryForm extends React.Component<Props & DispatchProp, State> {
  private textRef: HTMLInputElement | null = null;

  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = {
      selectedRoom: this.props.rooms[0] ?? null,
      text: '',
      whisperTarget: ''
    };
  }

  render(): React.ReactNode {
    const hasCharacter = this.props.credentials?.characterID != null;
    const hasRooms = this.props.rooms.length > 0;
    const isWhisper = this.state.selectedRoom?.scope === 'whisper';
    const scope = this.state.selectedRoom?.scope ?? undefined;
    const canSend = this.canSend();

    return (
      <div className='entry'>
        <select className='roomSelect' value={scope} disabled={!hasRooms} onChange={this.selectRoom.bind(this)}>
          {!scope && <option key='---'>---</option>}
          {hasRooms &&
            this.props.rooms.map((r) => (
              <option key={r.id} value={r.scope}>
                {r.scope}
              </option>
            ))}
        </select>
        {isWhisper && (
          <input
            className='whisperName'
            type='text'
            disabled={!hasCharacter}
            onChange={this.setWhisperTarget.bind(this)}
          />
        )}
        <input
          ref={(i) => (this.textRef = i)}
          className='textInput'
          type='text'
          disabled={!scope}
          onKeyUp={this.checkForEnter.bind(this)}
          onChange={this.setText.bind(this)}
        />
        <input
          className='submitButton'
          type='button'
          value='submit'
          disabled={!canSend}
          onClick={this.sendMessage.bind(this)}
        />
      </div>
    );
  }

  private canSend(): boolean {
    const { selectedRoom, whisperTarget, text } = this.state;

    return (
      this.props.credentials?.characterID !== null &&
      selectedRoom !== null &&
      (selectedRoom.scope !== 'whisper' || whisperTarget.length >= 3) &&
      text.length > 0
    );
  }

  private checkForEnter(ev: React.KeyboardEvent<HTMLInputElement>): void {
    if (ev.repeat || ev.metaKey || ev.altKey || ev.ctrlKey || !this.canSend()) return;
    if (ev.key === 'Enter') {
      this.sendMessage();
    }
  }

  componentDidUpdate(): void {
    const { rooms } = this.props;
    const { selectedRoom } = this.state;
    if (selectedRoom === null) {
      if (rooms.length > 0) this.setState({ selectedRoom: rooms[0]! });
    } else if (!rooms.find((r) => r.scope === selectedRoom?.scope)) {
      this.setState({ selectedRoom: rooms[0] ?? null });
    }
  }

  setText(ev: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ text: ev.target.value });
  }

  setWhisperTarget(ev: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ whisperTarget: ev.target.value });
  }

  selectRoom(ev: React.ChangeEvent<HTMLSelectElement>): void {
    const room = this.props.service.rooms.find((r) => r.scope == ev.target.value);
    this.setState({ selectedRoom: room ?? null });
  }

  sendMessage(): void {
    const { selectedRoom, whisperTarget, text } = this.state;
    if (this.canSend()) {
      if (selectedRoom?.scope === 'whisper') {
        this.props.service.sendWhisper(whisperTarget, text);
      } else {
        this.props.service.sendMessage(selectedRoom!, text);
      }
      this.setState({ text: '' });
      if (this.textRef) this.textRef.value = '';
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { credentials } = state.auth;
  return {
    ...ownProps,
    credentials
  };
};

export const EntryForm = connect(mapStateToProps)(AEntryForm);
