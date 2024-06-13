/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
  OfferPermissionSettings,
  OfferSummary,
  Group,
  Invitation
} from '@csegames/library/dist/hordetest/graphql/schema';
import { TeamJoinCurrentStatusQueryResult } from '../dataSources/teamJoinNetworkingConstants';
import * as React from 'react';
import { TeamJoinAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { convertServerTimeToLocalTime } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { lobbyLocalStore } from '../localStorage/lobbyLocalStorage';
import { webConf } from '../dataSources/networkConfiguration';

const StringIDGroupsNotificationAccept = 'GroupsNotificationAccept';
const StringIDGroupsNotificationDecline = 'GroupsNotificationDecline';
const StringIDGroupsNotificationInviteDescription = 'GroupsNotificationInviteDescription';

export const TutorialQueueID = 'tutorial';

interface TeamJoinState {
  defaultGroupCapacity: number;
  group: Group;
  groupOfferPermissions: OfferPermissionSettings;
  groupOffers: OfferSummary;
  selectedGroupMemberIndex: number;
  notifications: NotificationData[];
  hasClickedInvite: boolean;
}

// Notification text could be a string or JSX element to make formatting easy
export type NotificationContent = string | JSX.Element | JSX.Element[];

// An action that can be performed from a notification message
// (eg. a notification that the player has an available invite would have "invite" and "cancel" actions)
export interface NotificationAction {
  type: 'accept' | 'decline' | 'other';
  createText: (stringTable: Dictionary<StringTableEntryDef>) => NotificationContent;
  onClick?: () => void;
  hideAfterClick?: boolean; // if not specified, defaults to true
  disabled?: boolean;
}

export interface NotificationData {
  id: number;
  offerId?: string; // Id of any Invitation associated with this notif.
  createText: (stringTable: Dictionary<StringTableEntryDef>) => NotificationContent;
  expiryTimestamp: number;
  actions?: NotificationAction[];
  debugMessage?: boolean;
}

let nextNotificationId: number = 0;
export function createNotification(payload: Partial<NotificationData>, durationMS: number = 30000): NotificationData {
  let createText = payload.createText;
  if (!createText) {
    createText = (stringTable) => '';
  }

  return {
    ...payload,
    id: nextNotificationId++,
    createText: createText,
    expiryTimestamp: Date.now() + durationMS
  };
}

export function createInviteNotification(invite: Invitation, serverTimeDeltaMS: number): NotificationData {
  const actions: NotificationAction[] = [
    {
      type: 'accept',
      createText: (stringTable) => getStringTableValue(StringIDGroupsNotificationAccept, stringTable),
      onClick: async () => {
        TeamJoinAPI.AcceptInvitationV1(webConf, invite.from.id);
      },
      hideAfterClick: true,
      disabled: false
    },
    {
      type: 'decline',
      createText: (stringTable) => getStringTableValue(StringIDGroupsNotificationDecline, stringTable),
      onClick: async () => {
        TeamJoinAPI.RejectInvitationV1(webConf, invite.from.id);
      },
      hideAfterClick: true,
      disabled: false
    }
  ];

  const newNotif = createNotification({
    offerId: buildOfferId(invite),
    createText: (stringTable) => (
      <>
        <b>{invite.from.displayName}</b>
        <div dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
        {getStringTableValue(StringIDGroupsNotificationInviteDescription, stringTable)}
      </>
    ),
    // UTC Timestamp.
    actions
  });
  newNotif.expiryTimestamp = convertServerTimeToLocalTime(new Date(invite.expires).valueOf(), serverTimeDeltaMS);

  return newNotif;
}

export function buildOfferId(invite: Invitation): string {
  return `${invite.from.id}_${invite.to.id}`;
}

function generateDefaultTeamJoinState() {
  const defaultTeamJoinState: TeamJoinState = {
    defaultGroupCapacity: 8,
    group: null,
    groupOfferPermissions: {
      allowApplications: true,
      allowInvitations: true,
      alwaysAllowed: [],
      blocked: [],
      player: {
        defaultChampion: null,
        displayName: null,
        id: null
      },
      revision: null
    },
    groupOffers: {
      applications: [],
      invitations: [],
      player: {
        defaultChampion: null,
        displayName: null,
        id: null
      }
    },
    hasClickedInvite: lobbyLocalStore.getHasClickedInvite(),
    selectedGroupMemberIndex: -1,
    notifications: []
  };

  return defaultTeamJoinState;
}

export const teamJoinSlice = createSlice({
  name: 'teamJoin',
  initialState: generateDefaultTeamJoinState(),
  reducers: {
    addNotifications: (state: TeamJoinState, action: PayloadAction<NotificationData[]>) => {
      state.notifications.push(...action.payload);
    },
    removeNotifications: (state: TeamJoinState, action: PayloadAction<number[]>) => {
      state.notifications = state.notifications.filter((notif) => {
        return action.payload.indexOf(notif.id) === -1;
      });
    },
    updateTeamJoinCurrentState: (state: TeamJoinState, action: PayloadAction<TeamJoinCurrentStatusQueryResult>) => {
      state.group = action.payload.group;
      state.groupOffers = action.payload.groupOffers;
    },
    updateTeamJoinPermissions: (state: TeamJoinState, action: PayloadAction<Partial<OfferPermissionSettings>>) => {
      state.groupOfferPermissions = {
        ...state.groupOfferPermissions,
        ...action.payload
      };
    },
    addOrUpdateInvitation: (state: TeamJoinState, action: PayloadAction<Invitation>) => {
      const offerId = buildOfferId(action.payload);

      // If the invite already existed, we'll replace it.
      let offerIndex = state.groupOffers.invitations.findIndex((invite) => {
        return buildOfferId(invite) === offerId;
      });

      if (offerIndex === -1) {
        state.groupOffers.invitations.push(action.payload);
      } else {
        state.groupOffers.invitations[offerIndex] = action.payload;
      }
    },
    removeInvitation: (state: TeamJoinState, action: PayloadAction<string>) => {
      // Payload is the offerId of the invitation. See buildOfferId().

      // If the invite was present, we'll remove it.
      // Was it in groupOffers?
      if (state.groupOffers) {
        const groupOfferInvitations =
          state.groupOffers.invitations?.filter((invite) => {
            return buildOfferId(invite) !== action.payload;
          }) ?? [];
        state.groupOffers.invitations = groupOfferInvitations;
      }

      // Was it in group?
      if (state.group) {
        const groupInvitations =
          state.group.invitations?.filter((invite) => {
            return buildOfferId(invite) !== action.payload;
          }) ?? [];
        // Should be 0 or -1.  Size value includes both Members and Invitations.
        const sizeDelta: number = groupInvitations.length - (state.group.invitations?.length ?? 0);

        state.group.invitations = groupInvitations;
        state.group.size += sizeDelta;
      }
    },
    updateGroupState: (state: TeamJoinState, action: PayloadAction<Group>) => {
      state.group = action.payload;
    },
    updateDoNotDisturb: (state: TeamJoinState, action: PayloadAction<boolean>) => {
      if (state.groupOfferPermissions.allowApplications === action.payload) {
        state.groupOfferPermissions.allowApplications = !action.payload;
        state.groupOfferPermissions.allowInvitations = !action.payload;
      }
    },
    updateSelectedGroupMember: (state: TeamJoinState, action: PayloadAction<number>) => {
      state.selectedGroupMemberIndex = action.payload;
    },
    setHasClickedInvite: (state: TeamJoinState) => {
      state.hasClickedInvite = true;
    }
  }
});

export const {
  addNotifications,
  removeNotifications,
  updateTeamJoinCurrentState,
  updateTeamJoinPermissions,
  addOrUpdateInvitation,
  removeInvitation,
  setHasClickedInvite,
  updateGroupState,
  updateDoNotDisturb,
  updateSelectedGroupMember
} = teamJoinSlice.actions;
