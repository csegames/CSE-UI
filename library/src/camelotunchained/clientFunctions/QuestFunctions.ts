/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { QuestsSnapshot } from '../game/GameClientModels/QuestsSnapshot';
import Store from '../../_baseGame/utils/local-storage';

// All valid keys for use with this local store should be defined here.
const keyLoggedQuestIDs = 'LoggedQuestIDs';
const keyTrackedQuestIDs = 'TrackedQuestIDs';
const keyAutoTrackedQuestIDs = 'AutoTrackedQuestIDs';

const questsUpdatedEvent = 'quests.updated';
const questRewardEvent = 'quest.Reward';

export type QuestListener = (quests: QuestsSnapshot) => void;

export interface QuestMocks {
  triggerQuestsUpdated(guild: QuestsSnapshot): void;
}

export interface QuestFunctions {
  bindQuestsUpdatedListener(listener: QuestListener): ListenerHandle;
  turnInQuest(questInstanceID: string): void;
  getLoggedQuestIDs(): string[];
  addLoggedQuestID(questID: string);
  removeLoggedQuestID(questID: string);
  getTrackedQuestIDs(): string[];
  addTrackedQuestID(questID: string);
  removeTrackedQuestID(questID: string);
  getAutoTrackedQuestIDs(): string[]; // Quest instances already auto-added to the tracker once, so they aren't re-tracked once the player untracks them.
  addAutoTrackedQuestID(questID: string);
  removeAutoTrackedQuestID(questID: string);
}

class QuestFunctionsBase implements QuestFunctions, QuestMocks {
  private readonly events = new EventEmitter();
  protected store = new Store('FSRKeybinds');

  bindQuestsUpdatedListener(listener: QuestListener): ListenerHandle {
    return this.events.on(questsUpdatedEvent, listener);
  }
  triggerQuestsUpdated(quests: QuestsSnapshot): void {
    this.events.trigger(questsUpdatedEvent, quests);
  }
  turnInQuest(questInstanceID: string): void {
    engine.trigger(questRewardEvent, questInstanceID);
  }
  getLoggedQuestIDs(): string[] {
    return [];
  }
  addLoggedQuestID(questID: string) {}
  removeLoggedQuestID(questID: string) {}
  getTrackedQuestIDs(): string[] {
    return [];
  }
  addTrackedQuestID(questID: string) {}
  removeTrackedQuestID(questID: string) {}
  getAutoTrackedQuestIDs(): string[] {
    return [];
  }
  addAutoTrackedQuestID(questID: string) {}
  removeAutoTrackedQuestID(questID: string) {}
}

class CoherentQuestFunctions extends QuestFunctionsBase {
  bindQuestsUpdatedListener(listener: QuestListener): ListenerHandle {
    const mockHandle = super.bindQuestsUpdatedListener(listener);
    const engineHandle = engine.on(questsUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  getLoggedQuestIDs(): string[] {
    return this.store.get<string[]>(keyLoggedQuestIDs) ?? [];
  }
  addLoggedQuestID(questID: string) {
    let ids: string[] = this.getLoggedQuestIDs();
    if (!ids.includes(questID)) {
      this.store.set(keyLoggedQuestIDs, [...ids, questID]);
    }
  }
  removeLoggedQuestID(questID: string) {
    let ids: string[] = this.getLoggedQuestIDs();
    if (ids.includes(questID)) {
      this.store.set(
        keyLoggedQuestIDs,
        ids.filter((id) => id !== questID)
      );
    }
  }
  getTrackedQuestIDs(): string[] {
    return this.store.get<string[]>(keyTrackedQuestIDs) ?? [];
  }
  addTrackedQuestID(questID: string) {
    let ids: string[] = this.getTrackedQuestIDs();
    if (!ids.includes(questID)) {
      this.store.set(keyTrackedQuestIDs, [...ids, questID]);
    }
  }
  removeTrackedQuestID(questID: string) {
    let ids: string[] = this.getTrackedQuestIDs();
    if (ids.includes(questID)) {
      this.store.set(
        keyTrackedQuestIDs,
        ids.filter((id) => id !== questID)
      );
    }
  }
  getAutoTrackedQuestIDs(): string[] {
    return this.store.get<string[]>(keyAutoTrackedQuestIDs) ?? [];
  }
  addAutoTrackedQuestID(questID: string) {
    let ids: string[] = this.getAutoTrackedQuestIDs();
    if (!ids.includes(questID)) {
      this.store.set(keyAutoTrackedQuestIDs, [...ids, questID]);
    }
  }
  removeAutoTrackedQuestID(questID: string) {
    let ids: string[] = this.getAutoTrackedQuestIDs();
    if (ids.includes(questID)) {
      this.store.set(
        keyAutoTrackedQuestIDs,
        ids.filter((id) => id !== questID)
      );
    }
  }
}

class BrowserQuestFunctions extends QuestFunctionsBase {}

export const impl: QuestFunctions & QuestMocks = engine.isAttached
  ? new CoherentQuestFunctions()
  : new BrowserQuestFunctions();
