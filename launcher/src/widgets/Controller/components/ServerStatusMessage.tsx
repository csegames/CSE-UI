/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { primary } from '../../../api/graphql';

// views
import { PatcherServer, ServerType } from '../ControllerContext';
import gql from 'graphql-tag';
import { parseAlertMessage } from '../../../lib/alertMessageParser';
import { primaryConf } from '../../../api/networkConfig';
import { GraphQLQueryRequest, query } from '../../../api/query';
import { patcher } from '../../../services/patcher';

const StatusContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 125px;
  z-index: 10;

  &.no-data {
    visibility: collapse;
    pointer-events: none;
  }
`;

const StatusBox = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-left: 1px solid rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  width: 220px;
  min-height: 100px;
  padding: 20px;
`;

const StatusHeader = styled.div`
  /* font-family: 'Colus'; */ /* TODO: Figure out why this font isn't actually showing up */
  font-family: 'Lato';
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  line-height: 30px;
`;

const StatusDotParent = styled.svg`
  margin-left: 10px;
  margin-bottom: 0.27em;
  vertical-align: middle;
`;

const StatusDotRadius = 6.0;

const StatusDotServerUp = styled.circle`
  fill: green;
  stoke: none;
`;

const StatusDotServerDown = styled.circle`
  fill: red;
  stoke: none;
`;

const StatusMessageLine = styled.div`
  &:first-child {
    margin-bottom: 10px;
  }
  font-family: 'Lato';
  font-size: 16px;
  color: #ccc;
  margin-top: 3px;
  margin-bottom: 3px;
`;

const AlertMessagesGQLQuery = gql`
  query PatcherAlertMessagesQuery($destination: String!) {
    alerts(destination: $destination) {
      destination
      type
      template
      vars {
        key
        value
      }
    }
  }
`;

const ServerStatusFallbackHeaderText = 'Server Status';

const AlertMessagesGQLQueryVariables = {
  destination: 'launcher'
};

const ServerStatusMessageType = 'server_status';

export interface ServerStatusMessageProps {
  selectedServer: PatcherServer;
  visible: boolean;
}

export interface ServerStatusMessageState {
  serverName: string;
  statusMessageText: string;
}

export class ServerStatusMessage extends React.Component<ServerStatusMessageProps, ServerStatusMessageState> {
  private pollingIntervalHandle: any;

  private fetchAlertMessages = async (): Promise<primary.Alert> => {
    const queryParams: GraphQLQueryRequest = {
      query: AlertMessagesGQLQuery,
      variables: AlertMessagesGQLQueryVariables
    };

    try {
      const response = await query<Pick<primary.CUQuery, 'alerts'>>(queryParams, primaryConf);

      if (response && response.data && 'alerts' in response.data) {
        const alerts: primary.Alert[] = response.data.alerts;
        for (var msg of alerts) {
          if (msg.type == ServerStatusMessageType) {
            return msg;
          }
        }
      }

      console.warn(
        "ServerStatusMessage did not find message of type '" + ServerStatusMessageType + "'. Server response:",
        response
      );
    } catch (err) {
      console.error("AlertMessages query failed retrieving alert messages. error='" + err + "', query:", queryParams);
    }

    return null;
  };

  constructor(props: ServerStatusMessageProps) {
    super(props);
    this.state = { serverName: null, statusMessageText: null };
  }

  public render() {
    const { selectedServer, visible } = this.props;
    const { statusMessageText } = this.state;

    const mkbox = (headerContents: any, messageLines: any[], containerClass: string = null) => {
      return (
        <StatusContainer className={containerClass}>
          <StatusBox>
            <StatusHeader>{headerContents}</StatusHeader>
            {messageLines && <div>{messageLines}</div>}
          </StatusBox>
        </StatusContainer>
      );
    };

    if (!patcher.isLoggedIn || !visible || !selectedServer || selectedServer.type != ServerType.COLOSSUS) {
      return mkbox(ServerStatusFallbackHeaderText, [], 'no-data');
    }

    // either we switched servers or we haven't synced at all yet
    if (!this.state.serverName || this.state.serverName != selectedServer.name) {
      setTimeout(
        (() => {
          this.onServerSwitch();
        }).bind(this),
        50
      );
    }

    // we have no data at all - no status message and no matchmaking status data, so there's nothing to show
    if (!statusMessageText) {
      return mkbox(ServerStatusFallbackHeaderText, [], 'no-data');
    }

    let statusHeaderText = ServerStatusFallbackHeaderText;
    const haveServerStatus = selectedServer.name == this.state.serverName;
    if (haveServerStatus) {
      statusHeaderText = selectedServer.available ? 'Server Online' : 'Server Offline';
    }

    const statusHeader = (
      <div>
        {statusHeaderText}
        {haveServerStatus && (
          <StatusDotParent width={StatusDotRadius * 2} height={StatusDotRadius * 2}>
            {selectedServer.available ? (
              <StatusDotServerUp cx={StatusDotRadius} cy={StatusDotRadius} r={StatusDotRadius} />
            ) : (
              <StatusDotServerDown cx={StatusDotRadius} cy={StatusDotRadius} r={StatusDotRadius} />
            )}
          </StatusDotParent>
        )}
      </div>
    );

    let statusMessageLines: any[] = [];
    if (statusMessageText) {
      for (const line of statusMessageText.split('\n')) {
        statusMessageLines.push(<StatusMessageLine>{line}</StatusMessageLine>);
      }
    }

    return mkbox(statusHeader, statusMessageLines);
  }

  private onServerSwitch() {
    // clear state and resync with the new api server
    // (no need to clear statusMessageText since that's the same for all servers anyway)
    if (!this.props.selectedServer) {
      // clear the server state because we no longer have one somehow
      if (this.state.serverName != null) {
        this.setState({ serverName: null });
      }
    } else {
      this.setState({ serverName: this.props.selectedServer.name });
      this.syncServerStatus();
    }
  }

  private syncServerStatus() {
    this.fetchAlertMessages()
      .catch(
        ((err: any) => {
          console.error('fetchAlertMessages async exception', err);
          this.setState({ statusMessageText: null });
        }).bind(this)
      )
      .then(
        ((alertMessage: primary.Alert) => {
          if (!alertMessage) {
            this.setState({ statusMessageText: null });
          } else {
            this.setState({ statusMessageText: parseAlertMessage(alertMessage.template, alertMessage.vars) });
          }
        }).bind(this)
      );
  }

  public componentDidMount() {
    this.pollingIntervalHandle = setInterval(
      (() => {
        this.syncServerStatus();
      }).bind(this),
      30000
    );
  }

  public componentWillUnmount() {
    if (this.pollingIntervalHandle) {
      clearInterval(this.pollingIntervalHandle);
      this.pollingIntervalHandle = null;
    }
  }
}

export default ServerStatusMessage;
