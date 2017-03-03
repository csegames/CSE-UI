/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com) 
 * @Date: 2017-03-01 20:19:26 
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-01 20:22:06
 */
import * as React from 'react';
import {
  client,
  Input,
  jsKeyCodes,
  parseMessageForSlashCommand,
  events,
} from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface ConsoleStyle extends StyleDeclaration {
  container: React.CSSProperties;
  input: React.CSSProperties;
  consoleMessages: React.CSSProperties;
  line: React.CSSProperties;
}

export const defaultConsoleStyle: ConsoleStyle = {
  container: {
    position: 'fixed',
    flexDirection: 'column',
    top: '0px',
    left: '0px',
    right: '0px',
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  input: {
    flex: '0 0 auto',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },

  consoleMessages: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column-reverse',
    overflowY: 'scroll',
    height: '350px',
  },

  line: {
    flex: '0 0 auto',
    color: '#ececec',
  },
};

export interface ConsoleProps {
  styles?: Partial<ConsoleStyle>;
}

export interface ConsoleState {
  historyIndex: number;
  commandHistory: CircularArray<string>;
  textLines: CircularArray<string>;
  show: boolean;
}

class CircularArray<T> {
  private data: T[] = [];
  private _length: number = 0;

  public constructor(private maxLength: number = 50) {
  }

  public get length(): number {
    return this._length > this.maxLength ? this.maxLength : this._length;
  }

  public get(index: number): T {
    if (index < 0 || index > this.maxLength) return undefined;
    return this._length <= this.maxLength ? this.data[index] : this.data[((this._length % this.maxLength)+1+index) % this.maxLength]
  }

  public push(item: T) {
    this.data[this._length % this.maxLength] = item;
    this._length++;
  }
}

export class Console extends React.Component<ConsoleProps, ConsoleState> {
  constructor(props: ConsoleProps) {
    super(props);
    this.state = {
      historyIndex: 0,
      commandHistory: new CircularArray<string>(50),
      textLines: new CircularArray<string>(200),
      show: false,
    };
  }

  componentWillMount() {
    events.on('system_message', this.onConsoleText)
    events.on('hudnav--navigate', this.handleHUDNavNavigate);
  }

  onConsoleText = (s: string) => {
    const textLines = this.state.textLines;
    textLines.push(s);
    this.setState({
      textLines,
    });
  }

  handleHUDNavNavigate = (navItem: string) => {
    if (navItem === 'console') {
      if (this.state.show) {
        client.ReleaseInputOwnership();
      }
      this.setState({
        show: !this.state.show,
      });
    }
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === jsKeyCodes.ENTER) {
      // submit command 
      const text = this.inputRef.value;
      if (!parseMessageForSlashCommand(text)) {
        client.SendSlashCommand(text);
      }

      this.inputRef.value = '';
    }
  }

  renderTextLines = (ss: ConsoleStyle, custom: Partial<ConsoleStyle>) => {
    const lines: JSX.Element[] = [];
    for (let i = 0; i < this.state.textLines.length; ++i) {
      lines.push((
        <div key={i} className={css(ss.line, custom.line)}>
          {this.state.textLines.get(i)}
        </div>
      ))
    }
    return lines.reverse();
  }

  inputRef: HTMLInputElement = null;
  render() {
    const ss = StyleSheet.create(defaultConsoleStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    if (!this.state.show) return null;

    return (
      <div className={css(ss.container, custom.container)}>
        <div className={css(ss.consoleMessages, custom.consoleMessages)}>
          {this.renderTextLines(ss, custom)}
        </div>
        <div className={css(ss.input, custom.input)}>
          <Input type='text'
                 inputRef={r => this.inputRef = r}
                 onFocus={() => client.RequestInputOwnership()}
                 onBlue={() => client.ReleaseInputOwnership()}
                 onMouseEnter={() => client.RequestInputOwnership()}
                 onMouseLeave={() => {
                   console.log('release input ownership');
                   client.ReleaseInputOwnership();
                 }}
                 onKeyDown={this.onKeyDown} />
        </div>
      </div>
    );
  }
}

export default Console;
