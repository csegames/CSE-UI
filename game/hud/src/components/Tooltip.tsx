  /*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/camelot-unchained';
import {
  onShowTooltip,
  onHideTooltip,
  ShowTooltipPayload,
  ToolTipStyle,
  showTooltip,
  hideTooltip,
} from 'actions/tooltips';
import { getViewportSize } from 'lib/viewport';

const Container = styled.div`
  display: inline-block;
  position: relative;
  pointer-events: none;
`;

const View = styled.div`
  position: fixed;
  z-index: 9999;
  &.should-animate {
    opacity: 0;
    animation: fadeIn 0.15s forwards;
    -webkit-animation: fadeIn 0.15s forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DefaultTooltipWrapper = styled.div`
  pointer-events: none;
  position: relative;
  display: flex;
  flex-direction: column;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom, ${(props: {color: string}) => props.color}, transparent);
  border-image-slice: 1;
  background: url(../images/item-tooltips/bg.png);
  background-size: cover;
  -webkit-mask-image: url(../images/item-tooltips/ui-mask.png);
  -webkit-mask-size: cover;
  color: #ABABAB;
  width: auto;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(../images/item-tooltips/ornament_left.png);
    width: 35px;
    height: 35px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background: url(../images/item-tooltips/ornament_right.png);
    width: 35px;
    height: 35px;
  }
  padding: 5px;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(to right, ${(props: {color: string}) => props.color}, transparent);
  box-shadow: inset 0 0 20px 2px rgba(0,0,0,0.8);
  height: 106px;
  &:after {
    content: '';
    position: absolute;
    height: 106px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(../images/item-tooltips/title_viel.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

export interface TooltipState {
  wndRegion: utils.Quadrant;
  show: boolean;
  ttClassName: string;
  offsetLeft: number;
  offsetTop: number;
  content: JSX.Element | JSX.Element[] | string;
  shouldAnimate: boolean;
  styles?: Partial<ToolTipStyle>;
  simple?: boolean;
}

export class TooltipView extends React.Component<{}, TooltipState> {
  private tooltipRef: HTMLDivElement;
  private eventHandles: EventHandle[] = [];

  private mousePos = { clientX: 0, clientY: 0 };

  constructor(props: {}) {
    super(props);
    this.state = {
      wndRegion: utils.Quadrant.TopLeft,
      show: false,
      ttClassName: 'Tooltip',
      offsetLeft: 10,
      offsetTop: 20,
      content: null,
      shouldAnimate: false,
      styles: {},
      simple: false,
    };
  }

  public render() {
    const customStyles = this.state.styles || {};
    const useStandardWrapper = !this.state.simple;
    return this.state.show ? (
      <UIContext.Consumer>
        {
          (ui) => {
            const color = ui.currentTheme().toolTips.color[game.selfPlayerState.faction];
            return (
            <Container id='tooltip-view' className={customStyles.Tooltip}>
              <View
                ref={this.handleRef}
                className={`${customStyles.tooltip} ${this.state.shouldAnimate ? 'should-animate' : ''}`}>
                  {useStandardWrapper ? (
                    <DefaultTooltipWrapper color={color}>
                      <HeaderOverlay color={color} />
                      {this.state.content}
                    </DefaultTooltipWrapper>
                    ) : this.state.content}
              </View>
            </Container>
            );
          }

        }
      </UIContext.Consumer>
    ) : null;
  }

  public componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    this.eventHandles.push(onShowTooltip(this.handleShowTooltip));
    this.eventHandles.push(onHideTooltip(this.handleHideTooltip));
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private handleRef = (ref: HTMLDivElement) => {
    this.tooltipRef = ref;
    this.updatePosition();
  }

  private onMouseMove = (e: { clientX: number, clientY: number }) => {
    this.mousePos = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
    this.updatePosition();
  }

  private updatePosition = () => {
    if (!this.tooltipRef) return;

    const bounds = this.tooltipRef.getBoundingClientRect();
    const viewport = getViewportSize();

    let left = this.mousePos.clientX - this.state.offsetLeft;
    let top = this.mousePos.clientY + this.state.offsetTop;

    if (left + bounds.width - this.state.offsetLeft > viewport.width) {
      // flip tooltip to the left of the mouse
      left = Math.max(this.mousePos.clientX - bounds.width - this.state.offsetLeft, 0);
    }

    if (top + this.state.offsetTop + bounds.height > viewport.height) {
      top = Math.max(this.mousePos.clientY - bounds.height - this.state.offsetTop, 0);
    }

    this.tooltipRef.style.left = left + 'px';
    this.tooltipRef.style.top = top + 'px';
  }

  private handleShowTooltip = (payload: ShowTooltipPayload) => {
    const { content, event, shouldAnimate, styles } = payload;
    // this.updatePosition();
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
}


interface TooltipProps {
  content: JSX.Element | JSX.Element[] | string;
  delayMS?: number;
  shouldAnimate?: boolean;
  styles?: Partial<ToolTipStyle>;
  closeOnEvents?: string[];
  children: React.ReactNode;
}

export class Tooltip extends React.PureComponent<TooltipProps, {}> {
  private isMouseOver: boolean = false;
  private closeEventHandles: EventHandle[] = [];

  public render() {
    if (!this.props.children) {
      return null;
    }

    if (typeof this.props.children === 'string') {
      return <span onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>{this.props.children}</span>;
    }

    if (Array.isArray(this.props.children)) {
      console.warn('Tooltip can only have one child element!');
      return null;
    }

    const children = this.props.children as any;
    const newElement = React.cloneElement(this.props.children as any, {
      onMouseOver: (e) => {
        this.handleMouseOver(e);
        if (children.props && children.props.onMouseOver) {
          children.props.onMouseOver.call(newElement, e);
        }
      },
      onMouseLeave: (e) => {
        this.handleMouseLeave();
        if (children.props && children.props.onMouseLeave) {
          children.props.onMouseLeave.call(newElement, e);
        }
      },
    });
    return newElement;
  }

  public componentWillUnmount() {
    this.handleMouseLeave();
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

    if (this.props.closeOnEvents) {
      this.props.closeOnEvents.forEach((eventName) => {
        this.closeEventHandles.push(game.on(eventName, () => {
          if (this.isMouseOver) {
            this.handleMouseLeave();
          }
        }));
      });
    }
  }

  private handleMouseLeave = () => {
    if (!this.isMouseOver) return;
    this.isMouseOver = false;
    hideTooltip();
    if (this.closeEventHandles) {
      this.closeEventHandles.forEach(h => h.clear());
      this.closeEventHandles = [];
    }
  }
}
