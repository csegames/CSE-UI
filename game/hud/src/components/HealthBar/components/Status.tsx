/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { ql } from '@csegames/camelot-unchained';
import { CUQuery } from '@csegames/camelot-unchained/lib/graphql';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import StatusIcon from './StatusIcon';

const query = {
  namedQuery: 'statusEffects',
};

const StatusContainer = styled('div')`
  display: inline-block;
  flex-wrap: wrap;
  position: absolute;
  left: 515px;
  top: 95px;
  width: fit-content;
  width: 168px;
  height: 35px;
`;

export interface StatusProps {
  statuses: {
    id: number;
    duration: number;
  }[];
}

export interface StatusState {
  statusEffects: ql.schema.StatusDef[];
}

class Status extends React.Component<StatusProps, StatusState> {
  constructor(props: StatusProps) {
    super(props);
    this.state = {
      statusEffects: null,
    };
  }
  public render() {
    return (
      this.props.statuses && this.state.statusEffects ?
        <StatusContainer>
          <div>
          {this.props.statuses.map((status, index) => {
            const statusInfo = this.getStatusInfo(status.id);
            return (
              <StatusIcon key={`${index}-${status.id}`} status={statusInfo} />
            );
          })}
          </div>
        </StatusContainer> : <GraphQL query={query} onQueryResult={this.handleQueryResult} />
    );
  }

  public shouldComponentUpdate(nextProps: StatusProps, nextState: StatusState) {
    return !_.isEqual(nextState.statusEffects, this.state.statusEffects) ||
      !_.isEqual(nextProps.statuses, this.props.statuses);
  }

  private handleQueryResult = (result: GraphQLResult<Pick<CUQuery, 'status'>>) => {
    const resultData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;

    if (resultData && resultData.status && resultData.status.statuses &&
        !_.isEqual(resultData.status.statuses, this.state.statusEffects)) {
      this.setState({ statusEffects: resultData.status.statuses });
    }
  }

  private getStatusInfo = (id: number) => {
    const status = _.find(
      this.state.statusEffects,
      (statusEffect: ql.schema.StatusDef) => statusEffect.numericID === id);
    if (status) {
      return {
        id: status.id,
        name: status.name,
        description: status.description,
        iconURL: status.iconURL,
      };
    }
  }
}

export default Status;
