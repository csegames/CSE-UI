/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import {
  ClassDefGQL,
  EntityResourceDefinitionGQL,
  GroupMemberState
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import PlayerUnitFrame from './PlayerUnitFrame';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  EntityResource,
  StatusState,
  EntityPositionMapModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { InitTopic } from '../redux/initializationSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StatusDef } from '../dataSources/manifest/statusManifest';

const Root = 'HUD-WarbandMembers-Root';

interface ReactProps {}

interface InjectedProps {
  warbandMembers: (GroupMemberState | null)[];
  positions: EntityPositionMapModel;
  statusesByStringID: Dictionary<StatusDef>;
  classesByStringID: Dictionary<ClassDefGQL>;
  entityResourcesByStringID: Dictionary<EntityResourceDefinitionGQL>;
  woundStatusTag: string;
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
            const resources: ArrayMap<EntityResource> = this.getMemberResources(warbandMember);
            const statuses: ArrayMap<StatusState> = {};
            let wounds = 0;
            for (const status of warbandMember.statuses ?? []) {
              if (status) {
                const statusDef: StatusDef = this.props.statusesByStringID[status.id];
                if (statusDef) {
                  if (statusDef.statusTags.indexOf(this.props.woundStatusTag) != -1) {
                    wounds++;
                  }

                  statuses[status.id] = {
                    ...status,
                    id: statusDef.numericID
                  };
                }
              }
            }

            return (
              <div key={warbandMember.entityID}>
                <PlayerUnitFrame
                  allowTargetting
                  entityID={warbandMember.entityID}
                  isAlive={warbandMember.isAlive}
                  name={warbandMember.name}
                  resources={resources}
                  statuses={statuses}
                  isLeader={warbandMember.isLeader}
                  wounds={wounds}
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

  private getMemberResources(warbandMember: GroupMemberState): ArrayMap<EntityResource> {
    const resources: ArrayMap<EntityResource> = {};
    if (warbandMember.resources) {
      warbandMember.resources.forEach((resource) => {
        const resourceDef = this.props.entityResourcesByStringID[resource.id];
        if (resourceDef) {
          resources[resource.id] = {
            id: resource.id,
            name: resourceDef.name,
            lastDecreaseTime: 0,
            current: resource.current,
            max: resource.max
          };
        }
      });
    }
    return resources;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    warbandMembers: state.warband.members,
    positions: state.entities.positions,
    statusesByStringID: state.gameDefs.statusesByStringID,
    classesByStringID: state.gameDefs.classesByStringID,
    entityResourcesByStringID: state.gameDefs.entityResourcesByStringID,
    woundStatusTag: state.gameDefs.settings.woundStatusTag
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
  initTopics: [InitTopic.GameDefs, InitTopic.Warband],
  layer: HUDLayer.HUD,
  render: () => {
    return <WarbandMembers />;
  }
};
