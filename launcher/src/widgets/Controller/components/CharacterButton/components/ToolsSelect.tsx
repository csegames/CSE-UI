/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ContextState, PatcherServer, ServerType } from '../../../ControllerContext';
import { ContentPhase } from '../../../../../services/ContentPhase';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 25px;
  left: calc(50% - 90px);
`;

const ToolButton = styled.div`
  cursor: pointer;
  pointer-events: all;
  color: white;
  background-color: #131313;
  padding: 2px 35px;
  text-align: center;
  &:hover {
    filter: brightness(120%);
  }
  &:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
  }
`;

const activeTool = css`
  filter: brightness(150%);
`;

export interface ToolsSelectProps {
  servers: { [id: string]: PatcherServer };
  selectedServer: PatcherServer;
  onUpdateState: (phase: ContentPhase, state: Partial<ContextState>) => void;
}

class ToolsSelect extends React.Component<ToolsSelectProps> {
  public render() {
    const { servers, selectedServer } = this.props;
    const tools = _.values(servers).filter((server) => server.type === ServerType.CHANNEL);

    let sortedTools = tools;

    return (
      <InfoContainer>
        {sortedTools.map((tool) => {
          return (
            <ToolButton
              className={tool.name === selectedServer.name ? activeTool : ''}
              onClick={() => this.onToolClick(tool)}
            >
              {tool.name}
            </ToolButton>
          );
        })}
      </InfoContainer>
    );
  }

  private onToolClick = (tool: PatcherServer) => {
    this.props.onUpdateState(ContentPhase.Tools, { selectedServer: tool });
  };
}

export default ToolsSelect;
