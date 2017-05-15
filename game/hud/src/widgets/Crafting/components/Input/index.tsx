/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-14 21:42:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 08:00:37
 */

import * as React from 'react';
import { connect } from 'react-redux';

interface InputProps {
  size?: number;
  value?: string;
  onChange: (value: any) => void;
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
    this.setState({ changed: false, value: props.value });
  }

  public render() {
    return (
      <input type='text'
        size={this.props.size}
        onChange={this.onChange}
        onBlur={this.onBlur}
        value={this.state.value}
        />
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO extend to support validation
    this.setState({ changed: true, value: e.target.value });
  }

  private onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.state.changed) {
      const el = e.target as HTMLInputElement;
      this.props.onChange((el.value as any) | 0);
    }
  }
}

export default Input;
