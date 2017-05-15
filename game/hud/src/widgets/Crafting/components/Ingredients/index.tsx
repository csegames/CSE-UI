/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-06 16:09:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 08:44:11
 */

import * as React from 'react';
import { Ingredient } from '../../services/types';
import PossibleIngredients from '../PossibleIngredients';
import IngredientItem from '../IngredientItem';
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

export const Ingredients = (props: IngredientsProps) => {
  if (!props.job) return null;
  let selected: InventoryItem;
  const ingredients = {};

  // Select inventory item
  const select = (item: InventoryItem) => {
    selected = item;
  };

  // Render inventory item
  const render = (item: InventoryItem) => <div>{item.name}</div>;

  // ingredient qty
  let qty: number = 1;
  const count = (el: HTMLInputElement) => {
    qty = ((el.value as any) | 0) || 1;
  };

  // show already loaded ingredients
  const loaded = props.ingredients.map((ingredient: Ingredient, i: number) => {
    ingredients[ingredient.id] = ingredient;
    return (
      <IngredientItem
        key={ingredient.id}
        ingredient={ingredient}
        />
    );
  });
  const last = props.ingredients.length && props.ingredients[props.ingredients.length - 1];

  return (
    <div className='job-ingredients'>
      <h1 className='ingredients-title'>Ingredients...</h1>
      <div className='add-ingredient'>
        <PossibleIngredients onSelect={select}/>
        <span className='times'>x</span>
        <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => count(e.target)} size={2} value={'1'} />
        <button className='add' onClick={_ => selected && props.add(selected, qty)}>Add Ingredient</button>
      </div>
      <div className='loaded-ingredients'>
        {loaded}
        { last
          ? <button onClick={() => props.remove(last)}><i className='remove fa fa-times'></i> Remove Last</button>
          : undefined }
      </div>
    </div>
  );
};

export default Ingredients;
