/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { updateCurrentBattlePass, updateNextBattlePass, updatePreviousBattlePass } from '../redux/questSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
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
      }
    ];
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

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);

    if (!this.battlePassTimeoutInitialized && reduxState.game.gameDefsLoaded) {
      this.battlePassTimeoutInitialized = true;
      this.handleBattlePassUpdate();
    }
  }
}
