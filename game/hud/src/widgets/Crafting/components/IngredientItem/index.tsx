/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-15 07:29:27
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 23:08:48
 */

import * as React from 'react';
import { Ingredient, InventoryItem } from '../../services/types';

export interface IngredientProps {
  ingredient: Ingredient;
}

export const IngredientItem = (props: IngredientProps) => {
  const { id, name, stats } = props.ingredient;
  return (
    <div className='ingredient'>
      <span className='qty'>{stats.unitCount}</span>
      <span className='times'>x</span>
      <span className='name'>{name} @ {(stats.quality * 100) | 0}%</span>
    </div>
  );
};

export default IngredientItem;
