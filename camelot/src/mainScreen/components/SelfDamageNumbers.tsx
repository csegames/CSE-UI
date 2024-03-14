/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDHorizontalAnchor, HUDLayer, HUDVerticalAnchor, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { CombatEvent } from '@csegames/library/dist/_baseGame/types/CombatEvent';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { StatusDef, StatusUIVisibility } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { InitTopic } from '../redux/initializationSlice';

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
      event.data.damages?.forEach((damage) => {
        logs.unshift({ event, text: `-${damage.sent.toFixed(2)}`, horizontalOffset: -15 });
      });
      event.data.heals?.forEach((heal) => {
        logs.unshift({
          event,
          text: `+${heal.sent.toFixed(2)}`,
          color: '#4eb5ff',
          horizontalOffset: 15
        });
      });
      event.data.resources?.forEach((resource) => {
        let color: string;
        switch (resource.type) {
          case EntityResourceIDs.Blood:
            color = '#ff4718';
            break;
          case EntityResourceIDs.Health:
            color = '#4eb5ff';
            break;
          case EntityResourceIDs.Stamina:
            color = '#8cff2d';
            break;
        }
        logs.unshift({
          event,
          text: String(resource.sent.toFixed(2)),
          color,
          horizontalOffset: resource.sent < 0 ? -15 : 15
        });
      });
      event.data.statuses?.forEach((status) => {
        const statusDef = this.props.statusesByNumericID[status.statusID];
        if (!statusDef) {
          return;
        }

        const removed = status.action;
        if (
          statusDef.uIVisibility === StatusUIVisibility.ShowAll ||
          (removed && statusDef.uIVisibility === StatusUIVisibility.PopupOnRemove) ||
          (!removed && statusDef.uIVisibility === StatusUIVisibility.PopupOnAdd)
        ) {
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
    statusesByNumericID
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
  initTopics: [InitTopic.Statuses],
  layer: HUDLayer.HUD,
  render: () => {
    return <SelfDamageNumbers />;
  }
};
