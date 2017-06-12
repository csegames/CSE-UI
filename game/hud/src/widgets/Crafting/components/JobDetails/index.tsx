/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:32
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-12 18:26:39
 */

import * as React from 'react';
import { DropDownSelect } from 'camelot-unchained';
import { Ingredient } from '../../services/types';
import { Item, Template, Recipe, InventoryItem } from '../../services/types';
import { StyleSheet, css, merge, jobDetails, JobDetailsStyles } from '../../styles';
import Ingredients from '../Ingredients';

import Label from '../Label';
import Button from '../Button';
import Select from '../Select';
import RecipeSelect from '../RecipeSelect';
import TemplateSelect from '../TemplateSelect';
import NameInput from '../NameInput';
import QualityInput from '../QualityInput';
import QuantityInput from '../QuantityInput';
import VoxMessage from '../VoxMessage';
import OutputItems from '../OutputItems';

import { JobState, RecipesState, TemplatesState } from '../../services/session/reducer';

export interface JobDetailsProps {
  job: JobState;
  start: () => void;
  collect: () => void;
  cancel: () => void;
  setQuality: (quality: number) => void;
  setCount: (count: number) => void;
  setName: (name: string) => void;
  setRecipe: (recipe: Recipe) => void;
  setTemplate: (template: Template) => void;
  addIngredient: (item: InventoryItem, qty: number) => void;
  removeIngredient: (ingredient: Ingredient) => void;
  style?: Partial<JobDetailsStyles>;
}

export const JobDetails = (props: JobDetailsProps) => {
  const ss = StyleSheet.create(merge({}, jobDetails, props.style));
  const buttonStyle = { container: jobDetails.button };
  const job = props.job;
  const type = job.type;

  // enabled state of buttons
  const canStart = job.outputItems && job.outputItems.length && job.status === 'Configuring';
  const canCollect = job.status === 'Finished';
  const canCancel = job.status === 'Running';     // TODO: What is the actual status?
  const canQuality = job.type === 'refine';
  const canQuantity = job.type === 'make';

  // If no vox type set yet...
  if (!type) {
    return (
      <div className={css(ss.container)}>
        <div>Select a Job Type!</div>
        <VoxMessage/>
      </div>
    );
  }

  return (
    <div className={css(ss.container)}>
      <div className={css(ss.properties)}>
        {type === 'make' && <NameInput onChange={props.setName}/>}
        {type !== 'make' && <RecipeSelect onSelect={props.setRecipe}/>}
        {type === 'make' && <TemplateSelect onSelect={props.setTemplate}/>}
      </div>
      <Ingredients
        add={props.addIngredient}
        remove={props.removeIngredient}
        />
      <OutputItems/>
      <VoxMessage/>
      <div className={'job-details ' + css(ss.buttons)}>
        <QualityInput disabled={!canQuality} onChange={props.setQuality}/>
        <QuantityInput disabled={!canQuantity} onChange={props.setCount}/>
        <Button style={buttonStyle} disabled={!canStart} onClick={() => props.start()}>Start</Button>
        <Button style={buttonStyle} disabled={!canCollect} onClick={() => props.collect()}>Collect</Button>
        <Button style={buttonStyle} disabled={!canCancel} onClick={() => props.cancel()}>Cancel</Button>
      </div>
    </div>
  );
};

export default JobDetails;
