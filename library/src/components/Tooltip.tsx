/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
import * as _ from 'lodash';

import { Quadrant, windowQuadrant } from '../utils';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

export const defaultToolTipStyle: ToolTipStyle = {
  Tooltip: {
    display: 'inline-block',
    position: 'relative',
  },
  tooltip: {
    position: 'fixed',
    backgroundColor: '#444',
    border: '1px solid #4A4A4A',
    color: '#ececec',
    padding: '2px 5px',
    maxWidth: '200px',
    zIndex: 10,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },

  tooltipFixed: {
    position: 'fixed',
    backgroundColor: '#444',
    border: '1px solid #4A4A4A',
    color: '#ececec',
    padding: '2px 5px',
    maxWidth: '200px',
    zIndex: 10,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },
};

export interface ToolTipStyle extends StyleDeclaration {
  Tooltip: React.CSSProperties;
  tooltip: React.CSSProperties;
  tooltipFixed: React.CSSProperties;
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
  fixedMode?: boolean;
}

export interface TooltipState {
  wndRegion: Quadrant;
  show: boolean;
  ttClassName: string;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
  tooltipDimensions: { width: number, height: number };
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  private childRef: HTMLDivElement;
  private tooltipRef: HTMLDivElement;

  constructor(props: TooltipProps) {
    super(props);
    this.state = {
      wndRegion: Quadrant.TopLeft,
      show: this.props.show || false,
      ttClassName: this.props.tooltipClassName || 'Tooltip',
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
      tooltipDimensions: null,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultToolTipStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const showTooltip = typeof this.props.show !== 'undefined' ? this.props.show : this.state.show;

    const fixed = this.props.fixedMode || false;
    return (
      <div className={css(ss.Tooltip, custom.Tooltip)}>
        <div
          ref={ref => this.childRef = ref}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseleave}
          onMouseMove={this.onMouseMove}>
          {this.props.children}
        </div>
        {
          showTooltip ?
            <div
              ref={ref => this.tooltipRef = ref}
              className={css(!fixed && ss.tooltip,
                !fixed && custom.tooltip,
                fixed && ss.tooltipFixed,
                fixed && custom.tooltipFixed)}>
              {typeof this.props.content === 'string' ? this.props.content :
                <this.props.content {...this.props.contentProps} />}
            </div> : null
        }
      </div>
    );
  }

  private onMouseMove = (e: React.MouseEvent<any>) => {
    if (this.props.fixedMode && !this.state.tooltipDimensions) {
      this.setState({ tooltipDimensions: this.tooltipRef.getBoundingClientRect() });
    }
    if (!this.props.fixedMode) {
      const computedStyle: any = this.computeStyle(
        e.clientX,
        e.clientY,
        this.state.offsetLeft,
        this.state.offsetTop,
        this.state.offsetRight,
        this.state.offsetBottom,
      );
      if (this.tooltipRef) {
        this.tooltipRef.style.left = computedStyle.left ? computedStyle.left : 'auto';
        this.tooltipRef.style.right = computedStyle.right ? computedStyle.right : 'auto';
        this.tooltipRef.style.bottom = computedStyle.bottom ? computedStyle.bottom : 'auto';
        this.tooltipRef.style.top = computedStyle.top ? computedStyle.top : 'auto';
      }
    }
  }

  private onMouseEnter = (e: any) => {
    if (this.props.onTooltipShow) {
      this.props.onTooltipShow();
    }
    this.setState({
      show: true,
      wndRegion: windowQuadrant(e.clientX, e.clientY),
    } as any);
  }

  private onMouseleave = () => {
    if (this.props.onTooltipHide) {
      this.props.onTooltipHide();
    }
    this.setState({ show: false } as any);
  }

  private computeStyle = (x: number,
                          y: number,
                          offsetLeft: number,
                          offsetTop: number,
                          offsetRight: number,
                          offsetBottom: number) => {
    const { top, left, width, height } = this.childRef.getBoundingClientRect();
    if (this.props.fixedMode && this.state.tooltipDimensions) {
      switch (this.state.wndRegion) {
        case Quadrant.TopLeft:
          return {
            left: left + offsetLeft,
            top: top + height + offsetTop,
          };
        case Quadrant.TopRight:
          return {
            left: left - this.state.tooltipDimensions.width + width + offsetRight,
            top: top + height + offsetTop,
          };
        case Quadrant.BottomLeft:
          return {
            left: left + offsetLeft,
            top: top - this.state.tooltipDimensions.height + offsetBottom,
          };
        case Quadrant.BottomRight:
          return {
            left: left - this.state.tooltipDimensions.width + width + offsetRight,
            top: top - this.state.tooltipDimensions.height + offsetBottom,
          };
      }
    } else {
      switch (this.state.wndRegion) {
        case Quadrant.TopLeft:
          return {
            left: `${x + offsetLeft}px`,
            top: `${y + offsetTop}px`,
          };
        case Quadrant.TopRight:
          return {
            right: `${window.window.innerWidth - x + offsetRight}px`,
            top: `${y + offsetTop}px`,
          };
        case Quadrant.BottomLeft:
          return {
            left: `${x + offsetLeft}px`,
            bottom: `${window.window.innerHeight - y + offsetBottom}px`,
          };
        case Quadrant.BottomRight:
          return {
            right: `${window.window.innerWidth - x + offsetRight}px`,
            bottom: `${window.window.innerHeight - y + offsetBottom}px`,
          };
      }
    }
  }
}

export default Tooltip;
