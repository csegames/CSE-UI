/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';

import { TabState, parseChatRequest } from '../../../../../redux/chatSlice';
import { RootState } from '../../../../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CircularArray } from '@csegames/library/dist/_baseGame/types/CircularArray';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { getStringTableValue } from '../../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const Input = 'Chat-Views-ChatInput-Input';

const StringIDChatDefaultText = 'ChatDefaultText';

interface ReactProps {
  tab: TabState;
}

interface InjectedProps {
  color: string;
  fontFamily: string;
  sentMessages: CircularArray<string>;
  dmSenderNames: string[];
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

export interface State {
  value: string;
  // If -1, then we are not in the middle of building a response message.
  dmResponseIndex: number;
}

class AChatInput extends React.Component<Props, State> {
  state = { value: '', dmResponseIndex: -1 };
  private inputRef = React.createRef<HTMLTextAreaElement>();
  private handles: ListenerHandle[] = [];
  private sentHistoryIndex: number = -1;

  private updateHeight(ele: HTMLTextAreaElement) {
    ele.style.height = '';
    const newHeight = Math.max(Math.min(ele.scrollHeight + 2, 75), 20);
    ele.style.height = newHeight + 'px';
  }

  private updateHeightDelayed() {
    window.setTimeout(() => {
      if (this.inputRef?.current) {
        this.updateHeight(this.inputRef.current);
      }
    }, 1);
  }

  //replaces current chat value with the offset value from SentMessages
  private reviewChatHistory(offset: number) {
    if (this.props.sentMessages.length == 0) {
      return;
    }

    const origHistoryIndex = this.sentHistoryIndex;

    if (this.sentHistoryIndex >= 0) {
      this.sentHistoryIndex += offset;
    }

    // wraparound
    if (this.sentHistoryIndex < 0) {
      this.sentHistoryIndex += this.props.sentMessages.length;
    }

    if (this.sentHistoryIndex >= this.props.sentMessages.length) {
      this.sentHistoryIndex = this.sentHistoryIndex % this.props.sentMessages.length;
    }

    // update field
    if (
      origHistoryIndex != this.sentHistoryIndex &&
      this.sentHistoryIndex >= 0 &&
      this.sentHistoryIndex < this.props.sentMessages.length
    ) {
      this.setState({
        value: this.props.sentMessages.get(this.sentHistoryIndex)
      });
      this.updateHeightDelayed();
    }
  }

  onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    this.setState({
      value: e.currentTarget.value
    });
    this.updateHeightDelayed();
  }

  onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // treat a single slash character as empty (because entering '/' opens the chat box for slash commands)
    const inputIsEmpty: boolean = e.currentTarget.value.length == 0 || e.currentTarget.value === '/';

    // is the current input the same value as the currently selected sentHistoryIndex?
    const inputIsUnmodified =
      this.props.sentMessages.length > 0 &&
      this.sentHistoryIndex >= 0 &&
      this.sentHistoryIndex < this.props.sentMessages.length &&
      e.currentTarget.value == this.props.sentMessages.get(this.sentHistoryIndex);

    // does this input event correspond to an input character (printable text) or a control code (arrow keys, etc.)
    const isCharacterInput = e.key.length === 1; // https://stackoverflow.com/a/49612427

    if (this.state.dmResponseIndex >= 0) {
      if (e.key === 'Tab') {
        e.preventDefault();
        // If the user is in "pick who to respond to" mode, cycle through DM targets.
        const dmResponseIndex = (this.state.dmResponseIndex + 1) % this.props.dmSenderNames.length;
        this.setState({ dmResponseIndex, value: `/r ${this.props.dmSenderNames[dmResponseIndex]} ` });
      } else {
        // If the user is no longer picking a recipient, switch back to regular mode.
        this.setState({ dmResponseIndex: -1 });
      }
    }
    if (e.key === ' ' && e.currentTarget.value === '/r' && this.props.dmSenderNames.length > 0) {
      this.setState({ dmResponseIndex: 0, value: `/r ${this.props.dmSenderNames[0]} ` });
    } else if (e.key === 'ArrowUp' && (e.shiftKey || inputIsEmpty || inputIsUnmodified)) {
      e.preventDefault();
      this.reviewChatHistory(-1);
    } else if (e.key === 'ArrowDown' && (e.shiftKey || inputIsEmpty || inputIsUnmodified)) {
      e.preventDefault();
      this.reviewChatHistory(1);
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();

      // send message or command
      try {
        const val = e.currentTarget.value;
        if (val.startsWith('/')) {
          const cmd = val.replace('/', '');
          this.setState({
            value: game.tabComplete(cmd)
          });
        }
      } catch (err) {
        console.error(err);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      this.props.dispatch(
        parseChatRequest({ fromFilter: this.props.tab.activeFilter, content: e.currentTarget.value })
      );

      // clear input
      this.setState({ value: '' });
      this.updateHeightDelayed();
      this.sentHistoryIndex = -1;

      if (this.inputRef?.current) {
        this.inputRef.current.blur();
      }
    } else if (isCharacterInput) {
      // reset history counter when entering text
      this.sentHistoryIndex = -1;
    }
  }

  handleBeginChat(message: string) {
    let newValue: string = '';
    if (this.inputRef?.current) {
      window.setTimeout(() => {
        this.inputRef.current.focus();
        this.inputRef.current.setSelectionRange(this.inputRef.current.value.length, this.inputRef.current.value.length);
        this.updateHeight(this.inputRef.current);
      }, 1);

      newValue = message ? message : this.inputRef.current.value;
    } else {
      newValue = message;
    }
    this.setState({
      value: newValue
    });
  }

  public componentDidMount() {
    this.handles.push(game.onBeginChat(this.handleBeginChat.bind(this)));
  }

  public componentWillUnmount() {
    this.handles.forEach((h) => h.close());
  }

  render() {
    return (
      <textarea
        ref={this.inputRef}
        rows={1}
        disabled={!this.props.tab.allowChat()}
        onChange={this.onChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
        value={this.state.value}
        className={Input}
        style={{ color: this.props.color, fontFamily: this.props.fontFamily }}
        placeholder={getStringTableValue(StringIDChatDefaultText, this.props.stringTable)}
      />
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { theme, sentMessages, dmSenderNames } = state.chat;
  const { input } = theme;
  const { color, fontFamily } = input;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    color,
    fontFamily,
    sentMessages,
    dmSenderNames,
    stringTable
  };
}

export const ChatInput = connect(mapStateToProps)(AChatInput);
