/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { throttle } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { StatusDef } from '@csegames/library/lib/hordetest/graphql/schema';

import { StatusContext, StatusContextState } from 'context/StatusContext';
import { getStatusRemainingDuration } from 'lib/statusHelpers';
import { StatusItem } from './StatusItem';

const Container = styled.div`
  display: flex;
`;

export interface StatusWithDef extends Status {
  def: Partial<StatusDef>;
}

interface Props {
  statusContext: StatusContextState;
}

export interface State {
  friendlyStatuses: StatusWithDef[];
  hostileStatuses: StatusWithDef[];
}

class StatusBarWithInjectedContext extends React.Component<Props, State> {
  private playerStateHandle: EventHandle;
  constructor(props: Props) {
    super(props);

    this.handlePlayerStateUpdate = throttle(this.handlePlayerStateUpdate, 100);
    this.state = {
      friendlyStatuses: [],
      hostileStatuses: [],
    };
  }

  public render() {
    return (
      <Container>
        {this.state.friendlyStatuses.map((status: StatusWithDef) => {
          return (
            <StatusItem key={status.id} type='friendly' status={status} />
          )
        })}
        {this.state.hostileStatuses.map((status: StatusWithDef) => {
          return (
            <StatusItem key={status.id} type='hostile' status={status} />
          );
        })}
      </Container>
    );
  }

  public componentDidMount() {
    this.playerStateHandle = hordetest.game.selfPlayerState.onUpdated(this.handlePlayerStateUpdate);
  }

  public componentWillUnmount() {
    this.playerStateHandle.clear();
  }

  private handlePlayerStateUpdate = () => {
    const playerStateClone = cloneDeep(hordetest.game.selfPlayerState);

    let newFriendlyStatuses: StatusWithDef[] = [];
    let newHostileStatuses: StatusWithDef[] = [];
    Object.values(playerStateClone.statuses).forEach((status) => {
      const statusDef = this.props.statusContext.statusDefs.find(def => def.numericID === status.id);
      if (!statusDef) {
        console.error('Client provided a status that did not have a status def. NumericID: ' + status.id);
        return;
      }

      if (statusDef.statusTags.includes('friendly')) {
        newFriendlyStatuses.push({ ...status, def: statusDef });
      }

      if (statusDef.statusTags.includes('hostile')) {
        newHostileStatuses.push({ ...status, def: statusDef });
      }
    });

    newFriendlyStatuses = this.getSortedStatuses(newFriendlyStatuses);
    newHostileStatuses = this.getSortedStatuses(newHostileStatuses);
    this.setState({ friendlyStatuses: newFriendlyStatuses, hostileStatuses: newHostileStatuses });
  }

  private getSortedStatuses = (statuses: StatusWithDef[]) => {
    // Sort by largest remaining duration
    return statuses.sort((a, b) => {
      const remainingDurationA = getStatusRemainingDuration(a.duration, a.startTime);
      const remainingDurationB = getStatusRemainingDuration(b.duration, b.startTime);

      return remainingDurationB - remainingDurationA;
    });
  }
}

export function StatusBar() {
  const statusContext = useContext(StatusContext);

  return (
    <StatusBarWithInjectedContext statusContext={statusContext} />
  );
}
