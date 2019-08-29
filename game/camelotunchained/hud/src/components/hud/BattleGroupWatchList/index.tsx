/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from 'react-emotion';
import { styled } from '@csegames/linaria/react';
import { isEqual, isEmpty } from 'lodash';
import gql from 'graphql-tag';
import { CollapsingList } from 'cseshared/components/CollapsingList';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

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
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom,
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color}, transparent);
  border-image-slice: 1;
  background: url(../images/item-tooltips/bg.png);
  background-size: cover;
  -webkit-mask-image: url(../images/item-tooltips/ui-mask.png);
  -webkit-mask-size: 100% 100%;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(../images/item-tooltips/ornament_left.png);
    width: 35px;
    height: 35px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background: url(../images/item-tooltips/ornament_right.png);
    width: 35px;
    height: 35px;
  }

  transition: opacity 0.5s ease;
  opacity: 0;
  &.mouseOver {
    opacity: 1;
  }
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(to right, ${(props: {color: string}) => props.color}, transparent);
  box-shadow: inset 0 0 20px 2px rgba(0,0,0,0.8);
  height: 106px;
  &:after {
    content: '';
    position: absolute;
    height: 106px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(../images/item-tooltips/title_viel.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

export const defaultBattleGroupWatchListStyles: BattleGroupWatchListStyles = {
  body: css`
    height: auto;
    padding: 0 10px 20px 0;
  `,

  title: css`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
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
  mouseOver: boolean;
}

class BattleGroupWatchList extends React.Component<Props, State> {
  private receivedMemberUpdate: boolean = false;
  private myGroupsGQL: GraphQLResult<BattleGroupWatchListQuery.Query>;
  private evh: EventHandle[] = [];
  private mouseLeaveTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      battlegroupID: '',
      warbandID: '',
      warbandMembers: [],
      visible: false,
      mouseOver: false,
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
        {() => (
          this.state.battlegroupID && this.state.warbandID ?
          <UIContext.Consumer>
            {(ui) => {
              const color = ui.currentTheme().toolTips.color[camelotunchained.game.selfPlayerState.faction];
              return (
                <Container onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                  <Background color={color} className={this.state.mouseOver ? 'mouseOver' : ''}>
                    <HeaderOverlay color={color} />
                  </Background>
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
                </Container>
              );
            }}
          </UIContext.Consumer> : null
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
    if (this.state.mouseOver !== nextState.mouseOver) {
      return true;
    }

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
    if (characterId === camelotunchained.game.selfPlayerState.characterID) {
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

  private onMouseOver = () => {
    if (this.mouseLeaveTimeout) {
      window.clearTimeout(this.mouseLeaveTimeout);
      this.mouseLeaveTimeout = null;
    }

    if (!this.state.mouseOver) {
      this.setState({ mouseOver: true });
    }
  }

  private onMouseLeave = () => {
    this.mouseLeaveTimeout = window.setTimeout(() => {
      this.setState({ mouseOver: false });
    }, 1000);
  }
}

export default BattleGroupWatchList;
