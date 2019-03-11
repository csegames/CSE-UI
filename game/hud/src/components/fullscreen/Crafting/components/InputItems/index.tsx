/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { InventoryItem, VoxJob, SubItemSlot, MakeRecipeDefRef } from 'gql/interfaces';
import { RecipeData, InputItem, RecipeType } from '../../CraftingBase';
import { getJobContext, getItemSlotForRecipe } from '../../lib/utils';
import InputItemComponent from './InputItem';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

declare const toastr: any;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 220px;
  left: 30px;
  top: 10px;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 286px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 450px;
  }

  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    left: 25px;
    top: 5px;
  }
`;

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  inputItems: InputItem[];
  selectedRecipe: RecipeData;
  onAddInputItem: (item: InventoryItem.Fragment, slot: SubItemSlot, unitCount?: number) => void;
  onRemoveInputItem: (item: InventoryItem.Fragment, slot: SubItemSlot) => void;
  onSwapInputItem: (swappedItem: InventoryItem.Fragment, slot: SubItemSlot, newItem: InventoryItem.Fragment,
    newUnitCount: number) => void;
}

export interface ComponentProps {
  jobNumber: number;
}

export type Props = InjectedProps & ComponentProps;

export interface InputItemSlotsData extends InputItem {
  possibleItemSlot: SubItemSlot | null;
}

class InputItems extends React.Component<Props> {
  public render() {
    const inputItems = this.getInputItems();
    return (
      <Container>
        {inputItems.map((inputItem, i) => {
          const { item, slot, possibleItemSlot } = inputItem;
          return (
            <InputItemComponent
              key={i}
              slotNumber={i}
              item={item}
              subItemSlot={slot}
              possibleItemSlot={possibleItemSlot}
              jobNumber={this.props.jobNumber}
              onAddInputItem={this.onAddInputItem}
              onRemoveInputItem={this.onRemoveInputItem}
              onSwapInputItem={this.onSwapInputItem}
            />
          );
        })}
      </Container>
    );
  }

  private getInputItems = (): InputItemSlotsData[] => {
    const { selectedRecipe } = this.props;
    const inputItems: InputItemSlotsData[] = Array(6).fill({ item: null, slot: null, possibleItemSlot: null });

    for (let i = 0; i < 6; i++) {
      if (selectedRecipe && (selectedRecipe.type === RecipeType.Make || selectedRecipe.type === RecipeType.Shape)) {
        const selectedRecipeIngredient = selectedRecipe && (selectedRecipe.def as MakeRecipeDefRef).ingredients[i];
        const slot = selectedRecipeIngredient ?
          getItemSlotForRecipe(selectedRecipeIngredient.ingredient, selectedRecipe, i) : null;
        const potentialItem = this.props.inputItems.find(item => item.slot === slot);
        inputItems[i] = { item: potentialItem ? potentialItem.item : null, slot, possibleItemSlot: slot };
      } else {
        const potentialItem = this.props.inputItems[i];
        inputItems[i] = { ...potentialItem, possibleItemSlot: null };
      }
    }

    return inputItems;
  }

  private onAddInputItem = (item: InventoryItem.Fragment, slotNumber: number, unitCount?: number) => {
    const { selectedRecipe } = this.props;
    const slot = getItemSlotForRecipe(item.staticDefinition, selectedRecipe, Number(slotNumber));

    if (slot || !this.props.selectedRecipe) {
      this.props.onAddInputItem(item, slot, unitCount);
    } else {
      toastr.error('You can\'t put that item there!', 'Oh No!', { timeout: 3000 });
    }
  }

  private onSwapInputItem = (swappedItem: InventoryItem.Fragment,
                              slotNumber: number,
                              newItem: InventoryItem.Fragment,
                              newUnitCount: number) => {
    const { selectedRecipe } = this.props;
    const slot = getItemSlotForRecipe(swappedItem.staticDefinition, selectedRecipe, Number(slotNumber));

    if (slot || !this.props.selectedRecipe) {
      this.props.onSwapInputItem(swappedItem, slot, newItem, newUnitCount);
    } else {
      toastr.error('You can\'t put that item there!', 'Oh No!', { timeout: 3000 });
    }
  }

  private onRemoveInputItem = (item: InventoryItem.Fragment, slotNumber: number, slot: SubItemSlot) => {
    this.props.onRemoveInputItem(item, slot);
  }
}

class InputItemsWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ voxJob, inputItems, selectedRecipe, onAddInputItem, onRemoveInputItem, onSwapInputItem }) => (
          <InputItems
            {...this.props}
            voxJob={voxJob}
            inputItems={inputItems}
            selectedRecipe={selectedRecipe}
            onAddInputItem={onAddInputItem}
            onRemoveInputItem={onRemoveInputItem}
            onSwapInputItem={onSwapInputItem}
          />
        )}
      </JobContext.Consumer>
    );
  }
}

export default InputItemsWithInjectedContext;
