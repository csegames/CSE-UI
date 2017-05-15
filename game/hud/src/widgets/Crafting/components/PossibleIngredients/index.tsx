/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-15 05:17:25
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 07:17:15
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { InventoryItem } from '../../services/types';

export interface PossibleIngredientsReduxProps {
  dispatch?: (action: any) => void;
  ingredients?: InventoryItem[];
}

export interface PossibleIngredientsProps extends PossibleIngredientsReduxProps {
  onSelect: (recipe: InventoryItem) => void;
}

interface PossibleIngredientsState {
  selected: InventoryItem;
}

const select = (state: GlobalState, props: PossibleIngredientsProps) : PossibleIngredientsReduxProps => {
  return {
    ingredients: state.ingredients.ingredients,
  };
};

class PossibleIngredients extends React.Component<PossibleIngredientsProps, PossibleIngredientsState>{
  constructor(props: PossibleIngredientsProps) {
    super(props);
    this.state = { selected: null };
  }
  public render() {
    if (!this.props.ingredients) return null;
    const selectedItemIndex = this.props.ingredients.indexOf(this.state.selected);
    return (
      <Select
        items={this.props.ingredients || []}
        renderListItem={this.renderItem}
        renderActiveItem={this.renderActive}
        onSelectedItemChanged={this.onSelect}
        selectedItemIndex={selectedItemIndex}
        />
    );
  }
  private renderActive = (ingredient: InventoryItem) =>
    ingredient && <span key={ingredient.id} value={ingredient.id}>{ingredient.name}</span>
  private renderItem = (ingredient: InventoryItem) =>
    ingredient && <span key={ingredient.id} value={ingredient.id}>{ingredient.name}</span>
  private onSelect = (ingredient: InventoryItem) => {
    this.setState({ selected: ingredient });
    this.props.onSelect(ingredient);
  }
}

export default connect(select)(PossibleIngredients);
