/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../services/session/reducer';
import { Ingredient, Recipe, InventoryItem } from '../services/types';
import { StyleSheet, css, merge, jobDetails, JobDetailsStyles } from '../styles';
import Ingredients from './Ingredients';

import Button from './Button';
import RecipeSelect from './RecipeSelect';
import NameInput from './NameInput';
import QualityInput from './QualityInput';
import QuantityInput from './QuantityInput';
import VoxMessage from './VoxMessage';
import OutputItems from './OutputItems';

interface JobDetailsReduxProps {
  totalCraftingTime?: number;
  remaining?: number;
  outputItems?: InventoryItem[];
  status?: string;
  type?: string;
  dispatch?: (action: any) => void;
}

const select = (state: GlobalState, props: JobDetailsProps): JobDetailsReduxProps => {
  const job = state.job;
  return {
    remaining: state.ui.remaining,
    totalCraftingTime: job.totalCraftingTime,
    outputItems: job.outputItems,
    status: job.status,
    type: job.type,
  };
};

export interface JobDetailsProps extends JobDetailsReduxProps {
  start: () => void;
  collect: () => void;
  cancel: () => void;
  setQuality: (quality: number) => void;
  setCount: (count: number) => void;
  setName: (name: string) => void;
  setRecipe: (recipe: Recipe) => void;
  addIngredient: (item: InventoryItem, qty: number) => void;
  removeIngredient: (ingredient: Ingredient) => void;
  selectSlot: (slot: string) => void;
  style?: Partial<JobDetailsStyles>;
}

export const JobDetails = (props: JobDetailsProps) => {
  const ss = StyleSheet.create(merge({}, jobDetails, props.style));
  const buttonStyle = { button: jobDetails.button };
  const { type, status, outputItems } = props;

  // enabled state of buttons
  const canStart = outputItems && outputItems.length && status === 'Configuring';
  const canCollect = status === 'Finished';
  const canCancel = status === 'Running';     // TODO: What is the actual status?
  const canQuality = type === 'purify';
  const canQuantity = type === 'make';

  // If no vox type set yet...
  if (!type || type === 'invalid') {
    return (
      <div className={css(ss.jobDetails)}>
        <div>Select a Job Type!</div>
        <VoxMessage/>
      </div>
    );
  }

  return (
    <div className={css(ss.jobDetails) + ' job-details'}>
      <div className={css(ss.properties) + ' job-details-properties'}>
        {type === 'make' && <NameInput onChange={props.setName}/>}
        <RecipeSelect dispatch={props.dispatch} onSelect={props.setRecipe}/>
      </div>
      <div className={css(ss.ingredients) + ' job-details-ingredients'}>
        <Ingredients
          add={props.addIngredient}
          remove={props.removeIngredient}
          selectSlot={props.selectSlot}
          dispatch={props.dispatch}
          />
        <OutputItems/>
      </div>
      <VoxMessage/>
      <div className={css(ss.buttons) + ' job-details-footer'}>
        <QualityInput disabled={!canQuality} onChange={props.setQuality}/>
        <QuantityInput disabled={!canQuantity} onChange={props.setCount}/>
        <Button style={buttonStyle} disabled={!canStart} onClick={props.start}>Start</Button>
        <Button style={buttonStyle} disabled={!canCollect} onClick={props.collect}>Collect</Button>
        <Button style={buttonStyle} disabled={!canCancel} onClick={props.cancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default connect(select)(JobDetails);
