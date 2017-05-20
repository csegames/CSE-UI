/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-14 18:15:30
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 18:20:11
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../../../services/session/reducer';
import Select from '../../../Select';
import { Ingredient, InventoryItem } from '../../../../services/types';

interface FilteredItemsReduxProps {
  dispatch?: (action: any) => void;
  possibleIngredients?: Ingredient[];
}

const select = (state: GlobalState, props: FilteredItemsProps): FilteredItemsReduxProps => {
  const possibleIngredients = [...state.job.possibleIngredients];
  console.log('POSSIBLE INGREDIENTS ' + JSON.stringify(possibleIngredients));
  return { possibleIngredients };
};

export interface FilteredItemsProps extends FilteredItemsReduxProps {
  selectedItem: InventoryItem;
  items: InventoryItem[];
  onSelect: (item: InventoryItem) => void;
}

export interface FilteredItemsState {}

export class FilteredItems extends React.Component<FilteredItemsProps, FilteredItemsState> {
  public render() {
    let items: InventoryItem[] = [];
    if (this.props.possibleIngredients && this.props.items) {
      items = this.props.possibleIngredients.map<InventoryItem>((ingredient: Ingredient) => {
        console.log('FIND ' + JSON.stringify(ingredient));
        const matching = this.props.items.filter((item: InventoryItem) => {
          return item.name === ingredient.name && ingredient.stats.unitCount === item.stats.unitCount;
        });
        console.log('FOUND ' + JSON.stringify(matching));
        return matching[0];
      });
      console.log('FILTERED ITEMS ' + JSON.stringify(items));
    }
    const render = (item: InventoryItem) => item && (
      <div className='inventory-item'>
        <span className='name'>{item.name}</span>
        <span className='quantity'>x{item.stats.unitCount}</span>
        <span className='quality'>@ {(item.stats.quality * 100) | 0}%</span>
      </div>
    );
    return (
      <Select items={items}
        onSelectedItemChanged={this.props.onSelect}
        renderActiveItem={render}
        renderListItem={render}
        selectedItem={this.props.selectedItem}
        />
    );
  }
}

export default connect(select)(FilteredItems);

