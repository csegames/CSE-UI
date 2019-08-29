/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { getUppercaseRecipeType } from '../../lib/utils';
import { RecipeType } from '../../CraftingBase';
import { ItemDefRef, Requirement } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// #region InfoContainer constants
const INFO_CONTAINER_MAX_WIDTH = 600;
const INFO_CONTAINER_MARGIN_RIGHT = 10;
// #endregion
const InfoContainer = styled.div`
  max-width: ${INFO_CONTAINER_MAX_WIDTH}px;
  margin-right: ${INFO_CONTAINER_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    max-width: ${INFO_CONTAINER_MAX_WIDTH * MID_SCALE}px;
    margin-right: ${INFO_CONTAINER_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    max-width: ${INFO_CONTAINER_MAX_WIDTH * HD_SCALE}px;
    margin-right: ${INFO_CONTAINER_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region ItemName constants
const ITEM_NAME_FONT_SIZE = 36;
// #endregion
const ItemName = styled.div`
  font-family: Caudex;
  font-size: ${ITEM_NAME_FONT_SIZE}px;
  white-space: wrap;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${ITEM_NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ItemSubtitle constants
const ITEM_SUBTITLE_FONT_SIZE = 28;
// #endregion
const ItemSubtitle = styled.div`
  font-family: Caudex;
  font-size: ${ITEM_SUBTITLE_FONT_SIZE}px;
  white-space: wrap;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${ITEM_SUBTITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_SUBTITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ItemDescription constants
const ITEM_DESCRIPTION_FONT_SIZE = 28;
// #endregion
const ItemDescription = styled.div`
  font-size: ${ITEM_DESCRIPTION_FONT_SIZE}px;
  white-space: wrap;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    font-size: ${ITEM_DESCRIPTION_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_DESCRIPTION_FONT_SIZE * HD_SCALE}
  }
`;


export interface Props {
  recipeDef: ItemDefRef.Fragment;
  type?: RecipeType;
  requirementDescription?: Requirement.Fragment;
}

class Header extends React.Component<Props> {
  public render() {
    const { recipeDef, type } = this.props;
    const itemDefRef = recipeDef;
    return (
      <Container>
        <InfoContainer>
          <ItemName>{this.getName()}</ItemName>
          {type && <ItemSubtitle>Recipe type: {getUppercaseRecipeType(type)}</ItemSubtitle>}
          {itemDefRef && itemDefRef.description && <ItemDescription>({itemDefRef.description})</ItemDescription>}
        </InfoContainer>
      </Container>
    );
  }

  private getName = () => {
    const { recipeDef, requirementDescription } = this.props;
    if (recipeDef) {
      return recipeDef.name;
    }

    if (requirementDescription) {
      return requirementDescription.description;
    }
  }
}

export default Header;
