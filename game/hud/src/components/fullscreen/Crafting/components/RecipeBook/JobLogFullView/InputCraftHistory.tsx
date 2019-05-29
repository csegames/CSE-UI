/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { fill } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import {
  VoxJobLog,
  InventoryItem,
  MakeRecipeDefRef,
  PurifyRecipeDefRef,
  RecipeIngredientDef,
  MakeIngredientDef,
} from 'gql/interfaces';

import { CraftingContext } from '../../../CraftingContext';
import { RecipeIdToRecipe, RecipeType, RecipeData } from '../../../CraftingBase';
import Tooltip from 'shared/ItemTooltip';
import ItemImage from '../../../ItemImage';
import CraftingDefTooltip from '../../CraftingDefTooltip';
import { getIcon, getItemUnitCount, getItemQuality } from 'fullscreen/lib/utils';
import { GroupLogData } from '../index';
import { getIngredientInfo, toDisplayQuality } from '../../../lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_MARGIN_TOP = 40;
// #endregion
const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${CONTAINER_MARGIN_TOP}px;

  @media (max-width: 2560px) {
    margin-top: ${CONTAINER_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${CONTAINER_MARGIN_TOP * HD_SCALE}px;
  }
`;

// #region InputItemsContainer constants
const INPUT_ITEMS_CONTAINER_WIDTH = 240;
const INPUT_ITEMS_CONTAINER_HEIGHT = 320;
// #endregion
const InputItemsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: ${INPUT_ITEMS_CONTAINER_WIDTH}px;
  height: ${INPUT_ITEMS_CONTAINER_HEIGHT}px;

  @media (max-width: 2560px) {
    width: ${INPUT_ITEMS_CONTAINER_WIDTH * MID_SCALE}px;
    height: ${INPUT_ITEMS_CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${INPUT_ITEMS_CONTAINER_WIDTH * HD_SCALE}px;
    height: ${INPUT_ITEMS_CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

// #region InputItem constants
const INPUT_ITEM_DIMENSIONS = 96;
const INPUT_ITEM_MARGIN_RIGHT = 10;
const INPUT_ITEM_MARGIN_BOTTOM = 10;
// #endregion
const InputItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${INPUT_ITEM_DIMENSIONS}px;
  height: ${INPUT_ITEM_DIMENSIONS}px;
  margin-right: ${INPUT_ITEM_MARGIN_RIGHT}px;
  margin-bottom: ${INPUT_ITEM_MARGIN_BOTTOM}px;
  background-image: url(../images/crafting/uhd/paper-craft-no-counter-frame.png);
  background-size: cover;
  opacity: 0.7;

  @media (max-width: 2560px) {
    width: ${INPUT_ITEM_DIMENSIONS * MID_SCALE}px;
    height: ${INPUT_ITEM_DIMENSIONS * MID_SCALE}px;
    margin-right: ${INPUT_ITEM_MARGIN_RIGHT * MID_SCALE}px;
    margin-bottom: ${INPUT_ITEM_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${INPUT_ITEM_DIMENSIONS * HD_SCALE}px;
    height: ${INPUT_ITEM_DIMENSIONS * HD_SCALE}px;
    margin-right: ${INPUT_ITEM_MARGIN_RIGHT * HD_SCALE}px;
    margin-bottom: ${INPUT_ITEM_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region ConnceptArt constants
const CONCEPT_ART_WIDTH = 360;
const CONCEPT_ART_HEIGHT = 400;
// #endregion
const ConceptArt = styled.div`
  flex: 1;
  width: ${CONCEPT_ART_WIDTH}px;
  height: ${CONCEPT_ART_HEIGHT}px;
  background-image: url(../images/crafting/uhd/drawings/sketch-statue.png);
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    width: ${CONCEPT_ART_WIDTH * MID_SCALE}px;
    height: ${CONCEPT_ART_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${CONCEPT_ART_WIDTH * HD_SCALE}px;
    height: ${CONCEPT_ART_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/drawings/sketch-tdd-statue.png);
  }
`;

// #region UnitCountRange constants
const UNIT_COUNT_RANGE_RIGHT = 4;
const UNIT_COUNT_RANGE_FONT_SIZE = 18;
// #endregion
const UnitCountRange = styled.div`
  position: absolute;
  top: 0px;
  right: ${UNIT_COUNT_RANGE_RIGHT}px;
  font-size: ${UNIT_COUNT_RANGE_FONT_SIZE}px;
  color: #FFE3B9;
  z-index: 10;
  pointer-events: none;

  @media (max-width: 2560px) {
    right: ${UNIT_COUNT_RANGE_RIGHT * MID_SCALE}px;
    font-size: ${UNIT_COUNT_RANGE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    right: ${UNIT_COUNT_RANGE_RIGHT * HD_SCALE}px;
    font-size: ${UNIT_COUNT_RANGE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region QualityRange constants
const QUALITY_RANGE_RIGHT = 4;
const QUALITY_RANGE_FONT_SIZE = 18;
// #endregion
const QualityRange = styled.div`
  position: absolute;
  bottom: 0;
  right: ${QUALITY_RANGE_RIGHT}px;
  font-size: ${QUALITY_RANGE_FONT_SIZE}px;
  color: #FFE3B9;
  z-index: 10;
  pointer-events: none;

  @media (max-width: 2560px) {
    right: ${QUALITY_RANGE_RIGHT * MID_SCALE}px;
    font-size: ${QUALITY_RANGE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    right: ${QUALITY_RANGE_RIGHT * HD_SCALE}px;
    font-size: ${QUALITY_RANGE_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface InputItem {
  item: Partial<InventoryItem.Fragment>;
  ingredient: MakeIngredientDef | RecipeIngredientDef;
  recipeData?: RecipeData;
}

export interface ComponentProps {
  voxJobLog: VoxJobLog.Fragment | null;
  groupLogData: GroupLogData;
}

export interface Props extends ComponentProps {
  recipeIdToRecipe: RecipeIdToRecipe;
}

class InputCraftHistory extends React.Component<Props> {
  public render() {
    const inputItems = this.getInputItems();
    return (
      <Container>
        <InputItemsContainer>
          {inputItems.map((item, i) => {
            const ingredientInfo: RecipeIngredientDef = item && item.item && item.item.staticDefinition &&
              getIngredientInfo(item.recipeData, item.item.staticDefinition.id) as any;
            return (
              <InputItem key={i}>
                {item && ingredientInfo && item.recipeData.type === RecipeType.Shape &&
                  <UnitCountRange>
                    {ingredientInfo.minUnitCount === ingredientInfo.maxUnitCount ? ingredientInfo.minUnitCount :
                      `${ingredientInfo.minUnitCount}-${ingredientInfo.maxUnitCount}`}
                  </UnitCountRange>
                }
                {item &&
                  <ItemImage
                    icon={getIcon(item.item as InventoryItem.Fragment) ||
                      (item.ingredient.requirement &&
                      item.ingredient.requirement.iconURL)}
                    count={getItemUnitCount(item.item as InventoryItem.Fragment)}
                    quality={getItemQuality(item.item as InventoryItem.Fragment)}
                    onMouseOver={e => this.showItemTooltip(e as any, item)}
                    onMouseLeave={this.hideItemTooltip}
                  />
                }
                {item && ingredientInfo && item.recipeData.type === RecipeType.Shape &&
                  <QualityRange>
                    {`${toDisplayQuality(ingredientInfo.minQuality)}-${toDisplayQuality(ingredientInfo.maxQuality)}%`}
                  </QualityRange>
                }
              </InputItem>
            );
          })}
        </InputItemsContainer>
        <ConceptArt />
      </Container>
    );
  }

  private getInputItems = (): (InputItem | null)[] => {
    let inputItems: (InputItem | null)[] = [];
    if (!this.props.voxJobLog) {
      const recipeData = this.props.recipeIdToRecipe[this.props.groupLogData.log.jobIdentifier];
      if (!recipeData) {
        // We most likely hit this because data is still being fetched from graphql.
        // Just show empty input item slots in this case.
        return fill(Array(6 - inputItems.length), null);
      }

      switch (recipeData.type) {
        case RecipeType.Make:
        case RecipeType.Shape:
        case RecipeType.Block: {
          (recipeData.def as MakeRecipeDefRef).ingredients.forEach((ingredient) => {
            const item: Partial<InventoryItem.Fragment> = { staticDefinition: ingredient.ingredient };
            inputItems.push(this.itemToInputItem(item, ingredient, recipeData));
          });
          break;
        }
        case RecipeType.Purify:
        case RecipeType.Grind: {
          const ingredientItem = (recipeData.def as PurifyRecipeDefRef).ingredientItem;
          const item: Partial<InventoryItem.Fragment> = { staticDefinition: ingredientItem };
          inputItems[0] = this.itemToInputItem(item, null, recipeData);
          break;
        }
      }
    }

    if (this.props.voxJobLog && inputItems.length === 0) {
      // There was a voxJobLog so show the actual items that were inputted during that job
      inputItems = this.props.voxJobLog.inputItems.map(item => this.itemToInputItem(item, null));
    }

    // Fill with empty slots
    return inputItems.concat(fill(Array(6 - inputItems.length), null));
  }

  private itemToInputItem = (item: Partial<InventoryItem.Fragment>,
                              ingredient: MakeIngredientDef | RecipeIngredientDef,
                              recipeData?: RecipeData): InputItem => {
    return {
      item,
      ingredient,
      recipeData,
    };
  }

  private showItemTooltip = (event: MouseEvent, inputItem: InputItem) => {
    if (inputItem.item.id) {
      const payload: ShowTooltipPayload = {
        event,
        content: <Tooltip item={inputItem.item as InventoryItem.Fragment} instructions='' />,
        styles: 'item',
      };
      showTooltip(payload);
    } else if (!inputItem.item.staticDefinition && inputItem.ingredient.requirement) {
      const payload: ShowTooltipPayload = {
        event,
        content:
          <CraftingDefTooltip
            recipeDef={null}
            recipeData={inputItem.recipeData}
            ingredientInfo={inputItem.ingredient}
          />,
      };
      showTooltip(payload);
    } else {
      const payload: ShowTooltipPayload = {
        event,
        content: <CraftingDefTooltip recipeDef={inputItem.item.staticDefinition} recipeData={inputItem.recipeData} />,
      };
      showTooltip(payload);
    }
  }

  private hideItemTooltip = () => {
    hideTooltip();
  }
}

class InputCraftHistoryWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ recipeIdToRecipe }) => (
          <InputCraftHistory {...this.props} recipeIdToRecipe={recipeIdToRecipe} />
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default InputCraftHistoryWithInjectedContext;
