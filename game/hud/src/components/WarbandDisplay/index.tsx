/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import gql from 'graphql-tag';
import styled from 'react-emotion';
import { isEqual } from 'lodash';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/camelot-unchained/lib/graphql/subscription';
import {
  WarbandDisplayQuery,
  WarbandDisplayUpdateSubscription,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
  WarbandNotificationSubscription,
  GroupNotificationType,
  GroupMemberState,
  BattleGroupNotificationSubscription,
} from 'gql/interfaces';

import { addOrUpdate, removeWhere } from '../../lib/reduxUtils';
import WarbandMemberDisplay from './WarbandMemberDisplay';
import {
  setActiveWarbandID,
  getActiveWarbandID,
  onWarbandMemberUpdate,
  onWarbandMemberRemoved,
} from 'actions/warband';
import { GroupMemberFragment } from 'gql/fragments/GroupMemberFragment';
import WarbandNotificationProvider from './WarbandNotificationProvider';
import BattleGroupNotificationProvider from '../BattleGroups/BattleGroupNotificationProvider';

const Container = styled('div')`
  user-select: none;
  pointer-events: none;
`;

const characterImages = {
  humanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-m.png',
  humanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-f.png',
  luchorpanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-m.png',
  luchorpanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-f.png',
  valkyrieM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  valkyrieF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmalevM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmaleaM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-art.png',
  humanmaletM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-tdd.png',
  humanmalevF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-vik.png',
  humanmaleaF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-art.png',
  humanmaletF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-tdd.png',
};

export const query = gql`
  query WarbandDisplayQuery {
    myBattlegroup {
      battlegroup {
        id
      }
    }
    myActiveWarband {
      info {
        id
      }
      members {
        ...GroupMember
      }
    }
  }
  ${GroupMemberFragment}
`;

export const groupUpdateSubscriptionQuery = gql`
  subscription WarbandDisplayUpdateSubscription($groupID: String!) {
    activeGroupUpdates(groupID: $groupID) {
      updateType
      groupID

      ... on GroupMemberUpdate {
        memberState
      }

      ... on GroupMemberRemovedUpdate {
        characterID
      }
    }
  }
`;

export interface Props {
  isMini?: boolean;
}

export interface State {
  battlegroupID?: string;
  activeMembers?: GroupMemberState[];
  permanentMembers?: GroupMemberState[];
  name?: string;
  warbandID?: string;
}

