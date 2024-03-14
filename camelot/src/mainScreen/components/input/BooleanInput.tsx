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

const Label = 'HUD-BooleanInput-Label';
const Box = 'HUD-BooleanInput-Box';
const BoxOn = 'HUD-BooleanInput-BoxOn';
const Check = 'HUD-BooleanInput-Check';

interface ReactProps {
  text: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ABooleanInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <label className={Label}>
        <InputBox text={this.props.text} padded>
          <div className={this.props.value ? `${Box} ${BoxOn}` : Box} />
          <input className={Check} type='checkbox' checked={this.props.value} onClick={this.toggle.bind(this)} />
        </InputBox>
      </label>
    );
  }

  toggle(): void {
    this.props.setValue(!this.props.value);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const BooleanInput = connect(mapStateToProps)(ABooleanInput);
