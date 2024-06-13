/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { statsSubscription, StatsSubscriptionResult } from './gameStatsNetworkingConstants';
import {
  acceptGameStatsRequests,
  GameStatsRequests,
  resolveGameStatsRequests,
  setStats
} from '../redux/gameStatsSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { RootState } from '../redux/store';
import { Dispatch } from 'redux';

import { ScenarioAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { showError } from '../redux/navigationSlice';
import { webConf } from './networkConfiguration';

export class GameStatsNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.subscribe<StatsSubscriptionResult>(
        { operationName: 'overmind', query: statsSubscription },
        this.handleSubscription.bind(this)
      )
    ];
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    const toProcess = this.reduxState.gameStats.requests.queued;
    if (toProcess === null || this.reduxState.gameStats.requests.active !== null) {
      return;
    }
    this.dispatch(acceptGameStatsRequests(toProcess));
    window.setTimeout(this.handleRequests.bind(this, toProcess), 0);
  }

  private async handleRequests(requests: GameStatsRequests): Promise<void> {
    const instanceID = this.reduxState.gameStats.overmindSummary?.id;

    if (requests.setThumbsUp !== undefined && instanceID) {
      const response =
        requests.setThumbsUp === ''
          ? await ScenarioAPI.RevokeThumbsUp(webConf, instanceID)
          : await ScenarioAPI.RewardThumbsUp(webConf, instanceID, requests.setThumbsUp);
      if (!response.ok) {
        this.dispatch(showError(response));
        this.dispatch(resolveGameStatsRequests({ setThumbsUp: requests.setThumbsUp }));
      }
    }
    // on success, we wait for graphql subscriptions to give us a state update vs.
    // immediately clearing the request -- this enables a consistent view of the
    // request lifecycle where we have our answer before the request is considered
    // finished.  This will be less messy once we're actually using mutations and
    // dual rest+graphql input systems have been consolidated.
  }

  private handleSubscription(update: StatsSubscriptionResult): void {
    if (!update?.overmindSummaries) {
      console.warn('Received invalid response from GameStats fetch.');
      return;
    }

    this.dispatch(setStats(update.overmindSummaries));
    if (update.overmindSummaries.matchID === this.reduxState.match.currentRound?.roundID) {
      const character = update.overmindSummaries.characterSummaries?.find(
        (c) => c.accountID == this.reduxState.user.id
      );
      if (character) {
        this.dispatch(resolveGameStatsRequests({ setThumbsUp: character.thumbsUpReward ?? '' }));
      }
    }
  }
}
