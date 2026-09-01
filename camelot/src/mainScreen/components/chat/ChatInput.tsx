/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { ChatScope, ChatScopes, isChatScope } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTable } from '../../dataSources/manifest/stringTableManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { FactionBorder, BorderType } from '../FactionBorder';
import {
  allChatScopeDisplayData,
  getChatScopeFromSlashSelector,
  getCSSProperties,
  isResponseSelector,
  SelectionType
} from './ChatScopes';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { getFactionData } from '../../gameData/factionData';
import { chatService, slashCommands } from './ChatSetup';
import { game } from '@csegames/library/dist/_baseGame';
import { ContextMenuItem, showContextMenu } from '../../redux/contextMenuSlice';

const MAX_COMMAND_HISTORY_LENGTH = 20;

// This regex matches one or two words with a space after each and a slash at the front.
const roomPrefixRegex: RegExp = /^\/(\w+)\s(?:\s*(\S+)\s)?$/;

// CSS classes
const Form = 'HUD-Chat-Form';
const InputContainer = 'HUD-Chat-InputContainer';
const Input = 'HUD-Chat-Input';
const DefaultMessageTarget = 'HUD-Chat-DefaultMessageTarget';
const SendButton = 'HUD-Chat-SendButton';

// String IDs
const StringIDChatInputPlaceholder = 'ChatInputPlaceholder';

// ID used so the context menu can be closed if this component unmounts while it is open.
const ScopeMenuID = 'ChatScopeSelector';

interface ReactProps {
  isActive: boolean;
  getResponseTarget: () => string | undefined;
  setActive: (active: boolean) => void;
  sendMessage: (scope: ChatScope, text: string, whisperTarget?: string) => void;
  whisperTargetRequest?: string;
  onWhisperTargetConsumed: () => void;
  chatFontSize: number;
}

interface InjectedProps {
  maxChatMessageLength: number;
  stringTable: StringTable;
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps & AddDispatch;

interface State {
  commandHistory: string[];
  historyIndex: number;

