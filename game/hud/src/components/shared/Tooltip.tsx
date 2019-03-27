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
import { defaultItemTooltipStyle } from './ItemTooltip';

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
  position: relative;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom, ${(props: {color: string} &
    React.HTMLProps<HTMLDivElement>) => props.color}, transparent);
  border-image-slice: 1;
  -webkit-mask-image: url(../images/tooltips/uhd/mask.png);
  -webkit-mask-size: cover;
  color: #ABABAB;
  width: auto;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(../images/tooltips/hd/ornament-left.png);
    width: 38px;
    height: 42px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(../images/tooltips/hd/ornament-right.png);
    width: 38px;
    height: 42px;
  }
  padding: 5px;
  z-index: 1;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/tooltips/uhd/bg.jpg);
  background-size: auto 100%;
  background-repeat: repeat-x;
  z-index: -1;

  &.tdd {
    filter: hue-rotate(90deg);
  }

  &.viking {
    filter: hue-rotate(-160deg);
  }

  @media (max-width: 1920px) {
    background-image: url(../images/tooltips/hd/bg.jpg);
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

export interface Props {
  uiContext: UIContext;
}

class TooltipView extends React.Component<Props, TooltipState> {
  private tooltipRef: HTMLDivElement;
  private eventHandles: EventHandle[] = [];

  private mousePos = { clientX: 0, clientY: 0 };

  constructor(props: Props) {
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
                      <Background className={Faction[game.selfPlayerState.faction].toLowerCase()} />
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
    let style: Partial<ToolTipStyle> = null;
    if (typeof payload.styles === 'string') {
      switch (payload.styles) {
        case 'item': {
          style = this.props.uiContext.isUHD() ? { tooltip: defaultItemTooltipStyle.uhdTooltip } :
            { tooltip: defaultItemTooltipStyle.tooltip };
          break;
        }
        default: {
          style = {};
          break;
        }
      }
    } else {
      style = styles as Partial<ToolTipStyle>;
    }

    this.setState({
      show: true,
      wndRegion: utils.windowQuadrant(event.clientX, event.clientY),
      content,
      styles: style,
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

class TooltipViewWithInjectedContext extends React.Component<{}> {
  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => <TooltipView uiContext={uiContext} />}
      </UIContext.Consumer>
    );
  }
}

export { TooltipViewWithInjectedContext as TooltipView };
