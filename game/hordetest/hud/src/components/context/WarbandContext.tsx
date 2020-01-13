/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import {
  GroupNotification,
  GroupNotificationType,
  GroupTypes,
  IGroupUpdate,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
} from '@csegames/library/lib/hordetest/graphql/schema';
import { GraphQLActiveWarband } from '@csegames/library/lib/hordetest/graphql/schema';

export function onGroupNotification(callback: (myGroupNotifications: GroupNotification) => any): EventHandle {
  return game.on('subscription-groupNotification', callback);
}

export function onActiveGroupUpdate(callback: (activeGroupUpdates: IGroupUpdate) => any): EventHandle {
  return game.on('subscription-activeGroupUpdates', callback);
}

const warbandNotificationSubscription = gql`
  subscription WarbandNotificationSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;

const warbandUpdatesSubscription = gql`
  subscription WarbandUpdateSubscription($groupID: String!) {
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

const warbandQuery = gql`
  query MyActiveWarband {
    myActiveWarband {
      info {
        id
      }

      members {
        characterID
        classID
        race
        name
        isLeader
        isReady
      }
    }
  }
`;

export interface PartialGroupMemberState {
  characterID: string;
  name: string;
  classID: Archetype;
  isLeader: boolean;
  isReady: boolean;
}

export interface WarbandContextState {
  groupID: string;
  groupMembers: { [characterID: string]: PartialGroupMemberState };
}

const getDefaultWarbandContextState = (): WarbandContextState => ({
  groupID: '',
  groupMembers: {},
});

export const WarbandContext = React.createContext(getDefaultWarbandContextState());

interface NotificationSubscriptionResult {
  myGroupNotifications: GroupNotification;
}

interface UpdateSubscriptionResult {
  activeGroupUpdates: IGroupUpdate;
}

export class WarbandContextProvider extends React.Component<{}, WarbandContextState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultWarbandContextState();
  }

  public render() {
    return (
      <WarbandContext.Provider value={this.state}>
        <GraphQL
          query={warbandQuery}
          onQueryResult={this.handleWarbandQueryResult}
          subscription={{
            query: warbandNotificationSubscription,
            initPayload: {
              characterID: hordetest.game.selfPlayerState.characterID,
              token: game.accessToken,
              shardID: game.shardID,
            },
          }}
          subscriptionHandler={this.handleNotificationSubscription}
        />
        {this.state.groupID &&
          <GraphQL
            query={warbandQuery}
            onQueryResult={this.handleWarbandQueryResult}
            subscription={{
              query: warbandUpdatesSubscription,
              variables: {
                groupID: this.state.groupID,
              },
              initPayload: {
                characterID: hordetest.game.selfPlayerState.characterID,
                token: game.accessToken,
                shardID: game.shardID,
              },
            }}
            subscriptionHandler={this.handleUpdateSubscription}
          />
        }

        {this.props.children}
      </WarbandContext.Provider>
    );
  }

  private handleNotificationSubscription = (result: SubscriptionResult<NotificationSubscriptionResult>, data: any) => {
    if (!result.data && !result.data.myGroupNotifications) return data;

    // We should only get updates about warbands
    const notification = result.data.myGroupNotifications;
    game.trigger('subscription-groupNotification', notification);
    if (notification.groupType !== GroupTypes.Warband) return data;

    switch (notification.type) {
      case GroupNotificationType.Joined: {
        this.setState({ groupID: notification.groupID });
        break;
      }
      case GroupNotificationType.Removed: {
        this.setState(getDefaultWarbandContextState());
        break;
      }
    }
  }

  private handleUpdateSubscription = (result: SubscriptionResult<UpdateSubscriptionResult>, data: any) => {
    if (!result.data && !result.data.activeGroupUpdates) return data;

    const update = result.data.activeGroupUpdates;
    game.trigger('subscription-activeGroupUpdates', update);

    switch (update.updateType) {
      case GroupUpdateType.MemberJoined:
      case GroupUpdateType.MemberUpdate: {
        const memberState: PartialGroupMemberState = JSON.parse((update as GroupMemberUpdate).memberState);
        const groupMembers = { ...this.state.groupMembers };
        groupMembers[memberState.characterID] = memberState;
        this.setState({ groupMembers });
        break;
      }

      case GroupUpdateType.MemberRemoved: {
        const groupMembers = { ...this.state.groupMembers };
        delete groupMembers[(update as GroupMemberRemovedUpdate).characterID];
        this.setState({ groupMembers });
        break;
      }
    }
  }

  private handleWarbandQueryResult = (query: GraphQLResult<{ myActiveWarband: GraphQLActiveWarband }>) => {
    if (!query || !query.data || !query.data.myActiveWarband || !query.data.myActiveWarband.info) return query;

    const warband = query.data.myActiveWarband;
    const groupMembers = {};

    warband.members.forEach((member) => {
      groupMembers[member.characterID] = member;
    });

    this.setState({ groupID: warband.info.id, groupMembers });
    return query;
  }
}