  text: string;
  scope: ChatScope;
  whisperTarget?: string; // character name
}

class AChatInput extends React.Component<Props, State> {
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private listenHandles: ListenerHandle[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      commandHistory: [],
      historyIndex: -1,
      text: '',
      scope: ChatScopes.Zone
    };
  }

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Form}>
        <FactionBorder className={InputContainer} type={BorderType.Secondary}>
          {this.props.isActive && this.renderSelectedScope()}
          <input
            className={Input}
            type='text'
            style={{ fontSize: `${this.props.chatFontSize}rem` }}
            onKeyDown={this.handleInputKeydown.bind(this)}
            onChange={this.handleInputValueChange.bind(this)}
            placeholder={getStringTableValue(StringIDChatInputPlaceholder, this.props.stringTable)}
            value={this.state.text}
            ref={this.inputRef}
            maxLength={this.props.maxChatMessageLength}
            onFocus={() => {
              clientAPI.requestTextInput(true);
            }}
            onBlur={() => {
              clientAPI.requestTextInput(false);
            }}
          />
        </FactionBorder>
        <button
          className={SendButton}
          style={{ backgroundImage: `url(${factionData.sendButtonImage})` }}
          type='button'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleChatSubmit();
            this.props.setActive(false);
          }}
        />
      </div>
    );
  }

  componentDidMount(): void {
    this.listenHandles.push(
      clientAPI.bindBeginChatListener(this.handleBeginChat.bind(this)),
      clientAPI.bindEndChatListener(this.handleEndChat.bind(this))
    );
  }

  componentWillUnmount(): void {
    for (const handle of this.listenHandles) handle.close();
  }

  componentDidUpdate(prevProps: Props): void {
    // A whisper was requested elsewhere (e.g. left-clicking a chat name); switch to whisper scope for that target.
    if (this.props.whisperTargetRequest && this.props.whisperTargetRequest !== prevProps.whisperTargetRequest) {
      this.setState({ scope: ChatScopes.Whisper, whisperTarget: this.props.whisperTargetRequest, text: '' });
      this.props.onWhisperTargetConsumed();
    }

    if (this.props.isActive) {
      this.inputRef.current?.focus();
    } else {
      this.inputRef.current?.blur();
    }
  }

  private renderSelectedScope(): React.ReactNode {
    const { scope, whisperTarget } = this.state;
    const lastScopeData = allChatScopeDisplayData[scope];
    let targetText = getStringTableValue(lastScopeData.nameStringID, this.props.stringTable);
    if (scope === ChatScopes.Whisper && whisperTarget) {
      targetText = `<${targetText}-${whisperTarget}>`;
    } else {
      targetText = `<${targetText}>`;
    }

    return (
      <div className={DefaultMessageTarget} style={getCSSProperties(scope)} onClick={this.openScopeMenu.bind(this)}>
        {targetText}
      </div>
    );
  }

  // Opens a context menu listing the channels the player can currently post to, letting them
  // switch the active scope by clicking one (equivalent to typing the matching /scope selector).
  private openScopeMenu(e: React.MouseEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();

    // One entry per joined scope, excluding whisper (which needs a target) and hidden scopes.
    const scopes = [
      ...new Set(
        chatService.rooms
          .map((room) => room.scope)
          .filter(isChatScope)
          .filter(
            (scope) =>
              scope !== ChatScopes.Whisper && allChatScopeDisplayData[scope]?.selectionType !== SelectionType.Hidden
          )
      )
    ];
    if (scopes.length === 0) return;

    const getName = (scope: ChatScope): string =>
      getStringTableValue(allChatScopeDisplayData[scope].nameStringID, this.props.stringTable);
    scopes.sort((a, b) => getName(a).localeCompare(getName(b)));

    const content: ContextMenuItem[] = scopes.map((scope) => ({
      title: getName(scope),
      onClick: () => {
        this.setState({ scope });
        this.inputRef.current?.focus();
      }
    }));

    this.props.dispatch(showContextMenu({ id: ScopeMenuID, content, mouseX: e.clientX, mouseY: e.clientY }));
  }

  handleInputKeydown(e: React.KeyboardEvent<HTMLInputElement>): void {
    switch (e.key) {
      case 'ArrowUp':
        this.navigateHistory(1);
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.navigateHistory(-1);
        e.preventDefault();
        break;
      case 'Enter':
        this.handleChatSubmit();
        e.preventDefault();
        break;
      case 'Escape':
        this.props.setActive(false);
        e.preventDefault();
        break;
    }
  }

  // Check for scope/target selector pseudo-slashCommands.
  handleInputValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const text = e.target.value;
    const match = text.match(roomPrefixRegex);
    const scope = getChatScopeFromSlashSelector(match?.[1].toLowerCase());
    switch (scope) {
      case ChatScopes.Whisper:
        const target = this.props.getResponseTarget();
        if (target && isResponseSelector(text)) {
          this.setState({ text: '', scope, whisperTarget: target });
        } else if (match && match[2]) {
          this.setState({ text: '', scope, whisperTarget: match[2] });
        } else {
          this.setState({ text });
        }
        break;
      case undefined:
        this.setState({ text });
        break;
      default:
        this.setState({ text: '', scope });
        break;
    }
  }

  handleChatSubmit(): void {
    const { text, scope, whisperTarget } = this.state;
    if (!text) {
      this.props.setActive(false);
      return;
    }

    if (!text.startsWith('/')) {
      this.props.sendMessage(scope, text, whisperTarget);
      this.setState({ text: '' });
      return;
    }

    if (!slashCommands.parse(text)) {
      game.sendSlashCommand(text.substring(1));
    }

    const sentHistory = this.state.commandHistory.slice();
    sentHistory.unshift(text);
    if (sentHistory.length > MAX_COMMAND_HISTORY_LENGTH) sentHistory.pop();

    this.setState({ text: '', commandHistory: sentHistory, historyIndex: -1 });
  }

  handleBeginChat(text: string): void {
    this.setState({ text });
    this.props.setActive(true);
  }

  handleEndChat(): void {
    this.props.setActive(false);
  }

  navigateHistory(offset: number): void {
    const historyIndex = Math.max(Math.min(this.state.historyIndex + offset, this.state.commandHistory.length - 1), -1);
    const cmd = this.state.commandHistory[historyIndex] ?? '';
    this.setState({ text: cmd, historyIndex });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    maxChatMessageLength: state.gameDefs.settings?.maxChatMessageLength ?? 200,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID
  };
};

export const ChatInput = connect(mapStateToProps)(AChatInput);
