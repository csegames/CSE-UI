/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ExternalDataSource } from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { notificationsSubscription, NotificationsSubscriptionResult } from './notificationsNetworkingConstants';
import { convertLocalTimeToServerTime } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { Notification } from '@csegames/library/dist/camelotunchained/graphql/schema';
import {
  addServerMessage,
  BasicServerMessage,
  isBasicServerMessage,
  removeServerMessage
} from '../redux/notificationsSlice';
import { WithWebInterface } from '../redux/withWebInterface';

const revokeHint = 'revoke';

interface NotificationsManager {
  onMessageStart: Function;
  onMessageRevoke: Function;
  onMessageOver: Function;
}

interface RevocationMessage extends Notification {
  sequenceID: string;
}

function isRevocationMessage(message: Notification): message is RevocationMessage {
  return message.displayHints?.includes(revokeHint) === true && typeof message.sequenceID === 'string';
}

export class NotificationsService extends WithWebInterface(ExternalDataSource) {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.subscribe<NotificationsSubscriptionResult>(
        { operationName: 'notification', query: notificationsSubscription },
        this.handleSubscription.bind(this)
      )
    ];
  }

  private handleSubscription(result: NotificationsSubscriptionResult): void {
    // This subscription gives us a SINGLE notification update, either to add or revoke.
    const message = result.notifications!;

    let manager: NotificationsManager | null = null;

    const displayDate = new Date(message.displayTime!);
    const serverTime = convertLocalTimeToServerTime(Date.now(), this.reduxState.clock.serverTimeDeltaMS);
    const dateDiffMS = displayDate.getTime() - serverTime;
    let displayMS;
    if (message.displayDuration) {
      displayMS = this.getDisplayDurationMS(message.displayDuration);
      if (dateDiffMS < 0) {
        displayMS += dateDiffMS;
      }
    }

    if (isRevocationMessage(message)) {
      this.dispatch(removeServerMessage(message.sequenceID));
      return;
    }

    if (isBasicServerMessage(message)) {
      manager = this.buildServerMessageManager(message);
    }

    if (manager) {
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

  private buildServerMessageManager(message: BasicServerMessage): NotificationsManager {
    const manager: NotificationsManager = {
      onMessageStart: () => {
        // Add message to Redux.
        this.dispatch(addServerMessage(message));
      },
      onMessageOver: () => {
        // Message expired normally.
        this.dispatch(removeServerMessage(message.sequenceID));
      },
      onMessageRevoke: () => {
        // Message was canceled.
        this.dispatch(removeServerMessage(message.sequenceID));
      }
    };
    return manager;
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
}
