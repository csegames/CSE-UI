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

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoContainer = styled.div`
  max-width: 300px;
  margin-right: 5px;
`;

const ItemName = styled.div`
  font-family: Caudex;
  font-size: 18px;
  white-space: wrap;
  color: white;
`;

const ItemSubtitle = styled.div`
  font-family: Caudex;
  font-size: 14px;
  white-space: wrap;
  color: white;
`;

const ItemDescription = styled.div`
  font-size: 14px;
  white-space: wrap;
  color: #C3C3C3;
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
