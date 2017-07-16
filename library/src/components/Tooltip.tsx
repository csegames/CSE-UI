/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-24 11:47:41
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-12 11:04:24
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

import {Quadrant, windowQuadrant} from '../util';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

export const defaultToolTipStyle: ToolTipStyle = {
  Tooltip: {
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
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },
};
export interface ToolTipStyle extends StyleDeclaration {
  Tooltip: React.CSSProperties;
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
  show?: boolean;
  onTooltipShow?: () => void;
  onTooltipHide?: () => void;
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
      show: this.props.show || false,
      ttClassName: this.props.tooltipClassName || 'Tooltip',
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
    };
  }
  public render() {
    const ss = StyleSheet.create(defaultToolTipStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const showTooltip = typeof this.props.show !== 'undefined' ? this.props.show : this.state.show;
    return (
      <div className={css(ss.Tooltip, custom.Tooltip)}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseleave}
          onMouseMove={this.onMouseMove}>
        {this.props.children}
        {
          showTooltip ?
          <div className={css(ss.tooltip, custom.tooltip)} style={this.computeStyle()}>
            {typeof this.props.content === 'string' ? this.props.content : 
              <this.props.content {...this.props.contentProps} />}
          </div> : null
        }
      </div>
    );
  }
  private onMouseMove = (e: any) => {
    if (this.state.show === false) return;
    this.setState({
      x: e.clientX,
      y: e.clientY,
    } as any);
  }
  private onMouseEnter = (e: any) => {
    if (this.props.onTooltipShow) this.props.onTooltipShow();
    this.setState({
      show: true,
      wndRegion: windowQuadrant(e.clientX, e.clientY),
    } as any);
  }
  private onMouseleave = () => {
    if (this.props.onTooltipHide) this.props.onTooltipHide();
    this.setState({ show: false } as any);
  }
  private computeStyle = () => {
    switch (this.state.wndRegion) {
      case Quadrant.TopLeft:
        return {
          left: `${this.state.x + this.state.offsetLeft}px`,
          top: `${this.state.y + this.state.offsetTop}px`,
        };
      case Quadrant.TopRight:
      return {
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          top: `${this.state.y + this.state.offsetTop}px`,
        };
      case Quadrant.BottomLeft:
      return {
          left: `${this.state.x + this.state.offsetLeft}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`,
        };
      case Quadrant.BottomRight:
      return {
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`,
        };
    }
  }
}
export default Tooltip;
