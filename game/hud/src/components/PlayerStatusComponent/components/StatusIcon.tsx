/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Tooltip } from 'camelot-unchained';

const Icon = styled('div')`
  position: relative;
  width: 30px;
  height: 30px;
  margin-right: 2px;
  border-radius: 15px;
  cursor: pointer;
  pointer-events: all;
  background: url(${(props: any) => props.src}) no-repeat;
  background-size: 30px 30px;
  &:hover {
    box-shadow: inset 0 0 3px 2px rgba(255,255,255,0.7);
  }
`;

const TooltipHeader = styled('header')`
  font-size: 2em;
  font-weight: bold;
`;

const TooltipDescription = styled('p')`
  font-size: 1.3em;
`;

export interface StatusIconProps {
  status: {
    id: string;
    name: string;
    description: string;
    iconURL: string;
  };
}

class StatusIcon extends React.Component<StatusIconProps> {
  public render() {
    const { status } = this.props;
    if (status) {
      return (
        <Tooltip
          fixedMode
          content={() => (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '400px',
              maxHeight: '750px',
              overflow: 'hidden',
            }}>
              <TooltipHeader>{status.name}</TooltipHeader>
              <TooltipDescription>{status.description}</TooltipDescription>
            </div>
          )}
          styles={{
            tooltipFixed: {
              backgroundColor: 'rgba(0,0,0,0.9)',
              maxWidth: '500px',
              minWidth: '300px',
            },
          }}
        >
          <Icon src={status.iconURL} />
      </Tooltip>
      );
    } else {
      return null;
    }
  }
}

export default StatusIcon;
