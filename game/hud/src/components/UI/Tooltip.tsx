  /*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { keyframes } from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import {
  onShowTooltip,
  onHideTooltip,
  ShowTooltipPayload,
  ToolTipStyle,
  showTooltip,
  hideTooltip,
} from 'actions/tooltips';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled('div')`
  display: inline-block;
  position: relative;
`;

const View = styled('div')`
  position: fixed;
  z-index: 9999;
  &.should-animate {
    opacity: 0;
    animation: ${fadeIn} 0.15s forwards;
    -webkit-animation: ${fadeIn} 0.15s forwards;
  }
`;

export interface TooltipState {
  wndRegion: utils.Quadrant;
  show: boolean;
  ttClassName: string;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
  content: JSX.Element | JSX.Element[] | string;
  shouldAnimate: boolean;
  styles?: Partial<ToolTipStyle>;
}

export class TooltipView extends React.Component<{}, TooltipState> {
  private tooltipRef: HTMLDivElement;
  private windowDimensions: { innerHeight: number, innerWidth: number };
  private tooltipDimensions: { width: number, height: number };
  private eventHandles: EventHandle[] = [];

  private mousePos = { clientX: 0, clientY: 0 };

  constructor(props: {}) {
    super(props);
    this.state = {
      wndRegion: utils.Quadrant.TopLeft,
      show: false,
      ttClassName: 'Tooltip',
      offsetLeft: 10,
      offsetTop: 10,
      offsetRight: 5,
      offsetBottom: 5,
      content: null,
      shouldAnimate: false,
      styles: {},
    };
  }

  public render() {
    const customStyles = this.state.styles || {};

    return this.state.show ? (
      <Container className={customStyles.Tooltip}>
        <View
          innerRef={(ref: HTMLDivElement) => this.tooltipRef = ref}
          className={`${customStyles.tooltip} ${this.state.shouldAnimate ? 'should-animate' : ''}`}>
            {this.state.content}
        </View>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.initWindowDimensions();
    window.addEventListener('resize', this.initWindowDimensions);
    window.addEventListener('mousemove', this.onMouseMove);
    this.eventHandles.push(onShowTooltip(this.handleShowTooltip));
    this.eventHandles.push(onHideTooltip(this.handleHideTooltip));
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.initWindowDimensions);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private initWindowDimensions = () => {
    this.windowDimensions = { innerHeight: window.innerHeight, innerWidth: window.innerWidth };
    this.handleHideTooltip();
  }

  private onMouseMove = (e: { clientX: number, clientY: number }) => {
    this.mousePos = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
    this.updatePosition();
  }

  private updatePosition = () => {
    if (!this.tooltipDimensions && this.tooltipRef) {
      this.tooltipDimensions = {
        height: this.tooltipRef.clientHeight,
        width: this.tooltipRef.clientWidth,
      };
    }

    let computedStyle;
    computedStyle = this.computeStyle(
      this.mousePos.clientX,
      this.mousePos.clientY,
      this.state.offsetLeft,
      this.state.offsetTop,
      this.state.offsetRight,
      this.state.offsetBottom,
    );

    if (this.tooltipRef && computedStyle) {
      if (computedStyle.bottom) {
        const topScreenOverflow = this.mousePos.clientY - this.tooltipDimensions.height;
        if (topScreenOverflow < 0) {
          // Tooltip is overflowing the top of the viewport
          this.tooltipRef.style.bottom = `${computedStyle.bottom + topScreenOverflow}px`;
        } else {
          this.tooltipRef.style.bottom = `${computedStyle.bottom}px`;
        }
      }

      if (computedStyle.top) {
        const bottomScreenOverflow = this.windowDimensions.innerHeight -
          (this.mousePos.clientY + this.tooltipDimensions.height);
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

  private handleShowTooltip = (payload: ShowTooltipPayload) => {
    const { content, event, shouldAnimate, styles } = payload;
    this.updatePosition();
    this.setState({
      show: true,
      wndRegion: utils.windowQuadrant(event.clientX, event.clientY),
      content,
      styles,
      shouldAnimate,
    });
  }

  private handleHideTooltip = () => {
    this.setState({ show: false, content: null, styles: {} });
  }

  private computeStyle = (x: number,
                          y: number,
                          offsetLeft: number,
                          offsetTop: number,
                          offsetRight: number,
                          offsetBottom: number) => {
    switch (this.state.wndRegion) {
      case utils.Quadrant.TopLeft:
        return {
          left: x + offsetLeft,
          top: y + offsetTop,
        };
      case utils.Quadrant.TopRight:
        return {
          right: this.windowDimensions.innerWidth - x + offsetRight,
          top: y + offsetTop,
        };
      case utils.Quadrant.BottomLeft:
        return {
          left: x + offsetLeft,
          bottom: this.windowDimensions.innerHeight - y + offsetBottom,
        };
      case utils.Quadrant.BottomRight:
        return {
          right: this.windowDimensions.innerWidth - x + offsetRight,
          bottom: this.windowDimensions.innerHeight - y + offsetBottom,
        };
    }
  }
}


interface TooltipProps {
  content: JSX.Element | JSX.Element[] | string;
  delayMS?: number;
  shouldAnimate?: boolean;
  styles?: Partial<ToolTipStyle>;
  closeOnEvent?: string;
}

export class Tooltip extends React.PureComponent<TooltipProps, {}> {
  private isMouseOver: boolean = false;
  private closeEventHandle: EventHandle = null;

  public render() {
    if (!this.props.children) {
      return null;
    }

    if (typeof this.props.children === 'string') {
      return <span onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>{this.props.children}</span>;
    }

    return React.cloneElement(this.props.children as any, {
      onMouseOver: this.handleMouseOver,
      onMouseLeave: this.handleMouseLeave,
    });
  }


  private handleMouseOver = (event: React.MouseEvent) => {
    if (this.isMouseOver) return;
    this.isMouseOver = true;
    const evt = {
      clientX: event.clientX,
      clientY: event.clientY,
    };

    if (this.props.delayMS) {
      setTimeout(() => {
        if (this.isMouseOver) this.showTooltip(evt);
      }, this.props.delayMS);
    } else {
      this.showTooltip(evt);
    }
  }

  private showTooltip = (event: { clientX: number, clientY: number}) => {
    showTooltip({
      content: this.props.content,
      shouldAnimate: this.props.shouldAnimate,
      styles: this.props.styles,
      event,
    });

    if (this.props.closeOnEvent) {
      this.closeEventHandle = game.on(this.props.closeOnEvent, () => {
        if (this.isMouseOver) {
          this.handleMouseLeave();
        }
      });
    }
  }

  private handleMouseLeave = () => {
    this.isMouseOver = false;
    hideTooltip();
    if (this.closeEventHandle) {
      this.closeEventHandle.clear();
      this.closeEventHandle = null;
    }
  }
}
