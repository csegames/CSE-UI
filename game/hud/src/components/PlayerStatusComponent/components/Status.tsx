/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { ql } from 'camelot-unchained';
import { CUQuery } from 'camelot-unchained/lib/graphql';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';
import StatusIcon from './StatusIcon';

const StatusContainer = styled('div')`
  flex-wrap: wrap;
  position: relative;
  left: 150px;
  top: 15px;
  width: fit-content;
  width: 128px;
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
      this.props.statuses && !this.props.graphql.loading && this.props.graphql.data.status ?
        <StatusContainer>
          <div>
          {this.props.statuses.map((status) => {
            const statusInfo = this.getStatusInfo(status.id);
            return (
              <StatusIcon key={status.id} status={statusInfo} />
            );
          })}
          </div>
        </StatusContainer> : null
    );
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
