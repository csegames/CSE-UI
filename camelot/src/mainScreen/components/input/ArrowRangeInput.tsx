/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

// CSS classes
const Root = 'HUD-ArrowRangeInput-Root';
const Arrow = 'HUD-ArrowRangeInput-Arrow';
const ArrowDisabled = 'HUD-ArrowRangeInput-ArrowDisabled';
const ArrowLeft = 'HUD-ArrowRangeInput-ArrowLeft';
const ArrowIndex = 'HUD-ArrowRangeInput-ArrowIndex';
const ArrowRight = 'HUD-ArrowRangeInput-ArrowRight';

interface ReactProps {
  value: number;
  text: (value: number, maxValue: number) => string;
  setValue: (value: number) => void;
  minValue: number;
  maxValue: number;
  step: number;
  soundEvent?: SoundEvents;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AArrowRangeInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const isLeftDisabled = this.props.value === this.props.minValue;
    const isRightDisabled = this.props.value === this.props.maxValue;
    const leftArrowClassNames = [Arrow, ArrowLeft];
    if (isLeftDisabled) {
      leftArrowClassNames.push(ArrowDisabled);
    }
    const rightArrowClassNames = [Arrow, ArrowRight];
    if (isRightDisabled) {
      rightArrowClassNames.push(ArrowDisabled);
    }
    return (
      <div className={Root}>
        <div
          className={leftArrowClassNames.join(' ')}
          onClick={() => {
            if (!isLeftDisabled) {
              if (this.props.soundEvent) {
                clientAPI.playGameSound(this.props.soundEvent);
              }
              this.props.setValue(this.props.value - this.props.step);
            }
          }}
        />
        <div className={ArrowIndex}>{this.props.text(this.props.value, this.props.maxValue)}</div>
        <div
          className={rightArrowClassNames.join(' ')}
          onClick={() => {
            if (!isRightDisabled) {
              if (this.props.soundEvent) {
                clientAPI.playGameSound(this.props.soundEvent);
              }
              this.props.setValue(this.props.value + this.props.step);
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const ArrowRangeInput = connect(mapStateToProps)(AArrowRangeInput);
