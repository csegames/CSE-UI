/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDHorizontalAnchor, HUDLayer, HUDVerticalAnchor, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { ClassDefGQL, GroupMemberState, StatusDef } from '@csegames/library/dist/camelotunchained/graphql/schema';
import PlayerUnitFrame from './PlayerUnitFrame';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResource, StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { InitTopic } from '../redux/initializationSlice';

const Root = 'HUD-WarbandMembers-Root';

interface ReactProps {}

interface InjectedProps {
  warbandMembers: (GroupMemberState | null)[];
  statusesByStringID: Dictionary<StatusDef>;
  classesByStringID: Dictionary<ClassDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AWarbandMembers extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        {this.props.warbandMembers
          .filter((warbandMember) => warbandMember)
          .sort((a, b) => b.displayOrder - a.displayOrder)
          .map((warbandMember) => {
            const resources: ArrayMap<EntityResource> = {};
            resources[EntityResourceIDs.Blood] = {
              ...warbandMember.blood,
              id: EntityResourceIDs.Blood,
              name: 'Blood',
              lastDecreaseTime: 0
            };
            resources[EntityResourceIDs.Health] = {
              ...warbandMember.health,
              id: EntityResourceIDs.Health,
              name: 'Health',
              lastDecreaseTime: 0
            };
            resources[EntityResourceIDs.Stamina] = {
              ...warbandMember.stamina,
              id: EntityResourceIDs.Stamina,
              name: 'Stamina',
              lastDecreaseTime: 0
            };
            const statuses: ArrayMap<StatusState> = {};
            for (const status of warbandMember.statuses ?? []) {
              if (status) {
                statuses[status.id] = {
                  ...status,
                  id: this.props.statusesByStringID[status.id]?.numericID
                };
              }
            }
            return (
              <div key={warbandMember.entityID}>
                <PlayerUnitFrame
                  allowTargetting
                  entityID={warbandMember.entityID}
                  isAlive={warbandMember.isAlive}
                  name={warbandMember.name}
                  position={warbandMember.position}
                  resources={resources}
                  statuses={statuses}
                  isLeader={warbandMember.isLeader}
                  wounds={warbandMember.health.wounds}
                  key={warbandMember.characterID}
                  faction={warbandMember.faction}
                  class={this.props.classesByStringID[warbandMember.classID]}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    warbandMembers: state.warband.members,
    statusesByStringID: state.gameDefs.statusesByStringID,
    classesByStringID: state.gameDefs.classesByStringID
  };
};

const WarbandMembers = connect(mapStateToProps)(AWarbandMembers);

const WIDGET_NAME = 'Warband Members';

export const warbandMembersRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 0,
    yOffset: 20
  },
  initTopics: [InitTopic.GameDefs, InitTopic.Statuses, InitTopic.Warband],
  layer: HUDLayer.HUD,
  render: () => {
    return <WarbandMembers />;
  }
};
