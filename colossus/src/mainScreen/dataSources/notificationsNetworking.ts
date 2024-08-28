/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { notificationsSubscription, NotificationsSubscriptionResult } from './notificationsNetworkingConstants';
import {
  addWarningBroadcastMessageData,
  addEventAdvertisementPanelMessageData,
  addMOTDMessageData,
  addPinnedNoticeMessageData,
  MOTDMessageData,
  removeMOTDMessageData,
  WarningBroadcastMessageData,
  EventAdvertisementPanelMessageData,
  EventAdvertisementPanelModalData,
  PinnedNoticeMessageData,
  NotificationsSeverity,
  removeWarningBroadcastMessageData,
  removeEventAdvertisementPanelMessageData,
  removePinnedNoticeMessageData,
  setWarningBroadcastModalMessage,
  updateWarningBroadcastCountdown
} from '../redux/notificationsSlice';
import { ContentFlags, Notification } from '@csegames/library/dist/hordetest/graphql/schema';
import dateFormat from 'dateformat';
import { convertLocalTimeToServerTime } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { LobbyView, Overlay, showOverlay } from '../redux/navigationSlice';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

interface NotificationsManager {
  onMessageStart: Function;
  onMessageRevoke: Function;
  onMessageOver: Function;
}

interface NotificationsMessage extends Notification {
  content: string;
  displayTime: string;
  purpose: 'pinned-notice';
  mimeType: 'application/json';
}

interface PinnedNoticeContent {
  body: string;
  severity: NotificationsSeverity;
  title: string;
}

interface EventAdvertisementPanelMessage extends Notification {
  content: string;
  displayTime: string;
  purpose: 'event-advertisement-panel';
  mimeType: 'application/json';
}

interface EventAdvertisementPanelContent {
  image: string;
  text: string;
  secondaryText?: string;
  showTime?: boolean;
  link?: string;
  modal?: EventAdvertisementPanelModalData;
  lobbyView?: LobbyView;
  champion?: string;
}

interface MOTDMessage extends Notification {
  content: string;
  displayTime: string;
  purpose: 'motd';
  mimeType: 'application/json';
}

interface MOTDContent {
  image: string;
  title: string;
  body: string;
}

interface WarningBroadcastMessage extends Notification {
  content: string;
  displayTime: string;
  purpose: 'warning-broadcast';
  mimeType: 'application/json';
}

interface WarningBroadcastContent {
  image: string;
  title: string;
  severity: NotificationsSeverity;
  hasModal?: boolean;
  modalCountdownSeconds?: number;
}

