/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { find } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/camelotunchained';

import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import { DragEvent, DragAndDropInjectedProps, DraggableOptions } from 'utils/DragAndDrop/DragAndDrop';
import { getItemUnitCount, getItemQuality, getIcon, getInventoryDataTransfer } from 'fullscreen/lib/utils';
import { InventoryDataTransfer } from 'fullscreen/lib/itemEvents';
import Tooltip, { defaultItemTooltipStyle } from 'shared/ItemTooltip';
import ItemImage from '../../ItemImage';
import { RecipeData, RecipeType } from '../../CraftingBase';
import CraftingDefTooltip from '../CraftingDefTooltip';
import { getJobContext, canStartJob, getNearestVoxEntityID } from '../../lib/utils';
import ShapeInputItem from './ShapeInputItem';
import ItemCount from './ItemCount';
import DraggableItem, { Props as DraggableItemProps } from 'fullscreen/ItemShared/components/DraggableItem';
import {
  InventoryItem,
  SubItemSlot,
  MakeRecipeDefRef,
  PurifyRecipeDefRef,
  BlockRecipeDefRef,
  GrindRecipeDefRef,
  ShapeRecipeDefRef,
  VoxJob,
  VoxJobType,
  MakeIngredientDef,
  ItemDefRef,
} from 'gql/interfaces';
import { SlotType } from 'fullscreen/lib/itemInterfaces';
import { CraftingContext } from '../../CraftingContext';
import { placeholderIcon, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

declare const toastr: any;

const ALLOWED_COLOR = 'rgba(46, 213, 80, 0.4)';
const NOT_ALLOWED_COLOR = 'rgba(186, 50, 50, 0.4)';

// #region Container constants
const CONTAINER_MARGIN_RIGHT = 10;
const CONTAINER_MARGIN_BOTTOM = 10;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  margin-right: ${CONTAINER_MARGIN_RIGHT}px;
  margin-bottom: ${CONTAINER_MARGIN_BOTTOM}px;

  @media (max-width: 2560px) {
    margin-right: ${CONTAINER_MARGIN_RIGHT * MID_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${CONTAINER_MARGIN_RIGHT * HD_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region ItemContainerBackground constants
const ITEM_CONTAINER_BACKGROUND_DIMENSIONS = 180;
// #endregion
export const ItemContainerBackground = styled.div`
  width: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS}px;
  height: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS}px;
  background-image: url(../images/crafting/uhd/craft-frame-slots-background.png);
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 2560px) {
    width: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * HD_SCALE}px;
    background-image: url(../images/crafting/hd/craft-frame-slots-background.png);
  }
`;

const DisabledItemContainer = styled.div`
  width: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS}px;
  height: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS}px;
  background-image: url(../images/crafting/uhd/frame-slots-non-background.png);
  background-size: contain;
  opacity: 0.4;

  @media (max-width: 2560px) {
    width: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_CONTAINER_BACKGROUND_DIMENSIONS * HD_SCALE}px;
    background-image: url(../images/crafting/hd/frame-slots-non-background.png);
  }
`;

// #region ItemContainer constants
const ITEM_CONTAINER_DIMENSIONS = 120;
// #endregion
export const ItemContainer = styled.div`
  position: relative;
  width: ${ITEM_CONTAINER_DIMENSIONS}px;
  height: ${ITEM_CONTAINER_DIMENSIONS}px;
  pointer-events: all;
  cursor: pointer;
  background-image: url(../images/crafting/uhd/frame-slots-empty.png);
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  &.hasItem {
    background-image: url(../images/crafting/uhd/craft-frame-slots.png);
    &:hover {
      box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
    };
    &:active {
      box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
    };
  }

  @media (max-width: 2560px) {
    width: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * HD_SCALE}px;
    background-image: url(../images/crafting/hd/frame-slots-empty.png);
    &.hasItem {
      background-image: url(../images/crafting/hd/craft-frame-slots.png);
    }
  }
`;

// #region ItemWrapper constants
const ITEM_WRAPPER_DIMENSIONS = 108;
// #endregion
export const ItemWrapper = styled.div`
  position: relative;
  width: ${ITEM_WRAPPER_DIMENSIONS}px;
  height: ${ITEM_WRAPPER_DIMENSIONS}px;
  max-width: ${ITEM_WRAPPER_DIMENSIONS}px;
  max-height: ${ITEM_WRAPPER_DIMENSIONS}px;

  @media (max-width: 2560px) {
    width: ${ITEM_WRAPPER_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_WRAPPER_DIMENSIONS * MID_SCALE}px;
    max-width: ${ITEM_WRAPPER_DIMENSIONS * MID_SCALE}px;
    max-height: ${ITEM_WRAPPER_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_WRAPPER_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_WRAPPER_DIMENSIONS * HD_SCALE}px;
    max-width: ${ITEM_WRAPPER_DIMENSIONS * HD_SCALE}px;
    max-height: ${ITEM_WRAPPER_DIMENSIONS * HD_SCALE}px;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${(props: React.HTMLProps<HTMLDivElement> & { backgroundColor: string }) => props.backgroundColor};
  }
`;

// #region PlaceholderImage constants
const PLACEHOLDER_IMAGE_DIMENSIONS = 100;
// #endregion
export const PlaceholderImage = styled.img`
  width: ${PLACEHOLDER_IMAGE_DIMENSIONS}px;
  height: ${PLACEHOLDER_IMAGE_DIMENSIONS}px;
  pointer-events: none;
  opacity: 0.5;
  object-fit: cover;

  @media (max-width: 2560px) {
    width: ${PLACEHOLDER_IMAGE_DIMENSIONS * MID_SCALE}px;
    height: ${PLACEHOLDER_IMAGE_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${PLACEHOLDER_IMAGE_DIMENSIONS * HD_SCALE}px;
    height: ${PLACEHOLDER_IMAGE_DIMENSIONS * HD_SCALE}px;
  }
`;

export interface ComponentProps {
  slotNumber: number;
  jobNumber: number;
  item: InventoryItem.Fragment;
  subItemSlot: SubItemSlot;
  possibleItemSlot: SubItemSlot;
  onAddInputItem: (item: InventoryItem.Fragment, slotNumber: number, subItemSlot?: SubItemSlot, unitCount?: number) => void;
  onRemoveInputItem: (item: InventoryItem.Fragment, slotNumber: number, slot: SubItemSlot) => void;
  onSwapInputItem: (swappedItem: InventoryItem.Fragment, slotNumber: number, subItemSlot: SubItemSlot,
    newItem: InventoryItem.Fragment, newUnitCount: number) => void;
}

export type Props = ComponentProps & DragAndDropInjectedProps & InjectedContextProps;

export interface InjectedContextProps {
  voxEntityID: string;
  voxJob: VoxJob.Fragment;
  selectedRecipe: RecipeData;
}

export interface State {
  backgroundColor: string;
}

export class InputItem extends React.Component<Props, State> {
  private myDataTransfer: InventoryDataTransfer;
  private ingredientInfo: MakeIngredientDef;
  constructor(props: Props) {
    super(props);
    this.state = {
      backgroundColor: 'transparent',
    };
  }

  public render() {
    const { item, voxJob, jobNumber, subItemSlot } = this.props;
    const placeholderItem: InventoryItem.StaticDefinition = this.getSelectedRecipePlaceholderItem();
    if (this.ingredientInfo && !voxJob) {
      this.ingredientInfo = null;
    }

    if (voxJob && (voxJob.jobType === VoxJobType.Make || voxJob.jobType === VoxJobType.Block)) {
      this.ingredientInfo = this.getIngredientInfo(item && item.staticDefinition && item.staticDefinition.id) as any;
    }

    if (voxJob && voxJob.jobType === VoxJobType.Shape && placeholderItem) {
      this.ingredientInfo = this.getIngredientInfo((item && item.staticDefinition && item.staticDefinition.id) ||
        placeholderItem.id) as any;
    }

    return (
      <Container>
        <ItemContainerBackground>
          <ItemContainer
            className={item ? 'hasItem' : ''}
            onMouseDown={this.onRightClick}
            onMouseOver={(e: React.MouseEvent) => this.onMouseOver(e as any, placeholderItem)}
            onMouseLeave={this.onMouseLeave}>
            <DraggableItem
              initializeDragAndDrop={this.initializeDragAndDrop}
              item={this.props.item}
              dragItemID={this.getDragItemID()}
              data={() => this.myDataTransfer}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
              disableDrag={!item}
              renderWidth={54}
              renderHeight={54}>
              {this.renderInputItem()}
            </DraggableItem>
          </ItemContainer>
        </ItemContainerBackground>
        {voxJob && voxJob.jobType === VoxJobType.Shape && placeholderItem &&
          <ItemCount
            item={item}
            jobNumber={jobNumber}
            slot={subItemSlot}
            minUnitCount={this.ingredientInfo ? (this.ingredientInfo as any).minUnitCount : 0}
            maxUnitCount={this.ingredientInfo ? (this.ingredientInfo as any).maxUnitCount : 0}
          />}
      </Container>
    );
  }

  public componentDidMount() {
    this.setDragDataTransfer();
  }

  public componentDidUpdate() {
    this.setDragDataTransfer();
  }

  private renderInputItem = () => {
    if (this.isDisabled()) {
      return <DisabledItemContainer />;
    }

    const { item, voxJob, selectedRecipe } = this.props;
    const placeholderItem: InventoryItem.StaticDefinition = this.getSelectedRecipePlaceholderItem();
    if (voxJob && voxJob.jobType === VoxJobType.Shape && placeholderItem) {
      return (
        <ItemWrapper backgroundColor={this.state.backgroundColor}>
          <ShapeInputItem
            item={item}
            ingredientInfo={this.ingredientInfo as any}
            selectedRecipe={selectedRecipe}
            removeInputItem={this.removeInputItem}
          />
        </ItemWrapper>
      );
    }

    if (!this.props.item && this.isRequirementDescriptionSlot()) {
      return (
        <ItemWrapper backgroundColor={this.state.backgroundColor}>
          <PlaceholderImage src={this.ingredientInfo.requirement.iconURL || placeholderIcon} />
        </ItemWrapper>
      );
    }

    return (
      <ItemWrapper backgroundColor={this.state.backgroundColor}>
        {item ?
          <ItemImage count={getItemUnitCount(item)} icon={getIcon(item)} quality={getItemQuality(item)} /> :
            placeholderItem ? <PlaceholderImage src={placeholderItem.iconUrl} /> : null}
      </ItemWrapper>
    );
  }

  private getDragItemID = () => {
    return (this.props.item && this.props.item.id) || 'crafting-input-item';
  }

  private isRequirementDescriptionSlot = () => {
    return this.ingredientInfo && !this.ingredientInfo.ingredient && this.ingredientInfo.requirement;
  }

  private initializeDragAndDrop = (): DraggableOptions => {
    return {
      id: this.getDragItemID(),
      dataKey: 'inventory-items',
      dropTarget: true,
      disableDrag: !this.props.item,
    };
  }

  private setDragDataTransfer = () => {
    const item = this.props.item;
    this.myDataTransfer = getInventoryDataTransfer({
      slotType: SlotType.Standard,
      item,
      location: 'inVox',
      position: -1,
      voxEntityID: this.props.voxEntityID,
    });
  }

  private onDragOver = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>) => {
    if (!this.isDisabled()) {
      if (this.isAllowedToDrop(e)) {
        this.setState({ backgroundColor: ALLOWED_COLOR });
      } else {
        this.setState({ backgroundColor: NOT_ALLOWED_COLOR });
      }
    }
  }

  private onDragLeave = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>) => {
    this.setState({ backgroundColor: 'transparent' });
  }

  private onDrop = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>) => {
    if (!this.isDisabled() && this.isAllowedToDrop(e, true)) {
      const { voxJob } = this.props;
      const itemUnitCount = e.dataTransfer.unitCount || e.dataTransfer.item.stats.item.unitCount;
      if (voxJob && voxJob.jobType === VoxJobType.Shape) {
        // If a shape job and trying to add more than max, only add the max ratio count
        const ingredientInfo = this.getIngredientInfo(e.dataTransfer.item.staticDefinition.id) as any;
        if (this.props.item && this.props.item.stats.item.unitCount === ingredientInfo.maxUnitCount) {
          // Item is already equal to max ratio count. Do nothing.
          return;
        }

        if (this.props.item && (this.props.item.stats.item.unitCount + itemUnitCount > ingredientInfo.maxUnitCount)) {
          // Trying to add more than max items when there are already some items in the slot.
          this.props.onAddInputItem(
            e.dataTransfer.item,
            this.props.slotNumber,
            this.props.subItemSlot,
            ingredientInfo.maxUnitCount - this.props.item.stats.item.unitCount,
          );
          return;
        }

        if (itemUnitCount > ingredientInfo.maxUnitCount) {
          this.props.onAddInputItem(
            e.dataTransfer.item,
            this.props.slotNumber,
            this.props.subItemSlot,
            ingredientInfo.maxUnitCount,
          );
          return;
        }
      }

      if (!this.props.voxJob && this.props.item) {
        // Swap item
        this.props.onSwapInputItem(
          this.props.item,
          this.props.slotNumber,
          this.props.subItemSlot,
          e.dataTransfer.item,
          itemUnitCount,
        );
        return;
      }

      this.props.onAddInputItem(
        e.dataTransfer.item,
        this.props.slotNumber,
        this.props.subItemSlot,
        itemUnitCount,
      );
    }
  }

  private isDisabled = () => {
    const { voxJob, item } = this.props;
    return canStartJob(voxJob) && !item;
  }

  private getIngredientInfo = (ingredientDefId: string) => {
    const { selectedRecipe } = this.props;
    if (selectedRecipe) {
      if (this.props.selectedRecipe.type === RecipeType.Make && this.props.possibleItemSlot) {
        return (selectedRecipe.def as MakeRecipeDefRef).ingredients
          .find(ingredient => ingredient.slot === this.props.subItemSlot);
      }
      return find((selectedRecipe.def as MakeRecipeDefRef).ingredients,
        ingredient => ingredient.ingredient && ingredient.ingredient.id === ingredientDefId);
    } else {
      return null;
    }
  }

  private onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      this.removeInputItem();
    }
  }

  private onMouseOver = (event: MouseEvent, placeholderItem?: any) => {
    if (this.props.item) {
      const payload: ShowTooltipPayload = {
        content: <Tooltip item={this.props.item} instructions={''} />,
        event,
        styles: 'item',
      };
      showTooltip(payload);
      return;
    }

    if (this.isRequirementDescriptionSlot()) {
      const payload: ShowTooltipPayload = {
        content:
          <CraftingDefTooltip
            recipeDef={placeholderItem}
            recipeData={this.props.selectedRecipe}
            ingredientInfo={this.ingredientInfo}
          />,
        event,
        styles: defaultItemTooltipStyle,
      };
      showTooltip(payload);
      return;
    }

    if (placeholderItem) {
      const payload: ShowTooltipPayload = {
        content: (
          <CraftingDefTooltip recipeDef={placeholderItem} recipeData={this.props.selectedRecipe} />
        ),
        event,
        styles: 'item',
      };
      showTooltip(payload);
    }
  }

  private onMouseLeave = () => {
    hideTooltip();
  }

  private removeInputItem = () => {
    if (this.props.item) {
      this.props.onRemoveInputItem(this.props.item, this.props.slotNumber, this.props.subItemSlot);
      hideTooltip();
    }
  }

  private getSelectedRecipePlaceholderItem = () => {
    let placeholderItem = null;
    const { selectedRecipe, possibleItemSlot, slotNumber } = this.props;
    if (!selectedRecipe) {
      return null;
    }
    switch (selectedRecipe.type) {
      case RecipeType.Make: {
        const ingredient = find((selectedRecipe.def as MakeRecipeDefRef).ingredients,
          ingredient => ingredient.slot === possibleItemSlot);
        if (ingredient) {
          placeholderItem = ingredient.ingredient;
        }
        break;
      }

      case RecipeType.Block: {
        const potentialSlotIngredient = (selectedRecipe.def as BlockRecipeDefRef).ingredients[slotNumber];
        if (potentialSlotIngredient) {
          placeholderItem = potentialSlotIngredient.ingredient;
        }
        break;
      }

      case RecipeType.Grind: {
        if (slotNumber === 0) {
          placeholderItem = (selectedRecipe.def as GrindRecipeDefRef).ingredientItem;
        }
        break;
      }

      case RecipeType.Shape: {
        const ingredientDef = (selectedRecipe.def as ShapeRecipeDefRef).ingredients[slotNumber];
        if (ingredientDef) {
          placeholderItem = ingredientDef.ingredient;
        }
        break;
      }
    }

    return placeholderItem;
  }

  private isAllowedToDrop = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>, shouldErrorMessage?: boolean) => {
    if (this.isDisabled()) {
      toastr.error('That item doesn\'t go there!', 'Oh No!', { timeout: 3000 });
      return false;
    }

    if (e.dataTransfer.voxEntityID) {
      return false;
    }

    if (this.isRequirementDescriptionSlot()) {
      return webAPI.RequirementDescriptionMethods
        .MeetsRequirementDescription(this.ingredientInfo.requirement, e.dataTransfer.item.staticDefinition as ItemDefRef);
    }

    if (this.props.voxJob && this.props.voxJob.jobType === VoxJobType.Shape) {
      // For shape jobs, make sure the inputted item meets the min and max unit count, as well as the min and max quality.
      const placeholderItem: InventoryItem.StaticDefinition = this.getSelectedRecipePlaceholderItem();
      const ingredientInfo = (this.props.item || placeholderItem) && this.getIngredientInfo(
        this.props.item ? this.props.item.staticDefinition.id : placeholderItem.id) as any;

      if (!ingredientInfo) {
        return false;
      }

      const isCorrectItem = e.dataTransfer.item.staticDefinition.id === ingredientInfo.ingredient.id;
      const meetsQuality = e.dataTransfer.item.stats.item.quality <= ingredientInfo.maxQuality &&
        e.dataTransfer.item.stats.item.quality >= ingredientInfo.minQuality;

      if (shouldErrorMessage && !meetsQuality) {
        toastr.error(
          'Must enter item with quality in range of min and max quality for shape jobs.',
          'Oh No!',
          { timeout: 3000 },
        );
      }

      return isCorrectItem && meetsQuality;
    }

    if (this.props.voxJob && this.props.selectedRecipe) {
      switch (this.props.voxJob.jobType) {
        case VoxJobType.Make:
        case VoxJobType.Block: {
          const isAnIngredient = (this.props.selectedRecipe.def as MakeRecipeDefRef).ingredients.find((ing) => {
            if (!ing.ingredient && ing.requirement) {
              return webAPI.RequirementDescriptionMethods
                .MeetsRequirementDescription(ing.requirement, e.dataTransfer.item.staticDefinition as ItemDefRef);
            }
            return ing.ingredient.id === e.dataTransfer.item.staticDefinition.id;
          });
          return isAnIngredient;
        }
        case VoxJobType.Purify: {
          if (this.props.selectedRecipe.def) {
            const isAnIngredient = (this.props.selectedRecipe.def as PurifyRecipeDefRef).ingredientItem.id ===
              e.dataTransfer.item.staticDefinition.id;
            return isAnIngredient;
          }
          return true;
        }
      }
    }

    return true;
  }
}

class InputItemWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <CraftingContext.Consumer>
        {({ crafting }) => (
          <JobContext.Consumer>
            {({ selectedRecipe, voxJob }) => {
              const voxEntityID = getNearestVoxEntityID(crafting);
              return (
                <InputItem
                  {...this.props}
                  voxEntityID={voxEntityID}
                  voxJob={voxJob}
                  selectedRecipe={selectedRecipe}
                />
              );
            }}
          </JobContext.Consumer>
        )}
      </CraftingContext.Consumer>
    );
  }
}


export default InputItemWithInjectedContext;
