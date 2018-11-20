/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Input = styled('input')`
  font-family:Titillium Web;
  color: #c0c0c0 !important;
  text-transform: initial;
  font-size: 14px;
  display: inline-block;
  padding: 5px;
  border: 1px solid transparent !important;
  border-image: url(images/inventory/border-texture.png) !important;
  border-image-slice: 1 !important;
  border-image-repeat: round !important;
  background: url(images/inventory/filter-input-texture.png), rgba(10,10,10,1) !important;
  transition: border 0.30s ease-in-out;
  margin: 5px !important;
  &::placeholder {
    color: #c0c0c0 !important;
  }
  &:focus {
    border-image: url(images/inventory/border-texture.png) !important;
    border-image-slice: 1 !important;
    border-image-repeat: round !important;
    background: url(images/inventory/filter-input-texture.png), rgba(10,10,10,1) !important;
    border: 1px solid #847963 !important;
    outline: none;
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
