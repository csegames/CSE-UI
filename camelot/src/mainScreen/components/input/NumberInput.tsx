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
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

const Container = 'HUD-NumberInput-Container';
const Box = 'HUD-NumberInput-Box';
const Text = 'HUD-NumberInput-Text';
const Range = 'HUD-NumberInput-Range';

interface ReactProps {
  text: string;
  value: number;
  setValue: (value: number) => void;
  minValue: number;
  maxValue: number;
  step: number;
  playVolumeFeedback?: boolean;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ANumberInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const percent = (this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue);
    return (
      <InputBox text={this.props.text} padded>
        <>
          <div className={Container}>
            <div className={Box} style={{ left: `${percent * 100}%` }} />
            <input
              className={Range}
              type='range'
              value={this.props.value}
              onInput={this.handleInput.bind(this)}
              onMouseUp={this.handleMouseUp.bind(this)}
              min={this.props.minValue}
              max={this.props.maxValue}
              step={this.props.step}
            />
          </div>
          <div className={Text}>
            <span>{this.props.value}</span>
          </div>
        </>
      </InputBox>
    );
  }

  handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.props.setValue(Number(target.value));
  }

  handleMouseUp(): void {
    if (this.props.playVolumeFeedback) {
      clientAPI.playVolumeFeedback(SoundEvents.PLAY_SFX_VOLFEEDBACK, this.props.value);
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const NumberInput = connect(mapStateToProps)(ANumberInput);
