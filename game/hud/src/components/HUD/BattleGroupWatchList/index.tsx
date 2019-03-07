/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { isEqual, isEmpty } from 'lodash';
import gql from 'graphql-tag';
import { CollapsingList } from '@csegames/camelot-unchained/lib/components';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import { BattleGroupNotificationProvider } from '../BattleGroups/BattleGroupNotificationProvider';
import { WarbandNotificationProvider } from '../WarbandDisplay/WarbandNotificationProvider';
import WatchListItem from './WatchListItem';
import { WarbandDisplay } from '../WarbandDisplay';
import { removeWhere } from 'lib/reduxUtils';
import { GroupMemberFragment } from 'gql/fragments/GroupMemberFragment';
import {
  setActiveWarbandID,
  getActiveWarbandID,
  onWarbandMemberUpdate,
  onWarbandMemberRemoved,
} from 'actions/warband';
import {
  WarbandNotificationSubscription,
  BattleGroupWatchListQuery,
  GroupNotificationType,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
  GroupMemberState,
  BattleGroupNotificationSubscription,
  WarbandUpdateSubscription,
} from 'gql/interfaces';

const query = gql`
  query BattleGroupWatchListQuery {
    myActiveWarband {
      info {
        id
      }
      members {
        ...GroupMember
      }
    }

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

export interface BattleGroupWatchListStyles {
  body: string;
  title: string;
  listHeader: string;
}

const Container = styled.div`
  position: relative;
  user-select: none;
  pointer-events: all;
  width: 100%;
  padding: 3px;
  background:
    linear-gradient(
      to bottom left,
      rgba(196, 157, 108, 0.1),
      rgba(196, 157, 108, 0.25),
      rgba(0, 0, 0, 0.5) 70%,
      rgba(0, 0, 0, 0.9) 90%
    ),
    url(../images/battlegroups/battlegroup-bg.png);
  box-shadow: inset 0 -5px 50px 7px rgba(0,0,0,0.8);
  border-image: linear-gradient(to bottom, rgba(65, 65, 65, 1), rgba(0, 0, 0, 0));
  border-image-slice: 1;
  border-width: 1px;
  border-style: solid;
`;

const TopLeftOrnament = styled.div`
  position: absolute;
  top: -1px;
  left: -2px;
  width: 43px;
  height: 43px;
  background: url(../images/battlegroups/ornament-top-left.png) no-repeat;
`;

const TopRightOrnament = styled.div`
  position: absolute;
  top: -1px;
  right: -2px;
  width: 43px;
  height: 43px;
  background: url(../images/battlegroups/ornament-top-right.png) no-repeat;
`;

const BottomLeftOrnament = styled.div`
  position: absolute;
  bottom: -1px;
  left: -2px;
  width: 43px;
  height: 43px;
  background: url(../images/battlegroups/ornament-bottom-left.png) no-repeat;
`;

const BottomRightOrnament = styled.div`
  position: absolute;
  bottom: -1px;
  right: -2px;
  width: 43px;
  height: 43px;
  background: url(../images/battlegroups/ornament-bottom-right.png) no-repeat;
