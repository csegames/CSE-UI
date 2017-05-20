/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-06 16:09:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 20:45:03
 */

import * as React from 'react';
import { Ingredient } from '../../services/types';
import IngredientItem from '../IngredientItem';
import PossibleIngredients from '../PossibleIngredients';
import Select from '../Select';
import Input from '../Input';
import Label from '../Label';

import { InventoryItem } from '../../services/types';

export interface IngredientsProps {
  job: string;
  ingredients: Ingredient[];
  add: (item: InventoryItem, qty: number) => void;
  remove: (item: InventoryItem) => void;
}

export interface IngredientsState {
  selectedIngredient: InventoryItem;
  qty: number;
}

class Ingredients extends React.Component<IngredientsProps, IngredientsState> {
  constructor(props: IngredientsProps) {
    super(props);
    this.state = { selectedIngredient: null, qty: 1 };
  }

  public render() {
    const props = this.props;

    if (!props.job) return null;
    const ingredients = {};

    // Select inventory item
    const select = (item: InventoryItem) => {
      this.setState({ selectedIngredient: item });
    };

    // Render inventory item
    const render = (item: InventoryItem) => <div>{item.name}</div>;

    // ingredient qty
    const onChange = (value: string) => {
      this.setState({ qty: ((value as any) | 0) || 1 });
    };

    // show already loaded ingredients
    const loaded = props.ingredients.map((ingredient: Ingredient, i: number) => {
      ingredients[ingredient.id] = ingredient;
      return <IngredientItem key={i} ingredient={ingredient} />;
    });
    const last = props.ingredients.length && props.ingredients[props.ingredients.length - 1];
    const ready = this.state.selectedIngredient && this.state.qty > 0;
    const qtyok = this.state.selectedIngredient && this.state.selectedIngredient.stats.unitCount > 1;

    return (
      <div className='job-ingredients'>
        <h1 className='ingredients-title'>Ingredients...</h1>
        <div className='add-ingredient'>
          <PossibleIngredients selectedItem={this.state.selectedIngredient} onSelect={select}/>
          <span className='times'>x</span>
          <Input disabled={!qtyok} onChange={onChange} size={3} value={this.state.qty.toString()} />
          <button disabled={!ready} className='add' onClick={this.addIngredient}>Add Ingredient</button>
        </div>
        <div className='loaded-ingredients'>
          <div>{loaded}</div>
          { last
            ? <button onClick={() => props.remove(last)}><i className='remove fa fa-times'></i> Remove Last</button>
            : undefined }
        </div>
      </div>
    );
  }

  private addIngredient = () => {
    const { selectedIngredient, qty } = this.state;
    this.props.add(selectedIngredient, qty);
    this.setState({ selectedIngredient: null, qty: 1 });
  }
}

export default Ingredients;
