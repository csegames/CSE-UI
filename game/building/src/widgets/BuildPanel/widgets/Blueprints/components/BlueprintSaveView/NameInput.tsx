/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Input from '../../../../../common/Input';

export interface NameInputProps {
  placeholder?: string;
  maxLength?: number;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  onTimeout?: (value: string) => void;
  timeout?: number;
  grabFocus?: boolean;
};
export interface NameInputState {
};

class NameInput extends React.Component<NameInputProps, NameInputState> {
  public name: string = 'NameInput';
  private timer: any;
  private allowedKeys = [8, 16, 17, 20, 32, 35, 36, 37, 38, 39, 40, 45, 46];

  constructor(props: NameInputProps) {
    super(props);
 
    //letters
    for (let letter = 65; letter <= 90; letter++) {
      this.allowedKeys.push(letter);
    }

    //numbers
    for (let number = 48; number <= 57; number++) {
      this.allowedKeys.push(number);
    }
  }

  private onKeyDown = (e: React.KeyboardEvent): void => {
    if (this.allowedKeys.indexOf(e.which) !== -1) {
      return;
    }
    e.preventDefault();
  }

  private onKeyUp = (e: React.KeyboardEvent): void => {
    if (this.props.onKeyUp) this.props.onKeyUp(e);
    if (this.props.timeout) {
      const input: HTMLInputElement = e.target as HTMLInputElement;
      // after 500ms of non-typing, filter list
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.props.onTimeout(input.value);
      }, 500);
    }
  }

  getValue = (): string => {
    return (this.refs['node'] as Input).getValue();
  }

  render() {
    return (
      <Input ref="node"
        type="text"
        placeholder={this.props.placeholder}
        maxLength={this.props.maxLength}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        grabFocus={this.props.grabFocus}
        />
    );
  }
}

export default NameInput;
