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
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const UnitCountRange = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 9px;
  color: #FFE3B9;
  z-index: 10;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 12px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
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
  right: 0;
  font-size: 9px;
  color: #FFE3B9;
  z-index: 10;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 12px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 18px;
  }

  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    right: -1px;
    bottom: -6px;
  }
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  pointer-events: none;
  object-fit: cover;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 65px;
    height: 65px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 125px;
    height: 125px;
  }

  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    width: 41.5px;
    height: 41.5px;
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
