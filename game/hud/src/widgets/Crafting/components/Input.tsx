/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, jsKeyCodes } from '@csegames/camelot-unchained';
import { StyleSheet, css, merge, input, InputStyles } from '../styles';

interface InputProps {
  name?: string;      // temp for debugging
  size?: number;
  value?: string;
  numeric?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
  style?: Partial<InputStyles>;
}

interface InputState {
  value: string;
  changed: boolean;
}

class Input extends React.Component<InputProps, InputState> {

  constructor(props: InputProps) {
    super(props);
    this.state = { changed: false, value: props.value };
  }

  public componentWillReceiveProps(props: InputProps) {
    if (props.value !== this.state.value) {
      this.setState({ changed: false, value: props.value });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.releaseOwnership);
    client.ReleaseInputOwnership();
  }

  public render() {
    const ss = StyleSheet.create(merge({}, input, this.props.style));
    let adjuster;
    if (this.props.numeric) {
      adjuster = (
        <div className={css(ss.adjuster)}>
          <div className={css(ss.button)} onClick={this.increment}>+</div>
          <div className={css(ss.button)} onClick={this.decrement}>-</div>
        </div>
      );
    }
    return (
      <div className={css(ss.input)}>
        <input type='text'
          ref='input'
          className={css(ss.field)}
          size={this.props.size}
          disabled={this.props.disabled}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          value={this.state.value}
          />
        {adjuster}
      </div>
    );
  }

  private fireOnChange = () => {
    const el = this.refs['input'] as HTMLInputElement;
    this.props.onChange(el.value);
  }

  private increment = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.disabled) return;
    const input = this.refs['input'] as HTMLInputElement;
    let value = ((input.value as any) | 0) + 1;
    const max = this.props.max;
    if (max !== undefined && value > max) value = max;
    input.value = value.toString();
    this.setState({ changed: true, value: value.toString() });
    this.fireOnChange();
  }

  private decrement = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.disabled) return;
    const input = this.refs['input'] as HTMLInputElement;
    let value = ((input.value as any) | 0) - 1;
    const min = this.props.min;
    if (min !== undefined && value < min) value = min;
    input.value = value.toString();
    this.setState({ changed: true, value: value.toString() });
    this.fireOnChange();
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ changed: true, value: e.target.value });
  }

  private onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (client.debug) console.log(`Input: on focus ${this.props.name} grab ownership`);
    client.RequestInputOwnership();
    window.addEventListener('mousedown', this.releaseOwnership);
  }

  private releaseOwnership = (e: MouseEvent) => {
    if (e.srcElement !== this.refs['input'] as HTMLInputElement) {
      if (client.debug) console.log(`Input: mousedown elsewhere ${this.props.name} release ownership`);
      client.ReleaseInputOwnership();
      window.removeEventListener('mousedown', this.releaseOwnership);
    }
  }

  private onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (client.debug) console.log(`Input: onBlur ${this.props.name}`);
    if (this.state.changed) {
      if (client.debug) console.log(`Input: fireOnChange ${this.props.name}`);
      this.fireOnChange();
    }
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.props.numeric) {
      if (e.keyCode >= jsKeyCodes.ZERO && e.keyCode <= jsKeyCodes.NINE) return;
      if (e.keyCode === jsKeyCodes.BACKSPACE || e.keyCode === jsKeyCodes.ENTER) return;
      e.preventDefault();
    }
  }

  private onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.state.changed) {
      if (e.keyCode >= jsKeyCodes.SPACE || e.keyCode === jsKeyCodes.ENTER) {
        this.fireOnChange();
      }
    }
  }
}

export default Input;
