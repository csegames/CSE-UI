/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils, client, ql } from '@csegames/camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

const ServerSelectContainer = styled('div')`
  position: absolute;
  width: 200px;
  background-color: #454545;
  border: 1px solid #ccc;
  right: 0;
  top: 40px;
`;

const ListItem = styled('div')`
  box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
  padding: 5px;
  cursor: pointer;
  background-color: #222;
  color: white;
  border-bottom: 1px solid #ccc;
  &:hover {
    background-color: ${utils.lightenColor('#222222', 20)}
    color: ${utils.lightenColor('#008000', 100)};
    border-right: 4px inset ${utils.lightenColor('#008000', 45)};
  }
  &.selected {
    color: ${utils.lightenColor('#008000', 100)};
    border-right: 4px inset ${utils.lightenColor('#008000', 45)};
  }
`;

export interface ServerSelectProps extends GraphQLInjectedProps<{ serviceStatus: ql.schema.ConnectedServices }> {
  onServerSelect: (server: ql.schema.ServerModel) => void;
  selectedServer: ql.schema.ServerModel;
}

export interface ServerSelectState {
  
}

class ServerSelect extends React.Component<ServerSelectProps, ServerSelectState> {
  public render() {
    const props: any = this.props;
    if (!props.graphql.data || !props.graphql.data.serviceStatus) return null;
    return (
      <ServerSelectContainer>
        {props.graphql.data.serviceStatus.servers.map((server) => {
          const selected = !this.props.selectedServer ? server.channelID === client.patchResourceChannel :
            server.channelID === this.props.selectedServer.channelID;
          return (
            <ListItem
              key={server.channelID}
              className={`server-select-item ${selected ? 'selected' : ''}`}
              onClick={() => this.props.onServerSelect(server)}>
              {server.name}
            </ListItem>
          );
        })}
      </ServerSelectContainer>
    );
  }
}

const ServerSelectWithQL = withGraphQL<ServerSelectProps>(props => ({
  query: `
    query ServerSelect {
      serviceStatus {
        servers {
          channelID
          name
          status
        }
      }
    }
  `,
}))(ServerSelect);

export default ServerSelectWithQL;
