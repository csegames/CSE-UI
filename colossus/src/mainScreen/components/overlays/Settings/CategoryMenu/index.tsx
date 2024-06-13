/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CheckboxRow } from './CheckboxRow';
import { SliderRow } from './SliderRow';
import { DropdownRow } from './DropdownRow';
import { MenuBody } from '../Menu';
import { game } from '@csegames/library/dist/_baseGame';
import {
  BooleanOption,
  GameOption,
  IntRangeOption,
  OptionCategory,
  OptionKind,
  SelectOption
} from '@csegames/library/dist/_baseGame/types/Options';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  dequeuePendingGameOptionChange,
  enqueuePendingGameOptionChange,
  updateAdvanceGameOption
} from '../../../../redux/gameSettingsSlice';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

const Container = 'Settings-CategoryMenu-Container';

interface ReactProps {
  optionCategory: OptionCategory;
  onOptionChange?: (option: GameOption) => void;
}

interface InjectedProps {
  pendingSettingsChanges: Dictionary<GameOption>;
  advanceSettingsChanges: Dictionary<GameOption>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ACategoryMenu extends React.Component<Props> {
  public render() {
    const gameOptions = this.getOptions();
    return (
      <div className={MenuBody}>
        <div className={Container}>{gameOptions.map(this.renderRow.bind(this))}</div>
      </div>
    );
  }

  private getOptions(): GameOption[] {
    // Start from the saved options.  This is a new array, but the GameOption objects are all the same ones
    // stored in game.options, so we shouldn't mutate them.
    const options = Object.values(game.options).filter((o) => o.category === this.props.optionCategory);
    // Then overlay all pending changes.
    options.forEach((option, index) => {
      if (this.props.pendingSettingsChanges[option.name]) {
        // The stuff in pendingSettingsChanges is cloned copies.
        options[index] = this.props.pendingSettingsChanges[option.name];
      } else if (this.props.advanceSettingsChanges[option.name]) {
        // The stuff in advanceSettingsChanges is cloned copies.
        options[index] = this.props.advanceSettingsChanges[option.name];
      }
    });

    return options;
  }

  public componentDidMount() {
    game.on('settings-reset-to-default', this.handleReset);
  }

  private handleReset = () => {
    this.setState({ options: game.options });
  };

  private onChange = (option: GameOption) => {
    if (this.props.onOptionChange) {
      this.props.onOptionChange(option);
    }

    if (option.category === OptionCategory.Audio) {
      // Audio options should be applied immediately.
      const savedOption = game.options[option.name];
      this.props.dispatch(updateAdvanceGameOption([option, cloneDeep(savedOption)]));
      game.setOptionsAsync([option]).then((result) => {
        if (!result.success) {
          console.warn('SetOptionsAsync failed to apply all requested changes.', result);
        }
      });
    } else {
      // Send the change to Redux.
      const savedOption = game.options[option.name];
      if (savedOption.value === option.value) {
        // They changed the setting back to its original value, so it no longer counts as a pending change.
        this.props.dispatch(dequeuePendingGameOptionChange(option));
      } else {
        // They changed the setting to a new value, so queue up the change for saving later.
        this.props.dispatch(enqueuePendingGameOptionChange(option));
      }
    }
  };

  private renderRow = (option: GameOption, index: number) => {
    switch (option.kind) {
      case OptionKind.Boolean:
        return <CheckboxRow key={index} option={option as BooleanOption} onChange={this.onChange} />;
      case OptionKind.IntRangeOption:
      case OptionKind.FloatRangeOption:
      case OptionKind.DoubleRangeOption: {
        return <SliderRow key={index} option={option as IntRangeOption} onChange={this.onChange} />;
      }
      case OptionKind.Select: {
        return <DropdownRow key={index} option={option as SelectOption} onChange={this.onChange} />;
      }
    }

    return <div>Option</div>;
  };
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { pendingSettingsChanges, advanceSettingsChanges } = state.gameSettings;

  return {
    ...ownProps,
    pendingSettingsChanges,
    advanceSettingsChanges
  };
}

export const CategoryMenu = connect(mapStateToProps)(ACategoryMenu);
