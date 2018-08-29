/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Ingredient } from '../services/types';
import { StyleSheet, cssAphrodite, merge, ingredientItem, IngredientItemStyles } from '../styles';
import Icon from './Icon';
import { qualityToPercent, roundedMass } from '../services/util';

export interface IngredientItemProps {
  ingredient: Ingredient;
  qty: number;
  total: number;
  style?: Partial<IngredientItemStyles>;
}

export const IngredientItem = (props: IngredientItemProps) => {
  const ss = StyleSheet.create(merge({}, ingredientItem, props.style));
  const { name, stats } = props.ingredient;
  // const pcnt = props.total && (props.qty / props.total * 100).toFixed(0);
  const slot = props.ingredient.slot && props.ingredient.slot.replace('Ingredient', '').replace('NonRecipe', '');
  return (
    <div className={cssAphrodite(ss.ingredientItem)}>
      <Icon className={cssAphrodite(ss.icon)} src={props.ingredient.static.icon}/>
      <span className={cssAphrodite(ss.name)}>{name}</span>
      <span className={cssAphrodite(ss.slot)}>{slot}</span>
      <span className={cssAphrodite(ss.qty)}>{props.qty}</span>
      {/* <span className={cssAphrodite(ss.pcnt)}></span> */}
      <span className={cssAphrodite(ss.times)}>({Number(roundedMass(stats.weight).toFixed(3))}kg)</span>
      <span className={cssAphrodite(ss.name)}>@ {stats ? qualityToPercent(stats.quality) | 0 : NaN}%</span>
    </div>
  );
};

export default IngredientItem;
