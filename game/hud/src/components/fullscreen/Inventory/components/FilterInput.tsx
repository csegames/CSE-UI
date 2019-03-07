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

const Container = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 auto;
`;

const InputWrapperStyle = css`
  display: flex;
  flex: 1;
`;

const InputStyle = css`
  flex: 1;
  font-family:Titillium Web;
  color: #998675 !important;
  text-transform: initial;
  font-size: 14px;
  display: inline-block;
  padding: 0 5px;
  border: 1px solid transparent;
  border-image: url(../images/inventory/border-brown-texture.png);
  border-image-slice: 1;
  border-image-repeat:round;
  background: url(../images/inventory/filter-input-texture.png), rgba(10,10,10,1);
  transition: border 0.30s ease-in-out;
  &::-webkit-input-placeholder {
    color: #43382e;
  }
  &:focus {
    border: 1px solid transparent;
    border-image: url(../images/inventory/border-texture.png);
    border-image-slice: 1;
    border-image-repeat:round;
    background: url(../images/inventory/filter-input-texture.png), rgba(10,10,10,1);
    border: 1px solid #847963;
    outline: none;
  }
`;

export interface FilterInputProps {
  filterText: string;
  onFilterChanged: (val: string) => void;
  className?: string;
}

class FilterInput extends React.Component<FilterInputProps> {
  public render() {
    return (
      <Container className={this.props.className}>
        <TextInput
          data-input-group='block'
          overrideInputStyles
          wrapperClassName={InputWrapperStyle}
          inputClassName={InputStyle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.onFilterChanged(e.target.value)}
          placeholder={'Filter'}
        />
      </Container>
    );
  }
}

export default FilterInput;
