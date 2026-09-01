/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

const Root = 'HUD-FactionNumberSelector-Root';
const Arrow = 'HUD-FactionNumberSelector-Arrow';
const Text = 'HUD-FactionNumberSelector-Text';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  factionIDOverride?: string;
  minValue?: number;
  maxValue?: number;
  onValueChanged?: (newValue: number) => void;
  soundEventArrowClicked?: SoundEvents;
  soundEventPlusClicked?: SoundEvents;
  soundEventPlusShiftClicked?: SoundEvents;
  soundEventMinusClicked?: SoundEvents;
  soundEventMinusShiftClicked?: SoundEvents;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionNumberSelector extends React.Component<Props> {
  render(): JSX.Element {
    let {
      value,
      minValue,
      maxValue,
      onValueChanged,
      uiFactionID,
      factionIDOverride,
      dispatch,
      className,
      ...otherProps
    } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    minValue = minValue ?? Number.MIN_SAFE_INTEGER;
    maxValue = maxValue ?? Number.MAX_SAFE_INTEGER;

    const canDecrease = value > minValue;
    const canIncrease = value < maxValue;

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        <img
          className={`${Arrow} ${canDecrease ? '' : 'disabled'}`}
          src={factionData.arrowLeftImage}
          onClick={canDecrease ? this.onDecrementClicked.bind(this) : undefined}
        />
        <div className={Text}>{value.toFixed(0)}</div>
        <img
          className={`${Arrow} right ${canIncrease ? '' : 'disabled'}`}
          src={factionData.arrowLeftImage}
          onClick={canIncrease ? this.onIncrementClicked.bind(this) : undefined}
        />
      </div>
    );
  }

  private onDecrementClicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const diff = e.shiftKey ? 10 : 1;
    const newValue = Math.max(this.props.minValue ?? Number.MIN_SAFE_INTEGER, this.props.value - diff);

    this.props.onValueChanged(newValue);

    if (this.props.soundEventArrowClicked) {
      clientAPI.playGameSound(this.props.soundEventArrowClicked);
    }

    if (e.shiftKey && this.props.soundEventMinusShiftClicked) {
      clientAPI.playGameSound(this.props.soundEventMinusShiftClicked);
    } else if (this.props.soundEventMinusClicked) {
      clientAPI.playGameSound(this.props.soundEventMinusClicked);
    }
  }

  private onIncrementClicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const diff = e.shiftKey ? 10 : 1;
    const newValue = Math.min(this.props.maxValue ?? Number.MAX_SAFE_INTEGER, this.props.value + diff);

    this.props.onValueChanged(newValue);

    if (this.props.soundEventArrowClicked) {
      clientAPI.playGameSound(this.props.soundEventArrowClicked);
    }

    if (e.shiftKey && this.props.soundEventPlusShiftClicked) {
      clientAPI.playGameSound(this.props.soundEventPlusShiftClicked);
    } else if (this.props.soundEventPlusClicked) {
      clientAPI.playGameSound(this.props.soundEventPlusClicked);
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionNumberSelector = connect(mapStateToProps)(AFactionNumberSelector);
