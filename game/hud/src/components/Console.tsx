/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import {
  Input,
  parseMessageForSlashCommand,
} from '@csegames/camelot-unchained';

import styled from 'react-emotion';

import ObjectDisplay from './ObjectDisplay';

const Container = styled('div')`
  position: fixed;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  max-height: 400px;
`;

const InfoWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 0 0 450px;
  overflow-y: auto;
  color: #ececec;
  user-select: all;
`;

const ConsoleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

const InputWrapper = styled('div')`
  flex: 0 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.7);
`;

const Messages = styled('div')`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column-reverse;
  overflow-y: scroll;
  height: 350px;
`;

const Line = styled('div')`
  flex: 0 0 auto;
  color: #ececec;
`;


export interface ConsoleProps {
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

  public constructor(private maxLength: number = 250) {
  }

  public get length(): number {
    return this._length > this.maxLength ? this.maxLength : this._length;
  }

  public get(index: number): T {
    if (index < 0 || index > this.maxLength) return undefined;
    return this._length <= this.maxLength ?
      this.data[index] : this.data[((this._length % this.maxLength) + index) % this.maxLength];
  }

  public push(item: T) {
    this.data[this._length % this.maxLength] = item;
    this._length++;
  }
}

export class Console extends React.Component<ConsoleProps, ConsoleState> {
  private inputRef: HTMLInputElement = null;

  constructor(props: ConsoleProps) {
    super(props);
    this.state = {
      historyIndex: 0,
      commandHistory: new CircularArray<string>(50),
      textLines: new CircularArray<string>(250),
      show: false,
    };

    game.on('system_message', this.onConsoleText);
    game.on('hudnav--navigate', this.handleHUDNavNavigate);
  }

  public render() {
    if (!this.state.show) return null;

    return (
      <Container>
        <ConsoleWrapper>
          <Messages>
            {this.renderTextLines()}
          </Messages>
          <InputWrapper>
            <Input type='text'
                   styles={{
                     input: {
                       border: '1px solid rgba(255, 255, 255, 0.8)',
                       color: '#00cccc',
                     },
                   }}
                   inputRef={r => this.inputRef = r}
                   onKeyDown={this.onKeyDown} />
          </InputWrapper>
        </ConsoleWrapper>

        <InfoWrapper>
          <ObjectDisplay data={Console.getAPIData()} skipFunctions />
        </InfoWrapper>
      </Container>
    );
  }

  public shouldComponentUpdate() {
    return true;
  }

  private static getAPIData() {
    return game;
  }

  private onConsoleText = (s: string) => {
    const textLines = this.state.textLines;
    textLines.push(s);
    this.setState({
      textLines,
    });
  }

  private handleHUDNavNavigate = (navItem: string) => {
    if (navItem === 'console') {
      if (this.state.show) {
      }
      this.setState({
        show: !this.state.show,
      });
    }
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toUpperCase() === 'ENTER') {
      // submit command
      const text = this.inputRef.value.replace('/', '');
      if (!parseMessageForSlashCommand(text)) {
        game.sendSlashCommand(text);
      }

      this.inputRef.value = '';
    }
  }

  private renderTextLines = () => {
    const lines: JSX.Element[] = [];
    for (let i = 0; i < this.state.textLines.length; ++i) {
      lines.push((
        <Line key={i}>
          {this.state.textLines.get(i)}
        </Line>
      ));
    }
    return lines.reverse();
  }
}

export default Console;
