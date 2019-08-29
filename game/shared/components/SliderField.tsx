/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import * as CSS from '../lib/css-helper';
import { Box } from './Box';
import { Field } from './Field';
import { Slider } from './Slider';

const SliderContainer = styled.div`
  ${CSS.IS_ROW}
  height: 33px;
  padding: 0 5px;
`;

const Counter = styled.div`
  ${CSS.DONT_GROW}
  width: 60px;
  height: 33px;
  color: white;
  background-color: black;
  text-align: center;
`;

interface SliderFieldProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  current: number;
  logarithmic?: boolean;
  updateInterval?: number;
  onChange?: (value: number) => void;
}

export class SliderField extends React.PureComponent<SliderFieldProps> {
  public render() {
    const { min, max, label, current, logarithmic, updateInterval } = this.props;
    const cls = 'fixed-height';
    return (
      <Box>
        <Field className={`${cls}`} style={{ width: '35%' }}>{label.toTitleCase()}</Field>
        <Field className={`${cls}`} style={{ width: '50%' }}>
          <SliderContainer>
            <Slider
              min={min}
              max={max}
              current={current}
              onChange={this.onChange}
              logrithmic={logarithmic}
              updateInterval={updateInterval}
            />
          </SliderContainer>
        </Field>
        <Field className={`${cls} at-end`} style={{ width: '15%' }}>
          <Counter>
            {this.props.current}
          </Counter>
        </Field>
      </Box>
    );
  }

  private onChange = (value: number) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
}
