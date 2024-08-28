/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { StatusItem } from './StatusItem';
import { connect } from 'react-redux';
import { Status } from '@csegames/library/dist/hordetest/game/types/Status';
import { game } from '@csegames/library/dist/_baseGame';
import { RootState } from '../../../../redux/store';
import { IDLookupTable } from '../../../../redux/gameSlice';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StatusDef } from '../../../../dataSources/manifest/statusManifest';

const Container = 'StatusBar-Container';

export interface StatusWithDef {
  def: Partial<StatusDef>;
  status: Status;
  count: number;
}

interface ReactProps {}

interface InjectedProps {
  statuses: ArrayMap<Status>;
  statusDefs: IDLookupTable<StatusDef>;
}

type Props = ReactProps & InjectedProps;

class AStatusBar extends React.Component<Props> {
  public render() {
    const friendly: StatusWithDef[] = [];
    const hostile: StatusWithDef[] = [];

    for (const index in this.props.statuses) {
      const status = this.props.statuses[index];
      const statusDef = this.props.statusDefs[status.id];
      if (!statusDef || !statusDef.showInHUD) {
        continue;
      }
      if (statusDef.statusTags.indexOf('friendly') !== -1) {
        addStatusToList(statusDef, this.props.statuses[index], friendly);
      } else if (statusDef.statusTags.indexOf('hostile') !== -1) {
        addStatusToList(statusDef, this.props.statuses[index], hostile);
      }
    }

    sortStatuses(friendly);
    sortStatuses(hostile);

    return (
      <div id='StatusBar' className={Container}>
        {friendly.map((status: StatusWithDef, statusIndex: number) => {
          return <StatusItem key={`friendlyStatus_${statusIndex}`} type='friendly' status={status} />;
        })}
        {hostile.map((status: StatusWithDef, statusIndex: number) => {
          return <StatusItem key={`hostileStatus_${statusIndex}`} type='hostile' status={status} />;
        })}
      </div>
    );
  }
}

function addStatusToList(statusDef: StatusDef, status: Status, statusList: StatusWithDef[]): void {
  var existing = statusList.find((s) => s.def == statusDef);
  if (existing) {
    // keep track of the status that is going to expire first, that's the one that we want to show the countdown for
    const existingDuration = getStatusRemainingDuration(existing.status.duration, existing.status.startTime);
    const newDuration = getStatusRemainingDuration(status.duration, status.startTime);
    if (newDuration < existingDuration) {
      existing.status = status;
    }
    existing.count++;
  } else {
    statusList.push({ status: status, def: statusDef, count: 1 });
  }
}

function getStatusRemainingDuration(fullDuration: number, startTime: number) {
  return fullDuration - (game.worldTime - startTime);
}

function sortStatuses(statuses: StatusWithDef[]): void {
  // Sort by largest remaining duration
  statuses.sort((a, b) => {
    const remainingDurationA = getStatusRemainingDuration(a.status.duration, a.status.startTime);
    const remainingDurationB = getStatusRemainingDuration(b.status.duration, b.status.startTime);

    const durationResult = remainingDurationB - remainingDurationA;

    // if there's a case where durations are equal on two statuses, use the ID as a secondary sort.
    // statuses support infinite durations which produce a NaN duration result. We also consider this
    // case as two statuses which equal durations and want to sort by ID so they don't jump around order wise
    if (durationResult === 0 || isNaN(durationResult)) {
      return b.def.numericID - a.def.numericID;
    }

    return durationResult;
  });
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { statusDefsByNumericID: statusDefs } = state.game;
  const { statuses } = state.player;

  return {
    statusDefs,
    statuses,
    ...ownProps
  };
}

export const StatusBar = connect(mapStateToProps)(AStatusBar);
