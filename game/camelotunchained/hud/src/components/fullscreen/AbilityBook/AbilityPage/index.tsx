/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState } from 'react';
import { isEmpty, isArray } from 'lodash';
import Fuse, { FuseOptions } from 'fuse.js';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { styled } from '@csegames/linaria/react';

import { AbilityBookContext, Routes } from '../../../context/AbilityBookContext';
import { AbilityItem } from './AbilityItem';
import { FilterHeader } from './FilterHeader';
import { Modal } from './Modal';
import { AbilityType, useAbilityBuilderReducer } from 'services/session/AbilityBuilderState';
import { AbilityBookQuery } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { FullScreenContext } from 'fullscreen/lib/utils';

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

// #region ListItemContainer constants
const LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL = 10;
const LIST_ITEM_CONTAINER_MARGIN_BOTTOM = 20;
// #endregion
const ListItemContainer = styled.div`
  display: inline-block;
  flex: 1;
  width: calc(50% - ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * 2}px);
  max-width: calc(50% - ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * 2}px);
  margin: 0px ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL}px ${LIST_ITEM_CONTAINER_MARGIN_BOTTOM}px
  ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL}px;

  @media (max-width: 2560px) {
    width: calc(50% - ${(LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * 2) * MID_SCALE}px);
    max-width: calc(50% - ${(LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * 2) * MID_SCALE}px);
    margin: 0px ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * MID_SCALE}px ${LIST_ITEM_CONTAINER_MARGIN_BOTTOM * MID_SCALE}px
    ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: calc(50% - ${(LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * 2) * HD_SCALE}px);
    max-width: calc(50% - ${(LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * 2) * HD_SCALE}px);
    margin: 0px ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * HD_SCALE}px ${LIST_ITEM_CONTAINER_MARGIN_BOTTOM * HD_SCALE}px
    ${LIST_ITEM_CONTAINER_MARGIN_HORIZONTAL * HD_SCALE}px;
  }
`;

const AbilityRow = styled.div`
  display: flex;
  width: 100%;
`;

const Overlay = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 98;
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
    'name',
  ],
};

// tslint:disable-next-line:function-name
export function AbilityPage(props: Props) {
  const [abilityBuilderState, abilityBuilderDispatch] = useAbilityBuilderReducer();
  const { visibleComponentLeft, visibleComponentRight } = useContext(FullScreenContext);
  const abilityBookContext = useContext(AbilityBookContext);
  const [searchValue, setSearchValue] = useState('');
  const [componentFilters, setComponentFilter] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState<AbilityBookQuery.Abilities>(null);

  function onEditClick(ability: AbilityBookQuery.Abilities) {
    setSelectedAbility(ability);
  }

  function onCloseModal() {
    setSelectedAbility(null);
  }

  function onClearComponentFilters() {
    setComponentFilter([]);
  }

  function onModifyClick() {
    const selectedType: AbilityType = {
      id: selectedAbility.abilityNetwork.id,
      name: selectedAbility.abilityNetwork.display.name,
    };
    const abilityComponents = selectedAbility.abilityComponents.map(component => component.id);

    abilityBuilderDispatch({ type: 'set-selected-type', selectedType });
    abilityBuilderDispatch({ type: 'set-icon', icon: selectedAbility.icon });
    abilityBuilderDispatch({ type: 'set-name', name: selectedAbility.name });
    abilityBuilderDispatch({ type: 'set-ability-components', abilityComponents });
    abilityBuilderDispatch({ type: 'set-is-modifying', isModifying: true, modifiedAbilityID: selectedAbility.id });
    setSelectedAbility(null);

    if (visibleComponentLeft === 'ability-book-left' && visibleComponentRight !== 'ability-builder-right') {
      game.trigger('navigate', 'ability-builder-right');
    } else if (visibleComponentRight === 'ability-book-right' && visibleComponentLeft !== 'ability-builder-left') {
      game.trigger('navigate', 'ability-builder-left');
    }
  }

  async function onDeleteClick() {
    const res = await webAPI.AbilitiesAPI.DeleteAbility(
      webAPI.defaultConfig,
      selectedAbility.id,
    );

    if (res.ok) {
      onCloseModal();
      abilityBookContext.refetch();

      if (abilityBuilderState.modifiedAbilityID === selectedAbility.id) {
        abilityBuilderDispatch({ type: 'reset' });
      }
    }
  }

  function onComponentFilterChange(filter: string | string[]) {
    let componentFilterClone = [...componentFilters];

    if (isArray(filter)) {
      filter.forEach((f) => {
        if (componentFilterClone.includes(f)) {
          // Remove the filter
          componentFilterClone = componentFilterClone.filter(fC => fC !== f);
        } else {
          // Add the filter
          componentFilterClone.push(f);
        }
      });
    } else {
      if (componentFilterClone.includes(filter)) {
        // Remove the filter
        componentFilterClone = componentFilterClone.filter(f => f !== filter);
      } else {
        // Add the filter
        componentFilterClone.push(filter);
      }
    }

    setComponentFilter(componentFilterClone);
  }

  if (!abilityBookContext.abilityNetworkToAbilities[Routes[abilityBookContext.activeRoute]]) {
    return null;
  }

  let abilities: AbilityBookQuery.Abilities[] = [];
  const abilityRows = [];
  if (!isEmpty(abilityBookContext.abilityNetworkToAbilities)) {
    abilities = [...abilityBookContext.abilityNetworkToAbilities[Routes[abilityBookContext.activeRoute]]];

    // Handle component category filtering
    if (!isEmpty(componentFilters)) {
      abilities = abilities.filter((ability) => {
        if (ability.abilityComponents.find(component =>
            componentFilters.includes(component.display.name))) {
          return true;
        }

        return false;
      });
    }

    // Handle search filtering
    if (searchValue !== '') {
      const fuseSearch: { item: AbilityBookQuery.Abilities, score: number }[] =
        new Fuse(abilities, fuseSearchOptions).search(searchValue) as any;

      abilities = fuseSearch.sort((a, b) => a.score - b.score).map(searchItem => searchItem.item);
    }

    const numOfRows = Math.ceil(abilities.length / 2);
    for (let i = 0; i < numOfRows; i++) {
      const ability1 = abilities.shift();
      const ability2 = abilities.shift();

      if (ability2) {
        abilityRows.push([ability1,, ability2]);
      } else {
        abilityRows.push([ability1]);
      }
    }
  }

  return (
    <Container>
      {selectedAbility &&
        <>
          <Overlay>
            <Modal onModifyClick={onModifyClick} onDeleteClick={onDeleteClick} onCloseClick={onCloseModal} />
          </Overlay>
        </>
      }
      <FilterHeader
        searchValue={searchValue}
        onSearchChange={val => setSearchValue(val)}
        componentFilters={componentFilters}
        onComponentFiltersChange={onComponentFilterChange}
        onClearComponentFilters={onClearComponentFilters}
      />
      <ContentContainer className='cse-ui-scroller-thumbonly-brown'>
        <ListContainer>
          {abilityRows.map((abilityRow) => {
            return (
              <AbilityRow>
                {abilityRow.map((ability) => {
                  return (
                    <ListItemContainer>
                      <AbilityItem ability={ability} onEditClick={onEditClick} />
                    </ListItemContainer>
                  );
                })}
              </AbilityRow>
            );
          })}
        </ListContainer>
      </ContentContainer>
    </Container>
  );
}
