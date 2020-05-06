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
import {
  setActiveWarbandID,
  onWarbandMemberUpdate,
  onWarbandMemberRemoved,
} from 'actions/warband';

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
  memberIdToMemberState: { [characterId: string]: GroupMemberState };
}

export function getDefaultWarbandContextState(): WarbandContextState {
  return {
    activeWarbandID: '',
    memberIdToMemberState: {},
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
      <WarbandContext.Provider value={this.state}>
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
    if (!graphql.data || !graphql.data.myActiveWarband || !graphql.data.myActiveWarband.info) return graphql;

    const memberIdToMemberState = {};
    graphql.data.myActiveWarband.members.forEach((member) => {
      memberIdToMemberState[member.characterID] = member;
      onWarbandMemberUpdate(member as GroupMemberState);
    });

    setActiveWarbandID(graphql.data.myActiveWarband.info.id);
    this.setState({ activeWarbandID: graphql.data.myActiveWarband.info.id, memberIdToMemberState });
 }

  private handleNotificationSubscription = (result: SubscriptionResult<WarbandNotificationSubscription.Subscription>,
                                            data: any) => {
    if (!result.data) return data;

    const notification = result.data.myGroupNotifications;
    if (notification.groupType === 'Warband') {
      switch (notification.type) {
        case GroupNotificationType.Removed: {
          game.trigger('chat-leave-room', notification.groupID);

          Object.keys(this.state.memberIdToMemberState).forEach((memberId) => {
            onWarbandMemberRemoved(memberId);
          });

          this.setState({ activeWarbandID: '', memberIdToMemberState: {} });
          setActiveWarbandID(null);
          break;
        }
        case GroupNotificationType.Joined: {
          this.setState({ activeWarbandID: notification.groupID });
          setActiveWarbandID(notification.groupID);
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
        const memberIdToMemberState = { ...this.state.memberIdToMemberState };
        try {
          const member: GroupMemberState = JSON.parse((update as GroupMemberUpdate).memberState);
          memberIdToMemberState[member.characterID] = member;
          onWarbandMemberUpdate(member);
          setActiveWarbandID(update.groupID);
          this.setState({ memberIdToMemberState });
        } catch(e) {
          console.error('There was an error updating warband member');
        }
        break;
      }

      case GroupUpdateType.MemberRemoved: {
        const memberIdToMemberState = { ...this.state.memberIdToMemberState };
        const characterId = (update as GroupMemberRemovedUpdate).characterID;
        delete memberIdToMemberState[characterId];
        onWarbandMemberRemoved(characterId);
        this.setState({ memberIdToMemberState });
        break;
      }
    }
  }
}
