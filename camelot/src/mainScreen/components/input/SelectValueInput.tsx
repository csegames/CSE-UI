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
import { SelectValue } from '@csegames/library/dist/_baseGame/types/Options';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const Values = 'HUD-SelectValueInput-Values';
const Value = 'HUD-SelectValueInput-Value';
const Select = 'HUD-SelectValueInput-Select';
const Caret = 'HUD-SelectValueInput-Caret';

interface ReactProps {
  text: string;
  value: SelectValue;
  values: ArrayMap<SelectValue>;
  setValue: (value: SelectValue) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
}

class ASelectValueInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render(): JSX.Element {
    return (
      <InputBox text={this.props.text} padded>
        <>
          <div className={Select} onClick={this.toggle.bind(this)}>
            <span>{this.props.value.description}</span>
            {!this.state.isOpen && (
              <svg className={Caret} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
                <path d='M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z' />
              </svg>
            )}
            {this.state.isOpen && (
              <svg className={Caret} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
                <path d='M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z' />
              </svg>
            )}
          </div>
          {this.state.isOpen && (
            <div className={Values}>
              {Object.values(this.props.values)
                .filter((value) => value.value !== this.props.value.value)
                .map((value, index) => {
                  const onClick = (): void => {
                    this.props.setValue(value);
                    this.setState({ isOpen: false });
                  };
                  return (
                    <div className={Value} onClick={onClick} key={index}>
                      <span>{value.description}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      </InputBox>
    );
  }

  toggle(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const SelectValueInput = connect(mapStateToProps)(ASelectValueInput);
