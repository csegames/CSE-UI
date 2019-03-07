/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { fill } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { VoxJobLog, InventoryItem, MakeRecipeDefRef, PurifyRecipeDefRef, RecipeIngredientDef } from 'gql/interfaces';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';

import { CraftingContext } from '../../../CraftingContext';
import { RecipeIdToRecipe, RecipeType, RecipeData } from '../../../CraftingBase';
import Tooltip, { defaultTooltipStyle } from 'shared/ItemTooltip';
import ItemImage from '../../../ItemImage';
import CraftingDefTooltip from '../../CraftingDefTooltip';
import { getIcon, getItemUnitCount, getItemQuality } from 'fullscreen/lib/utils';
import { GroupLogData } from '../index';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';
import { getIngredientInfo, toDisplayQuality } from '../../../lib/utils';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const InputItemsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 120px;
  height: 160px;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 270px;
    height: 400px;
  }
`;

const InputItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: url(../images/crafting/1080/paper-craft-no-counter-frame.png);
  margin-right: 5px;
  margin-bottom: 5px;
  opacity: 0.7;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/paper-craft-no-counter-frame.png) no-repeat;
    background-size: cover;
    width: 130px;
    height: 130px;
    margin-right: 15px;
    margin-bottom: 15px;
  }
`;

const ConceptArt = styled.div`
  flex: 1;
  width: 180px;
  height: 200px;
  background: url(../images/crafting/1080/drawings/sketch-statue.png) no-repeat;
  background-size: contain;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 432px;
    height: 600px;
    background: url(../images/crafting/4k/drawings/sketch-tdd-statue.png) no-repeat;
    background-size: contain;
  }
`;

const UnitCountRange = styled.div`
  position: absolute;
  top: 0px;
  right: 2px;
  font-size: 9px;
  color: #FFE3B9;
  z-index: 10;
  pointer-events: none;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 18px;
  }
  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    right: -1px;
    top: -4px;
  }
`;

const QualityRange = styled.div`
  position: absolute;
  bottom: 0;
  right: 2px;
  font-size: 9px;
  color: #FFE3B9;
  z-index: 10;
  pointer-events: none;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 18px;
  }
  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    right: -1px;
    bottom: -6px;
  }
`;

export interface InputItem {
  item: Partial<InventoryItem.Fragment>;
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
            const ingredientInfo: RecipeIngredientDef = item &&
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
                    icon={getIcon(item.item as InventoryItem.Fragment)}
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
            inputItems.push(this.itemToInputItem(item, recipeData));
          });
          break;
        }
        case RecipeType.Purify:
        case RecipeType.Grind: {
          const ingredientItem = (recipeData.def as PurifyRecipeDefRef).ingredientItem;
          const item: Partial<InventoryItem.Fragment> = { staticDefinition: ingredientItem };
          inputItems[0] = this.itemToInputItem(item, recipeData);
          break;
        }
      }
    }

    if (this.props.voxJobLog && inputItems.length === 0) {
      // There was a voxJobLog so show the actual items that were inputted during that job
      inputItems = this.props.voxJobLog.inputItems.map(item => this.itemToInputItem(item));
    }

    // Fill with empty slots
    return inputItems.concat(fill(Array(6 - inputItems.length), null));
  }

  private itemToInputItem = (item: Partial<InventoryItem.Fragment>,
                              recipeData?: RecipeData): InputItem => {
    return {
      item,
      recipeData,
    };
  }

  private showItemTooltip = (event: MouseEvent, inputItem: InputItem) => {
    if (inputItem.item.id) {
      const payload: ShowTooltipPayload = {
        event,
        content: <Tooltip item={inputItem.item as InventoryItem.Fragment} instructions='' />,
        styles: defaultTooltipStyle,
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
