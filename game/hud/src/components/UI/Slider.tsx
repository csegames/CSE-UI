/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import * as CSS from '../../lib/css-helper';

const HANDLE_BG_COLOR = 'rgb(15,16,18)';
const HANDLE_FG_COLOR = 'rgb(252,211,179)';

const SlidingSpace = styled.div`
  position: relative;
  width: 100%;
  height: 33px;
  ${CSS.ALLOW_MOUSE}
`;

const SliderRule = styled.div`
  position: absolute;
  top: 15px;
  height: 3px;
  width: 100%;
  left: 0;
  background-color: rgba(128,128,128,0.5);
  pointer-events: none;
`;

const SliderHandle = styled.div`
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
  box-sizing: content-box!important;
`;

function logslider(v: number, min: number, max: number) {
  const minp = min + 0.49;
  const maxp = max;
  const minv = Math.log(minp);
  const maxv = Math.log(maxp);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (v - minp));
}

function currentInRange2Percent(current: number, min: number, max: number) {
  return (current - min) / (max - min) * 100;
}

function logposition(v: number, min: number, max: number) {
  const minp = min + 0.49;
  const maxp = max;
  const minv = Math.log(minp);
  const maxv = Math.log(maxp);
  const scale = (maxv - minv) / (maxp - minp);
  return (Math.log(v) - minv) / scale + minp;
}


export interface Props {
  min: number;
  max: number;
  current: number;
  onChange: (value: number) => void;
  logrithmic?: boolean;
  updateInterval?: number;
}

export interface State {
  position: number;
}

export class Slider extends React.Component<Props, State> {
  private last: number = 0;
  private changeTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      position: 0,
    };
  }

  public render() {
    let transition;
    const { min, max } = this.props;
    const { position } = this.state;
    const pos = currentInRange2Percent(position, min, max);
    const offset = Math.abs(this.last - position);
    this.last = position;
    if (offset > 0) {
      const pcnt = currentInRange2Percent(min + offset, min, max);
      const time = 0.004 * pcnt;
      if (time >= 0.016) transition = `left ${time}s ease`;
    }
    return (
      <SlidingSpace
        onMouseDown={this.handleMouse}
        onMouseMove={this.handleMouse}
        onMouseOut={this.handleMouse}
        onMouseUp={this.handleMouse}
        >
        <SliderRule/>
        <SliderHandle style={{ left: pos + '%', transition }}/>
      </SlidingSpace>
    );
  }

  public componentDidMount() {
    this.setStateFromProps(this.props);
  }
  public componentWillReceiveProps(next: Props) {
    this.setStateFromProps(next);
  }


  private setStateFromProps = (props: Props) => {
    const { min, max } = props;
    let current = props.current;
    let position = current;
    if (current < min) current = min;
    if (current > max) current = max;
    if (props.logrithmic) position = logposition(current, min, max);
    this.setState({ position });
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
      this.setState({ position });
      this.onChange(current);
    }
  }

  private onChange(value: number) {
    if (this.changeTimeout) window.clearTimeout(this.changeTimeout);
    this.changeTimeout = window.setTimeout(
      () => {
        this.props.onChange(value);
        this.changeTimeout = null;
      },
      typeof this.props.updateInterval === 'number' ? this.props.updateInterval : 100,
    );
  }
}

export default Slider;
