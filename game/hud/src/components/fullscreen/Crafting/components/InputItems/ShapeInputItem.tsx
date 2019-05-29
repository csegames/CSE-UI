/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { RecipeIngredientDef, InventoryItem } from 'gql/interfaces';

import { PlaceholderImage } from './InputItem';
import { RecipeData } from '../../CraftingBase';
import { toDisplayQuality } from '../../lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

// #region UnitCountRange constants
const UNIT_COUNT_RANGE_FONT_SIZE = 18;
// #endregion
const UnitCountRange = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${UNIT_COUNT_RANGE_FONT_SIZE}px;
  color: #FFE3B9;
  z-index: 10;

  @media (max-width: 2560px) {
    font-size: ${UNIT_COUNT_RANGE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${UNIT_COUNT_RANGE_FONT_SIZE * HD_SCALE}px;
  }
`;

const QualityRange = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: ${UNIT_COUNT_RANGE_FONT_SIZE}px;
  color: #FFE3B9;
  z-index: 10;

  @media (max-width: 2560px) {
    font-size: ${UNIT_COUNT_RANGE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${UNIT_COUNT_RANGE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ItemImage constants
const ITEM_DIMENSIONS = 100;
// #endregion
const ItemImage = styled.img`
  width: ${ITEM_DIMENSIONS}px;
  height: ${ITEM_DIMENSIONS}px;
  pointer-events: none;
  object-fit: cover;

  @media (max-width: 2560px) {
    width: ${ITEM_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_DIMENSIONS * HD_SCALE}px;
  }
`;

export interface Props {
  item: InventoryItem.Fragment;
  ingredientInfo: RecipeIngredientDef;
  selectedRecipe: RecipeData;
  removeInputItem: () => void;
}

class ShapeInputItem extends React.Component<Props> {
  public render() {
    const { item, ingredientInfo } = this.props;
    return (
      <Container>
        {ingredientInfo &&
          <UnitCountRange>
            {ingredientInfo.minUnitCount === ingredientInfo.maxUnitCount ? ingredientInfo.minUnitCount :
              `${ingredientInfo.minUnitCount}-${ingredientInfo.maxUnitCount}`}
          </UnitCountRange>
        }
        {item ?
          <ItemImage src={item.staticDefinition.iconUrl} /> :
            ingredientInfo ?
              <PlaceholderImage src={ingredientInfo.ingredient.iconUrl} /> : null
        }
        {ingredientInfo &&
          <QualityRange>
            {`${toDisplayQuality(ingredientInfo.minQuality)}-${toDisplayQuality(ingredientInfo.maxQuality)}%`}
          </QualityRange>
        }
      </Container>
    );
  }

  public componentWillUnmount() {
    // Just remove input item if we leave the shape job. We don't have enough API support to save the ratios.
    this.props.removeInputItem();
  }
}

export default ShapeInputItem;
