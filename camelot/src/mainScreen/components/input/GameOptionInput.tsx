/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import {
  GameOption,
  OptionCategory,
  OptionKind,
  RangeOption,
  SelectOption,
  SelectValue
} from '@csegames/library/dist/_baseGame/types/Options';
import { BooleanInput } from './BooleanInput';
import { NumberInput } from './NumberInput';
import { SelectValueInput } from './SelectValueInput';

interface ReactProps {
  option: GameOption;
  value: number | boolean | SelectValue;
  setValue: (value: number | boolean | SelectValue) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AGameOptionInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    this.props.option.value;
    const text = this.props.option.displayName;
    const value = this.props.value;
    switch (this.props.option.kind) {
      case OptionKind.Boolean: {
        if (typeof value !== 'boolean') {
          console.error('Non-boolean value supplied for boolean OptionInput');
        }
        return <BooleanInput text={text} value={value as boolean} setValue={this.props.setValue} />;
      }
      case OptionKind.IntRangeOption:
      case OptionKind.FloatRangeOption:
      case OptionKind.DoubleRangeOption: {
        const option = this.props.option as RangeOption;
        if (typeof value !== 'number') {
          console.error('Non-number value supplied for number OptionInput');
        }
        return (
          <NumberInput
            text={text}
            value={value as number}
            step={option.increment}
            setValue={this.props.setValue}
            minValue={option.minValue}
            maxValue={option.maxValue}
            playVolumeFeedback={option.category === OptionCategory.Audio}
          />
        );
      }
      case OptionKind.Select: {
        const option = this.props.option as SelectOption;
        if (typeof value !== 'object') {
          console.error('Non-select value supplied for select OptionInput');
        }
        return (
          <SelectValueInput
            text={text}
            value={value as SelectValue}
            values={option.selectValues}
            setValue={this.props.setValue}
          />
        );
      }
    }
    console.error(`GameOption kind ${this.props.option.kind} is not handled for input.`);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const GameOptionInput = connect(mapStateToProps)(AGameOptionInput);
