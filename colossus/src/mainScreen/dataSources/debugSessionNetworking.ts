/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { setDebugSessions, setMatchAccess } from '../redux/matchSlice';
import {
  DebugSession,
  MatchAccess,
  SessionRemoved,
  SessionUpdated
} from '@csegames/library/dist/hordetest/graphql/schema';
import { showError } from '../redux/navigationSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { convertError, isServiceError } from '../helpers/errorConversionHelpers';
import { ActivitiesAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from './networkConfiguration';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { DebugSessionConfig } from '@csegames/library/dist/_baseGame/types/DebugSessionConfig';
import {
  DebugSessionQueryResult,
  DebugSessionSubscriptionResult,
  debugSessionQuery,
  debugSessionSubscription
} from './debugSessionNetworkingConstants';
import { RootState } from '../redux/store';
import { Dispatch } from 'redux';
import { InitTopic, setInitialized } from '../redux/initializationSlice';

const autoconnectSession: DebugSession = {
  allocated: null,
  completed: null,
  created: null,
  createdBy: null,
  ended: null,
  error: null,
  overrideSheetID: null,
  overrideTabID: null,
  revision: null,
  roundID: 'autoconnect-match-placeholder',
  scenarioID: null,
  serverName: 'localhost',
  serverPort: 6000,
  started: null,
  zoneID: null
};

export class DebugSessionService extends ExternalDataSource {
  private lastConfig: DebugSessionConfig = null;

  protected async bind(): Promise<ListenerHandle[]> {
    if (game.isAutoConnectEnabled) {
      this.dispatch(setMatchAccess(MatchAccess.Online));
      this.dispatch(setDebugSessions([[autoconnectSession], autoconnectSession]));
      this.dispatch(setInitialized({ topic: InitTopic.Matchmaking, result: true }));
      return [];
    }

    return [
      clientAPI.bindDebugSessionConfigListener(this.onDebugSessionConfig.bind(this)),
      await this.query<DebugSessionQueryResult>({ query: debugSessionQuery }, this.handleStatus.bind(this)),
      await this.subscribe<DebugSessionSubscriptionResult>(
        { operationName: 'debug-session', query: debugSessionSubscription },
        this.handleSubscription.bind(this)
      ),
      this.onInitialize(this.refresh.bind(this))
    ];
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    const ready = this.lastConfig && reduxState.initialization.completed && !this.reduxState.initialization.completed;
    super.onReduxUpdate(reduxState, dispatch);
    if (ready && this.lastConfig) this.onDebugSessionConfig(this.lastConfig);
  }

  private async onDebugSessionConfig(config: DebugSessionConfig): Promise<void> {
    this.lastConfig = config;
    if (
      game.isAutoConnectEnabled ||
      !this.reduxState.initialization.completed ||
      this.reduxState.match.currentRound ||
      !config.scenario
    ) {
      return;
    }

    // implicitly request a server allocation
    const response = await ActivitiesAPI.CreateDebugSession(
      webConf,
      config.scenario,
      config.zone,
      config.sheet,
      config.tab
    );
    if (!response.ok) {
      this.dispatch(showError(response));
    }

    // on success, we should receieve updates to our subscription about the current status of our requested allocation
  }

  private async refresh(): Promise<void> {
    await this.query<DebugSessionQueryResult>({ query: debugSessionQuery }, this.handleStatus.bind(this));
  }

  private handleStatus(result: DebugSessionQueryResult): void {
    console.warn('session query update', result);
    const data = result.debugSession;

    if (!data) {
      console.warn('Unable to process match status update');
      return;
    }

    const session = this.oldestDebugSession(data.currentSessions);
    this.dispatch(setDebugSessions([data.currentSessions, session]));
  }

  private handleSubscription(result: DebugSessionSubscriptionResult): void {
    console.warn('session sub update', result);
    const msg = result.debugSessionUpdates;
    switch (msg.type) {
      case 'SessionRemoved': {
        const val = msg as SessionRemoved;

        const removedSession = this.reduxState.match.debugSessions.find((session) => session.roundID === val.roundID);
        if (!removedSession) break;

        const sessions = this.remove(this.reduxState.match.debugSessions, (session) => session.roundID === val.roundID);
        this.dispatch(setDebugSessions([sessions, this.oldestDebugSession(sessions)]));
        break;
      }
      case 'SessionUpdated': {
        const val = msg as SessionUpdated;
        if (!val.session) break;
        const sessions = this.update(
          this.reduxState.match.debugSessions,
          val.session,
          (session) => session.roundID === val.session.roundID,
          (session) => session.roundID >= val.session.roundID
        );

        this.dispatch(setDebugSessions([sessions, this.oldestDebugSession(sessions)]));
        if (isServiceError(val.session.error)) {
          this.dispatch(showError(convertError(val.session.error)));
        }
        break;
      }
    }
  }

  private oldestDebugSession(sessions: DebugSession[]) {
    let currentSession: DebugSession = null;
    let oldestCreated = Number.MAX_SAFE_INTEGER;
    let oldestStarted = Number.MAX_SAFE_INTEGER;
    for (const session of sessions ?? []) {
      if (session.completed) {
        continue;
      }

      // first started match wins
      const started = session.started ? new Date(session.started).valueOf() : Number.MAX_SAFE_INTEGER;
      if (started < oldestStarted) {
        currentSession = session;
        oldestStarted = started;
      }
      if (oldestStarted < Number.MAX_SAFE_INTEGER) {
        continue;
      }

      // first created match is the tiebreaker
      const created = new Date(session.created).valueOf();
      if (created < oldestCreated) {
        currentSession = session;
        oldestCreated = created;
      }
    }
    return currentSession;
  }

  private remove<T>(src: T[], eq: (x: T) => boolean): T[] {
    const index = src.findIndex(eq);
    if (index < 0) return src;
    const out = src.slice();
    out.splice(index, 1);
    return out;
  }

  private update<T>(src: T[], item: T, eq: (x: T) => boolean, stop: (x: T) => boolean): T[] {
    const out = src.slice();
    let index = src.findIndex(stop);
    let matched = false;
    if (index < 0) {
      index = out.length;
    } else {
      matched = eq(src[index]);
    }
    out.splice(index, matched ? 1 : 0, item);
    return out;
  }
}
