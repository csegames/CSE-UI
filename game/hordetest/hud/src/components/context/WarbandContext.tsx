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
import { preloadQueryEvents } from '../fullscreen/Preloader';

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
        championID
        costumeID
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
  championID: string;
  costumeID: string;
}

export interface ContextState {
  groupID: string;
  groupMembers: { [characterID: string]: PartialGroupMemberState };
}

interface ContextFunctions {
  reset: () => void;
  refetch: () => void;
}

export type WarbandContextState = ContextState & ContextFunctions;

export const getDefaultWarbandContextState = (): ContextState => ({
  groupID: '',
  groupMembers: {},
});

export const WarbandContext = React.createContext({
  ...getDefaultWarbandContextState(),
  reset: () => {},
  refetch: () => {},
});

interface NotificationSubscriptionResult {
  myGroupNotifications: GroupNotification;
}

interface UpdateSubscriptionResult {
  activeGroupUpdates: IGroupUpdate;
}

export class WarbandContextProvider extends React.Component<{}, ContextState> {
  private graphql: GraphQLResult<{ myActiveWarband: GraphQLActiveWarband }>;
  private isInitialQuery: boolean = true;
  private refetchHandle: number;
  private lastCharacterID: string;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultWarbandContextState();
  }


  public render() {
    console.log(`re-render warband context provider`);
    this.lastCharacterID = game.characterID;
    return (
      <WarbandContext.Provider value={{ ...this.state, reset: this.reset, refetch: this.refetch }}>
        <GraphQL
          query={warbandQuery}
          onQueryResult={this.handleQueryResult}
          subscription={{
            query: warbandNotificationSubscription,
            initPayload: {
              characterID: this.lastCharacterID,
              token: game.accessToken,
            },
          }}
          subscriptionHandler={this.handleNotificationSubscription}
        />
        {this.state.groupID &&
          <GraphQL
            subscription={{
              query: warbandUpdatesSubscription,
              initPayload: {
                characterID: this.lastCharacterID,
                token: game.accessToken,
              },
            }}
            subscriptionHandler={this.handleUpdateSubscription}
          />
        }

        {this.props.children}
      </WarbandContext.Provider>
    );
  }

  public componentWillUnmount() {
    if (this.refetchHandle) {
      window.clearTimeout(this.refetchHandle);
    }
  }

  private refetch = () => {
    if (this.graphql) {
      this.graphql.refetch();
    }
  }

  private reset = () => {
    this.setState({ ...getDefaultWarbandContextState() });
  }

  private triggerGroupNotificationEvent = (notification: GroupNotification) => {
    game.trigger('subscription-groupNotification', notification);
  }

  private triggerActiveGroupUpdatesEvent = (update: GroupMemberUpdate | GroupMemberRemovedUpdate) => {
    game.trigger('subscription-activeGroupUpdates', update);
  }

  private handleNotificationSubscription = (result: SubscriptionResult<NotificationSubscriptionResult>, data: any) => {
    if (!result || !result.data || !result.data.myGroupNotifications) return data;

    // We should only get updates about warbands
    const notification = result.data.myGroupNotifications;
    game.trigger('subscription-groupNotification', notification);
    if (notification.groupType !== GroupTypes.Warband) {
      return data;
    }

    switch (notification.type) {
      case GroupNotificationType.Joined: {
        this.handleNotificationJoined(notification, () => this.triggerGroupNotificationEvent(notification));
        break;
      }
      case GroupNotificationType.Removed: {
        this.handleNotificationRemoved(notification, () => this.triggerGroupNotificationEvent(notification));
        break;
      }
    }
  }

  private handleUpdateSubscription = (result: SubscriptionResult<UpdateSubscriptionResult>, data: any) => {
    if (!result || !result.data || !result.data.activeGroupUpdates) return data;

    const update = result.data.activeGroupUpdates;
    if (update.groupID !== this.state.groupID) {
      return;
    }

    switch (update.updateType) {
      case GroupUpdateType.MemberJoined:
      case GroupUpdateType.MemberUpdate: {
        this.handleUpdateMemberUpdate(update as GroupMemberUpdate, () => this.triggerActiveGroupUpdatesEvent(update));
        break;
      }

      case GroupUpdateType.MemberRemoved: {
        this.handleUpdateMemberRemoved(update as GroupMemberRemovedUpdate, () => this.triggerActiveGroupUpdatesEvent(update));
        break;
      }
    }
  }

  private handleQueryResult = (query: GraphQLResult<{ myActiveWarband: GraphQLActiveWarband }>) => {
    if (!query || !query.data) {
      // Query failed but we don't want to hold up loading. In future, handle this a little better,
      // maybe try to refetch a couple times and if not then just continue on the flow.
      this.onDonePreloading(false);
      return query;
    }

    this.graphql = query;

    
    if (!query.data.myActiveWarband || !query.data.myActiveWarband.info || !query.data.myActiveWarband.members) {
      this.onDonePreloading(true);
      return query;
    }

    if (this.lastCharacterID === "") 
    {
      console.log('forcing update');
      this.refetchHandle = window.setTimeout(() => this.forceUpdate(), 2000);
    }


    const warband = query.data.myActiveWarband;
    const groupMembers = {};

    warband.members.forEach((member) => {
      groupMembers[member.characterID] = member;
    });

    this.setState({ groupID: warband.info.id, groupMembers });
    this.onDonePreloading(true);
    return query;
  }

  private handleNotificationJoined = (notification: GroupNotification, onDone: () => void) => {
    if (!notification ||
        notification.type !== GroupNotificationType.Joined ||
        notification.groupType !== GroupTypes.Warband) {
      console.error('Tried to call handleNotificationJoined with an invalid notification');
      onDone();
      return;
    }

    this.setState({ groupID: notification.groupID }, onDone);
  }

  private handleNotificationRemoved = (notification: GroupNotification, onDone: () => void) => {
    if (!notification ||
        notification.type !== GroupNotificationType.Removed ||
        notification.groupType !== GroupTypes.Warband) {
      console.error('Tried to call handleNotificationRemoved with an invalid notification');
      onDone();
      return;
    }

    this.setState({ ...getDefaultWarbandContextState() }, onDone);
  }

  private handleUpdateMemberUpdate = (update: GroupMemberUpdate, onDone: () => void) => {
    if (!update ||
        (update.updateType !== GroupUpdateType.MemberJoined && update.updateType !== GroupUpdateType.MemberUpdate)) {
      console.error('Tried to call handleUpdateMemberUpdate with an invalid update');
      onDone();
      return;
    }

    try {
      const memberState = JSON.parse((update as GroupMemberUpdate).memberState);
      const groupMembers = { ...this.state.groupMembers };
      groupMembers[memberState.characterID] = memberState;
      this.setState({ groupMembers }, onDone);
    } catch (e) {
      console.error(e);
      onDone();
    }
  }

  private handleUpdateMemberRemoved = (update: GroupMemberRemovedUpdate, onDone: () => void) => {
    if (!update || update.updateType !== GroupUpdateType.MemberRemoved) {
      console.error('Tried to call handleUpdateMemberRemoved with an invalid update');
      onDone();
      return;
    }

    const groupMembers = { ...this.state.groupMembers };
    delete groupMembers[(update as GroupMemberRemovedUpdate).characterID];
    this.setState({ groupMembers }, onDone);
  }

  private onDonePreloading = (isSuccessful: boolean) => {
    if (this.isInitialQuery) {
      game.trigger(preloadQueryEvents.warbandContext, isSuccessful);
      this.isInitialQuery = false;
    }
  }
}
