/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from '../utils/css-helper';
import { Box } from './Box';
import { Field } from './Field';

const HANDLE_BG_COLOR = 'rgb(15,16,18)';
const HANDLE_FG_COLOR = 'rgb(252,211,179)';

const SliderContainer = styled('div')`
  ${CSS.IS_ROW}
  height: 33px;
  padding: 0 5px;
`;

const SlidingSpace = styled('div')`
  position: relative;
  width: 100%;
  height: 33px;
  ${CSS.ALLOW_MOUSE}
`;

const SliderRule = styled('div')`
  position: absolute;
  top: 15px;
  height: 3px;
  width: 100%;
  left: 0;
  background-color: rgba(128,128,128,0.5);
  pointer-events: none;
`;

const SliderHandle = styled('div')`
  position: absolute;
  top: 9px;
  left: 0;
  height: 9px;
  width: 9px;
  transform: rotate(45deg);
  background-color: ${HANDLE_FG_COLOR};
  border: 3px inset ${HANDLE_BG_COLOR};
  pointer-events: none;
  margin-left: -8px;
`;

const Counter = styled('div')`
  ${CSS.DONT_GROW}
  width: 60px;
  height: 33px;
  color: white;
  background-color: black;
  text-align: center;
`;

function logslider(v: number, min: number, max: number) {
  const minp = min + 0.49;
  const maxp = max;
  const minv = Math.log(minp);
  const maxv = Math.log(maxp);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (v - minp));
}

function logposition(v: number, min: number, max: number) {
  const minp = min + 0.49;
  const maxp = max;
  const minv = Math.log(minp);
  const maxv = Math.log(maxp);
  const scale = (maxv - minv) / (maxp - minp);
  return (Math.log(v) - minv) / scale + minp;
}

interface SliderFieldProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  current: number;
  logrithmic?: boolean;
  updateInterval?: number;
  onChange: (id: string, value: number) => void;
}

interface SliderFieldState {
  current: number;            // may be logrithmic
  position: number;           // slider position
}

function currentInRange2Percent(current: number, min: number, max: number) {
  return (current - min) / (max - min) * 100;
}

export class SliderField extends React.PureComponent<SliderFieldProps, SliderFieldState> {
  private last: number = 0;
  private changeTimeout: any = 0;
  constructor(props: SliderFieldProps) {
    super(props);
    this.state = { current: 0, position: 0 };
  }
  public componentDidMount() {
    this.setStateFromProps(this.props);
  }
  public componentWillReceiveProps(next: SliderFieldProps) {
    this.setStateFromProps(next);
  }
  public render() {
    let transition;
    const { min, max, label } = this.props;
    const { current, position } = this.state;
    const pos = currentInRange2Percent(position, min, max);
    const cls = 'fixed-height';
    const offset = Math.abs(this.last - position);
    this.last = position;
    if (offset > 0) {
      const pcnt = currentInRange2Percent(min + offset, min, max);
      const time = 0.004 * pcnt;
      if (time >= 0.016) transition = `left ${time}s ease`;
    }
    return (
      <Box>
        <Field className={`${cls}`} style={{ width: '35%' }}>{label}</Field>
        <Field className={`${cls}`} style={{ width: '50%' }}>
          <SliderContainer>
            <SlidingSpace
              onMouseDown={this.handleMouse}
              onMouseMove={this.handleMouse}
              onMouseOut={this.handleMouse}
              onMouseUp={this.handleMouse}
              >
              <SliderRule/>
              <SliderHandle style={{ left: pos + '%', transition }}/>
            </SlidingSpace>
          </SliderContainer>
        </Field>
        <Field className={`${cls} at-end`} style={{ width: '15%' }}>
          <Counter>
            {current}
          </Counter>
        </Field>
      </Box>
    );
  }

  private setStateFromProps = (props: SliderFieldProps) => {
    const { min, max } = props;
    let current = props.current;
    let position = current;
    if (current < min) current = min;
    if (current > max) current = max;
    if (props.logrithmic) position = logposition(current, min, max);
    this.setState({ current, position });
  }

  private handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.buttons & 1 || e.nativeEvent.which === 1) {
      const { min, max, logrithmic } = this.props;
      let pcnt = e.nativeEvent.offsetX / e.currentTarget.offsetWidth * 100;
      if (pcnt < 0) pcnt = 0;
      else if (pcnt > 100) pcnt = 100;
      const position = Math.round(min + ((max - min) * pcnt / 100));
      let current = position;
      // only update parent element of change every so often
      if (logrithmic) {
        current = Math.round(logslider(position, min, max));
      }
      this.setState({ position, current });
      this.onChange(this.props.id, current);
    }
  }

  private onChange(id: string, value: number) {
    if (this.props.onChange) {
      if (this.changeTimeout) clearTimeout(this.changeTimeout);
      this.changeTimeout = setTimeout(
        () => {
          this.props.onChange(this.props.id, value);
          this.changeTimeout = null;
        },
        this.props.updateInterval || 100,
      );
    }
  }
}
