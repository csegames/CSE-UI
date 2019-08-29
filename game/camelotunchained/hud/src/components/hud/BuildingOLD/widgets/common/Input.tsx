/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import inputOwnership from './InputOwnership';

export interface NameInputProps {
  type: string;
  placeholder?: string;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  grabFocus?: boolean;
}
export interface NameInputState {
}

class Input extends React.Component<NameInputProps, NameInputState> {
  public name: string = 'Input';
  private input: HTMLInputElement = null;

  constructor(props: NameInputProps) {
    super(props);
    this.inputRef = this.inputRef.bind(this);
  }

  public render() {
    // autoFocus doesn't work either
    return (
      <input
        className='Input-control'
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

  public getValue = (): string => {
    return this.input ? this.input.value : undefined;
  }

  private inputRef = (input: HTMLInputElement): void => {
    this.input = input;
    if (input && this.props.grabFocus) {
      input.focus();    // doesn't work
    }
  }
}

export default Input;
