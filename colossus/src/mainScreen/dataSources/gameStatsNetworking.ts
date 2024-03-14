/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import {
  statsQuery,
  StatsQueryResult,
  statsSubscription,
  StatsSubscriptionResult
} from './gameStatsNetworkingConstants';
import { setStats, setThumbsUp } from '../redux/gameStatsSlice';
import {
  AccountID,
  OvermindSummaryAlert,
  ScenarioAlertCategory
} from '@csegames/library/dist/hordetest/graphql/schema';
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { startProfileRefresh } from '../redux/profileSlice';
import { MatchEndSequence, setMatchEnd } from '../redux/matchSlice';

export class GameStatsNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    const scenarioID = this.reduxState.player?.scenarioID;
    const shardID = game.shardID;

    if (scenarioID == null) {
      this.leaveOnFailure();
      return [];
    }

    return [
      await this.query<StatsQueryResult>(
        { query: statsQuery, variables: { scenarioID, shardID } },
        this.handleStatsQueryResult.bind(this)
      ),
      await this.subscribe<StatsSubscriptionResult>(
        { operationName: 'stats', query: statsSubscription, variables: { scenarioID } },
        this.handleSubscriptionUpdate.bind(this)
      )
    ];
  }

  private handleStatsQueryResult(result: StatsQueryResult): void {
    // Validate the result.
    if (!result?.overmindsummary) {
      console.warn('Received invalid response from GameStats fetch.');
      this.leaveOnFailure();
      return;
    }
    this.dispatch(setStats(result.overmindsummary));
  }

  private handleSubscriptionUpdate(statsResult: StatsSubscriptionResult) {
    const result = statsResult?.scenarioAlerts;
    if (!result) {
      console.warn('Got invalid response from Stats subscription.', result);
      return;
    }
    if (result.category !== ScenarioAlertCategory.Summary) return;

    const scenarioAlerts = result as OvermindSummaryAlert;
    const thumbsUp: { [id: string]: [AccountID] } = {};
    for (const summary of scenarioAlerts.summary.characterSummaries) {
      const reward = summary.thumbsUpReward as string;
      if (!reward || reward === '0000000000000000000000') continue;
      if (thumbsUp[reward]) {
        thumbsUp[reward].push(summary.accountID);
      } else {
        thumbsUp[reward] = [summary.accountID];
      }
    }
    this.dispatch(setThumbsUp(thumbsUp));
  }

  private leaveOnFailure(): void {
    this.dispatch(startProfileRefresh());
    this.dispatch(
      setMatchEnd({
        matchID: this.reduxState.match.currentRound?.roundID,
        sequence: MatchEndSequence.GotoLobby,
        refresh: true
      })
    );
  }
}
