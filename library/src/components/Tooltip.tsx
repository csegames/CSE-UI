/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-24 11:47:41
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 18:06:09
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
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import {Quadrant, windowQuadrant} from '../util';

export const defaultToolTipStyle: ToolTipStyle = {
  container: {
    display: 'inline-block',
  },

  tooltip: {
    position: 'fixed',
    backgroundColor: '#444',
    border: '1px solid #4A4A4A',
    color: '#ececec',
    padding: '2px 5px',
    maxWidth: '200px',
    zIndex: 1000,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
  }
};

export interface ToolTipStyle extends StyleDeclaration {
  container: React.CSSProperties;
  tooltip: React.CSSProperties;
}

export interface TooltipProps {
  content: string | ((props?: any) => JSX.Element);
  contentProps?: any;
  tooltipClassName?: string;
  offsetLeft?: number;
  offsetRight?: number;
  offsetTop?: number;
  offsetBottom?: number;
  styles?: Partial<ToolTipStyle>;
}

export interface TooltipState {
  x: number;
  y: number;
  wndRegion: Quadrant;
  show: boolean;
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
      show: false,
      ttClassName: this.props.tooltipClassName || 'Tooltip',
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
    };
  }

  onMouseMove = (e: any) => {
    if (this.state.show == false) return;
    this.setState({
      x: e.clientX,
      y: e.clientY
    } as any);
  }

  onMouseEnter = (e: any) => {
    this.setState({
      show: true,
      wndRegion: windowQuadrant(e.clientX, e.clientY),
    } as any);
  }

  onMouseleave = () => {
    this.setState({show: false} as any);
  }

  computeStyle = () => {
    switch (this.state.wndRegion) {
      case Quadrant.TopLeft:
        return {
          left: `${this.state.x + this.state.offsetLeft}px`,
          top: `${this.state.y + this.state.offsetTop}px`
        };
      case Quadrant.TopRight:
      return {
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          top: `${this.state.y + this.state.offsetTop}px`
        };
      case Quadrant.BottomLeft:
      return {
          left: `${this.state.x + this.state.offsetLeft}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`
        };
      case Quadrant.BottomRight:
      return {
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`
        };
    }
  }

  render() {

    const ss = StyleSheet.create(defaultToolTipStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseleave}
           onMouseMove={this.onMouseMove}>
        {this.props.children}
        {
          this.state.show ?
          <div className={css(ss.tooltip, custom.tooltip)} style={this.computeStyle()}>
            {typeof this.props.content === 'string' ? this.props.content : <this.props.content {...this.props.contentProps} />}
          </div> : null
        }
      </div>
    )
  }
}

export default Tooltip;