export class NotificationsService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.subscribe<NotificationsSubscriptionResult>(
        { operationName: 'notification', query: notificationsSubscription(this.reduxState.player.shardID) },
        this.handleSubscription.bind(this)
      )
    ];
  }

  protected canBind(): boolean {
    return (
      // We need champion data to load before we can validate that notifications are sending valid champion IDs
      this.reduxState.championInfo.champions.length > 0 &&
      // We need the shard ID to use as a tag when subscribing
      this.reduxState.player.shardID !== 0
    );
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    if (reduxState.notifications.seenMOTD !== null) {
      clientAPI.setSeenMOTD(reduxState.notifications.seenMOTD);
    }
  }

  private handleSubscription(result: NotificationsSubscriptionResult): void {
    const message = result.notifications;
    let manager: NotificationsManager;
    let content: unknown;
    const displayDate = new Date(message.displayTime);
    const serverTime = convertLocalTimeToServerTime(Date.now(), this.reduxState.clock.serverTimeDeltaMS);
    const dateDiffMS = displayDate.getTime() - serverTime;
    let displayMS;
    if (message.displayDuration) {
      displayMS = this.getDisplayDurationMS(message.displayDuration);
      if (dateDiffMS < 0) {
        displayMS += dateDiffMS;
      }
    }
    if (message.mimeType === 'application/json') {
      try {
        content = JSON.parse(message.content);
      } catch {
        console.error('Failed to parse event message content as JSON:', message.content);
        return;
      }
    }
    // Pinned Notice component
    if (this.isPinnedNoticeMessage(message) && this.isPinnedNoticeContent(content)) {
      const pinnedNoticeContent: PinnedNoticeContent = content;
      const data = this.getPinnedNoticeMessageData(message, pinnedNoticeContent, displayDate);
      manager = {
        onMessageStart: () => {
          this.dispatch(addPinnedNoticeMessageData(data));
        },
        onMessageRevoke: () => {
          this.dispatch(removePinnedNoticeMessageData(message.sequenceID));
        },
        onMessageOver: () => {
          this.dispatch(removePinnedNoticeMessageData(message.sequenceID));
        }
      };
    }
    // Event Advertisement Panel component
    if (this.isEventAdvertisementPanelMessage(message) && this.isEventAdvertisementPanelContent(content)) {
      const eventAdvertisementPanelContent: EventAdvertisementPanelContent = content;
      const data = this.getEventAdvertisementPanelMessageData(message, eventAdvertisementPanelContent, displayDate);
      manager = {
        onMessageStart: () => {
          this.dispatch(addEventAdvertisementPanelMessageData(data));
        },
        onMessageRevoke: () => {
          this.dispatch(removeEventAdvertisementPanelMessageData(message.sequenceID));
        },
        onMessageOver: () => {
          this.dispatch(removeEventAdvertisementPanelMessageData(message.sequenceID));
        }
      };
    }
    // MOTD component
    const seenMOTDs = clientAPI.getSeenMOTDs();
    if (!seenMOTDs.includes(message.sequenceID) && this.isMOTDMessage(message) && this.isMOTDContent(content)) {
      const motdContent: MOTDContent = content;
      const data = this.getMOTDMessageData(message, motdContent, displayDate);
      manager = {
        onMessageStart: () => {
          this.dispatch(addMOTDMessageData(data));
        },
        onMessageRevoke: () => {
          this.dispatch(removeMOTDMessageData(message.sequenceID));
        },
        onMessageOver: () => {
          this.dispatch(removeMOTDMessageData(message.sequenceID));
        }
      };
    }
    // Warning Broadcast in-game component
    if (this.isWarningBroadcastMessage(message) && this.isWarningBroadcastContent(content)) {
      const warningBroadcastContent: WarningBroadcastContent = content;
      const data = this.getWarningBroadcastMessageData(message, warningBroadcastContent, dateDiffMS, displayMS);
      let countdownInterval: number;
      manager = {
        onMessageStart: () => {
          this.dispatch(addWarningBroadcastMessageData(data));
          if (warningBroadcastContent.hasModal) {
            countdownInterval = window.setInterval(() => {
              const current = data.countdown ? Math.floor((data.countdown.endsAt - Date.now()) / 1000) : undefined;
              if (data.countdown && current >= 0) {
                this.dispatch(updateWarningBroadcastCountdown([message.sequenceID, current]));
              } else {
                window.clearInterval(countdownInterval);
              }
            }, 500);
          }
        },
        onMessageRevoke: () => {
          this.dispatch(removeWarningBroadcastMessageData(message.sequenceID));

          if (countdownInterval) {
            window.clearInterval(countdownInterval);
          }
        },
        onMessageOver: () => {
          if (warningBroadcastContent.hasModal) {
            this.dispatch(setWarningBroadcastModalMessage(data));
            this.dispatch(showOverlay(Overlay.WarningBroadcastModal));
          }
          this.dispatch(removeWarningBroadcastMessageData(data.id));
          if (countdownInterval) {
            window.clearInterval(countdownInterval);
          }
        }
      };
    }
    // Revoke message
    if (message.displayHints === ContentFlags.Revoke) {
      manager.onMessageRevoke();
    }
    // Add message
    else {
      setTimeout(() => {
        manager.onMessageStart();
      }, dateDiffMS);
      if (displayMS) {
        setTimeout(() => {
          manager.onMessageOver();
        }, displayMS);
      }
    }
  }

  private getDisplayDurationMS(displayDuration: string): number {
    const displayDurationPieces = displayDuration.split(':');
    const days = displayDurationPieces[0].includes('.')
      ? Number(displayDurationPieces[0].substring(0, displayDurationPieces[0].indexOf('.')))
      : 0;
    const hours = displayDurationPieces[0].includes('.')
      ? Number(displayDurationPieces[0].substring(displayDurationPieces[0].indexOf('.') + 1))
      : Number(displayDurationPieces[0]);
    const minutes = Number(displayDurationPieces[1]);
    const seconds = Number(displayDurationPieces[2]);
    let displayMS = days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    return displayMS;
  }

  private isPinnedNoticeMessage(message: Notification): message is NotificationsMessage {
    if (message.content === null) return false;
    if (message.displayTime === null) return false;
    if (message.mimeType !== 'application/json') return false;
    if (message.purpose !== 'pinned-notice') return false;
    return true;
  }

  private isPinnedNoticeContent(content: any): content is PinnedNoticeContent {
    if (typeof content !== 'object' || content === null) return false;
    if (!('title' in content)) return false;
    if (typeof content.title !== 'string') return false;
    if (!('body' in content)) return false;
    if (typeof content.body !== 'string') return false;
    if (!('severity' in content)) return false;
    if (typeof content.severity !== 'string') return false;
    const severities: string[] = Object.values(NotificationsSeverity);
    if (!severities.includes(content.severity)) return false;
    return true;
  }

  private getPinnedNoticeMessageData(
    message: NotificationsMessage,
    content: PinnedNoticeContent,
    displayDate: Date
  ): PinnedNoticeMessageData {
    return {
      id: message.sequenceID,
      title: content.title,
      body: content.body,
      severity: content.severity,
      time: dateFormat(displayDate, 'h:MM TT mmmm d, yyyy')
    };
  }

  private isEventAdvertisementPanelMessage(message: Notification): message is EventAdvertisementPanelMessage {
    if (message.content === null) return false;
    if (message.displayTime === null) return false;
    if (message.mimeType !== 'application/json') return false;
    if (message.purpose !== 'event-advertisement-panel') return false;
    return true;
  }

  private isEventAdvertisementPanelContent(content: any): content is EventAdvertisementPanelContent {
    if (typeof content !== 'object' || content === null) return false;
    if (!('image' in content)) return false;
    if (typeof content.image !== 'string') return false;
    if (!('text' in content)) return false;
    if (typeof content.text !== 'string') return false;
    if ('secondaryText' in content && typeof content.secondaryText !== 'string') return false;
    if ('link' in content) {
      if (typeof content.link !== 'string') return false;
    }
    if ('modal' in content) {
      if (typeof content.modal !== 'object' || content.modal === null) return false;
      if (!('image' in content.modal)) return false;
      if (typeof content.modal.image !== 'string') return false;
      if (!('title' in content.modal)) return false;
      if (typeof content.modal.title !== 'string') return false;
      if (!('body' in content.modal)) return false;
      if (typeof content.modal.body !== 'string') return false;
    }
    if ('lobbyView' in content) {
      if (typeof content.lobbyView !== 'string') return false;
      if (!Object.values(LobbyView).includes(content.lobbyView)) return false;
    }
    if ('champion' in content) {
      if (typeof content.champion !== 'string') return false;
      if (!this.reduxState.championInfo.champions.some((champion) => champion.id === content.champion)) return false;
    }
    return true;
  }

  private getEventAdvertisementPanelMessageData(
    message: EventAdvertisementPanelMessage,
    content: EventAdvertisementPanelContent,
    displayDate: Date
  ): EventAdvertisementPanelMessageData {
    return {
      id: message.sequenceID,
      image: content.image,
      text: content.text,
      secondaryText: content.secondaryText,
      showTime: content.showTime,
      link: content.link,
      modal: content.modal,
      lobbyView: content.lobbyView,
      champion: content.champion,
      time: dateFormat(displayDate, 'h:MM TT mmmm d, yyyy')
    };
  }

  private isMOTDMessage(message: Notification): message is MOTDMessage {
    if (message.content === null) return false;
    if (message.displayTime === null) return false;
    if (message.mimeType !== 'application/json') return false;
    if (message.purpose !== 'motd') return false;
    return true;
  }

  private isMOTDContent(content: any): content is MOTDContent {
    if (typeof content !== 'object' || content === null) return false;
    if (!('image' in content)) return false;
    if (typeof content.image !== 'string') return false;
    if (!('title' in content)) return false;
    if (typeof content.title !== 'string') return false;
    if (!('body' in content)) return false;
    if (typeof content.body !== 'string') return false;
    return true;
  }

  private getMOTDMessageData(message: MOTDMessage, content: MOTDContent, displayDate: Date): MOTDMessageData {
    return {
      id: message.sequenceID,
      image: content.image,
      title: content.title,
      body: content.body,
      time: dateFormat(displayDate, 'h:MM TT mmmm d, yyyy')
    };
  }

  private isWarningBroadcastMessage(message: Notification): message is WarningBroadcastMessage {
    if (message.content === null) return false;
    if (message.displayTime === null) return false;
    if (message.mimeType !== 'application/json') return false;
    if (message.purpose !== 'warning-broadcast') return false;
    return true;
  }

  private isWarningBroadcastContent(content: any): content is WarningBroadcastContent {
    if (typeof content !== 'object' || content === null) return false;
    if (!('title' in content)) return false;
    if (typeof content.title !== 'string') return false;
    if (!('body' in content)) return false;
    if (typeof content.body !== 'string') return false;
    if (!('severity' in content)) return false;
    if (typeof content.severity !== 'string') return false;
    if ('hasModal' in content && typeof content.hasModal !== 'boolean') return false;
    if ('modalCountdownSeconds' in content && typeof content.modalCountdownSeconds !== 'number') return false;
    const severities: string[] = Object.values(NotificationsSeverity);
    if (!severities.includes(content.severity)) return false;
    return true;
  }

  private getWarningBroadcastMessageData(
    message: WarningBroadcastMessage,
    content: WarningBroadcastContent,
    dateDiffMS: number,
    displayMS: number | undefined
  ): WarningBroadcastMessageData {
    let countdown;
    if (content.hasModal && displayMS) {
      const ms = displayMS - dateDiffMS;
      const seconds = Math.floor(ms / 1000);
      countdown = {
        current: seconds,
        endsAt: Date.now() + displayMS,
        max: seconds
      };
    }
    return {
      id: message.sequenceID,
      image: content.image,
      title: content.title,
      severity: content.severity,
      countdown,
      modalCountdownSeconds: content.modalCountdownSeconds
    };
  }
}
