/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, cssAphrodite, merge, input, InputStyles } from '../styles';

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
  }

  public render() {
    const ss = StyleSheet.create(merge({}, input, this.props.style));
    let adjuster;
    if (this.props.numeric) {
      adjuster = (
        <div className={cssAphrodite(ss.adjuster)}>
          <div className={cssAphrodite(ss.button)} onClick={this.increment}>+</div>
          <div className={cssAphrodite(ss.button)} onClick={this.decrement}>-</div>
        </div>
      );
    }
    return (
      <div className={cssAphrodite(ss.input)}>
        <input type='text'
          ref='input'
          className={cssAphrodite(ss.field)}
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
    if (process.env.IS_DEVELOPMENT) console.log(`Input: on focus ${this.props.name} grab ownership`);
    window.addEventListener('mousedown', this.releaseOwnership);
  }

  private releaseOwnership = (e: MouseEvent) => {
    if (e.srcElement !== this.refs['input'] as HTMLInputElement) {
      if (process.env.IS_DEVELOPMENT) console.log(`Input: mousedown elsewhere ${this.props.name} release ownership`);
      window.removeEventListener('mousedown', this.releaseOwnership);
    }
  }

  private onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (process.env.IS_DEVELOPMENT) console.log(`Input: onBlur ${this.props.name}`);
    if (this.state.changed) {
      if (process.env.IS_DEVELOPMENT) console.log(`Input: fireOnChange ${this.props.name}`);
      this.fireOnChange();
    }
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.props.numeric) {
      try {
        if (parseInt(e.key, 10) >= 0 && parseInt(e.key, 10) <= 9) return;
      } catch (e) {}
      if (e.key.toUpperCase() === 'BACKSPACE' || e.key.toUpperCase() === 'ENTER') return;
      e.preventDefault();
    }
  }

  private onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.state.changed) {
      if (e.key.toUpperCase() >= 'SPACE' || e.keyCode === 'ENTER') {
        this.fireOnChange();
      }
    }
  }
}

export default Input;
