/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState } from 'react';
import Fuse, { FuseOptions } from 'fuse.js';
import { styled } from '@csegames/linaria/react';
import { AbilityBookContext } from '../index';
import { ComponentItem } from './ComponentItem';
import { FilterHeader } from './FilterHeader';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AbilityBookQuery, AbilityComponent } from 'gql/interfaces';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 3px;
`;

// #region ContentContainer constants
const CONTENT_CONTAINER_MARGIN_TOP = 30;
// #endregion
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 5%;
  overflow: auto;
  margin-top: ${CONTENT_CONTAINER_MARGIN_TOP}px;

  @media (max-width: 2560px) {
    margin-top: ${CONTENT_CONTAINER_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${CONTENT_CONTAINER_MARGIN_TOP * HD_SCALE}px;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  align-self: center;
`;

// #region ComponentRow constants
// #endregion
const ComponentRow = styled.div`
  display: flex;
`;

const ComponentCategoryContainer = styled.div`

`;

// #region ComponentCategoryName constants
const COMPONENT_CATEGORY_NAME_FONT_SIZE = 42;
const COMPONENT_CATEGORY_NAME_LETTER_SPACING = 2;
// #endregion
const ComponentCategoryName = styled.div`
  font-size ${COMPONENT_CATEGORY_NAME_FONT_SIZE}px;
  letter-spacing: ${COMPONENT_CATEGORY_NAME_LETTER_SPACING}px;
  font-family: TradeWinds;

  @media (max-width: 2560px) {
    font-size ${COMPONENT_CATEGORY_NAME_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${COMPONENT_CATEGORY_NAME_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size ${COMPONENT_CATEGORY_NAME_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${COMPONENT_CATEGORY_NAME_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region CategoryNameUnderline constants
const CATEGORY_NAME_UNDERLINE_HEIGHT = 7;
const CATEGORY_NAME_UNDERLINE_MARGIN_BOTTOM = 36;
// #endregion
const CategoryNameUnderline = styled.div`
  width: 100%;
  height: ${CATEGORY_NAME_UNDERLINE_HEIGHT}px;
  margin-bottom: ${CATEGORY_NAME_UNDERLINE_MARGIN_BOTTOM}px;
  background-image: url(../images/abilitybook/uhd/title-underline.png);
  background-size: 100% 100%;

  @media (max-width: 2560px) {
    height: ${CATEGORY_NAME_UNDERLINE_HEIGHT * MID_SCALE}px;
    margin-bottom: ${CATEGORY_NAME_UNDERLINE_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CATEGORY_NAME_UNDERLINE_HEIGHT * HD_SCALE}px;
    margin-bottom: ${CATEGORY_NAME_UNDERLINE_MARGIN_BOTTOM * HD_SCALE}px;
    background-image: url(../images/abilitybook/hd/title-underline.png);
    background-size: 100% 100%;
  }
`;

export interface Props {
}

export const fuseSearchOptions: FuseOptions<any> = {
  shouldSort: true,
  threshold: 0.3,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  includeScore: true,
  keys: [
    'display.name',
  ],
};

// tslint:disable-next-line:function-name
export function AbilityComponents(props: Props) {
  const { abilityComponents, componentCategoryToComponentIDs } = useContext(AbilityBookContext);
  const [searchValue, setSearchValue] = useState('');

  return (
    <Container>
      <FilterHeader searchValue={searchValue} onSearchChange={val => setSearchValue(val)} />
      <ContentContainer className='cse-ui-scroller-thumbonly'>
        <ListContainer>
          {Object.keys(componentCategoryToComponentIDs).map((componentCategoryName) => {
            const abilityComponentRows: AbilityBookQuery.AbilityComponents[][] = [];
            const abilityComponentIDs = [...componentCategoryToComponentIDs[componentCategoryName]];
            let categoryAbilityComponents = abilityComponentIDs.map(id => abilityComponents[id]);

            if (searchValue !== '') {
              const fuseSearch: { item: AbilityComponent.Fragment, score: number }[] =
                new Fuse(categoryAbilityComponents, fuseSearchOptions).search(searchValue) as any;

              categoryAbilityComponents = fuseSearch.sort((a, b) => a.score - b.score).map(searchItem => searchItem.item);
            }

            const numOfRows = Math.ceil(categoryAbilityComponents.length / 2);
            const categoryAbilityComponentsClone = [...categoryAbilityComponents];
            for (let i = 0; i < numOfRows; i++) {
              const abilityComponent1 = categoryAbilityComponentsClone.shift();
              const abilityComponent2 = categoryAbilityComponentsClone.shift();

              if (abilityComponent2) {
                abilityComponentRows.push([abilityComponent1,, abilityComponent2]);
              } else {
                abilityComponentRows.push([abilityComponent1]);
              }
            }

            return categoryAbilityComponents.length > 0 ? (
              <ComponentCategoryContainer>
                <ComponentCategoryName>{componentCategoryName}</ComponentCategoryName>
                <CategoryNameUnderline />
                {abilityComponentRows.map((abilityComponentRow) => {
                  return (
                    <ComponentRow>
                      {abilityComponentRow.map((abilityComponent) => {
                        return (
                          <ComponentItem abilityComponent={abilityComponent} />
                        );
                      })}
                    </ComponentRow>
                  );
                })}
              </ComponentCategoryContainer>
            ) : null;
          })}
        </ListContainer>
      </ContentContainer>
    </Container>
  );
}
