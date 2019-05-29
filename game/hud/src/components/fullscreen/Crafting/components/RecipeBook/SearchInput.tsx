/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { TextInput } from 'shared/TextInput';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_LEFT = 10;
const CONTAINER_HEIGHT = 62;
const CONTAINER_MARGIN_BOTTOM = 20;
const CONTAINER_PADDING_BOTTOM = 10;
const CONTAINER_PADDING_RIGHT = 10;
// #endregion
const Container = styled.div`
  position: relative;
  top: 0px;
  right: 0;
  left: ${CONTAINER_LEFT}px;
  height: ${CONTAINER_HEIGHT}px;
  margin-bottom: ${CONTAINER_MARGIN_BOTTOM}px;
  padding: 0 0 ${CONTAINER_PADDING_BOTTOM}px ${CONTAINER_PADDING_RIGHT}px;
  background-image: url(../images/crafting/uhd/search-line.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: left bottom;

  @media (max-width: 2560px) {
    left: ${CONTAINER_LEFT * MID_SCALE}px;
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
    padding: 0 0 ${CONTAINER_PADDING_BOTTOM * MID_SCALE}px ${CONTAINER_PADDING_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    left: ${CONTAINER_LEFT * HD_SCALE}px;
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
    padding: 0 0 ${CONTAINER_PADDING_BOTTOM * HD_SCALE}px ${CONTAINER_PADDING_RIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/search-line.png);
  }
`;

const WrapperStyle = css`
  width: 100%;
  height: 100%;
`;

// #region InputStyle constants
const INPUT_STYLE_FONT_SIZE = 40;
// #endregion
const InputStyle = css`
  width: 100%;
  height: 100%;
  background: transparent !important;
  border: 0px !important;
  outline: none !important;
  font-family: Caveat !important;
  font-size: ${INPUT_STYLE_FONT_SIZE}px !important;
  color: black !important;
  &::placeholder {
    color: black !important;
  }

  @media (max-width: 2560px) {
    font-size: ${INPUT_STYLE_FONT_SIZE * MID_SCALE}px !important;
  }

  @media (max-width: 1920px) {
    font-size: ${INPUT_STYLE_FONT_SIZE * HD_SCALE}px !important;
  }
`;

export interface Props {
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
}

class SearchInput extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <TextInput
          placeholder={'Search'}
          overrideInputStyles
          wrapperClassName={WrapperStyle}
          inputClassName={InputStyle}
          value={this.props.searchValue}
          onChange={this.onChange}
        />
      </Container>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSearchChange(e.target.value);
  }
}

export default SearchInput;
