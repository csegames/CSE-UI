/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-15 07:29:27
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:50:11
 */

import * as React from 'react';
import { Ingredient } from '../services/types';
import { StyleSheet, css, merge, ingredientItem, IngredientItemStyles } from '../styles';
import Icon from './Icon';

export interface IngredientItemProps {
  ingredient: Ingredient;
  qty: number;
  total: number;
  style?: Partial<IngredientItemStyles>;
}

export const IngredientItem = (props: IngredientItemProps) => {
  const ss = StyleSheet.create(merge({}, ingredientItem, props.style));
  const { name, stats } = props.ingredient;
  const pcnt = props.total && (props.qty / props.total * 100).toFixed(1);
  return (
    <div className={css(ss.ingredientItem)}>
      <Icon className={css(ss.icon)} src={props.ingredient.static.icon}/>
      <span className={css(ss.qty)}>{props.qty}</span>
      <span className={css(ss.pcnt)}>({pcnt}%)</span>
      <span className={css(ss.times)}>x</span>
      <span className={css(ss.name)}>{name} @ {stats ? (stats.quality * 100) | 0 : 0}% {stats.weight}KG</span>
    </div>
  );
};

export default IngredientItem;
