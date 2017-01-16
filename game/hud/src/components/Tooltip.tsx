/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-24 11:47:41
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 17:50:35
 */

/*
 * Usage:
 * 
 * A text tooltip is easy, just wrap the element you would like to have a tooltip 
 * displayed for and set the content to a string message!
 * <Tooltip content='Hello World!'>
 *   <h1>Stuff and things</h1>
 * </Tooltip>
 * 
 * Tooltips can also be jsx elements!
 * <Tooltip content={<img src='https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg' />}>
 *   <h1>Hover for a cat picture!</h1>
 * </Tooltip>
 * 
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import {Quadrant, windowQuadrant} from '../lib/layoutLib';

const defaultStyles = {
  tooltip: {
    backgroundColor: '#4d573e',
    border: '1px solid darken(#4d573e, 20%)',
    color: '#ececec',
    padding: '2px 5px',
    maxWidth: '200px',
    'z-index': '9999',
  }
};

export interface TooltipProps {
  content: any;
  tooltipClassName?: string;
  offsetLeft?: number;
  offsetRight?: number;
  offsetTop?: number;
  offsetBottom?: number;
  style?: React.CSSProperties;
}

export interface TooltipState {
  x: number;
  y: number;
  wndRegion: Quadrant;
  hidden: boolean;
  ttClassName: string;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  constructor(props: TooltipProps) {
    super(props);
    this.state = {
      x: -99999,
      y: -99999,
      wndRegion: Quadrant.TopLeft,
      hidden: true,
      ttClassName: this.props.tooltipClassName || 'Tooltip',
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
    };
  }

  onMouseMove = (e: any) => {
    if (this.state.hidden == true) return;
    this.setState({
      x: e.clientX,
      y: e.clientY
    } as any);
  }

  onMouseEnter = (e: any) => {
    this.setState({
      hidden: false,
      wndRegion: windowQuadrant(e.clientX, e.clientY),
    } as any);
  }

  onMouseleave = () => {
    this.setState({hidden: true} as any);
  }

  computeStyle = () => {
    switch (this.state.wndRegion) {
      case Quadrant.TopLeft:
        return {
          position: 'fixed',
          left: `${this.state.x + this.state.offsetLeft}px`,
          top: `${this.state.y + this.state.offsetTop}px`
        };
      case Quadrant.TopRight:
      return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          top: `${this.state.y + this.state.offsetTop}px`
        };
      case Quadrant.BottomLeft:
      return {
          position: 'fixed',
          left: `${this.state.x + this.state.offsetLeft}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`
        };
      case Quadrant.BottomRight:
      return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`
        };
    }
  }

  render() {

    const ss = StyleSheet.create({
      tooltip: {
        ...defaultStyles.tooltip,
        ...(this.props.style || {})
      }
    });

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseleave} onMouseMove={this.onMouseMove}
        style={{display: 'inline-block'}}>
        {this.props.children}
        {
          this.state.hidden ? null :
          <div className={css(ss.tooltip)} style={this.computeStyle()}>{this.props.content}</div>
        }
      </div>
    )
  }
}

export default Tooltip;
