/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:32
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-06 18:15:36
 */

import * as React from 'react';
import { Ingredient } from '../../services/session/job';
import { InventoryItem } from '../../services/types';
import Ingredients from '../Ingredients';

import Label from '../Label';

export interface JobDetailsProps {
  job: string;
  ingredients: Ingredient[];
  set: () => void;
  start: () => void;
  collect: () => void;
  cancel: () => void;
  setQuality: (quality: number) => void;
  setName: (name: string) => void;
  setRecipe: (id: string) => void;
  setTemplate: (id: string) => void;
  addIngredient: (item: InventoryItem) => void;
}

function makeSelect(label: string) {
  return (
    <div>
      <Label>{ label }</Label>
      <select>
        <option></option>
        <option>dummy 1</option>
        <option>dummy 2</option>
        <option>dummy 3</option>
        <option>dummy 4</option>
        <option>dummy 5</option>
      </select>
    </div>
  );
}

const recipe = (job: string) => {
  switch (job) {
    case 'purify':
    case 'grind':
    case 'refine':
    case 'shape':
    case 'block':
      return makeSelect(job[0].toUpperCase() + job.substr(1) + ' Recipe');
  }
};

const template = (job: string) =>
  job === 'make'
  && <div>{ makeSelect('Armour Template') }{ makeSelect('Weapon Template') }</div>;

const quality = () =>
    <div>
      <Label>Quality</Label>
      <input type='text' size={3}/>%
    </div>
  ;

export const JobDetails = (props: JobDetailsProps) => {
  if (!props.job) return null;
  return (
    <div className='job-details'>
      <div className='job-properties'>
        {quality()}
        {recipe(props.job)}
        {template(props.job)}
      </div>
      <hr/>
      <Ingredients
        job={props.job}
        ingredients={props.ingredients}
        add={(item: InventoryItem) => props.addIngredient(item)}
        />
      <hr/>
      <div className='job-buttons'>
        <button onClick={() => props.set()}>Set</button>
        <button onClick={() => props.start()}>Start</button>
        <button onClick={() => props.collect()}>Collect</button>
        <button onClick={() => props.cancel()}>Cancel</button>
      </div>
    </div>
  );
};

export default JobDetails;
