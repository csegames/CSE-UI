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
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';
import StatusIcon from './StatusIcon';

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

export interface StatusProps extends GraphQLInjectedProps<Pick<CUQuery, 'status'>> {
  statuses: {
    id: number;
    duration: number;
  }[];
}

export interface StatusState {

}

class Status extends React.Component<StatusProps, StatusState> {
  public render() {
    return (
      this.props.statuses && !this.props.graphql.loading && this.props.graphql.data && this.props.graphql.data.status ?
        <StatusContainer>
          <div>
          {this.props.statuses.map((status, index) => {
            const statusInfo = this.getStatusInfo(status.id);
            return (
              <StatusIcon key={`${index}-${status.id}`} status={statusInfo} />
            );
          })}
          </div>
        </StatusContainer> : null
    );
  }

  public shouldComponentUpdate(nextProps: StatusProps) {
    return !_.isEqual(nextProps.graphql, this.props.graphql) ||
      !_.isEqual(nextProps.statuses, this.props.statuses);
  }

  private getStatusInfo = (id: number) => {
    const status = _.find(
      this.props.graphql.data.status.statuses,
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

const StatusWithQL = withGraphQL<StatusProps>({
  query: `
    query StatusEffectsStoreQuery {
      status {
        statuses {
          id
          numericID
          iconURL
          description
          name
        }
      }
    }
  `,
})(Status);

export default StatusWithQL;
