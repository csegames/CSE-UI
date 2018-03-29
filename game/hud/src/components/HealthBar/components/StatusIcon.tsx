/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

const Container = styled('div')`
  position: relative;
  display: inline-block;
`;

const Icon = styled('div')`
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 2px;
  border-radius: 25px;
  cursor: pointer;
  pointer-events: all;
  background: url(${(props: any) => props.src}) no-repeat;
  background-size: 50px 50px;
  &:hover {
    box-shadow: inset 0 0 3px 2px rgba(255,255,255,0.7);
  }
`;

const TooltipContainer = styled('div')`
  display: flex;
  flex-direction: column;
  visibility: ${(props: any) => props.showTooltip ? 'visible' : 'hidden'};
  opacity: ${(props: any) => props.showTooltip ? 1 : 0};
  position: absolute;
  top: 0;
  left: 60px;
  width: 500px;
  white-space: wrap;
  margin-top: -10px;
  margin-bottom: -10px;
  padding: 0 15px;
  background-color: #000;
  color: white;
  z-index: 9999;
`;

const TooltipHeader = styled('header')`
  font-size: 2.5em;
  font-weight: bold;
`;

const TooltipDescription = styled('p')`
  font-size: 30px;
  line-height: 30px;
`;

export interface StatusIconProps {
  status: {
    id: string;
    name: string;
    description: string;
    iconURL: string;
  };
}

export interface StatusIconState {
  showTooltip: boolean;
}

class StatusIcon extends React.Component<StatusIconProps, StatusIconState> {
  constructor(props: StatusIconProps) {
    super(props);
    this.state = {
      showTooltip: false,
    };
  }

  public render() {
    const { status } = this.props;
    if (status) {
      return (
        <Container>
          <Icon
            onMouseEnter={this.onShowTooltip}
            onMouseLeave={this.onHideTooltip}
            style={{ backgroundImage: `url(${status.iconURL}), url(images/unknown-item.jpg)` }}
          />
          <TooltipContainer showTooltip={this.state.showTooltip}>
            <TooltipHeader>{status.name}</TooltipHeader>
            <TooltipDescription>{status.description}</TooltipDescription>
          </TooltipContainer>
        </Container>
      );
    } else {
      return null;
    }
  }

  public shouldComponentUpdate(nextProps: StatusIconProps, nextState: StatusIconState) {
    return !_.isEqual(nextProps.status, this.props.status) || this.state.showTooltip !== nextState.showTooltip;
  }

  private onShowTooltip = () => {
    this.setState({ showTooltip: true });
  }

  private onHideTooltip = () => {
    this.setState({ showTooltip: false });
  }
}

export default StatusIcon;
