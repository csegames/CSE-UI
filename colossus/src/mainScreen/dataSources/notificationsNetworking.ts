/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { notificationsSubscription, NotificationsSubscriptionResult } from './notificationsNetworkingConstants';
import {
  addEventAdvertisementPanelMessageData,
  addMOTDMessageData,
  MOTDMessageData,
  MOTDModalData,
  removeMOTDMessageData,
  addNotificationsMessageData,
  EventAdvertisementPanelMessageData,
  EventAdvertisementPanelModalData,
  NotificationsMessageData,
  NotificationsMessageSeverity,
  removeEventAdvertisementPanelMessageData,
  removeNotificationsMessageData
} from '../redux/notificationsSlice';
import { ContentFlags, Notification } from '@csegames/library/dist/hordetest/graphql/schema';
import dateFormat from 'dateformat';
import { convertLocalTimeToServerTime } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { LobbyView } from '../redux/navigationSlice';
import { lobbyLocalStore } from '../localStorage/lobbyLocalStorage';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';

interface NotificationsMessage extends Notification {
  content: string;
  displayTime: string;
  purpose: 'notification';
  mimeType: 'application/json';
}

interface NotificationsContent {
  body: string;
  severity: NotificationsMessageSeverity;
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
  modal: MOTDModalData;
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
      lobbyLocalStore.setSeenMOTD(reduxState.notifications.seenMOTD);
    }
  }

  private handleSubscription(result: NotificationsSubscriptionResult): void {
    const message = result.notifications;
    let addData: Function;
    let removeData: Function;
    let content;
    const displayDate = new Date(message.displayTime);
    const serverTime = convertLocalTimeToServerTime(Date.now(), this.reduxState.clock.serverTimeDeltaMS);
    const dateDiffMS = displayDate.getTime() - serverTime;
    if (message.mimeType === 'application/json') {
      try {
        content = JSON.parse(message.content);
      } catch {
        console.error('Failed to parse notifications message content as JSON:', message.content);
        return;
      }
    }
    // Notifications component
    if (this.isNotificationsMessage(message) && this.isNotificationsContent(content)) {
      const data = this.getNotificationsMessageData(message, content, displayDate);
      addData = () => {
        this.dispatch(addNotificationsMessageData(data));
      };
      removeData = () => {
        this.dispatch(removeNotificationsMessageData(message.sequenceID));
      };
    }
    // Event Advertisement Panel component
    if (this.isEventAdvertisementPanelMessage(message) && this.isEventAdvertisementPanelContent(content)) {
      const data = this.getEventAdvertisementPanelMessageData(message, content, displayDate);
      addData = () => {
        this.dispatch(addEventAdvertisementPanelMessageData(data));
      };
      removeData = () => {
        this.dispatch(removeEventAdvertisementPanelMessageData(message.sequenceID));
      };
    }
    // MOTD component
    const seenMOTDs = lobbyLocalStore.getSeenMOTDs();
    if (!seenMOTDs.includes(message.sequenceID) && this.isMOTDMessage(message) && this.isMOTDContent(content)) {
      const data = this.getMOTDMessageData(message, content, displayDate);
      addData = () => {
        this.dispatch(addMOTDMessageData(data));
      };
      removeData = () => {
        this.dispatch(removeMOTDMessageData(message.sequenceID));
      };
    }
    // TODO: Warning Broadcasts in-game component
    // TODO: Confirmation Modal in-game component
    // Revoke message
    if (message.displayHints === ContentFlags.Revoke) {
      removeData();
    }
    // Add message
    else {
      if (addData) {
        setTimeout(() => {
          addData();
        }, dateDiffMS);
        if (message.displayDuration) {
          let displayMS = this.getDisplayDurationMS(message.displayDuration);
          if (dateDiffMS < 0) {
            displayMS += dateDiffMS;
          }
          setTimeout(() => {
            removeData();
          }, displayMS);
        }
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

  private isNotificationsMessage(message: Notification): message is NotificationsMessage {
    if (message.content === null) return false;
    if (message.displayTime === null) return false;
    if (message.mimeType !== 'application/json') return false;
    if (message.purpose !== 'notification') return false;
    return true;
  }

  private isNotificationsContent(content: any): content is NotificationsContent {
    if (typeof content !== 'object' || content === null) return false;
    if (!('title' in content)) return false;
    if (typeof content.title !== 'string') return false;
    if (!('body' in content)) return false;
    if (typeof content.body !== 'string') return false;
    if (!('severity' in content)) return false;
    if (typeof content.severity !== 'string') return false;
    const severities: string[] = Object.values(NotificationsMessageSeverity);
    if (!severities.includes(content.severity)) return false;
    return true;
  }

  private getNotificationsMessageData(
    message: NotificationsMessage,
    content: NotificationsContent,
    displayDate: Date
  ): NotificationsMessageData {
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
    if (typeof content.modal !== 'object' || content.modal === null) return false;
    if (!('image' in content.modal)) return false;
    if (typeof content.modal.image !== 'string') return false;
    if (!('title' in content.modal)) return false;
    if (typeof content.modal.title !== 'string') return false;
    if (!('body' in content.modal)) return false;
    if (typeof content.modal.body !== 'string') return false;
    return true;
  }

  private getMOTDMessageData(message: MOTDMessage, content: MOTDContent, displayDate: Date): MOTDMessageData {
    return {
      id: message.sequenceID,
      modal: content.modal,
      time: dateFormat(displayDate, 'h:MM TT mmmm d, yyyy')
    };
  }
}
