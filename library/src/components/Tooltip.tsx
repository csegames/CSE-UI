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
import styled, { css } from 'react-emotion';

import { Quadrant, windowQuadrant } from '../utils';

const Container = styled('div')`
  display: inline-block;
  position: relative;
`;

const TooltipView = styled('div')`
  position: fixed;
  background-color: #444;
  border: 1px solid #4A4A4A;
  color: #ECECEC;
  padding: 2px 5px;
  max-width: 200px;
  z-index: 10;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const TooltipFixedView = styled('div')`
  position: fixed;
  background-color: #444;
  border: 1px solid #4A4A4A;
  color: #ECECEC;
  padding: 2px 5px;
  max-width: 200px;
  z-index: 10;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

export interface ToolTipStyle {
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
  wndRegion?: Quadrant;
}

export interface TooltipState {
  wndRegion: Quadrant;
  show: boolean;
  ttClassName: string;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  private childRef: HTMLDivElement;
  private tooltipRef: HTMLDivElement;
  private windowDimensions: { innerHeight: number, innerWidth: number };
  private tooltipDimensions: { width: number, height: number };

  constructor(props: TooltipProps) {
    super(props);
    this.state = {
      wndRegion: Quadrant.TopLeft || this.props.wndRegion,
      show: this.props.show || false,
      ttClassName: this.props.tooltipClassName || 'Tooltip',
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
    };
  }

  public render() {
    const customStyles = this.props.styles || {};
    const showTooltip = typeof this.props.show !== 'undefined' ? this.props.show : this.state.show;

    const fixed = this.props.fixedMode || false;
    return (
      <Container style={customStyles.Tooltip}>
        <div
          ref={ref => this.childRef = ref}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseleave}
          onMouseMove={this.onMouseMove}>
          {this.props.children}
        </div>
        {
          showTooltip ?
            !fixed ?
              <TooltipView
                innerRef={ref => this.tooltipRef = ref}
                style={customStyles.tooltip}>
                  {typeof this.props.content === 'string' ? this.props.content :
                    <this.props.content {...this.props.contentProps} />
                  }
              </TooltipView> :
              <TooltipFixedView
                innerRef={ref => this.tooltipRef = ref}
                style={customStyles.tooltipFixed}>
                    {typeof this.props.content === 'string' ? this.props.content :
                  <this.props.content {...this.props.contentProps} />}
              </TooltipFixedView> : null
        }
      </Container>
    );
  }

  public componentDidMount() {
    this.initWindowDimensions();
    window.addEventListener('resize', this.initWindowDimensions);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.initWindowDimensions);
  }

  private initWindowDimensions = () => {
    this.windowDimensions = { innerHeight: window.innerHeight, innerWidth: window.innerWidth };
  }

  private onMouseMove = (e: React.MouseEvent<any>) => {
    if (!this.tooltipDimensions && this.tooltipRef) {
      this.tooltipDimensions = this.tooltipRef.getBoundingClientRect();
    }

    let computedStyle;
    if (this.props.fixedMode && this.tooltipDimensions) {
      const { top, left } = this.childRef.getBoundingClientRect();
      computedStyle = this.computeStyle(
        left,
        top,
        this.state.offsetLeft,
        this.state.offsetTop,
        this.state.offsetRight,
        this.state.offsetBottom,
      );

    }
    if (!this.props.fixedMode) {
      computedStyle = this.computeStyle(
        e.clientX,
        e.clientY,
        this.state.offsetLeft,
        this.state.offsetTop,
        this.state.offsetRight,
        this.state.offsetBottom,
      );
    }

    if (this.tooltipRef && computedStyle) {
      if (computedStyle.bottom) {
        const topScreenOverflow = e.clientY - this.tooltipDimensions.height;
        if (topScreenOverflow < 0) {
          // Tooltip is overflowing the top of the viewport
          this.tooltipRef.style.bottom = `${computedStyle.bottom + topScreenOverflow}px`;
        } else {
          this.tooltipRef.style.bottom = `${computedStyle.bottom}px`;
        }
      }

      if (computedStyle.top) {
        const bottomScreenOverflow = this.windowDimensions.innerHeight - (e.clientY + this.tooltipDimensions.height);
        if (bottomScreenOverflow < 0) {
          // Tooltip is overflowing the bottom of the viewport
          this.tooltipRef.style.top = `${computedStyle.top + bottomScreenOverflow}px`;
        } else {
          this.tooltipRef.style.top = `${computedStyle.top}px`;
        }
      }

      this.tooltipRef.style.left = computedStyle.left ? `${computedStyle.left}px` : 'auto';
      this.tooltipRef.style.right = computedStyle.right ? `${computedStyle.right}px` : 'auto';
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
    const wndRegion = typeof this.props.wndRegion === 'number' ? this.props.wndRegion : this.state.wndRegion;
    if (this.props.fixedMode && this.tooltipDimensions) {
      const { top, left, width, height } = this.childRef.getBoundingClientRect();
      switch (wndRegion) {
        case Quadrant.TopLeft:
          return {
            left: x + offsetLeft,
            top: y + height + offsetTop,
          };
        case Quadrant.TopRight:
          return {
            left: x - this.tooltipDimensions.width + width + offsetRight,
            top: y + height + offsetTop,
          };
        case Quadrant.BottomLeft:
          return {
            left: x + offsetLeft,
            top: y - this.tooltipDimensions.height + offsetBottom,
          };
        case Quadrant.BottomRight:
          return {
            left: x - this.tooltipDimensions.width + width + offsetRight,
            top: y - this.tooltipDimensions.height + offsetBottom,
          };
      }
    } else {
      switch (wndRegion) {
        case Quadrant.TopLeft:
          return {
            left: x + offsetLeft,
            top: y + offsetTop,
          };
        case Quadrant.TopRight:
          return {
            right: this.windowDimensions.innerWidth - x + offsetRight,
            top: y + offsetTop,
          };
        case Quadrant.BottomLeft:
          return {
            left: x + offsetLeft,
            bottom: this.windowDimensions.innerHeight - y + offsetBottom,
          };
        case Quadrant.BottomRight:
          return {
            right: this.windowDimensions.innerWidth - x + offsetRight,
            bottom: this.windowDimensions.innerHeight - y + offsetBottom,
          };
      }
    }
  }
}

export default Tooltip;
