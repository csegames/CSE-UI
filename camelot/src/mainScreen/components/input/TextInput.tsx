/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { InputBox } from './InputBox';

const Root = 'HUD-TextInput-Root';
const Input = 'HUD-TextInput-Input';

interface ReactProps {
  text: string;
  value: string;
  setValue: (value: string) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ATextInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <label className={Root}>
        <span>{this.props.text}</span>
        <InputBox>
          <input className={Input} type='text' value={this.props.value} onChange={this.handleTextChange.bind(this)} />
        </InputBox>
      </label>
    );
  }

  handleTextChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.props.setValue(target.value);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const TextInput = connect(mapStateToProps)(ATextInput);
