/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

export interface SliderStyle {
  Slider: React.CSSProperties;
  label: React.CSSProperties;
  input: React.CSSProperties;
  minMaxInfo: React.CSSProperties;
  minMaxText: React.CSSProperties;
}

const Container = styled('div')`
  width: 100%;
`;

const Label = styled('label')`
  color: white;
`;

const Input = styled('input')`
  -webkit-appearance: none;
  width: 100%;
  cursor: pointer;
  background: transparent;

  &:focus: {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    background-color: #454545;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: white;
    border: 1px solid #201F1F;
    height: 20px;
    width: 20px;
    border-radius: 7px;
    cursor: pointer;
    margin-top: -10px;
  }

  &:active::-webkit-slider-thumb {
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.8);
  }

  &:hover::-webkit-slider-thumb {
    background-color: white;
  }

  &:hover::-webkit-slider-runnable-track {
    background-color: ${utils.lightenColor('#454545', 30)};
  }
`;


const MinMaxInfo = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const MinMaxText = styled('div')`
  font-size: 12px;
  color: rgba(100, 100, 100, 1);
`;

export interface SliderProps {
  styles?: Partial<SliderStyle>;
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export interface SliderState {
  customInputValue: number;
}

export class Slider extends React.Component<SliderProps, SliderState> {
  constructor(props: SliderProps) {
    super(props);
    this.state = {
      customInputValue: props.value,
    };
  }

  public render() {
    return (
      <Container>
        {this.props.label && <Label>{this.props.label}</Label>}
        <Input
          type='range'
          onChange={this.onInputChange}
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
        />
        <MinMaxInfo>
          <MinMaxText>{this.props.min || 0}</MinMaxText>
          <span>{this.props.value}</span>
          <MinMaxText>{this.props.max || 100}</MinMaxText>
        </MinMaxInfo>
      </Container>
    );
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = parseInt(e.target.value, 10);
    const min = this.props.min || 0;
    const max = this.props.max || 100;
    if (inputVal >= min && inputVal <= max) {
      this.props.onChange(inputVal);
    }
  }
}

export default Slider;

