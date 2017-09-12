/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { isEqual } from 'lodash';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/camelot-unchained/lib/graphql/subscription';

import BattleGroupList from './BattleGroupList';
import { GroupMemberFragment } from '../../gql/fragments/GroupMemberFragment';
import { WarbandDisplay, groupUpdateSubscriptionQuery } from '../WarbandDisplay';
import BattlegroupNotificationProvider from './BattleGroupNotificationProvider';
import {
  getActiveBattlegroupID,
  setActiveBattlegroupID,
  onBattlegroupMemberUpdate,
  onBattlegroupMemberRemoved,
} from 'actions/battlegroups';
import {
  WarbandDisplayUpdateSubscription,
  BattleGroupsListQuery,
  GroupMemberState,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
  BattleGroupNotificationSubscription,
  GroupNotificationType,
} from 'gql/interfaces';

const query = gql`
  query BattleGroupsListQuery {
    myBattlegroup {
      battlegroup {
        id
        warbands
      }
      members {
        ...GroupMember
      }
    }
  }
  ${GroupMemberFragment}
`;

interface CharacterIdToGroupMemberState {
  [characterId: string]: GroupMemberState;
}

export interface GroupWithinBattlegroup {
  title: string;
  items: CharacterIdToGroupMemberState;
}

export interface WarbandIdToGroupWithinBattlegroup {
  [groupId: string]: GroupWithinBattlegroup;
}

export interface Props {
}

export interface State {
  visible: boolean;
  groups: WarbandIdToGroupWithinBattlegroup;
  battlegroupID: string;
}

class BattleGroups extends React.Component<Props, State> {
  private myBattlegroupsGQL: GraphQLResult<BattleGroupsListQuery.Query>;
  constructor(props: Props) {
    super(props);
    this.state = {
      groups: {},
      visible: false,
      battlegroupID: '',
    };
  }

