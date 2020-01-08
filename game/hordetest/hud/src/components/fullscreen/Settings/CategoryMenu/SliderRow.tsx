/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ItemContainer } from '../ItemContainer';

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
`;

const Slider = styled.input`
  position: relative;
  -webkit-appearance: none;
  appearance: none;
  height: 9px;
  width: 100%;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -4px;
    width: 7px;
    height: 7px;
    transform: scale(1.5) rotate(45deg);
    background-color: #6ba1dd;
    border: 2px solid black;
    box-sizing: content-box !important;
    cursor: pointer;
  }
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 33px;
  color: white;
  background-color: black;
  text-align: center;
  margin-left: 10px;
`;

export interface Props {
  option: IntRangeOption;
  onChange: (option: IntRangeOption) => void;
}

export function SliderRow(props: Props) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newOption = cloneDeep(props.option);
    newOption.value = Number(e.target.value);
    props.onChange(newOption);
  }

  return (
    <ItemContainer>
      <div>
        {props.option.displayName.toTitleCase()}
      </div>

      <SliderContainer>
        <Slider
          type="range"
          value={props.option.value}
          min={props.option.minValue}
          max={props.option.maxValue}
          onChange={onChange}
        />
        <Value>{props.option.value}</Value>
      </SliderContainer>
    </ItemContainer>
  );
}
