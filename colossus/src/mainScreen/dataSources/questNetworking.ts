/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { questStaticDataQuery, QuestStaticDataQueryResult } from './questNetworkingConstants';
import {
  QuestStaticData,
  updateCurrentBattlePass,
  updateNextBattlePass,
  updatePreviousBattlePass,
  updateQuestStaticData
} from '../redux/questSlice';
import { QuestDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { InitTopic } from '../redux/initializationSlice';
import {
  getBattlePassEndTimeMS,
  getBattlePassStartTimeMS,
  getCurrentBattlePass,
  getMostRecentExpiredBattlePass,
  getNextBattlePass
} from '../components/views/Lobby/BattlePass/BattlePassUtils';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';

export class QuestNetworkingService extends ExternalDataSource {
  private battlePassTimeout: number;
  private battlePassTimeoutInitialized: boolean = false;

  protected async bind(): Promise<ListenerHandle[]> {
    return [
      {
        close: () => {
          if (this.battlePassTimeout) {
            clearTimeout(this.battlePassTimeout);
            this.battlePassTimeout = null;
            this.battlePassTimeoutInitialized = false;
          }
        }
      },
      await this.query<QuestStaticDataQueryResult>(
        { query: questStaticDataQuery },
        this.handleStaticDataQueryResult.bind(this),
        InitTopic.Quests
      )
    ];
  }

  private handleStaticDataQueryResult(result: QuestStaticDataQueryResult): void {
    // Validate the result.
    if (!result.game.quests) {
      console.warn('Received invalid static data from Quest fetch.');
      return;
    }

    const staticData: QuestStaticData = {
      quests: {
        Invalid: [],
        Normal: [],
        BattlePass: [],
        DailyNormal: [],
        DailyHard: [],
        Champion: [],
        SubQuest: []
      },
      questsById: {}
    };

    // Separate quests by type.  We almost never need to access more than a single type at a time.
    result.game.quests.forEach((quest: QuestDefGQL) => {
      if (staticData.quests[quest.questType]) {
        staticData.quests[quest.questType].push(quest);
      } else {
        staticData.quests.Invalid.push(quest);
        console.warn('Received static quest data with invalid questType', quest);
      }
      staticData.questsById[quest.id] = quest;
    });

    // Sort quests by their start date (if specified).
    staticData.quests.BattlePass.sort(this.sortQuestsByStartDate);
    staticData.quests.DailyNormal.sort(this.sortQuestsByStartDate);
    staticData.quests.DailyHard.sort(this.sortQuestsByStartDate);

    this.dispatch(updateQuestStaticData(staticData));
  }

  private handleBattlePassUpdate(): void {
    // Clean up the old timer if there was one.
    clearTimeout(this.battlePassTimeout);
    this.battlePassTimeout = null;

    // Check if the current, previous, and next battlepass entries have changed.
    const currentBattlePass = getCurrentBattlePass(
      this.reduxState.quests.quests.BattlePass,
      this.reduxState.clock.serverTimeDeltaMS
    );
    const nextBattlePass = getNextBattlePass(
      this.reduxState.quests.quests.BattlePass,
      this.reduxState.clock.serverTimeDeltaMS
    );
    const previousBattlePass = getMostRecentExpiredBattlePass(
      this.reduxState.quests.quests.BattlePass,
      this.reduxState.clock.serverTimeDeltaMS
    );

    if (currentBattlePass?.id !== this.reduxState.quests.currentBattlePass?.id) {
      this.dispatch(updateCurrentBattlePass(currentBattlePass));
    }
    if (nextBattlePass?.id !== this.reduxState.quests.nextBattlePass?.id) {
      this.dispatch(updateNextBattlePass(nextBattlePass));
    }
    if (previousBattlePass?.id !== this.reduxState.quests.previousBattlePass?.id) {
      this.dispatch(updatePreviousBattlePass(previousBattlePass));
    }

    // Set a timer for when we next expect a BattlePass transition to occur, to a maximum wait of one hour
    // so that we can readjust if clocks drift.
    const oneHourMS = 60 * 60 * 1000;
    if (currentBattlePass) {
      // If there is a currentBP, then we care about when it ends.
      const endTimeout = Math.min(
        oneHourMS,
        Math.max(
          1,
          getBattlePassEndTimeMS(currentBattlePass) - getServerTimeMS(this.reduxState.clock.serverTimeDeltaMS)
        )
      );
      this.battlePassTimeout = window.setTimeout(this.handleBattlePassUpdate.bind(this), endTimeout);
    } else if (nextBattlePass) {
      // Else if there is a nextBP, then we care about either when it hits Preview or when it Starts.
      const serverTime = getServerTimeMS(this.reduxState.clock.serverTimeDeltaMS);
      const startTime = getBattlePassStartTimeMS(nextBattlePass);
      // If there is no previewDate, this will be 1970, indicating the Battlepass is in Preview already.
      const previewTime = new Date(nextBattlePass.previewDate).getTime();

      if (serverTime < previewTime) {
        // Not yet in Preview, so next important update is when Preview begins.
        const previewTimeout = Math.min(oneHourMS, Math.max(1, previewTime - serverTime));
        this.battlePassTimeout = window.setTimeout(this.handleBattlePassUpdate.bind(this), previewTimeout);
      } else {
        // In Preview, so next important update is when the battlepass starts.
        const startTimeout = Math.min(oneHourMS, Math.max(1, startTime - serverTime));
        this.battlePassTimeout = window.setTimeout(this.handleBattlePassUpdate.bind(this), startTimeout);
      }
    }
  }

  private sortQuestsByStartDate(a: QuestDefGQL, b: QuestDefGQL): number {
    const aStartDateLock = a.questLock?.find((lock) => {
      return lock.startTime != null;
    });
    const bStartDateLock = b.questLock?.find((lock) => {
      return lock.startTime != null;
    });

    // Quests without start dates come first in the array, then sorted by start date.
    if (!bStartDateLock) {
      return 1;
    } else if (!aStartDateLock) {
      return -1;
    }

    const aStartDate: Date = new Date(aStartDateLock.startTime);
    const bStartDate: Date = new Date(bStartDateLock.startTime);

    return aStartDate.getTime() - bStartDate.getTime();
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);

    if (
      !this.battlePassTimeoutInitialized &&
      reduxState.initialization.componentStatus[InitTopic.ChampionInfo] &&
      reduxState.initialization.componentStatus[InitTopic.Quests]
    ) {
      this.battlePassTimeoutInitialized = true;
      this.handleBattlePassUpdate();
    }
  }
}