  public render() {
    const groups = this.state.groups;
    const arrayOfGroups: any = [];
    Object.keys(groups).forEach((group) => {
      const correctFormatGroup: any = {
        title: groups[group].title,
        items: [],
      };

      Object.keys(groups[group].items).forEach((item) => {
        correctFormatGroup.items.push(groups[group].items[item]);
      });

      arrayOfGroups.push(correctFormatGroup);
    });

    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
        {() => (
          <>
            <BattlegroupNotificationProvider onNotification={this.handleBattlegroupNotification} />
            {this.state.battlegroupID && <BattleGroupList groups={arrayOfGroups} />}
            {this.state.battlegroupID &&
              <GraphQL
                subscription={{
                  query: groupUpdateSubscriptionQuery,
                  initPayload: defaultSubscriptionOpts().initPayload,
                  variables: {
                    groupID: this.state.battlegroupID,
                  },
                }}
                subscriptionHandler={this.handleSubscription}
              />
            }
          </>
        )}
      </GraphQL>
    );
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.visible !== nextState.visible) {
      return true;
    }

    if (this.state.battlegroupID !== nextState.battlegroupID) {
      return true;
    }

    if (!isEqual(this.state.groups, nextState.groups)) {
      return true;
    }

    return false;
  }

  private handleQueryResult = (graphql: GraphQLResult<BattleGroupsListQuery.Query>) => {
    this.myBattlegroupsGQL = graphql;
    if (graphql.loading || !graphql.data || !graphql.data.myBattlegroup || !graphql.data.myBattlegroup.battlegroup) {
      return graphql;
    }

    this.initBattlegroup(graphql.data.myBattlegroup);
  }

  private handleSubscription = (result: SubscriptionResult<WarbandDisplayUpdateSubscription.Subscription>,
                                data: any) => {
    if (!result.data || !result.ok) {
      return data;
    }

    const resultData = result.data;
    switch (resultData.activeGroupUpdates.updateType) {
      case GroupUpdateType.MemberJoined: {
        const member = WarbandDisplay.deserializeMember((resultData.activeGroupUpdates as GroupMemberUpdate).memberState);
        this.onMemberJoin(member);
        break;
      }
      case GroupUpdateType.MemberRemoved: {
        this.onMemberRemove((resultData.activeGroupUpdates as GroupMemberRemovedUpdate).characterID);
        break;
      }
      case GroupUpdateType.MemberUpdate: {
        const member = WarbandDisplay.deserializeMember((resultData.activeGroupUpdates as GroupMemberUpdate).memberState);
        this.onMemberUpdate(member);
        break;
      }
    }
  }

  private handleBattlegroupNotification = (notification: BattleGroupNotificationSubscription.MyGroupNotifications) => {
    switch (notification.type) {
      case GroupNotificationType.Joined: {
        this.onBattlegroupJoin(notification.groupID);
        break;
      }

      case GroupNotificationType.Removed: {
        this.onBattlegroupQuit(notification.groupID);
        break;
      }
    }
  }

  private initBattlegroup = (myBattlegroup: BattleGroupsListQuery.MyBattlegroup) => {
    const groups: WarbandIdToGroupWithinBattlegroup = {};
    const warbandIdToMembers: { [id: string]: CharacterIdToGroupMemberState } = {};

    myBattlegroup.members.forEach((member) => {
      onBattlegroupMemberUpdate(member as GroupMemberState);
      if (warbandIdToMembers[member.warbandID]) {
        warbandIdToMembers[member.warbandID] = {
          ...warbandIdToMembers[member.warbandID],
          [member.characterID]: member as GroupMemberState,
        };
      } else {
        warbandIdToMembers[member.warbandID] = {
          [member.characterID]: member as GroupMemberState,
        };
      }
    });

    myBattlegroup.battlegroup.warbands.forEach((warbandId) => {
      groups[warbandId] = {
        title: warbandId,
        items: warbandIdToMembers[warbandId],
      };
    });

    setActiveBattlegroupID(myBattlegroup.battlegroup.id);
    this.setState({ groups, battlegroupID: myBattlegroup.battlegroup.id });
  }

  private show = () => {
    if (!this.state.visible) {
      this.setState({ visible: true });
    }
  }

  private hide = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
  }

  private onBattlegroupJoin = (groupId: string) => {
    this.setState({ battlegroupID: groupId });
    setActiveBattlegroupID(groupId);
    this.myBattlegroupsGQL.refetch();
  }

  private onBattlegroupQuit = (groupId: string) => {
    if (getActiveBattlegroupID() === groupId) {
      setActiveBattlegroupID(null);
    }

    this.setState((state) => {
      if (state.battlegroupID !== groupId) return state;
      return {
        groups: {},
        battlegroupID: '',
        visible: false,
      };
    });
  }

  private onMemberJoin = (member: GroupMemberState) => {
    this.show();
    onBattlegroupMemberUpdate(member);
    const groupItems = this.state.groups[member.warbandID] ? this.state.groups[member.warbandID].items : {};
    const groups = {
      ...this.state.groups,
      [member.warbandID]: {
        title: member.warbandID,
        items: {
          ...groupItems,
          [member.characterID]: member,
        },
      },
    };
    this.setState({ groups });
  }

  private onMemberRemove = (characterId: string) => {
    onBattlegroupMemberRemoved(characterId);
    const groups = { ...this.state.groups };
    let groupId = '';
    Object.keys(groups).forEach((gId) => {
      Object.keys(groups[gId].items).forEach((id) => {
        if (characterId === id) {
          groupId = gId;
        }
      });
    });

    if (characterId === game.selfPlayerState.characterID) {
      this.hide();
      this.setState({ groups: {} });
      return;
    }

    if (groups[groupId] && groups[groupId].items[characterId]) {
      delete groups[groupId].items[characterId];
    }
    if (groups[groupId] && Object.keys(groups[groupId].items).length === 0) {
      delete groups[groupId];
    }

    if (Object.keys(groups).length === 0) {
      this.hide();
    }

    this.setState({ groups });
  }

  private onMemberUpdate = (member: GroupMemberState) => {
    onBattlegroupMemberUpdate(member);
    const groups = { ...this.state.groups };
    if (groups[member.warbandID] && groups[member.warbandID].items[member.characterID].name !== member.name) {
      groups[member.warbandID].items[member.characterID] = member;
      this.setState({ groups });
    }
  }
}

export default BattleGroups;
