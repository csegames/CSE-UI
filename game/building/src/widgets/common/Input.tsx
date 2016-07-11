/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDOM from 'react';
import inputOwnership from './InputOwnership';
import { client } from 'camelot-unchained';

export interface NameInputProps {
  type: string;
  placeholder?: string;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  grabFocus?: boolean;
};
export interface NameInputState {
};

class Input extends React.Component<NameInputProps, NameInputState> {
  public name: string = 'Input';
  input: HTMLInputElement = null;

  constructor(props: NameInputProps) {
    super(props);
    this.inputRef = this.inputRef.bind(this);
  }

  getValue = (): string => {
    return this.input ? this.input.value : undefined;
  }

  inputRef = (input: HTMLInputElement): void => {
    this.input = input;
    if (input && this.props.grabFocus) {
      input.focus();    // doesn't work
    }
  }

  render() {
    // autoFocus doesn't work either
    console.log('grabFocus is ' + this.props.grabFocus);
    return (
      <input
        className="Input-control" 
        ref={this.inputRef}
        autoFocus={this.props.grabFocus}
        type={this.props.type}
        onFocus={inputOwnership} onBlur={inputOwnership}
        placeholder={this.props.placeholder}
        maxLength={this.props.maxLength}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
      />
    );
  }
}

export default Input;
