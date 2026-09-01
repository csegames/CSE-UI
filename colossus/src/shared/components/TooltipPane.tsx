/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../mainScreen/redux/store';
import { TooltipParams, TooltipPosition, TooltipState } from '../../mainScreen/redux/tooltipSlice';
import { CSETransition } from '../../shared/components/CSETransition';

// We offset the tooltip slightly so you can still see what you're hovering the mouse over.
const TOOLTIP_OFFSET_VMIN = 1;

// Styles.
const TooltipWrapper = 'HUD-TooltipPane-TooltipWrapper';
const Background = 'HUD-TooltipPane-TooltipBackground';
const TextWrapper = 'HUD-TooltipPane-TextWrapper';
const ContentWrapper = 'HUD-TooltipPane-ContentWrapper';

interface State {
  displayedTooltip: TooltipParams;
}

interface ReactProps {}

interface InjectedProps {
  // We use ALL of the fields in this class, so just take them all directly.
  tooltipState: TooltipState;
  hudWidth: number;
  hudHeight: number;
  vminPx: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class TooltipPane extends React.Component<Props, State> {
  private tooltipRef: HTMLDivElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      displayedTooltip: null
    };
  }

  public render(): React.ReactNode {
    return this.renderTooltip();
  }

  private renderTooltip(): React.ReactNode {
    // Should only be null until the first tooltip is shown.
    if (!this.state.displayedTooltip) {
      return null;
    }

    // Displayed content is from a cached copy so it doesn't appear blank during exit transitions.
    const content =
      typeof this.state.displayedTooltip.content === 'function'
        ? this.state.displayedTooltip.content()
        : this.state.displayedTooltip.content;

    if (!content || content === '') {
      return null;
    }

    return (
      <CSETransition
        // We read off of Redux directly to know if we ought to show or hide the content.
        show={!!this.props.tooltipState.content}
        className={TooltipWrapper}
        ref={(r) => {
          this.tooltipRef = r as HTMLDivElement;
        }}
        style={this.calculateTooltipStyle()}
        removeWhenHidden={true}
      >
        {this.state.displayedTooltip.disableBackground ? (
          <div className={typeof content === 'string' ? TextWrapper : ContentWrapper}>{content}</div>
        ) : (
          <div className={Background}>
            <div className={typeof content === 'string' ? TextWrapper : ContentWrapper}>{content}</div>
          </div>
        )}
      </CSETransition>
    );
  }

  private calculateTooltipStyle(): React.CSSProperties {
    const finalStyle: React.CSSProperties = {};

    if (!this.tooltipRef) {
      finalStyle.visibility = 'hidden';
      return finalStyle;
    }

    switch (this.state.displayedTooltip.position) {
      case TooltipPosition.AtMouse: {
        this.addMousePositionStyles(finalStyle);
        break;
      }
      case TooltipPosition.Fixed:
      default: {
        this.addFixedPositionStyles(finalStyle);
        break;
      }
    }

    return finalStyle;
  }

  private addFixedPositionStyles(finalStyle: React.CSSProperties): void {
    // Defaults to the right of the source, but flips to the left if it overflows.
    // Default aligns the top of the tooltip to the top of the source, but will move up
    //   the smallest amount possible to avoid overflowing off the bottom of the window.
    const tooltipRect = this.tooltipRef.getBoundingClientRect();
    const sourceRect = this.props.tooltipState.sourceRect;
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
  }

  private addMousePositionStyles(finalStyle: React.CSSProperties): void {
    const rightOverflow = Math.max(
      this.props.tooltipState.mouseX + this.tooltipRef.offsetWidth - this.props.hudWidth,
      0
    );
    const leftOverflow = Math.max((this.props.tooltipState.mouseX - this.tooltipRef.offsetWidth) * -1, 0);

    let leftValue: string = '0';
    let topValue: string = '0';

    if (rightOverflow <= leftOverflow) {
      if (rightOverflow > 0) {
        // Clamp the tooltip since it is overflowing the right edge of the screen.
        leftValue = `${this.props.tooltipState.mouseX - rightOverflow}px`;
      } else {
        // No actual overflow, so the tooltip appears slightly to the right of the mouse.
        leftValue = `calc(${this.props.tooltipState.mouseX}px + ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    } else {
      if (leftOverflow > 0) {
        // Was overflowing the left edge, but now it sits up against the left edge.
        leftValue = '0';
      } else {
        // Was overflowing the right edge, so the tooltip appears slightly to the left of the mouse.
        leftValue = `calc(${
          this.props.tooltipState.mouseX - this.tooltipRef.offsetWidth
        }px - ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    }

    const bottomOverflow = Math.max(
      this.props.tooltipState.mouseY + this.tooltipRef.offsetHeight - this.props.hudHeight,
      0
    );
    const topOverflow = Math.max((this.props.tooltipState.mouseY - this.tooltipRef.offsetHeight) * -1, 0);

    if (bottomOverflow <= topOverflow) {
      if (bottomOverflow > 0) {
        // Clamp the tooltip since it is overflowing the bottom edge of the screen.
        topValue = `${this.props.tooltipState.mouseY - bottomOverflow}px`;
      } else {
        // No actual overflow, so the tooltip appears slightly below the mouse.
        topValue = `calc(${this.props.tooltipState.mouseY}px + ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    } else {
      if (topOverflow > 0) {
        // Was overflowing the top edge, but now it sits up against the top edge.
        topValue = '0';
      } else {
        // Was overflowing the bottom edge, so the tooltip appears slightly above the mouse.
        topValue = `calc(${
          this.props.tooltipState.mouseY - this.tooltipRef.offsetHeight
        }px - ${TOOLTIP_OFFSET_VMIN}vmin)`;
      }
    }

    finalStyle.transform = `translate(${leftValue}, ${topValue})`;
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.tooltipState?.content !== this.props.tooltipState?.content) {
      // Always maintain a set of visible content so we can show something during exit transitions.
      if (!!this.props.tooltipState?.content) {
        this.setState({
          // No need to clone this.  Redux will fully replace it when appropriate.
          displayedTooltip: this.props.tooltipState
        });
      }
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const tooltipState = state.tooltip;
  const { hudWidth, hudHeight, vminPx } = state.hud;

  return {
    ...ownProps,
    tooltipState,
    hudWidth,
    hudHeight,
    vminPx
  };
}

export default connect(mapStateToProps)(TooltipPane);
