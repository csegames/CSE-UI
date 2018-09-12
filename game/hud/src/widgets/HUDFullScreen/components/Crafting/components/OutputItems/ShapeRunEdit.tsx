/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { debounce, isEmpty } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { RecipeData, InputItem } from '../../CraftingBase';
import { getJobContext } from '../../lib/utils';
import NumberWheel from '../NumberWheel';
import { InventoryContext } from '../../../ItemShared/InventoryContext';
import { VoxJob, InventoryItem, ShapeRecipeDefRef } from 'gql/interfaces';

const ShapeRunEditContainer = styled.div`
  display: block;
`;

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  selectedRecipe: RecipeData;
  shapeJobRunCount: number;
  inventoryItems: InventoryItem.Fragment[];
  inputItems: InputItem[];
  onShapeJobRunCountChange: (runCount: number) => void;
}

export interface ComponentProps {
  jobNumber: number;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  minValue: number;
  maxValue: number;
}

class ShapeRun extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      minValue: 0,
      maxValue: 0,
    };
    this.onCountChange = debounce(this.onCountChange, 200);
  }

  public render() {
    const { selectedRecipe } = this.props;
    if (!selectedRecipe) return null;

    return (
      <ShapeRunEditContainer>
        <NumberWheel
          defaultValue={this.getDefaultShapeRun()}
          maxValue={this.state.maxValue}
          minValue={this.state.minValue}
          maxCutoffValue={this.state.maxValue}
          onSelectValue={this.onCountChange}
          prevValueDecorator={'x'}
        />
      </ShapeRunEditContainer>
    );
  }

  public componentDidMount() {
    const { minValue, maxValue } = this.getMinAndMaxValue();
    this.setState({ minValue, maxValue });
  }

  public componentDidUpdate(prevProps: Props) {
    const recipeChange = prevProps.voxJob && this.props.voxJob && prevProps.voxJob.recipeID !== this.props.voxJob.recipeID;
    const outputItemsUpdated = prevProps.voxJob && this.props.voxJob &&
      ((isEmpty(prevProps.voxJob.outputItems) && !isEmpty(this.props.voxJob.outputItems)) ||
      !isEmpty(prevProps.voxJob.outputItems) && isEmpty(this.props.voxJob.outputItems));
    if (recipeChange || outputItemsUpdated) {
      const { minValue, maxValue } = this.getMinAndMaxValue();
      this.setState({ minValue, maxValue });
    }
  }

  private onCountChange = (newVal: number) => {
    this.props.onShapeJobRunCountChange(newVal);
  }

  private getMinAndMaxValue = () => {
    const { voxJob, selectedRecipe, inputItems, inventoryItems } = this.props;

    if (voxJob && isEmpty(voxJob.outputItems)) {
      // Job is not ready to be started. This means input items have not been fully configured, and ratios are not clear.
      return {
        minValue: 0,
        maxValue: 0,
      };
    }

    const recipeDef = (selectedRecipe.def as ShapeRecipeDefRef);
    const ingredientIdToPossibleRunCount: { [id: string]: number } = {};

    // First add the ingredient ids to both maps
    recipeDef.ingredients.forEach((ingredient) => {
      // Search players inventory for ingredient
      const inputIngredient = inputItems.find(item =>
        item.item.staticDefinition.id === ingredient.ingredient.id);
      if (!inputIngredient) {
        ingredientIdToPossibleRunCount[ingredient.ingredient.id] = 0;
        return;
      }

      const potentialIngredient = inventoryItems.find(item => ingredient.ingredient.id === item.staticDefinition.id);
      const ratioCount = inputIngredient.item.stats.item.unitCount / (this.props.shapeJobRunCount || 1);
      if (!potentialIngredient) {
        // Couldn't find any potential ingredients in inventory
        ingredientIdToPossibleRunCount[ingredient.ingredient.id] =
          Math.floor(inputIngredient.item.stats.item.unitCount / ratioCount);
        return;
      }

      if (potentialIngredient.stats.item.quality <= ingredient.maxQuality &&
          potentialIngredient.stats.item.quality >= ingredient.minQuality) {
        // If we're here, this is a valid ingredient. Now check how many jobs can be run for this one ingredient given
        // the ratio unit count for that specific ingredient.
        const howManyTimes = Math.floor(potentialIngredient.stats.item.unitCount / ratioCount);
        if (howManyTimes > 0) ingredientIdToPossibleRunCount[ingredient.ingredient.id] = howManyTimes;
      }
    });

    // Now go through possible run counts and choose the lowest as the max.
    let maxValue: number;
    Object.keys(ingredientIdToPossibleRunCount).forEach((ingredientId) => {
      if (!maxValue || ingredientIdToPossibleRunCount[ingredientId] < maxValue) {
        maxValue = ingredientIdToPossibleRunCount[ingredientId];
      }
    });

    return {
      minValue: 1,
      maxValue: maxValue || 1,
    };
  }

  private getDefaultShapeRun = () => {
    if (!this.props.voxJob || isEmpty(this.props.voxJob.outputItems)) {
      return 0;
    }

    return 1;
  }
}

class ShapeRunWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <InventoryContext.Consumer>
        {({ inventoryItems }) => (
          <JobContext.Consumer>
            {({ voxJob, inputItems, selectedRecipe, shapeJobRunCount, onShapeJobRunCountChange }) => {
              return (
                <ShapeRun
                  {...this.props}
                  voxJob={voxJob}
                  inputItems={inputItems}
                  selectedRecipe={selectedRecipe}
                  shapeJobRunCount={shapeJobRunCount}
                  onShapeJobRunCountChange={onShapeJobRunCountChange}
                  inventoryItems={inventoryItems}
                />
              );
            }}
          </JobContext.Consumer>
        )}
      </InventoryContext.Consumer>
    );
  }
}

export default ShapeRunWithInjectedContext;