export class WarbandDisplay extends React.Component<Props, State> {
  private myWarbandGQL: GraphQLResult<WarbandDisplayQuery.Query>;
  private receivedMemberUpdate: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      ...(WarbandDisplay.emptyWarband()),
      battlegroupID: '',
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQuery}>
        {() => (
          <Container>
            {
              !this.state.battlegroupID && this.state.activeMembers &&
                this.state.activeMembers.map(m => <WarbandMemberDisplay key={m.entityID} member={m as any} />)
            }
            {!this.state.battlegroupID && this.state.warbandID &&
              <GraphQL
                subscription={{
                  query: groupUpdateSubscriptionQuery,
                  initPayload: defaultSubscriptionOpts().initPayload,
                  variables: {
                    groupID: this.state.warbandID,
                  },
                }}
                subscriptionHandler={this.handleSubscription}
              />
            }
            <WarbandNotificationProvider onNotification={this.handleWarbandNotification} />
            <BattleGroupNotificationProvider onNotification={this.handleBattleGroupNotification} />
          </Container>
        )}
      </GraphQL>
    );
  }

  public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>) {

    if (this.props.isMini !== nextProps.isMini) {
      return true;
    }

    if (this.state.warbandID !== nextState.warbandID) {
      return true;
    }

    if (this.receivedMemberUpdate) {
      this.receivedMemberUpdate = false;
      return true;
    }

    if (!isEqual(nextState.activeMembers, this.state.activeMembers)) {
      return true;
    }

    return false;
  }

  public static deserializeMember(memberJSON: string): GroupMemberState {
    try {
      const member = JSON.parse(memberJSON);
      member.avatar = WarbandDisplay.getAvatar(member.gender, member.race);
      return member;
    } catch (e) {
      if  (process.env.IS_DEVELOPMENT) {
        console.error(`WarbandMemberJoined Failed to parse WarbandMember. | ${e}`);
      }
      return;
    }
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

  private handleBattleGroupNotification = (notification: BattleGroupNotificationSubscription.MyGroupNotifications) => {
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

  private handleQuery = (graphql: GraphQLResult<WarbandDisplayQuery.Query>) => {
    this.myWarbandGQL = graphql;
    if (!graphql.data || !graphql.ok) {
      return graphql;
    }

    const myBattlegroup = graphql.data.myBattlegroup;
    if (myBattlegroup && myBattlegroup.battlegroup) {
      this.setState({ battlegroupID: myBattlegroup.battlegroup.id });
    }

    const warband = graphql.data.myActiveWarband;
    if (warband && warband.info) {
      this.onInitializeWarband(warband.info.id, warband.members as GroupMemberState[]);
    }
  }

  private handleSubscription = (result: SubscriptionResult<WarbandDisplayUpdateSubscription.Subscription>,
                                data: WarbandDisplayQuery.Query) => {
    if (!result.data || !result.ok) {
      return data;
    }

    const resultData = result.data;
    switch (resultData.activeGroupUpdates.updateType) {
      case GroupUpdateType.MemberJoined: {
        const member = WarbandDisplay.deserializeMember((resultData.activeGroupUpdates as GroupMemberUpdate).memberState);
        this.onWarbandMemberJoined(member);
        break;
      }
      case GroupUpdateType.MemberRemoved: {
        this.onWarbandMemberRemoved((resultData.activeGroupUpdates as GroupMemberRemovedUpdate).characterID);
        break;
      }
      case GroupUpdateType.MemberUpdate: {
        const member = WarbandDisplay.deserializeMember((resultData.activeGroupUpdates as GroupMemberUpdate).memberState);
        this.onWarbandMemberUpdated(member);
        break;
      }
    }
  }

  private static emptyWarband() {
    return {
      activeMembers: [] as GroupMemberState[],
      name: '',
      permanentMembers: [] as GroupMemberState[],
      warbandID: '',
    };
  }

  private static memberCompare(a: GroupMemberState, b: GroupMemberState): boolean {
    return a.characterID === b.characterID;
  }

  private static getAvatar(gender: Gender, race: Race) {
    if (gender === Gender.Male) { // MALE
      switch (race) {
        case 2: return characterImages.luchorpanM; // Luchorpan
        case 4: return characterImages.valkyrieM; // Valkyrie
        case 15: return characterImages.humanmalevM; // Humanmalev
        case 16: return characterImages.humanmaleaM; // Humanmalea
        case 17: return characterImages.humanmaletM; // Humanmalet
        case 18: return characterImages.humanM; // Pict
      }
    } else {
      switch (race) {
        case 2: return characterImages.luchorpanF; // Luchorpan
        case 4: return characterImages.valkyrieF; // Valkyrie
        case 15: return characterImages.humanmalevF; // Humanmalev
        case 16: return characterImages.humanmaleaF; // Humanmalea
        case 17: return characterImages.humanmaletF; // Humanmalet
        case 18: return characterImages.humanF; // Pict
      }
    }
  }

  private onInitializeWarband = (id: string, members: GroupMemberState[]) => {
    this.setState({
      ...(WarbandDisplay.emptyWarband()),
      warbandID: id,
      activeMembers: members,
    });
    setActiveWarbandID(id);
    members.forEach(member => onWarbandMemberUpdate(member));
  }

  private onWarbandJoined = (id: string) => {
    this.setState({
      ...(WarbandDisplay.emptyWarband()),
      warbandID: id,
    });
    setActiveWarbandID(id);
    this.myWarbandGQL.refetch();
  }

  private onWarbandQuit = (id: string) => {
    if (getActiveWarbandID() === id) {
      setActiveWarbandID(null);
    }

    this.setState((state) => {
      if (state.warbandID !== id) return state;
      return {
        ...(WarbandDisplay.emptyWarband()),
      };
    });
  }

  private onWarbandMemberJoined = (member: GroupMemberState) => {
    if (!member) return;
    onWarbandMemberUpdate(member);
    this.receivedMemberUpdate = true;
    this.setState((state) => {
      return {
        ...state,
        activeMembers: addOrUpdate(state.activeMembers, member, WarbandDisplay.memberCompare),
      };
    });
  }

  private onWarbandMemberUpdated = (member: GroupMemberState) => {
    if (!this.state.warbandID) return;
    if (!member) return;
    onWarbandMemberUpdate(member);
    this.receivedMemberUpdate = true;
    this.setState((state) => {
      return {
        ...state,
        activeMembers: addOrUpdate(state.activeMembers, member, WarbandDisplay.memberCompare),
      };
    });
  }

  private onWarbandMemberRemoved = (characterID: string) => {
    if (characterID === game.selfPlayerState.characterID) {
      this.onWarbandQuit(this.state.warbandID);
      return;
    }
    onWarbandMemberRemoved(characterID);
    this.receivedMemberUpdate = true;
    this.setState((state) => {
      const removeResult = removeWhere(state.activeMembers, m => m.characterID === characterID);
      if (removeResult.removed.length > 0) {
        game.trigger('systemMessage', `${removeResult.removed[0].name} has left your warband.`);
      }
      return {
        ...state,
        activeMembers: removeResult.result,
      };
    });
  }
}
