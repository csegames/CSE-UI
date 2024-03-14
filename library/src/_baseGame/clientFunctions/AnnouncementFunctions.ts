/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';
import { AnnouncementType } from '../types/localDefinitions';

export type AnnouncementListener = (
  type: AnnouncementType,
  text: string,
  title: string,
  iconPath: string,
  soundID: number
) => void;

export interface AnnouncementMocks {
  triggerAnnouncement(type: AnnouncementType, text: string, title: string, iconPath: string, soundID: number): void;
}

export interface AnnouncementFunctions {
  bindAnnouncementListener(listener: AnnouncementListener): ListenerHandle;
}

class AnnouncementFunctionsBase implements AnnouncementFunctions, AnnouncementMocks {
  private readonly events = new EventEmitter();

  bindAnnouncementListener(listener: AnnouncementListener): ListenerHandle {
    return this.events.on('announcement', listener);
  }
  triggerAnnouncement(type: AnnouncementType, text: string, title: string, iconPath: string, soundID: number) {
    this.events.trigger('announcement', type, text, title, iconPath, soundID);
  }
}

class CoherentAnnouncementFunctions extends AnnouncementFunctionsBase {
  bindAnnouncementListener(listener: AnnouncementListener): ListenerHandle {
    const mockHandle = super.bindAnnouncementListener(listener);
    const engineHandle = engine.on('announcement', listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserAnnouncementFunctions extends AnnouncementFunctionsBase {}

export const impl: AnnouncementFunctions & AnnouncementMocks = engine.isAttached
  ? new CoherentAnnouncementFunctions()
  : new BrowserAnnouncementFunctions();
