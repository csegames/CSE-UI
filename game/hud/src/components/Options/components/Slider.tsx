/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface SliderStyle extends StyleDeclaration {
  Slider: React.CSSProperties;
  label: React.CSSProperties;
  input: React.CSSProperties;
  minMaxInfo: React.CSSProperties;
  minMaxText: React.CSSProperties;
}

export const defaultSliderStyle: SliderStyle = {
  Slider: {
    width: '100%',
  },

  label: {
    color: 'white',
  },

  input: {
    webkitAppearance: 'none',
    width: '100%',
    margin: '-5px',
    padding: '5px',
    cursor: 'pointer',
    background: 'transparent',
    ':focus': {
      outline: 'none',
    },
    '::-webkit-slider-runnable-track': {
      width: '100%',
      height: '5px',
      backgroundColor: '#454545',
    },
    '::-webkit-slider-thumb': {
      webkitAppearance: 'none',
      border: '1px solid #201f1f',
      height: '20px',
      width: '20px',
      borderRadius: '7px',
      cursor: 'pointer',
      marginTop: '-10px',
    },
    ':active::-webkit-slider-thumb': {
      boxShadow: 'inset 0 0 1px rgba(0,0,0,0.8)',
    },
    ':hover::-webkit-slider-thumb': {
      backgroundColor: 'white',
    },
    ':hover::-webkit-slider-runnable-track': {
      backgroundColor: utils.lightenColor('#454545', 30),
    },
  },

  minMaxInfo: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  minMaxText: {
    fontSize: '12px',
    color: 'rgba(100,100,100,1)',
  },
};

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
    const ss = StyleSheet.create(defaultSliderStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.Slider, custom.Slider)}>
        {this.props.label && <label className={css(ss.label, custom.label)}>{this.props.label}</label>}
        <input
          type='range'
          className={css(ss.input, custom.input)}
          onChange={this.onInputChange}
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
        />
        <div className={css(ss.minMaxInfo, custom.minMaxInfo)}>
          <span className={css(ss.minMaxText, custom.minMaxText)}>{this.props.min || 0}</span>
          <span>{this.props.value}</span>
          <span className={css(ss.minMaxText, custom.minMaxText)}>{this.props.max || 100}</span>
        </div>
      </div>
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

