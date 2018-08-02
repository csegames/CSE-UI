/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 20:36:49
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-09-29 20:42:40
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../services/session/reducer';
import Select from './Select';
import { StyleSheet, css, merge, possibleSlots, PossibleSlotsStyles } from '../styles';

interface PossibleSlotsReduxProps {
  possibleItemSlots?: string[];
}

const select = (state: GlobalState, props: PossibleSlotsProps): PossibleSlotsReduxProps => {
  const possibleItemSlots: string[] = [];
  state.job.possibleItemSlots.forEach((slot: string, index: number) => {
    possibleItemSlots.push(slot);
  });
  return { possibleItemSlots };
};

export interface PossibleSlotsProps extends PossibleSlotsReduxProps {
  selectedItem: string;
  disabled?: boolean;
  style?: Partial<PossibleSlotsStyles>;
  onSelect: (slot: string) => void;
  dispatch: (action: any) => void;
}

export interface PossibleSlotsState {}

export class PossibleSlots extends React.Component<PossibleSlotsProps, PossibleSlotsState> {
  public render() {
    const ss = StyleSheet.create(merge({}, possibleSlots, this.props.style));
    const render = (slot: string) => slot && (
      <div className={css(ss.possibleSlots)}>
        {slot && slot.replace('NonRecipe', 'Any')}
      </div>
    );
    return (
      <Select
        disabled={this.props.disabled}
        style={{ select: possibleSlots.select }}
        items={this.props.possibleItemSlots}
        onSelectedItemChanged={this.props.onSelect}
        renderActiveItem={render}
        renderListItem={render}
        selectedItem={this.props.selectedItem}
        />
    );
  }
}

export default connect(select)(PossibleSlots);
