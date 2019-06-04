/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Input constants
const INPUT_FONT_SIZE = 28;
const INPUT_PADDING = 10;
const INPUT_MARGIN = 10;
// #endregion
const Input = styled.input`
  font-family:Titillium Web;
  color: #c0c0c0 !important;
  text-transform: initial;
  font-size: ${INPUT_FONT_SIZE}px;
  padding: ${INPUT_PADDING}px;
  margin: ${INPUT_MARGIN}px !important;
  display: inline-block;
  border: 1px solid transparent !important;
  border-image: url(../images/inventory/border-texture.png) !important;
  border-image-slice: 1 !important;
  border-image-repeat: round !important;
  background: url(../images/inventory/filter-input-texture.png), rgba(10,10,10,1) !important;
  transition: border 0.30s ease-in-out;
  &::placeholder {
    color: #c0c0c0 !important;
  }
  &:focus {
    border-image: url(../images/inventory/border-texture.png) !important;
    border-image-slice: 1 !important;
    border-image-repeat: round !important;
    background: url(../images/inventory/filter-input-texture.png), rgba(10,10,10,1) !important;
    border: 1px solid #847963 !important;
    outline: none;
  }

  @media (max-width: 2560px) {
    font-size: ${INPUT_FONT_SIZE * MID_SCALE}px;
    padding: ${INPUT_PADDING * MID_SCALE}px;
    margin: ${INPUT_MARGIN * MID_SCALE}px !important;
  }

  @media (max-width: 1920px) {
    font-size: ${INPUT_FONT_SIZE * HD_SCALE}px;
    padding: ${INPUT_PADDING * HD_SCALE}px;
    margin: ${INPUT_MARGIN * HD_SCALE}px !important;
  }
`;

export interface SearchInputProps extends React.InputHTMLAttributes<JSX.Element> {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

class SearchInput extends React.PureComponent<SearchInputProps> {
  public render() {
    return (
      <Input
        placeholder='Filter'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.onSearchChange(e.target.value)}
        value={this.props.searchValue}
      />
    );
  }
}

export default SearchInput;
