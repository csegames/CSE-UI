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
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 auto;
`;

const InputWrapperStyle = css`
  display: flex;
  flex: 1;
`;

// #region InputStyle constants
const INPUT_STYLE_FONT_SIZE = 28;
const INPUT_STYLE_PADDING_VERTICAL = 5;
const INPUT_STYLE_PADDING_HORIZONTAL = 10;
// #endregion
const InputStyle = css`
  flex: 1;
  font-family:Titillium Web;
  color: #998675 !important;
  text-transform: initial;
  font-size: ${INPUT_STYLE_FONT_SIZE}px;
  padding: ${INPUT_STYLE_PADDING_VERTICAL}px ${INPUT_STYLE_PADDING_HORIZONTAL}px;
  display: inline-block;
  border: 1px solid transparent;
  border-image: url(../images/inventory/border-brown-texture.png);
  border-image-slice: 1;
  border-image-repeat:round;
  background: url(../images/inventory/filter-input-texture.png), rgba(10, 10, 10, 1);
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

  @media (max-width: 2560px) {
    font-size: ${INPUT_STYLE_FONT_SIZE * MID_SCALE}px;
    padding: ${INPUT_STYLE_PADDING_VERTICAL * MID_SCALE}px ${INPUT_STYLE_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${INPUT_STYLE_FONT_SIZE * HD_SCALE}px;
    padding: ${INPUT_STYLE_PADDING_VERTICAL * HD_SCALE}px ${INPUT_STYLE_PADDING_HORIZONTAL * HD_SCALE}px;
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
