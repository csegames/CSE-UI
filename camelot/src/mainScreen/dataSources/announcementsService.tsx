/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AnnouncementType } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { receiveAnnouncementText } from '../redux/chatSlice';
import { addPopUpAnnouncement } from '../redux/popUpAnnouncementsSlice';

export const chatGlobalRoomID = '_global';
export const chatCombatRoomID = 'combat';
export const chatSystemRoomID = 'system';

export class AnnouncementsService extends ExternalDataSource {
  private announcementHandle: ListenerHandle | null = null;

  protected bind(): Promise<ListenerHandle[]> {
    this.listenForAnnouncement();

    return Promise.resolve([
      {
        close: () => {
          this.closeAnnouncementHandle();
        }
      }
    ]);
  }

  private listenForAnnouncement(): void {
    this.announcementHandle = clientAPI.bindAnnouncementListener((announcementType, announcementText) => {
      if (announcementType === AnnouncementType.Text) {
        this.dispatch(receiveAnnouncementText(announcementText));
      }
      if (announcementType === AnnouncementType.PopUp) {
        this.dispatch(addPopUpAnnouncement(announcementText));
      }
    });
  }

  private closeAnnouncementHandle(): void {
    if (this.announcementHandle) {
      this.announcementHandle.close();
      this.announcementHandle = null;
    }
  }
}
