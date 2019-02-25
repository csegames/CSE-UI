/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from 'linaria/react';
import gql from 'graphql-tag';
import { isEqual } from 'lodash';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import { WarbandDisplay } from '../WarbandDisplay';
import BattleGroupsListView from './BattleGroupListView';
import { GroupMemberFragment } from 'gql/fragments/GroupMemberFragment';
import {
  setActiveBattlegroupID,
  onBattlegroupMemberUpdate,
  onBattlegroupMemberRemoved,
  getActiveBattlegroupID,
} from 'actions/battlegroups';
import {
  BattleGroupsListQuery,
  GroupUpdateType,
  GroupMemberRemovedUpdate,
  GroupMemberUpdate,
  GroupMemberState,
  BattleGroupUpdateSubscription,
  BattleGroupNotificationSubscription,
  GroupNotificationType,
} from 'gql/interfaces';
import { BattleGroupNotificationProvider } from './BattleGroupNotificationProvider';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

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

export interface GroupArray {
  title: string;
  items: GroupMemberState[];
}

export interface Props {
}

export interface State {
  battlegroupID: string;
  groups: WarbandIdToGroupWithinBattlegroup;
}

class BattleGroupsList extends React.Component<Props, State> {
  private receivedMemberUpdate: boolean = false;
  private evh: EventHandle[] = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      groups: {},
      battlegroupID: '',
    };
  }
  public render() {
    if (!this.state.battlegroupID) {
      return null;
    }

    const groups = this.state.groups;
    const arrayOfGroups: GroupArray[] = [];
    Object.keys(groups).forEach((group) => {
      const correctFormatGroup: GroupArray = {
        title: groups[group].title,
        items: [],
      };

      Object.keys(groups[group].items).forEach((item) => {
        correctFormatGroup.items.push(groups[group].items[item]);
      });

      arrayOfGroups.push(correctFormatGroup);
    });
    return (
      <Container>
        <BattleGroupsListView groups={arrayOfGroups} />
        <GraphQL
          query={query}
          onQueryResult={this.handleQueryResult}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.evh.push(game.on(BattleGroupNotificationProvider.notificationEventName, this.handleBattlegroupNotification));
    this.evh.push(game.on(BattleGroupNotificationProvider.updateEventName, this.handleBattlegroupUpdate));
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.battlegroupID !== nextState.battlegroupID) {
      return true;
    }

    if (this.receivedMemberUpdate) {
      this.receivedMemberUpdate = false;
      return true;
    }

    if (!isEqual(this.state.groups, nextState.groups)) {
      return true;
    }

    return false;
  }

  private handleQueryResult = (graphql: GraphQLResult<BattleGroupsListQuery.Query>) => {
    if (graphql.loading || !graphql.data || !graphql.data.myBattlegroup || !graphql.data.myBattlegroup.battlegroup) {
      return graphql;
    }

    this.initBattlegroup(graphql.data.myBattlegroup);
  }

  public componentWillUnmount() {
    this.evh.forEach(ev => ev.clear());
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

  private onBattlegroupJoin = (groupId: string) => {
    this.setState({ battlegroupID: groupId });
    setActiveBattlegroupID(groupId);
  }

  private onBattlegroupQuit = (groupId: string) => {
    if (getActiveBattlegroupID() === groupId) {
      setActiveBattlegroupID(null);
    }

    this.setState((state: State) => {
      if (state.battlegroupID !== groupId) return state;
      return {
        battlegroupID: '',
      };
    });
  }

  private handleBattlegroupUpdate = (update: BattleGroupUpdateSubscription.ActiveGroupUpdates) => {
    switch (update.updateType) {
      case GroupUpdateType.MemberJoined: {
        const member = WarbandDisplay.deserializeMember((update as GroupMemberUpdate).memberState);
        this.onMemberJoin(member);
        break;
      }
      case GroupUpdateType.MemberRemoved: {
        this.onMemberRemove((update as GroupMemberRemovedUpdate).characterID);
        break;
      }
      case GroupUpdateType.MemberUpdate: {
        const member = WarbandDisplay.deserializeMember((update as GroupMemberUpdate).memberState);
        this.onMemberUpdate(member);
        break;
      }
    }
  }

  private initBattlegroup = (myBattlegroup: BattleGroupsListQuery.MyBattlegroup) => {
    const groups: WarbandIdToGroupWithinBattlegroup = {};
    const warbandIdToMembers: { [id: string]: CharacterIdToGroupMemberState } = {};

    setActiveBattlegroupID(myBattlegroup.battlegroup.id);
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

    this.setState({ groups });
  }

  private onMemberJoin = (member: GroupMemberState) => {
    if (member.warbandID === '0000000000000000000000') return;
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

    this.receivedMemberUpdate = true;
    this.setState({ groups });
  }

  private onMemberRemove = (characterId: string) => {
    this.setState((state) => {
      onBattlegroupMemberRemoved(characterId);
      const groups = cloneDeep(state.groups);
      let groupId = '';
      Object.keys(groups).forEach((gId) => {
        Object.keys(groups[gId].items).forEach((id) => {
          if (characterId === id) {
            groupId = gId;
          }
        });
      });

      if (characterId === game.selfPlayerState.characterID) {
        this.setState({ groups: {} });
        return;
      }

      if (groups[groupId] && groups[groupId].items[characterId]) {
        delete groups[groupId].items[characterId];
      }
      if (groups[groupId] && Object.keys(groups[groupId].items).length === 0) {
        delete groups[groupId];
      }

      this.receivedMemberUpdate = true;
      return {
        ...state,
        groups,
      };
    });
  }

  private onMemberUpdate = (member: GroupMemberState) => {
    this.setState((state) => {
      onBattlegroupMemberUpdate(member);
      const groups = cloneDeep(state.groups);
      if (groups[member.warbandID] && groups[member.warbandID].items && groups[member.warbandID].items[member.characterID] &&
          groups[member.warbandID].items[member.characterID].name !== member.name) {
        groups[member.warbandID].items[member.characterID] = member;
        this.receivedMemberUpdate = true;
        return {
          ...state,
          groups,
        };
      }
    });
  }
}

export default BattleGroupsList;
