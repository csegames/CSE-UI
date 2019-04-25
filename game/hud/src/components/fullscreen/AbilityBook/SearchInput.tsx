/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { TextInput } from 'shared/TextInput';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const InputContainer = styled.div`
  position: relative;
`;

// #region SearchIcon constants
const SEARCH_ICON_RIGHT = 30;
const SEARCH_ICON_FONT_SIZE = 28;
// #endregion
const SearchIcon = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: ${SEARCH_ICON_RIGHT}px;
  font-size: ${SEARCH_ICON_FONT_SIZE}px;
  top: 0px;
  bottom: 0px;

  &.close {
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.5;
    }
  }

  @media (max-width: 2560px) {
    right: ${SEARCH_ICON_RIGHT * MID_SCALE}px;
    font-size: ${SEARCH_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    right: ${SEARCH_ICON_RIGHT * HD_SCALE}px;
    font-size: ${SEARCH_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region inputStyle constants
const INPUT_STYLE_WIDTH = 410;
const INPUT_STYLE_HEIGHT = 86;
const INPUT_STYLE_PADDING_TOP = 60;
const INPUT_STYLE_PADDING_BOT = 40;
const INPUT_STYLE_FONT_SIZE = 32;
// #endregion
const inputStyle = css`
  width: ${INPUT_STYLE_WIDTH}px;
  height: ${INPUT_STYLE_HEIGHT}px;
  padding: 0 ${INPUT_STYLE_PADDING_TOP}px 0 ${INPUT_STYLE_PADDING_BOT}px;
  font-size: ${INPUT_STYLE_FONT_SIZE}px;
  background-image: url(../images/abilitybook/uhd/search-border.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-family: TitilliumWeb;
  color: black;
  background-color: transparent;
  border: 0;

  &::placeholder {
    color: black;
  }

  @media (max-width: 2560px) {
    width: ${INPUT_STYLE_WIDTH * MID_SCALE}px;
    height: ${INPUT_STYLE_HEIGHT * MID_SCALE}px;
    padding: 0 ${INPUT_STYLE_PADDING_TOP * MID_SCALE}px 0 ${INPUT_STYLE_PADDING_BOT * MID_SCALE}px;
    font-size: ${INPUT_STYLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybook/hd/search-border.png);
    width: ${INPUT_STYLE_WIDTH * HD_SCALE}px;
    height: ${INPUT_STYLE_HEIGHT * HD_SCALE}px;
    padding: 0 ${INPUT_STYLE_PADDING_TOP * HD_SCALE}px 0 ${INPUT_STYLE_PADDING_BOT * HD_SCALE}px;
    font-size: ${INPUT_STYLE_FONT_SIZE * HD_SCALE}px;
  }

  @media (max-width: 1640px) {
    width: ${INPUT_STYLE_WIDTH * 0.3}px;
  }
`;

export interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

// tslint:disable-next-line:function-name
export function SearchInput(props: Props) {
  function onClearClick() {
    props.onSearchChange('');
  }

  return (
    <InputContainer>
      <TextInput
        overrideInputStyles
        placeholder='Filter by name'
        value={props.searchValue}
        inputClassName={inputStyle}
        onChange={e => props.onSearchChange(e.target.value)}
      />
      {props.searchValue === '' ?
        <SearchIcon className='fa fa-search' /> :
        <SearchIcon className='close fa fa-times' onClick={onClearClick} />
      }
    </InputContainer>
  );
}
