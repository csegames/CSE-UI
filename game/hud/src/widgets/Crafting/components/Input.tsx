/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-14 21:42:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:50:50
 */

import * as React from 'react';
import { client } from 'camelot-unchained';
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

  private changeTimer: any;

  constructor(props: InputProps) {
    super(props);
    this.state = { changed: false, value: props.value };
  }

  public componentWillReceiveProps(props: InputProps) {
    this.setState({ changed: false, value: props.value });
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

  private delayedOnChange = (ms: number) => {
    this.cancelOnChange();
    this.changeTimer = setTimeout(() => {
      this.changeTimer = null;
      const el = this.refs['input'] as HTMLInputElement;
      this.props.onChange(el.value);
    }, ms);
  }

  private cancelOnChange = () => {
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
      this.changeTimer = null;
    }
  }

  private increment = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.disabled) return;
    this.cancelOnChange();
    const input = this.refs['input'] as HTMLInputElement;
    let value = ((input.value as any) | 0) + 1;
    const max = this.props.max;
    if (max !== undefined && value > max) value = max;
    input.value = value.toString();
    this.setState({ changed: true, value: value.toString() });
    this.delayedOnChange(500);
  }

  private decrement = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.disabled) return;
    this.cancelOnChange();
    const input = this.refs['input'] as HTMLInputElement;
    let value = ((input.value as any) | 0) - 1;
    const min = this.props.min;
    if (min !== undefined && value < min) value = min;
    input.value = value.toString();
    this.setState({ changed: true, value: value.toString() });
    this.delayedOnChange(400);
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO extend to support validation
    this.setState({ changed: true, value: e.target.value });
  }

  private onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('CRAFTING: REQUEST INPUT OWNERSHIP - ALL YOUR INPUTZ BELONGZ TO US!!!');
    client.RequestInputOwnership();
  }

  private onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('CRAFTING: RELEASE INPUT OWNERSHIP :(');
    client.ReleaseInputOwnership();
    if (this.state.changed) {
      this.delayedOnChange(0);
    }
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.cancelOnChange();
    if (this.props.numeric) {
      if (e.keyCode > 47 && e.keyCode < 58) return;
      if (e.keyCode === 8 || e.keyCode === 13) return;
      e.preventDefault();
    }
  }

  private onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.state.changed) {
      if (e.keyCode >= 32) {
        this.delayedOnChange(500);
      }
      if (e.keyCode === 13) {
        this.delayedOnChange(0);
      }
    }
  }
}

export default Input;
