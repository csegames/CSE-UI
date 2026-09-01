/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { QuestsSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/QuestsSnapshot';
import {
  addAutoTrackedQuestID,
  addTrackedQuestID,
  QuestDisplayCategory,
  QuestStateEx,
  removeAutoTrackedQuestID,
  removeLoggedQuestID,
  removeTrackedQuestID,
  updateAutoTrackedQuestIDs,
  updateLoggedQuestIDs,
  updateQuests,
  updateRolloverTime,
  updateTrackedQuestIDs
} from '../redux/questSlice';
import {
  getItemRewards,
  getQuestSectionTitleStringID,
  getQuestsForDisplayCategory,
  isGenericQuestDisplay
} from '../helpers/questHelpers';
import { showToaster, ToasterParams } from '../redux/toastersSlice';
import { getFactionData } from '../gameData/factionData';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { CurrencyID } from '../helpers/itemHelpers';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { WithWebInterface } from '../redux/withWebInterface';

const StringIDQuestNotificationAccepted = 'QuestNotificationAccepted';
const StringIDQuestNotificationCompleted = 'QuestNotificationCompleted';

const SellTargetPrefix = 'Sell.';

export class QuestService extends WithWebInterface(ExternalDataSource) {
  // Map from previous snapshot -- null until first snapshot arrives so the initial login state never generates notifications.
  private lastQuests: Record<string, QuestStateEx> | null = null;

  protected async bind(): Promise<ListenerHandle[]> {
    this.dispatch(updateLoggedQuestIDs(clientAPI.getLoggedQuestIDs()));
    this.dispatch(updateTrackedQuestIDs(clientAPI.getTrackedQuestIDs()));
    this.dispatch(updateAutoTrackedQuestIDs(clientAPI.getAutoTrackedQuestIDs()));

    return [
      // Clear the snapshot on disconnect (logout / character switch) to avoid diffing the next character's first snapshot against the stale one
      await this.onDisconnect(() => {
        this.lastQuests = null;
      }),
      clientAPI.bindQuestsUpdatedListener(this.handleQuestsUpdated.bind(this))
    ];
  }

  private handleQuestsUpdated(newState: QuestsSnapshot) {
    let quests: Record<string, QuestStateEx> = {};
    Object.entries(newState.quests).forEach(([instanceID, qState]) => {
      quests[instanceID] = {
        instanceID,
        ...qState
      };
    });

    // If any of the tracked or logged quests is no longer valid (completed or expire), stop watching them.
    if (Object.keys(quests).length > 0) {
      const logged = clientAPI.getLoggedQuestIDs();
      const tracked = clientAPI.getTrackedQuestIDs();
      const autoTracked = clientAPI.getAutoTrackedQuestIDs();

      for (const instanceID of logged) {
        if (!quests[instanceID] || quests[instanceID].isRewarded) {
          clientAPI.removeLoggedQuestID(instanceID);
          this.dispatch(removeLoggedQuestID(instanceID));
        }
      }

      for (const instanceID of tracked) {
        if (!quests[instanceID] || quests[instanceID].isRewarded) {
          clientAPI.removeTrackedQuestID(instanceID);
          this.dispatch(removeTrackedQuestID(instanceID));
        }
      }

      // Remove auto-track bookkeeping for quest instances that no longer exist
      for (const instanceID of autoTracked) {
        if (!quests[instanceID]) {
          clientAPI.removeAutoTrackedQuestID(instanceID);
          this.dispatch(removeAutoTrackedQuestID(instanceID));
        }
      }

      this.autoTrackTutorialQuests(quests);
    }

    if (this.lastQuests !== null) {
      this.notifyQuestTransitions(this.lastQuests, quests);
    }
    this.lastQuests = quests;

    this.dispatch(updateQuests(quests));
    this.dispatch(updateRolloverTime(newState.rolloverTime));
  }

  // Detects quest transitions between snapshots and surfaces them as toasts
  private notifyQuestTransitions(
    oldQuests: Record<string, QuestStateEx>,
    newQuests: Record<string, QuestStateEx>
  ): void {
    const { gameDefs, stringTable } = this.reduxState;

    // Batch toasters so all completed appear before accepted
    const completedToasts: ToasterParams[] = [];
    const acceptedToasts: ToasterParams[] = [];

    for (const quest of Object.values(newQuests)) {
      const old = oldQuests[quest.instanceID];
      const isNewlyAccepted = !old && !quest.isCompleted && !quest.isRewarded;
      const isNewlyRewarded = (!old || !old.isRewarded) && quest.isRewarded;
      if (!isNewlyAccepted && !isNewlyRewarded) {
        continue;
      }

      const def = gameDefs.questDefs[quest.questDataID];
      if (!def || !isGenericQuestDisplay(def)) {
        continue;
      }

      const questName = getStringTableValue(def.name, stringTable.stringTable);
      const sectionStringID = getQuestSectionTitleStringID(def);
      const category = sectionStringID ? getStringTableValue(sectionStringID, stringTable.stringTable) : undefined;

      // Same icon the QuestLog/QuestTracker show: a turn-in item's icon if the quest has one,
      // the faction training icon for Tutorial quests, otherwise none.
      const sellTarget = def.targets.find(({ id }) => id.startsWith(SellTargetPrefix));
      const sellItemID = sellTarget?.id?.slice(SellTargetPrefix.length) ?? '';
      const sellItemDef = gameDefs.itemsByStringID[sellItemID];
      const isTutorial = def.tags.includes(QuestDisplayCategory.Tutorial);
      const titleIconURL =
        sellItemDef?.iconUrl ??
        (isTutorial ? getFactionData(this.reduxState.hud.uiFactionID).iconTutorialImage : undefined);

      if (isNewlyAccepted) {
        acceptedToasts.push({
          id: `QuestAccepted${quest.instanceID}`,
          content: {
            eyebrow: getStringTableValue(StringIDQuestNotificationAccepted, stringTable.stringTable),
            category,
            titleIconURL,
            title: questName,
            isSmall: true
          },
          position: 'quest',
          soundEvent: SoundEvents.PLAY_UI_QUEST_ACCEPTED
        });
      }

      if (isNewlyRewarded) {
        const rewards = getItemRewards(def, gameDefs.itemsByStringID).map((reward) => ({
          name: reward.name,
          amount: reward.amount,
          iconUrl: reward.iconUrl,
          isGold: reward.itemID === CurrencyID.Gold
        }));

        completedToasts.push({
          id: `QuestRewarded${quest.instanceID}`,
          content: {
            eyebrow: getStringTableValue(StringIDQuestNotificationCompleted, stringTable.stringTable),
            category,
            titleIconURL,
            title: questName,
            rewards: rewards.length > 0 ? rewards : undefined,
            isSmall: true
          },
          position: 'quest',
          soundEvent: SoundEvents.PLAY_UI_QUEST_COMPLETED
        });
      }
    }

    for (const toast of [...completedToasts, ...acceptedToasts]) {
      this.dispatch(showToaster(toast));
    }
  }

  // Tutorial quest instances are added to the QuestTracker widget (trackedQuestIDs) automatically the first time we see them.
  // Only auto-track a given quest once to prevent re-adding if the player has untracked it.
  private autoTrackTutorialQuests(quests: Record<string, QuestStateEx>): void {
    const { gameDefs, hud } = this.reduxState;

    const tutorialQuests = getQuestsForDisplayCategory(
      QuestDisplayCategory.Tutorial,
      quests,
      gameDefs.questDefs,
      gameDefs.itemsByStringID,
      hud.uiFactionID
    );

    const autoTracked = clientAPI.getAutoTrackedQuestIDs();
    const tracked = clientAPI.getTrackedQuestIDs();

    for (const quest of tutorialQuests) {
      // Never (re-)track a quest whose reward has already been claimed.
      if (quest.isRewarded || autoTracked.includes(quest.instanceID)) {
        continue;
      }

      clientAPI.addAutoTrackedQuestID(quest.instanceID);
      this.dispatch(addAutoTrackedQuestID(quest.instanceID));

      if (!tracked.includes(quest.instanceID)) {
        clientAPI.addTrackedQuestID(quest.instanceID);
        this.dispatch(addTrackedQuestID(quest.instanceID));
      }
    }
  }
}
