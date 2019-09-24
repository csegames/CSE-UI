/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { CheckboxRow } from './CheckboxRow';
import { SliderRow } from './SliderRow';
import { DropdownRow } from './DropdownRow';

const Container = styled.div`
  width: calc(100% - 20px);
  height: 100%;
  padding: 0 10px;
`;

export interface Props {
  optionCategory: OptionCategory;
  onOptionChange: (option: GameOption) => void;
}

export interface State {
  options: ArrayMap<GameOption>;
}

export class CategoryMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      options: game.options,
    };
  }

  public render() {
    const gameOptions = Object.values(this.state.options).filter(o => o.category === this.props.optionCategory);
    return (
      <Container>
        {gameOptions.map(this.renderRow)}
      </Container>
    );
  }

  public componentDidMount() {
    game.on('settings-reset-to-default', this.handleReset);
  }

  private handleReset = () => {
    this.setState({ options: game.options });
  }

  private onChange = (option: GameOption) => {
    this.props.onOptionChange(option);

    const optionsClone = cloneDeep<ArrayMap<GameOption>>(this.state.options);
    optionsClone[option.name] = option;
    this.setState({ options: optionsClone });
  }

  private renderRow = (option: GameOption) => {
    switch (option.kind) {
      case OptionKind.Boolean:
        return (
          <CheckboxRow option={option as BooleanOption} onChange={this.onChange} />
        );
      case OptionKind.IntRangeOption:
      case OptionKind.FloatRangeOption:
      case OptionKind.DoubleRangeOption:
        {
          return (
            <SliderRow option={option as IntRangeOption} onChange={this.onChange} />
          );
        }
      case OptionKind.Select:
        {
          return (
            <DropdownRow option={option as SelectOption} onChange={this.onChange} />
          );
        }
    }

    return (
      <div>Option</div>
    );
  }
}
