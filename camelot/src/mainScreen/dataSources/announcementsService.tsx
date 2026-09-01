/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AnnouncementType } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { addPopUpAnnouncement } from '../redux/popUpAnnouncementsSlice';
import { getStringTableValue } from '../helpers/stringTableHelpers';

export class AnnouncementsService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([this.listenForAnnouncement()]);
  }

  private localizeText(text: string): string {
    return getStringTableValue(text, this.reduxState.stringTable.stringTable);
  }

  private listenForAnnouncement(): ListenerHandle {
    return clientAPI.bindAnnouncementListener((announcementType, announcementText) => {
      if (announcementType === AnnouncementType.PopUp) {
        const localizedText = this.localizeText(announcementText);
        this.dispatch(addPopUpAnnouncement([localizedText, 'rgb(225, 225, 225)']));
      } else if (announcementType === AnnouncementType.ObjectiveFail) {
        const localizedText = this.localizeText(announcementText);
        this.dispatch(addPopUpAnnouncement([localizedText, '#f60000']));
      }
    });
  }
}