`;

export const defaultBattleGroupWatchListStyles: BattleGroupWatchListStyles = {
  body: css`
    height: 220px;
    padding: 0 10px;
  `,

  title: css`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
    border-image: linear-gradient(to right, rgba(176, 176, 175, 0) 5%, rgba(176, 176, 175, 0.7), rgba(176, 176, 175, 0) 95%);
    border-image-slice: 1;
    border-width: 1px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    letter-spacing: 1px;
  `,

  listHeader: css`
    display: flex;
    justify-content: flex-end;
    font-size: 15px;
    margin-bottom: -5px;
  `,
};

export interface Props {
  styles?: Partial<BattleGroupWatchListStyles>;
}

export interface State {
  battlegroupID: string;
  warbandID: string;
  warbandMembers: GroupMemberState[];
  visible: boolean;
}

class BattleGroupWatchList extends React.Component<Props, State> {
  private receivedMemberUpdate: boolean = false;
  private myGroupsGQL: GraphQLResult<BattleGroupWatchListQuery.Query>;
  private evh: EventHandle[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      battlegroupID: '',
      warbandID: '',
      warbandMembers: [],
      visible: false,
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
        {() => (
          this.state.battlegroupID && this.state.warbandID ?
            <Container>
              <TopLeftOrnament />
              <TopRightOrnament />
              <BottomLeftOrnament />
              <BottomRightOrnament />
              <CollapsingList
                title={`Watch (${this.state.warbandMembers.length})`}
                items={this.state.warbandMembers}
                styles={{
                  body: defaultBattleGroupWatchListStyles.body,
                  title: defaultBattleGroupWatchListStyles.title,
                }}
                renderListItem={(item: GroupMemberState) =>
                  <WatchListItem item={item} />
                }
              />
            </Container> : null
        )}
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.evh.push(game.on(WarbandNotificationProvider.notificationEventName, this.handleWarbandNotification));
    this.evh.push(game.on(WarbandNotificationProvider.updateEventName, this.handleWarbandUpdate));
    this.evh.push(game.on(BattleGroupNotificationProvider.notificationEventName, this.handleBattlegroupNotification));
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.warbandID !== nextState.warbandID) {
      return true;
    }

    if (this.state.battlegroupID !== nextState.battlegroupID) {
      return true;
    }

    if (this.receivedMemberUpdate) {
      this.receivedMemberUpdate = false;
      return true;
    }

    if (!isEqual(nextState.warbandMembers, this.state.warbandMembers)) {
      return true;
    }

    return false;
  }

  public componentWillUnmount() {
    this.evh.forEach(ev => ev.clear());
  }

  private handleWarbandNotification = (notification: WarbandNotificationSubscription.MyGroupNotifications) => {
    switch (notification.type) {
      case GroupNotificationType.Joined: {
        this.onWarbandJoined(notification.groupID);
        break;
      }
      case GroupNotificationType.Removed: {
        this.onWarbandQuit(notification.groupID);
        break;
      }
    }
  }

  private handleBattlegroupNotification = (notification: BattleGroupNotificationSubscription.MyGroupNotifications) => {
    switch (notification.type) {
      case GroupNotificationType.Joined: {
        this.setState({ battlegroupID: notification.groupID });
        break;
      }
      case GroupNotificationType.Removed: {
        this.setState({ battlegroupID: '' });
        break;
      }
    }
  }

  private handleQueryResult = (graphql: GraphQLResult<BattleGroupWatchListQuery.Query>) => {
    this.myGroupsGQL = graphql;
    if (!graphql.data || !graphql.ok) {
      return graphql;
    }

    const myBattlegroup = graphql.data.myBattlegroup;
    const stateUpdate: Partial<State> = {};
    if (myBattlegroup && myBattlegroup.battlegroup) {
      stateUpdate['battlegroupID'] = myBattlegroup.battlegroup.id;
    }

    const warband = graphql.data.myActiveWarband;
    if (warband && warband.info) {
      stateUpdate['warbandID'] = warband.info.id;
      stateUpdate['warbandMembers'] = warband.members as GroupMemberState[];
    }

    if (!isEmpty(stateUpdate)) {
      this.setState(state => ({ ...state, ...stateUpdate }));
    }
  }

  private handleWarbandUpdate = (update: WarbandUpdateSubscription.ActiveGroupUpdates) => {
    switch (update.updateType) {
      case GroupUpdateType.MemberJoined: {
        const member = WarbandDisplay.deserializeMember((update as GroupMemberUpdate).memberState);
        this.onWarbandMemberJoined(member);
        break;
      }
      case GroupUpdateType.MemberRemoved: {
        this.onWarbandMemberRemoved((update as GroupMemberRemovedUpdate).characterID);
        break;
      }
      case GroupUpdateType.MemberUpdate: {
        const member = WarbandDisplay.deserializeMember((update as GroupMemberUpdate).memberState);
        this.onWarbandMemberUpdated(member);
        break;
      }
    }
  }

  private onWarbandJoined = (id: string) => {
    this.setState({ warbandID: id });
    setActiveWarbandID(id);
    this.myGroupsGQL.refetch();
  }

  private onWarbandQuit = (id: string) => {
    if (getActiveWarbandID() === id) {
      setActiveWarbandID(null);
    }

    if (this.state.warbandID === id) {
      this.setState({ warbandID: '', battlegroupID: '' });
    }
  }

  private onWarbandMemberJoined = (member: GroupMemberState) => {
    onWarbandMemberUpdate(member);
    this.show();
    const warbandMembers = [...this.state.warbandMembers];
    this.receivedMemberUpdate = true;

    const memberIndex = warbandMembers.findIndex(wm => wm.characterID === member.characterID);
    if (warbandMembers[memberIndex]) {
      warbandMembers[memberIndex] = member;
    } else {
      warbandMembers.push(member);
    }

    this.setState({ warbandMembers });
  }

  private onWarbandMemberRemoved = (characterId: string) => {
    onWarbandMemberRemoved(characterId);
    let warbandMembers = [...this.state.warbandMembers];
    if (characterId === game.selfPlayerState.characterID) {
      this.onWarbandQuit(this.state.warbandID);
      return;
    }

    warbandMembers = removeWhere(warbandMembers, wm => wm.characterID === characterId).result;
    if (warbandMembers.length === 0) {
      // No more members, hide the widget
      this.hide();
    }

    this.receivedMemberUpdate = true;
    this.setState({ warbandMembers });
  }

  private onWarbandMemberUpdated = (member: GroupMemberState) => {
    onWarbandMemberUpdate(member);
    const warbandMembers = [...this.state.warbandMembers];
    const memberIndex = warbandMembers.findIndex(wm => wm.characterID === member.characterID);

    if (memberIndex !== -1) {
      warbandMembers[memberIndex] = member;
    } else {
      warbandMembers.push(member);
    }

    this.receivedMemberUpdate = true;
    this.setState({ warbandMembers });
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
}

export default BattleGroupWatchList;
