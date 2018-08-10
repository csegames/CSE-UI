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
import { StatusDef } from '@csegames/camelot-unchained/lib/graphql';
import { HUDContext, HUDGraphQLQueryResult } from 'HUDContext';
import StatusIcon from './StatusIcon';

const StatusContainer = styled('div')`
  display: inline-block;
  flex-wrap: wrap;
  position: absolute;
  left: 540px;
  top: 95px;
  width: fit-content;
  width: 168px;
  height: 35px;
`;

export interface InjectedStatusProps {
  statusEffects: HUDGraphQLQueryResult<StatusDef[]>;
}

export interface StatusComponentProps {
  statuses: {
    id: number;
    duration: number;
  }[];
}

export type StatusProps = InjectedStatusProps & StatusComponentProps;

class Status extends React.Component<StatusProps> {
  constructor(props: StatusProps) {
    super(props);
    this.state = {
      statusEffects: null,
    };
  }
  public render() {
    return (
      <StatusContainer>
        <div>
          {this.props.statuses && this.props.statuses.map((status, index) => {
            const statusInfo = this.getStatusInfo(status.id);
            return (
              <StatusIcon key={`${index}-${status.id}`} status={statusInfo} />
            );
          })}
        </div>
      </StatusContainer>
    );
  }

  public shouldComponentUpdate(nextProps: StatusProps) {
    return !_.isEqual(nextProps.statuses, this.props.statuses);
  }

  private getStatusInfo = (id: number) => {
    const status = _.find(
      this.props.statusEffects.data,
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

class StatusWithInjectedContext extends React.Component<StatusComponentProps> {
  public render() {
    return (
      <HUDContext.Consumer>
        {({ statuses }) => {
          return <Status {...this.props} statusEffects={statuses} />;
        }}
      </HUDContext.Consumer>
    );
  }
}

export default StatusWithInjectedContext;
