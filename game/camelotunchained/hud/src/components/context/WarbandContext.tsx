/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/library/lib/_baseGame/graphql/subscription';
import {
  WarbandNotificationSubscription,
  GroupNotificationType,
  WarbandUpdateSubscription,
  WarbandContextQuery,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
} from 'gql/interfaces';
import { GroupMemberFragment } from 'gql/fragments/GroupMemberFragment';

const warbandQuery = gql`
  query WarbandContextQuery {
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

const notificationSubscription = gql`
  subscription WarbandNotificationSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;

const updateSubscription = gql`
  subscription WarbandUpdateSubscription {
    activeGroupUpdates {
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
}

export interface WarbandContextState {
  activeWarbandID: string;
  memberEntityIdToCharacterId: { [entityId: string]: string };
  memberCharacterIdToMemberState: { [characterId: string]: GroupMemberState };

  refetch: () => void;
}

export function getDefaultWarbandContextState(): WarbandContextState {
  return {
    activeWarbandID: '',
    memberEntityIdToCharacterId: {},
    memberCharacterIdToMemberState: {},

    refetch: () => {},
  }
}

export const WarbandContext = React.createContext(getDefaultWarbandContextState());

export class WarbandContextProvider extends React.Component<Props, WarbandContextState> {
  public static notificationEventName = 'warband-notification';
  public static updateEventName = 'warband-update';
  private graphql: GraphQLResult<WarbandContextQuery.Query>;
  constructor(props: Props) {
    super(props);
    this.state = getDefaultWarbandContextState();
  }

  public render() {
    return (
      <WarbandContext.Provider value={{ ...this.state, refetch: this.graphql ? this.graphql.refetch : () => {} }}>
        <GraphQL
          query={{
            query: warbandQuery,
            operationName: "warband-context"
          }}
          onQueryResult={this.handleWarbandQueryResult}
          subscription={{
            query: notificationSubscription,
            operationName: "group-notification-sub",
            initPayload: defaultSubscriptionOpts().initPayload,
          }}
          subscriptionHandler={this.handleNotificationSubscription}
        />
        <GraphQL
          subscription={{
            query: updateSubscription,
            operationName: "active-warband-sub",
            initPayload: defaultSubscriptionOpts().initPayload,
          }}
          subscriptionHandler={this.handleUpdateSubscription}
        />
        {this.props.children}
      </WarbandContext.Provider>
    );
  }

  private handleWarbandQueryResult = (graphql: GraphQLResult<WarbandContextQuery.Query>) => {
    this.graphql = graphql;
    if (!graphql.data || !graphql.data.myActiveWarband) return graphql;

    const memberEntityIdToCharacterId = {};
    const memberCharacterIdToMemberState = {};
    graphql.data.myActiveWarband.members.forEach((member) => {
      memberEntityIdToCharacterId[member.entityID] = member.characterID;
      memberCharacterIdToMemberState[member.characterID] = member;
    });

    this.setState({
      activeWarbandID: graphql.data.myActiveWarband.info ? graphql.data.myActiveWarband.info.id : '',
      memberCharacterIdToMemberState,
      memberEntityIdToCharacterId,
    });
 }

  private handleNotificationSubscription = (result: SubscriptionResult<WarbandNotificationSubscription.Subscription>,
                                            data: any) => {
    if (!result.data) return data;

    const notification = result.data.myGroupNotifications;
    if (notification.groupType === 'Warband') {
      switch (notification.type) {
        case GroupNotificationType.Removed: {
          game.trigger('chat-leave-room', notification.groupID);
          this.setState({ activeWarbandID: '', memberCharacterIdToMemberState: {}, memberEntityIdToCharacterId: {} });
          break;
        }
        case GroupNotificationType.Joined: {
          this.setState({ activeWarbandID: notification.groupID });
          this.graphql.refetch();
          break;
        }
      }

      game.trigger(WarbandContextProvider.notificationEventName, notification);
    }

    return data;
  }

  private handleUpdateSubscription = (result: SubscriptionResult<WarbandUpdateSubscription.Subscription>,
                                      data: any) => {
    if (!result.data) return data;

    const update = result.data.activeGroupUpdates;
    game.trigger(WarbandContextProvider.updateEventName, update);

    switch(update.updateType) {
      case GroupUpdateType.MemberUpdate:
      case GroupUpdateType.MemberJoined: {
        const memberEntityIdToCharacterId = { ...this.state.memberEntityIdToCharacterId };
        const memberCharacterIdToMemberState = { ...this.state.memberCharacterIdToMemberState };
        try {
          const member: GroupMemberState = JSON.parse((update as GroupMemberUpdate).memberState);
          memberEntityIdToCharacterId[member.entityID] = member.characterID;
          memberCharacterIdToMemberState[member.characterID] = member;
          this.setState({ activeWarbandID: update.groupID, memberCharacterIdToMemberState, memberEntityIdToCharacterId });
        } catch(e) {
          console.error('There was an error updating warband member');
        }
        break;
      }

      case GroupUpdateType.MemberRemoved: {
        const memberEntityIdToCharacterId = { ...this.state.memberEntityIdToCharacterId };
        const memberCharacterIdToMemberState = { ...this.state.memberCharacterIdToMemberState };
        const characterId = (update as GroupMemberRemovedUpdate).characterID;
        const entityId = memberCharacterIdToMemberState[characterId].entityID;

        delete memberEntityIdToCharacterId[entityId];
        delete memberCharacterIdToMemberState[characterId];
        this.setState({ memberCharacterIdToMemberState, memberEntityIdToCharacterId });
        break;
      }
    }
  }
}
