/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:32
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 08:37:10
 */

import * as React from 'react';
import { DropDownSelect } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Ingredient } from '../../services/types';
import { Item, Template, Recipe, InventoryItem } from '../../services/types';
import Ingredients from '../Ingredients';

import Label from '../Label';
import Select from '../Select';
import RecipeSelect from '../RecipeSelect';
import TemplateSelect from '../TemplateSelect';
import NameInput from '../NameInput';
import QualityInput from '../QualityInput';

import { JobState, RecipesState, TemplatesState } from '../../services/session/reducer';

export interface JobDetailsProps {
  job: JobState;
  set: () => void;
  start: () => void;
  collect: () => void;
  cancel: () => void;
  setQuality: (quality: number) => void;
  setName: (name: string) => void;
  setRecipe: (recipe: Recipe) => void;
  setTemplate: (template: Template) => void;
  addIngredient: (item: InventoryItem, qty: number) => void;
  removeIngredient: (item: InventoryItem) => void;
}

export const JobDetails = (props: JobDetailsProps) => {
  const job = props.job;
  const type = job.type;

  // If no vox type set yet...
  if (!type) return (
    <div className='job-details'>
      <div>Select a Job Type!</div>
    </div>
  );

  const ready = true; /* TODO type && job.quality > 0
                && (type === 'make' ? job.name && job.template : job.recipe); */
  return (
    <div className='job-details'>
      <div className='job-properties'>
        {<QualityInput onChange={props.setQuality}/>}
        {type === 'make' && <NameInput onChange={props.setName}/>}
        {type !== 'make' && <RecipeSelect onSelect={props.setRecipe}/>}
        {type === 'make' && (
          <div>
            <TemplateSelect type='armor' onSelect={props.setTemplate}/>
            <TemplateSelect type='weapons' onSelect={props.setTemplate}/>
          </div>
        )}
      </div>
      <Ingredients
        job={type}
        ingredients={props.job.ingredients}
        add={props.addIngredient}
        remove={props.removeIngredient}
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
