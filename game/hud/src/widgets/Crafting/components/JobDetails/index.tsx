/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:32
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-11 22:38:08
 */

import * as React from 'react';
import { DropDownSelect } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Ingredient } from '../../services/types';
import { Item, Template, Recipe, InventoryItem } from '../../services/types';
import Ingredients from '../Ingredients';

import Label from '../Label';
import Select from '../Select';

import { JobState, RecipesState, TemplatesState } from '../../services/session/reducer';

export interface JobDetailsProps {
  job: JobState;
  recipes: RecipesState;
  templates: TemplatesState;
  set: () => void;
  start: () => void;
  collect: () => void;
  cancel: () => void;
  setQuality: (quality: number) => void;
  setName: (name: string) => void;
  setRecipe: (id: string) => void;
  setTemplate: (id: string) => void;
  addIngredient: (item: InventoryItem, qty: number) => void;
}

function makeSelect(label: string, data: Item[], set: (id: string) => void) {
  const changed = (item: Item) => {
    set(item.id);
  };
  const render = (item: Item) => {
    return (
        <span key={item.id} value={item.id}>{item.name}</span>
    );
  };
  return (
    <div>
      <Label>{ label }</Label>
      <Select items={data} renderActiveItem={render} renderListItem={render}
            onSelectedItemChanged={changed}/>
    </div>
  );
}

const recipe = (job: string, recipes: Recipe[], set: (id: string) => void) => {
  switch (job) {
    case 'purify':
    case 'grind':
    case 'refine':
    case 'shape':
    case 'block':
      return makeSelect(job[0].toUpperCase() + job.substr(1) + ' Recipe', recipes, set);
  }
};

const template = (
  job: string,
  armour: Template[],
  weapons: Template[],
  setArmor: (id: string) => void,
  setWeapon: (id: string) => void,
) => {
  if (job !== 'make') return;
  return (
    <div>
      { makeSelect('Armour Template', armour, setArmor) }
      { makeSelect('Weapon Template', weapons, setWeapon) }
    </div>
  );
};

const quality = (set: (quality: number) => void) => {
    const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = ((e.target.value as any) | 0);
      if (value < 0) {
        e.target.value = '';
      } else if (value > 100) {
        e.target.value = '100';
      } else {
        set(value);
      }
    };
    return (
      <div>
        <Label>Quality</Label>
        <input type='text' size={3} onChange={changed}/>%
      </div>
    );
};

const name = (type: string, set: (name: string) => void) => {
    if (type !== 'make') return;
    const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
      set(e.target.value);
    };
    return (
      <div>
        <Label>Name</Label>
        <input type='text' size={32} onChange={changed}/>
      </div>
    );
};

export const JobDetails = (props: JobDetailsProps) => {
  const job = props.job;
  const type = job.type;
  if (!type) return <div className='job-details'>AAA</div>;
  const ready = type && job.quality > 0
                && (type === 'make' ? job.name && job.template : job.recipe);
  return (
    <div className='job-details'>
      <div className='job-properties'>
        {quality(props.setQuality)}
        {name(type, props.setName)}
        {recipe(type, props.recipes[type], props.setRecipe)}
        {template(type, props.templates.armour, props.templates.weapons, props.setTemplate, props.setTemplate)}
      </div>
      <Ingredients
        job={type}
        ingredients={props.job.ingredients}
        add={props.addIngredient}
        />
      <div className='job-buttons'>
        <button disabled={!props.job} onClick={() => props.set()}>Set</button>
        <button disabled={!ready} onClick={() => props.start()}>Start</button>
        <button onClick={() => props.collect()}>Collect</button>
        <button onClick={() => props.cancel()}>Cancel</button>
      </div>
    </div>
  );
};

export default JobDetails;
