/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
  updateTeamJoinCurrentState,
  updateGroupState,
  NotificationData,
  createInviteNotification,
  addNotifications,
  updateTeamJoinPermissions,
  addOrUpdateInvitation,
  removeInvitation,
  removeNotifications,
  buildOfferId,
  createNotification,
  NotificationContent
} from '../redux/teamJoinSlice';
import {
  currentStateQuery,
  groupOffersSubscription,
  GroupOffersSubscriptionResult,
  groupSubscription,
  GroupSubscriptionResult,
  TeamJoinCurrentStatusQueryResult
} from './teamJoinNetworkingConstants';
import ExternalDataSource from '../redux/externalDataSource';
import {
  Group,
  GroupUpdate,
  Invitation,
  Member,
  OfferEvent,
  OfferPermissionSettings,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { getAccountID } from '@csegames/library/dist/_baseGame/utils/accountUtils';
import { game } from '@csegames/library/dist/_baseGame';
import { BooleanOption } from '@csegames/library/dist/_baseGame/types/Options';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { getStringTableValue, getTokenizedStringTableValue } from '../helpers/stringTableHelpers';
import { RootState } from '../redux/store';
import { GameOptionIDs } from '../redux/gameOptionsSlice';

const StringIDGroupsNotificationGroupDisbanded = 'GroupsNotificationGroupDisbanded';
const StringIDGroupsNotificationJoined = 'GroupsNotificationJoined';
const StringIDGroupsNotificationLeft = 'GroupsNotificationLeft';
const StringIDGroupsNotificationKicked = 'GroupsNotificationKicked';
const StringIDGroupsNotificationYouKicked = 'GroupsNotificationYouKicked';
const StringIDGroupsNotificationDisconnected = 'GroupsNotificationDisconnected';
const StringIDGroupsNotificationDeclined = 'GroupsNotificationDeclined';
const StringIDTeamJoinPanelExpiredInvite = 'TeamJoinPanelExpiredInvite';

export class TeamJoinNetworkingService extends ExternalDataSource {
  // To track expiry of invitations sent by the local user.
  private invitationClock: NodeJS.Timeout;
  // The id of the recipient of the next expiring invitation.
  private nextExpiringInvitationTargetID: string;

  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<TeamJoinCurrentStatusQueryResult>(
        { query: currentStateQuery },
        this.handleCurrentStatusQueryResult.bind(this)
      ),
      await this.subscribe<GroupOffersSubscriptionResult>(
        { operationName: 'groups', query: groupOffersSubscription },
        (result: GroupOffersSubscriptionResult) => {
          if (result?.groupOffers?.isInvite) {
            this.handleGroupOffersSubscriptionResult(result.groupOffers);
          } else {
            console.warn('Got invalid response from TeamJoin GroupOffers subscription.', result);
          }
        }
      ),
      await this.subscribe<GroupSubscriptionResult>(
        { operationName: 'offers', query: groupSubscription },
        (result: GroupSubscriptionResult) => {
          this.handleGroupSubscriptionResult(result.group);
        }
      ),
      this.onInitialize(this.refresh.bind(this))
    ];
  }

  private handleCurrentStatusQueryResult(result: TeamJoinCurrentStatusQueryResult): void {
    // Apply permission updates (if any).
    if (result.groupOfferPermissions) {
      this.dispatch(updateTeamJoinPermissions(result.groupOfferPermissions));
      // The "Options" system is managed by the game client, but we consider the server to be authoritative
      // for TeamJoin-related settings, so we will update the client's copy of data whenever the server tells
      // us something different.
      this.updateClientSettingsToMatch(result.groupOfferPermissions);
    } else {
      console.warn('Received invalid groupOfferPermissions from TeamJoin fetch.');
    }

    // Update Group and Offers.
    this.dispatch(updateTeamJoinCurrentState(result));

    // Queue up an invite notif for each pending invitation.
    const invites: NotificationData[] = [];
    result.groupOffers.invitations?.forEach((invite: Invitation) => {
      // But we can skip any that expired already due to latency.
      if (new Date(invite.expires).valueOf() > getServerTimeMS(this.reduxState.clock.serverTimeDeltaMS)) {
        invites.push(createInviteNotification(invite, this.reduxState.clock.serverTimeDeltaMS));
      }
    });
    this.dispatch(addNotifications(invites));
  }

  private handleGroupOffersSubscriptionResult(event: OfferEvent): void {
    const { hasEnded, expires, from, sent, to } = event;
    const invite = { expires, from, sent, to };

    const offerID = buildOfferId(invite);

    this.checkAndRemoveExistingNotif(offerID);
    if (hasEnded) {
      this.dispatch(removeInvitation(offerID));
    } else {
      // Create or update the Offer for local storage.
      this.dispatch(addOrUpdateInvitation(invite));
      // Add a new invitation notif to the queue.
      this.dispatch(addNotifications([createInviteNotification(invite, this.reduxState.clock.serverTimeDeltaMS)]));
    }
  }

  private checkAndRemoveExistingNotif(offerID: string) {
    for (let notification of this.reduxState.teamJoin.notifications) {
      if (notification.offerId === offerID) {
        this.dispatch(removeNotifications([notification.id]));
        break;
      }
    }
  }

  private handleGroupSubscriptionResult(newGroup: Group | null): void {
    this.dispatch(updateGroupState(newGroup));

    const oldGroup = this.reduxState.teamJoin.group;
    if (!oldGroup) {
      // If the previous group state was "no group", we don't need to create notifs.
      // The user will just see the group appear (because they clicked Accept on an invite).
      // Same if the user transitioned from one group to another (merged groups, or server shenanigans),
      return;
    }

    if (!newGroup) {
      // If we transition directly from a group we were a member of to a null group, that means either
      // that the group was disbanded deliberately, or else the server exploded and killed ALL groups.
      // In either case, we can show the 'disbanded' notif to this user.
      this.dispatch(
        addNotifications([
          createNotification({
            createText: (stringTable) => getStringTableValue(StringIDGroupsNotificationGroupDisbanded, stringTable)
          })
        ])
      );
    }

    if (oldGroup.id !== newGroup.id) {
      // Having swapped groups, we can't build a delta, so move on without trying to build a specific
      // listing of changes.
      return;
    }

    const newNotifs: NotificationData[] = [];

    // The updateLog has a max size of 50, at which point it erases from the front to make room at the back.
    // So we just need to look at the new entries at the back to generate notifs.
    const numChanges = newGroup.totalChanges - oldGroup.totalChanges;
    for (let i = newGroup.updateLog.length - numChanges; i < newGroup.updateLog.length; ++i) {
      const change: GroupUpdate = newGroup.updateLog[i];
      let notifText: (stringTable: Dictionary<StringTableEntryDef>) => NotificationContent = null;

      switch (change.action) {
        case 'Joined':
          if (change.target.id !== getAccountID(game.accessToken)) {
            notifText = (stringTable) =>
              getTokenizedStringTableValue(StringIDGroupsNotificationJoined, stringTable, {
                NAME: change.target.displayName
              });
          }
          break;
        case 'Left':
          if (change.target.id !== getAccountID(game.accessToken)) {
            notifText = (stringTable) =>
              getTokenizedStringTableValue(StringIDGroupsNotificationLeft, stringTable, {
                NAME: change.target.displayName
              });
          }
          break;
        case 'Kicked':
          if (change.target.id !== getAccountID(game.accessToken)) {
            notifText = (stringTable) =>
              getTokenizedStringTableValue(StringIDGroupsNotificationKicked, stringTable, {
                NAME: change.target.displayName
              });
          } else {
            notifText = (stringTable) => getStringTableValue(StringIDGroupsNotificationYouKicked, stringTable);
          }
          break;
        case 'Disbanded':
          notifText = (stringTable) => getStringTableValue(StringIDGroupsNotificationGroupDisbanded, stringTable);
          break;
        case 'Promoted': // No notif when changing the Leader.
        default:
          break;
      }

      if (notifText) {
        newNotifs.push(createNotification({ createText: notifText }));
      }
    }

    // If there were no official changes, check for rejected invites and disconnects.  Rejections trigger a
    // subscription update, but do not add anything to the updateLog.  Same for disconnects.
    if (numChanges === 0) {
      const disconnects: Member[] = newGroup.members.filter((member) => {
        if (member.isOnline) {
          return false;
        }
        // Member is currently offline.
        const prevState = oldGroup.members.find((prevMember) => {
          return prevMember.id === member.id;
        });
        if (prevState) {
          // And member was previously online, so they just now disconnected.
          return prevState.isOnline;
        }
      });

      disconnects.forEach((member) => {
        newNotifs.push(
          createNotification({
            createText: (stringTable) =>
              getTokenizedStringTableValue(StringIDGroupsNotificationDisconnected, stringTable, {
                NAME: member.displayName
              })
          })
        );
      });

      const rejectedInvites: Invitation[] = oldGroup.invitations.filter((oldInvite) => {
        return (
          // Making a list of all invites from the previous state that are not contained
          // in the new state.
          newGroup.invitations.find((newInvite) => {
            return newInvite.to.id === oldInvite.to.id;
          }) === undefined
        );
      });

      rejectedInvites.forEach((rejectedInvite) => {
        if (rejectedInvite.from.id === getAccountID(game.accessToken)) {
          newNotifs.push(
            createNotification({
              createText: (stringTable) =>
                getTokenizedStringTableValue(StringIDGroupsNotificationDeclined, stringTable, {
                  NAME: rejectedInvite.to.displayName
                })
            })
          );
        }
      });
    }

    this.dispatch(addNotifications(newNotifs));
  }

  private refresh(): void {
    this.query<TeamJoinCurrentStatusQueryResult>(
      { query: currentStateQuery },
      this.handleCurrentStatusQueryResult.bind(this)
    );
  }

  private async updateClientSettingsToMatch(offerSettings: OfferPermissionSettings): Promise<void> {
    const dndOpt: any = this.reduxState.gameOptions.gameOptions[GameOptionIDs.DoNotDisturb];
    const clientDND: boolean = dndOpt && typeof dndOpt.value === 'boolean' && dndOpt.value;
    const serverDND: boolean = offerSettings && !offerSettings.allowInvitations;

    if (dndOpt && clientDND !== serverDND) {
      const updatedOption: BooleanOption = {
        name: dndOpt.name,
        displayName: dndOpt.displayName,
        category: dndOpt.category,
        kind: dndOpt.kind,
        value: serverDND,
        defaultValue: false
      };
      const result = await game.setOptionsAsync([updatedOption]);
      if (!result.success) {
        console.warn('SetOptionsAsync failed to apply all requested changes from the server.', result);
      }
    }
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();

    if (this.invitationClock) {
      clearInterval(this.invitationClock);
      this.invitationClock = null;
    }
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);

    this.startInvitationTimeoutIfNeeded();
  }

  private startInvitationTimeoutIfNeeded(): void {
    // If there are active invitations, we want to set a timeout to schedule the next expiry notif.
    const hasInvitations = (this.reduxState.teamJoin.group?.invitations?.length ?? 0) > 0;
    if (hasInvitations) {
      // Find the next invitation that will expire and set a timeout for it.
      const nextInvitation = this.getNextExpiringInvitation();
      // If we're already waiting on that invitation to expire, we don't have to do anything yet.
      if (nextInvitation && nextInvitation.to.id !== this.nextExpiringInvitationTargetID) {
        if (this.invitationClock) {
          clearInterval(this.invitationClock);
          this.invitationClock = null;
        }
        // Wait at least until the next frame, even if the invitation already expired since we found it.
        const expiryDeltaMS = Math.max(
          1,
          new Date(nextInvitation.expires).getTime() - getServerTimeMS(this.reduxState.clock.serverTimeDeltaMS)
        );
        this.invitationClock = setTimeout(this.onInvitationTimeout.bind(this), expiryDeltaMS);
        this.nextExpiringInvitationTargetID = nextInvitation.to.id;
      }
    } else if (this.invitationClock) {
      clearInterval(this.invitationClock);
      this.invitationClock = null;
      this.nextExpiringInvitationTargetID = '';
    }
  }

  private getNextExpiringInvitation(): Invitation | null {
    let nextInvitation: Invitation | null = null;
    let prevExpiry: number = Number.MAX_SAFE_INTEGER;
    this.reduxState.teamJoin.group?.invitations?.forEach((invitation) => {
      // We only care about invitations sent by the local player.
      if (invitation.from.id === getAccountID(game.accessToken)) {
        const expiry = new Date(invitation.expires).getTime();
        // Start with the first invitation, then replace if the new one expires sooner.
        if (!nextInvitation || expiry < prevExpiry) {
          nextInvitation = invitation;
          prevExpiry = expiry;
        }
      }
    });
    return nextInvitation;
  }

  private onInvitationTimeout(): void {
    this.reduxState.teamJoin.group?.invitations?.forEach((invitation) => {
      // If there are any expired invitations, we have to clean up.
      if (new Date(invitation.expires).getTime() < getServerTimeMS(this.reduxState.clock.serverTimeDeltaMS)) {
        if (this.reduxState.teamJoin.group.size === 2) {
          this.dispatch(updateGroupState(null));
        } else {
          this.dispatch(removeInvitation(buildOfferId(invitation)));
        }

        // If necessary, queue a notif for the expiry.
        if (invitation.from.id === getAccountID(game.accessToken)) {
          this.dispatch(
            addNotifications([
              createNotification({
                createText: (stringTable) =>
                  getTokenizedStringTableValue(StringIDTeamJoinPanelExpiredInvite, stringTable, {
                    NAME: invitation.to.displayName
                  })
              })
            ])
          );
        }
      }
    });
  }
}
