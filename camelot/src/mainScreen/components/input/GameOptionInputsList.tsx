/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { GameOption, OptionCategory, SelectValue } from '@csegames/library/dist/_baseGame/types/Options';
import { game } from '@csegames/library/dist/_baseGame';
import { GameOptionInput } from './GameOptionInput';
import Fuse from 'fuse.js/dist/fuse';
import { updateAdvanceGameOption } from '../../redux/gameSettingsSlice';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

interface ReactProps {
  category: OptionCategory;
  getValue: (option: GameOption) => number | boolean | SelectValue;
  setValue: (option: GameOption, value: number | boolean | SelectValue) => void;
  searchValue: string;
  isAdvance?: boolean;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AGameOptionInputsList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <>
        {this.getOptions().map((option) => {
          const setValue = (value: number | boolean | SelectValue) => {
            if (this.props.isAdvance) {
              // Advance options should be applied immediately.
              const advanceOption = cloneDeep(option);
              advanceOption.value = value;
              const originalOption = cloneDeep(option);
              this.props.dispatch(updateAdvanceGameOption([advanceOption, originalOption]));
              game.setOptionsAsync([advanceOption]).then((result) => {
                if (!result.success) {
                  console.warn('SetOptionsAsync failed to apply all requested changes.', result);
                }
              });
            }
            this.props.setValue(option, value);
          };
          return (
            <GameOptionInput
              option={option}
              value={this.props.getValue(option)}
              setValue={setValue.bind(this)}
              key={option.name}
            />
          );
        })}
      </>
    );
  }

  getOptions(): GameOption[] {
    const options = Object.values(game.options).filter((option) => option.category === this.props.category);
    const pattern = this.props.searchValue.replace(/ /g, '').toLowerCase();
    if (pattern) {
      const fuse = new Fuse(options, {
        isCaseSensitive: false,
        shouldSort: true,
        keys: ['displayName']
      });
      const results = fuse.search(pattern);
      return results.map((result) => result.item);
    }
    return options;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const GameOptionInputsList = connect(mapStateToProps)(AGameOptionInputsList);
