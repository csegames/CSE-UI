/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { TooltipParams, TooltipState } from '../redux/tooltipSlice';
import { CSETransition } from '../../shared/components/CSETransition';
import { FactionDef } from '../dataSources/manifest/factionManifest';

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
  factions: Dictionary<FactionDef>;
  myFaction: Faction;
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
        {this.state.displayedTooltip.disableBackground ? null : (
          <div
            className={Background}
            style={{ filter: `hue-rotate(${this.props.factions[Faction[this.props.myFaction]]?.hueRotation ?? 0}deg)` }}
          />
        )}
        <div className={typeof content === 'string' ? TextWrapper : ContentWrapper}>{content}</div>
      </CSETransition>
    );
  }

  private calculateTooltipStyle(): React.CSSProperties {
    const finalStyle: React.CSSProperties = {};

    if (!this.tooltipRef) {
      finalStyle.visibility = 'hidden';
      return finalStyle;
    }

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

    return finalStyle;
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
  const { hudWidth, hudHeight } = state.hud;
  const { factions } = state.gameDefs;
  const myFaction = state.player.faction;

  return {
    ...ownProps,
    tooltipState,
    hudWidth,
    hudHeight,
    factions,
    myFaction
  };
}

export default connect(mapStateToProps)(TooltipPane);
