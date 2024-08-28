/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { CombatEvent } from '@csegames/library/dist/_baseGame/types/CombatEvent';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { EntityResourceDefinitionGQL } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StatusDef } from '../dataSources/manifest/statusManifest';

const Root = 'HUD-SelfDamageNumbers-Root';
const Log = 'HUD-SelfDamageNumbers-Log';

const maxTimeAlive = 7000;

interface ReactProps {}

interface RenderableCombatEvent {
  data: CombatEvent;
  time: number;
}

interface LogData {
  text: string;
  color?: string;
  horizontalOffset?: number;
  event: RenderableCombatEvent;
}

interface InjectedProps {
  dispatch?: Dispatch;
  events: CombatEvent[];
  name: string;
  statusesByNumericID: Dictionary<StatusDef>;
  entityResourcesByNumericID: Dictionary<EntityResourceDefinitionGQL>;
}

type Props = ReactProps & InjectedProps;

interface State {
  events: RenderableCombatEvent[];
}

class ASelfDamageNumbers extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      events: []
    };
  }

  render(): JSX.Element {
    const logs = this.getLogs();
    return (
      <div className={Root}>
        {logs.map((log, logIndex) => {
          let eventLogIndex = 0;
          let verticalOffset = 0;
          logs.slice(0, logIndex).forEach((previousLog) => {
            if (previousLog.horizontalOffset === log.horizontalOffset) {
              verticalOffset++;
            }
            if (previousLog.event === log.event) {
              eventLogIndex++;
            }
          });
          return (
            <span
              className={Log}
              style={{
                marginTop: `${verticalOffset * 1.75}vmin`,
                left: `${log.horizontalOffset ?? 0}vmin`,
                color: log.color
              }}
              key={`${log.event.time}-${eventLogIndex}`}
            >
              {log.text}
            </span>
          );
        })}
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (this.props.events !== prevProps.events) {
      this.setState({
        events: [
          ...this.state.events.filter(this.isEventAlive.bind(this)),
          ...this.props.events.map((event) => ({ data: event, time: Date.now() }))
        ]
      });
    }
  }

  getLogs(): LogData[] {
    const logs: LogData[] = [];
    const events = this.state.events.filter((event) => event.data.toName === this.props.name);
    events.forEach((event) => {
      event.data.resources?.forEach((resource) => {
        const resourceDef = this.props.entityResourcesByNumericID[resource.resourceNumericID];
        if (!resourceDef) {
          return;
        }

        let color: string;
        switch (resourceDef.id) {
          case EntityResourceIDs.Blood:
            color = '#ff4718';
            break;
          case EntityResourceIDs.Health:
            if (resource.amount < 0) {
              color = '#ff0000';
            } else {
              color = '#4eb5ff';
            }
            break;
          case EntityResourceIDs.Stamina:
            color = '#8cff2d';
            break;
        }
        logs.unshift({
          event,
          text: `${resource.amount > 0 ? '+' : ''}${resource.amount.toFixed(2)}`,
          color,
          horizontalOffset: resource.amount < 0 ? -15 : 15
        });
      });
      event.data.statuses?.forEach((status) => {
        const statusDef = this.props.statusesByNumericID[status.statusID];
        if (!statusDef) {
          return;
        }

        const removed = status.action;
        if ((removed && statusDef.showOnRemove) || (!removed && statusDef.showOnAdd)) {
          logs.unshift({
            event,
            text: `${removed ? '-' : '+'}${status.name}`
          });
        }
      });
    });
    return logs;
  }

  isEventAlive(event: RenderableCombatEvent): boolean {
    const timeAlive = Date.now() - event.time;
    return timeAlive < maxTimeAlive;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { statusesByNumericID } = state.gameDefs;
  return {
    ...ownProps,
    events: state.combat.events,
    name: state.player.name,
    statusesByNumericID,
    entityResourcesByNumericID: state.gameDefs.entityResourcesByNumericID
  };
};

const SelfDamageNumbers = connect(mapStateToProps)(ASelfDamageNumbers);

export const WIDGET_NAME_SELF_DAMAGE_NUMBERS = 'Self Damage Numbers';
export const selfDamageNumbersRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_SELF_DAMAGE_NUMBERS,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 10
  },
  layer: HUDLayer.HUD,
  render: () => {
    return <SelfDamageNumbers />;
  }
};
