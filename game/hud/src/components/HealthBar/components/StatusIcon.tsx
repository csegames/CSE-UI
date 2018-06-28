/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { showTooltip, hideTooltip } from '../../../services/actions/tooltips';

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
  white-space: wrap;
  max-width: 200px;
  margin-bottom: -15px;
  padding: 0 5px;
  background-color: #000;
  color: white;
  z-index: 9999;
`;

const TooltipHeader = styled('div')`
  font-size: 16px;
  font-weight: bold;
`;

const TooltipDescription = styled('p')`
  font-size: 12px;
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
}

class StatusIcon extends React.Component<StatusIconProps, StatusIconState> {
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
        </Container>
      );
    } else {
      return null;
    }
  }

  public shouldComponentUpdate(nextProps: StatusIconProps, nextState: StatusIconState) {
    return !_.isEqual(nextProps.status, this.props.status);
  }

  private onShowTooltip = (event: MouseEvent) => {
    const content =
      <TooltipContainer>
        <TooltipHeader>{this.props.status.name}</TooltipHeader>
        <TooltipDescription>{this.props.status.description}</TooltipDescription>
      </TooltipContainer>;

    showTooltip({ content, event });
  }

  private onHideTooltip = () => {
    hideTooltip();
  }
}

export default StatusIcon;
