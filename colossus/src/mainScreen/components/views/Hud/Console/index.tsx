/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { Input } from '../../../shared/Input';

import ObjectDisplay from './ObjectDisplay';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI, mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { RootState } from '../../../../redux/store';

const Container = 'Console-Container';
const InfoWrapper = 'Console-InfoWrapper';
const ConsoleWrapper = 'Console-ConsoleWrapper';
const InputWrapper = 'Console-InputWrapper';
const Messages = 'Console-Messages';
const Line = 'Console-Line';

const ToggleConsolePosition = 'Console-ToggleConsolePosition';

export interface ConsoleProps {
  slashCommands: SlashCommandRegistry<RootState>;
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

  public constructor(private maxLength: number = 250) {}

  public get length(): number {
    return this._length > this.maxLength ? this.maxLength : this._length;
  }

  public get(index: number): T {
    if (index < 0 || index > this.maxLength) return undefined;
    return this._length <= this.maxLength
      ? this.data[index]
      : this.data[((this._length % this.maxLength) + index) % this.maxLength];
  }

  public push(item: T) {
    this.data[this._length % this.maxLength] = item;
    this._length++;
  }
}

export class Console extends React.Component<ConsoleProps, ConsoleState> {
  private inputRef: HTMLInputElement = null;

  private eventHandles: ListenerHandle[];

  constructor(props: ConsoleProps) {
    super(props);
    this.state = {
      historyIndex: 0,
      commandHistory: new CircularArray<string>(50),
      textLines: new CircularArray<string>(250),
      show: false
    };
  }

  public componentDidMount(): void {
    this.eventHandles = [
      clientAPI.bindAnnouncementListener(this.onConsoleText.bind(this)),
      clientAPI.bindNavigateListener(this.handleHUDNavNavigate.bind(this), 'console')
    ];
  }

  public componentWillUnmount(): void {
    this.eventHandles.forEach((curHandle) => curHandle.close());
  }

  public render() {
    return this.state.show ? (
      <div className={Container} data-input-group="block">
        <div className={ToggleConsolePosition} onClick={() => mockEvents.triggerNavigate('console')}>
          Close Console
        </div>
        <div className={ConsoleWrapper}>
          <div className={Messages}>{this.renderTextLines()}</div>
          <div className={InputWrapper}>
            <Input
              type="text"
              styles={{
                input: {
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#00cccc'
                }
              }}
              inputRef={(r) => (this.inputRef = r)}
              onKeyDown={this.onKeyDown}
            />
          </div>
        </div>

        <div className={InfoWrapper}>
          <ObjectDisplay data={Console.getAPIData()} skipFunctions />
        </div>
      </div>
    ) : null;
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
      textLines
    });
  };

  private handleHUDNavNavigate = (navItem: string) => {
    this.setState({ show: !this.state.show });
  };

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toUpperCase() === 'ENTER') {
      // submit command
      const text = this.inputRef.value.replace('/', '');
      if (!this.props.slashCommands.parse(text)) {
        game.sendSlashCommand(text);
      }

      this.inputRef.value = '';
    }
  };

  private renderTextLines = () => {
    const lines: JSX.Element[] = [];
    for (let i = 0; i < this.state.textLines.length; ++i) {
      lines.push(
        <div className={Line} key={i}>
          {this.state.textLines.get(i)}
        </div>
      );
    }
    return lines.reverse();
  };
}

export default Console;
