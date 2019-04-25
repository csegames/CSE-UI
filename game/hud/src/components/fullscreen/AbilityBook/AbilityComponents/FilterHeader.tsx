/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { SearchInput } from '../SearchInput';
import { FilterCheck } from '../FilterCheck';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 7.5%;
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

// const DropdownItemClass = css`
//   &.selected:before {
//     content: '';
//     position: absolute;
//     right: 5px;
//     top: 0;
//     bottom: 0;
//     display: flex;
//     align-items: center;
//   }
// `;

export interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

// tslint:disable-next-line:function-name
export function FilterHeader(props: Props) {
  return (
    <Container>
      <Spacing>
        <FilterCheck text='Not learned' />
      </Spacing>
      <SearchInput searchValue={props.searchValue} onSearchChange={props.onSearchChange} />
    </Container>
  );
}
