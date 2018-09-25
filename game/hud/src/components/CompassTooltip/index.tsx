/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { events } from '@csegames/camelot-unchained';

const CompassTooltipContainer: React.SFC = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  display: flex;
  pointer-events: none;
  user-select: none;
  justify-content: center;
  align-items: flex-start;
`;

const CompassTooltipInner: React.SFC = styled('div')`
  height: auto;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(0,0,0,0.2);
  box-sizing: border-box !important;
  overflow: hidden;
  display: block;
  width: auto;
  margin: 0 auto;
  color: white;
`;

const CompassTooltipTitle = styled('div')`
  font-size: 14px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px;
  text-align: center;
  font-family: 'Merriweather Sans',sans-serif;
  text-shadow: 0 0 2px black;
`;

const CompassTooltipSubtitle = styled('div')`
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  text-align: center;
  font-family: 'Merriweather Sans',sans-serif;
  text-shadow: 0 0 2px black;
`;

const CompassTooltipDistance = styled('div')`
  font-size: 12px;
  padding: 10px;
  padding-top: 0px;
  text-align: center;
  font-family: 'Merriweather Sans',sans-serif;
  text-shadow: 0 0 2px black;
`;

export interface CompassTooltipData {
  id: string;
  title: string;
  subtitle?: string;
  distance: number;
  elevation: number;
  bearing: number;
}

export interface CompassTooltipProps {}

interface CompassTooltipState {
  data: CompassTooltipData | null;
}

class CompassTooltip extends React.Component<CompassTooltipProps, CompassTooltipState> {

  private showListener: number;
  private updateListener: number;
  private hideListener: number;

  public state = {
    data: null as any,
  };

  public render() {
    return (
      <CompassTooltipContainer>
        {this.state.data ? (
          <CompassTooltipInner>
            <CompassTooltipTitle dangerouslySetInnerHTML={{ __html: this.state.data.title }} />
            {this.state.data.subtitle ? (
              <CompassTooltipSubtitle dangerouslySetInnerHTML={{ __html: this.state.data.subtitle }} />
            ) : null}
            <CompassTooltipDistance>{this.state.data.distance.toFixed(2)}m</CompassTooltipDistance>
          </CompassTooltipInner>
        ) : null }
      </CompassTooltipContainer>
    );
  }

  public shouldComponentUpdate(nextProps: CompassTooltipProps, nextState: CompassTooltipState) {
    if (this.state.data !== nextState.data) {
      return true;
    }
    if (this.state.data) {
      if (this.state.data.id !== nextState.data.id) {
        return true;
      }
      if (this.state.data.title !== nextState.data.title) {
        return true;
      }
      if (this.state.data.subtitle !== nextState.data.subtitle) {
        return true;
      }
      if (this.state.data.distance.toFixed(2) !== nextState.data.distance.toFixed(2)) {
        return true;
      }
      if (this.state.data.elevation.toFixed(2) !== nextState.data.elevation.toFixed(2)) {
        return true;
      }
      if (this.state.data.bearing.toFixed(2) !== nextState.data.bearing.toFixed(2)) {
        return true;
      }
    }
    return false;
  }

  public componentDidMount() {
    this.showListener = events.on('compass-tooltip--show', this.showTooltip);
    this.updateListener = events.on('compass-tooltip--update', this.updateTooltip);
    this.hideListener = events.on('compass-tooltip--hide', this.hideTooltip);
  }

  public componentWillUnmount() {
    events.off(this.showListener);
    events.off(this.updateListener);
    events.off(this.hideListener);
  }

  private showTooltip = (data: CompassTooltipData) => {
    this.setState((prevState: CompassTooltipState) => {
      return {
        data,
      };
    });
  }

  private updateTooltip = (data: CompassTooltipData) => {
    this.setState((prevState: CompassTooltipState) => {
      if (!prevState.data) {
        return {
          data,
        };
      } else if (prevState.data && prevState.data.id === data.id) {
        return {
          data,
        };
      } else {
        return null;
      }
    });
  }

  private hideTooltip = (id: string) => {
    this.setState((prevState: CompassTooltipState) => {
      if (prevState.data && prevState.data.id === id) {
        return {
          data: null,
        };
      } else {
        return null;
      }
    });
  }
}

export default CompassTooltip;
