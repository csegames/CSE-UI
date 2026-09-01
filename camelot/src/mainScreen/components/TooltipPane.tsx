/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { MouseRelativePosition, SourceRelativePosition, TooltipState } from '../redux/tooltipSlice';
import { CSETransition } from '../../shared/components/CSETransition';
import { BorderBackground, FactionBorder, BorderType } from './FactionBorder';

// We offset the tooltip slightly so you can still see what you're hovering the mouse over.
const TOOLTIP_OFFSET_VMIN = 1;
const FOLLOW_MOUSE_MOVEMENT = false;
const ALLOW_FADE_TRANSITIONS = false;

// Styles.
const TooltipWrapper = 'HUD-TooltipPane-TooltipWrapper';
export const TooltipBorder = 'HUD-TooltipPane-Border';
const TextWrapper = 'HUD-TooltipPane-TextWrapper';
export const ContentWrapper = 'HUD-TooltipPane-ContentWrapper';

interface State {
  moveCounter: number;
}

interface InjectedProps {
  // We use ALL of the fields in this class, so just take them all directly.
  tooltipState: TooltipState;
  hudWidth: number;
  hudHeight: number;
  vminPx: number;
  dispatch?: Dispatch;
}

type Props = InjectedProps;

class TooltipPane extends React.Component<Props, State> {
  private readonly handleMouseMove = this.onMouseMove.bind(this);
  private tooltipRef: HTMLDivElement = null;
  private lastPosition: MouseEvent = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      moveCounter: 0
    };
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  public render(): React.ReactNode {
    const { id, content } = this.props.tooltipState;

    if (!content) {
      // only true until the first tooltip is set
      return null;
    }

    if (!ALLOW_FADE_TRANSITIONS) {
      if (!id) {
        this.onTooltipRef(null);
        return null;
      }
      return (
        <div className={TooltipWrapper} ref={this.onTooltipRef.bind(this)} style={this.calculateTooltipStyle()}>
          {this.renderContent(content)}
        </div>
      );
    }

    return (
      <CSETransition
        // We read off of Redux directly to know if we ought to show or hide the content.
        show={!!id}
        className={TooltipWrapper}
        ref={(r) => {
          this.tooltipRef = r as HTMLDivElement;
        }}
        style={this.calculateTooltipStyle()}
        removeWhenHidden={true}
      >
        {this.renderContent(content)}
      </CSETransition>
    );
  }

  private renderContent(content: React.ReactNode): React.ReactNode {
    if (this.props.tooltipState.noOuterBorder) {
      return content;
    }
    return (
      <FactionBorder type={BorderType.Primary} className={TooltipBorder} background={BorderBackground.PatternLarge}>
        <div className={typeof content === 'string' ? TextWrapper : ContentWrapper}>{content}</div>
      </FactionBorder>
    );
  }

  private onTooltipRef(tooltipRef: HTMLDivElement | null) {
    // We must calculate the style after we have the reference so that we know the physical position
    // of the div.
    this.tooltipRef = tooltipRef;
    this.tooltipRef?.setAttribute('style', this.toCSS(this.calculateTooltipStyle()));
  }

  private toCSS(css: React.CSSProperties) {
    let output = '';
    for (const [key, value] of Object.entries(css)) {
      let kebab = '';
      for (const char of key) {
        if (char >= 'A' && char <= 'Z') {
          kebab += '-' + char.toLowerCase();
        } else {
          kebab += char;
        }
      }
      output += `${kebab}: ${value};`;
    }
    return output;
  }

  private onMouseMove(e: MouseEvent) {
    this.lastPosition = e; // Cache off the position for style calculation without forcing another render eval.

    if (FOLLOW_MOUSE_MOVEMENT && this.props.tooltipState.position.type === 'mouse' && this.props.tooltipState.id) {
      // If we have an active mouse relative tooltip, force render to update the position.
      this.setState({ moveCounter: (this.state.moveCounter + 1) % 100 });
    }
  }

  private calculateTooltipStyle(): React.CSSProperties {
    const finalStyle: React.CSSProperties = {};

    const { maxWidth, position } = this.props.tooltipState;

    if (maxWidth?.length > 0) {
      finalStyle.maxWidth = maxWidth;
    }

    if (!this.tooltipRef || !this.props.tooltipState.id) {
      finalStyle.visibility = 'hidden';
      return finalStyle;
    }

    switch (position.type) {
      case 'mouse': {
        const { offsetWidth, offsetHeight } = this.tooltipRef;
        this.addMousePositionStyles(position, finalStyle, offsetWidth, offsetHeight);
        break;
      }
      case 'source': {
        const tooltipRect = this.tooltipRef.getBoundingClientRect();
        this.addFixedPositionStyles(position, finalStyle, tooltipRect);
        break;
      }
      default:
        console.warn(`unknown tooltip position type ${JSON.stringify(position)}`);
    }

    return finalStyle;
  }

  private addFixedPositionStyles(
    pos: SourceRelativePosition,
    finalStyle: React.CSSProperties,
    tooltipRect: DOMRect
  ): void {
    // Defaults to the right of the source, but flips to the left if it overflows.
    // Default aligns the top of the tooltip to the top of the source, but will move up
    //   the smallest amount possible to avoid overflowing off the bottom of the window.
    const sourceRect = pos.sourceRect;
    const offsetPx = TOOLTIP_OFFSET_VMIN * this.props.vminPx;

    let leftValue: string = '0';
    let topValue: string = '0';

    // Horizontal positioning.
    if (sourceRect.right + offsetPx + tooltipRect.width > this.props.hudWidth) {
      // The tooltip is too big to fit to the right of the source, so put it on the left of the source.
      leftValue = `${sourceRect.left - offsetPx - tooltipRect.width}px`;
    } else {
      // The tooltip fits to the right of the source, so that's where we want it.
      leftValue = `${sourceRect.right + offsetPx}px`;
    }

    // Vertical positioning.
    const verticalOverflow = sourceRect.top + tooltipRect.height - this.props.hudHeight;
    if (verticalOverflow > 0) {
      // The tooltip overflows the bottom of the screen, so raise it.
      topValue = `${sourceRect.top - verticalOverflow}px`;
    } else {
      // The tooltip fits fine vertically.
      topValue = `${sourceRect.top}px`;
    }

    finalStyle.transform = `translate(${leftValue}, ${topValue})`;

    if (pos.xOffset) {
      finalStyle.marginLeft = `${pos.xOffset}vmin`;
    }

    if (pos.yOffset) {
      finalStyle.marginTop = `${pos.yOffset}vmin`;
    }
  }

  private addMousePositionStyles(
    pos: MouseRelativePosition,
    finalStyle: React.CSSProperties,
    offsetWidth: number,
    offsetHeight: number
  ): void {
    const mouseX = this.lastPosition?.x ?? 0;
    const mouseY = this.lastPosition?.y ?? 0;

    const rightOverflow = Math.max(mouseX + offsetWidth - this.props.hudWidth, 0);
    const leftOverflow = Math.max((mouseX - offsetWidth) * -1, 0);

    let leftValue: string = '0';
    let topValue: string = '0';

    if (rightOverflow <= leftOverflow) {
      if (rightOverflow > 0) {
        // Clamp the tooltip since it is overflowing the right edge of the screen.
        leftValue = `${mouseX - rightOverflow}px`;
      } else {
        // No actual overflow, so the tooltip appears slightly to the right of the mouse.
        leftValue = `calc(${mouseX}px + ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    } else {
      if (leftOverflow > 0) {
        // Was overflowing the left edge, but now it sits up against the left edge.
        leftValue = '0';
      } else {
        // Was overflowing the right edge, so the tooltip appears slightly to the left of the mouse.
        leftValue = `calc(${mouseX - offsetWidth}px - ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    }

    const bottomOverflow = Math.max(mouseY + offsetHeight - this.props.hudHeight, 0);
    const topOverflow = Math.max((mouseY - offsetHeight) * -1, 0);

    if (bottomOverflow <= topOverflow) {
      if (bottomOverflow > 0) {
        // Clamp the tooltip since it is overflowing the bottom edge of the screen.
        topValue = `${mouseY - bottomOverflow}px`;
      } else {
        // No actual overflow, so the tooltip appears slightly below the mouse.
        topValue = `calc(${mouseY}px + ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    } else {
      if (topOverflow > 0) {
        // Was overflowing the top edge, but now it sits up against the top edge.
        topValue = '0';
      } else {
        // Was overflowing the bottom edge, so the tooltip appears slightly above the mouse.
        topValue = `calc(${mouseY - offsetHeight}px - ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    }

    finalStyle.transform = `translate(${leftValue}, ${topValue})`;

    if (pos.xOffset) {
      finalStyle.marginLeft = `${pos.xOffset}vmin`;
    }

    if (pos.yOffset) {
      finalStyle.marginTop = `${pos.yOffset}vmin`;
    }
  }
}

function mapStateToProps(state: RootState): Props {
  const tooltipState = state.tooltip;
  const { hudWidth, hudHeight, vminPx } = state.hud;

  return {
    tooltipState,
    hudWidth,
    hudHeight,
    vminPx
  };
}

export default connect(mapStateToProps)(TooltipPane);
