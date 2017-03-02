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
} from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface ConsoleStyle extends StyleDeclaration {
  container: React.CSSProperties;
  input: React.CSSProperties;
  lines: React.CSSProperties;
  line: React.CSSProperties;
}

export const defaultConsoleStyle: ConsoleStyle = {
  container: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    right: '0px',
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  input: {
    flex: '0 0 auto',
  },

  lines: {
    flex: '1 1 auto',
    display: 'flex',
    alignContent: 'stetch',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  line: {
    flex: '1 1 auto',
  },
};

export interface ConsoleProps {
  styles?: Partial<ConsoleStyle>;
}

export interface ConsoleState {
  historyIndex: number;
  commandHistory: CircularArray<string>;
  textLines: CircularArray<string>;
}

class CircularArray<T> {
  private data: T[];
  private _length: number;

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
    };
  }

  componentWillMount() {
    client.OnConsoleText(this.onConsoleText);
  }

  onConsoleText = (s: string) => {
    const textLines = this.state.textLines;
    textLines.push(s);
    this.setState({
      textLines,
    });
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === jsKeyCodes.ENTER) {
      // submit command 
      const text = this.inputRef.value;
      if (!parseMessageForSlashCommand(text)) {
        client.SendSlashCommand(text);
      }
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
    return lines;
  }

  inputRef: HTMLInputElement = null;
  render() {
    const ss = StyleSheet.create(defaultConsoleStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.container, custom.container)}>
        <div className={css(ss.lines, custom.lines)}>
          {this.renderTextLines(ss, custom)}
        </div>
        <div className={css(ss.input, custom.input)}>
          <Input type='text'
                 inputRef={r => this.inputRef = r}
                 onKeyDown={this.onKeyDown} />
        </div>
      </div>
    );
  }
}

export default Console;
