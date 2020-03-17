/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { FilterDropdown, Section } from '../FilterDropdown';
import { SearchInput } from '../SearchInput';
import { FilterCheck } from '../FilterCheck';
import { AbilityBookContext } from '../../../context/AbilityBookContext';
import { Routes } from '../../../context/AbilityBookContext';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 6.5%;
`;

// #region Spacing constants
const SPACING_MARGIN_RIGHT = 30;
// #endregion
const Spacing = styled.div`
  margin-right: ${SPACING_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    margin-right: ${SPACING_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${SPACING_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region ResetFilters constants
const RESET_FILTERS_FONT_SIZE = 28;
const RESET_FILTERS_MARGIN_LEFT = 30;
// #endregion
const ResetFilters = styled.div`
  cursor: pointer;
  font-family: CaudexBold;
  font-size: ${RESET_FILTERS_FONT_SIZE}px;
  margin-left: ${RESET_FILTERS_MARGIN_LEFT}px;
  text-transform: uppercase;
  color: #1F1E1B;
  opacity: 1;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.5;
  }

  @media (max-width: 2560px) {
    font-size: ${RESET_FILTERS_FONT_SIZE * MID_SCALE}px;
    margin-left: ${RESET_FILTERS_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${RESET_FILTERS_FONT_SIZE * HD_SCALE}px;
    margin-left: ${RESET_FILTERS_MARGIN_LEFT * HD_SCALE}px;
  }
`;

export interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
  componentFilters: string[];
  onComponentFiltersChange: (componentFilter: string | string[]) => void;
  onClearComponentFilters: () => void;
}

// tslint:disable-next-line:function-name
export function FilterHeader(props: Props) {
  const abilityBookContext = useContext(AbilityBookContext);

  const networks = abilityBookContext.abilityNetworks[Routes[abilityBookContext.activeRoute]];
  const componentCategories: Section[] = networks ? networks.componentCategories
    .filter(componentCategory => abilityBookContext.componentCategoryToComponentIDs[componentCategory.displayInfo.name])
    .map((componentCategory) => {
      return {
        title: componentCategory.displayInfo.name,
        selected: true,
        items: abilityBookContext.componentCategoryToComponentIDs[componentCategory.displayInfo.name]
          .map(id => abilityBookContext.abilityComponents[id]),
      };
    }) : [];

  function onResetClick() {
    props.onSearchChange('');
    props.onClearComponentFilters();
  }

  return (
    <Container>
      <Spacing>
        <FilterCheck text='Unassigned' />
      </Spacing>
      <Spacing>
        <FilterDropdown
          placeholder='Filter by components'
          sections={componentCategories}
          selected={props.componentFilters}
          onSelectItem={props.onComponentFiltersChange}
          onDeselectAll={props.onClearComponentFilters}
        />
      </Spacing>
      <SearchInput searchValue={props.searchValue} onSearchChange={props.onSearchChange} />
      <ResetFilters onClick={onResetClick}>Reset Filters</ResetFilters>
    </Container>
  );
}
