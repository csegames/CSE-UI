/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 20:36:49
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-11 12:40:03
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../services/session/reducer';
import Select from '../Select';
import { Ingredient, InventoryItem } from '../../services/types';
import { StyleSheet, css, merge, possibleIngredients, PossibleIngredientsStyles } from '../../styles';
import Icon from '../Icon';

interface PossibleIngredientsReduxProps {
  dispatch?: (action: any) => void;
  possibleIngredients?: InventoryItem[];
  style?: Partial<PossibleIngredientsStyles>;
}

const select = (state: GlobalState, props: PossibleIngredientsProps): PossibleIngredientsReduxProps => {
  const possibleIngredients = [...state.job.possibleIngredients];
  return { possibleIngredients };
};

export interface PossibleIngredientsProps extends PossibleIngredientsReduxProps {
  selectedItem: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

export interface PossibleIngredientsState {}

export class PossibleIngredients extends React.Component<PossibleIngredientsProps, PossibleIngredientsState> {
  public render() {
    const ss = StyleSheet.create(merge({}, possibleIngredients, this.props.style));
    const render = (item: InventoryItem) => item && (
      <div className={'possible-ingredient ' + css(ss.container)}>
        <Icon className={css(ss.span, ss.icon)} src={item.static.icon}/>
        <span className={css(ss.span, ss.name)}>{item.name}</span>
        <span className={css(ss.span, ss.quantity)}>x{item.stats.unitCount}</span>
        <span className={css(ss.span, ss.quality)}>@ {(item.stats.quality * 100) | 0}%</span>
      </div>
    );
    return (
      <Select
        style={{container: possibleIngredients.select}}
        items={this.props.possibleIngredients}
        onSelectedItemChanged={this.props.onSelect}
        renderActiveItem={render}
        renderListItem={render}
        selectedItem={this.props.selectedItem}
        />
    );
  }
}

export default connect(select)(PossibleIngredients);
