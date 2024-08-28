/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { InitTopic, setInitialized } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { matchQuery, matchSubscription, MatchQueryResult, MatchSubscriptionResult } from './matchNetworkingConstants';
import {
  acceptMatchRequests,
  resolveMatchRequests,
  isDebugSession,
  MatchEndSequence,
  MatchRequests,
  resetMatchRequests,
  Round,
  setDefaultQueue,
  setGameModes,
  setMatchAccess,
  setMatchEnd,
  setMatches,
  setQueueEntries,
  setQueues,
  setSelections,
  setConnectionError,
  clearQueueEntries
} from '../redux/matchSlice';
import {
  AccessChanged,
  ChampionSelection,
  DebugSession,
  GameModeRemoved,
  GameModeUpdated,
  Match,
  MatchAccess,
  MatchRemoved,
  MatchUpdated,
  QueueEntry,
  QueueEntryRemoved,
  QueueEntryUpdated,
  QueueRemoved,
  QueueUpdated,
  SelectionRemoved,
  SelectionUpdated
} from '@csegames/library/dist/hordetest/graphql/schema';
import { LifecyclePhase, hideAllOverlays, showError, updateLifecycle } from '../redux/navigationSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { convertError, isServiceError } from '../helpers/errorConversionHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from 'redux';
import { RootState } from '../redux/store';
import { ActivitiesAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { LoadingScreenReason } from '@csegames/library/dist/_baseGame/clientFunctions/LoadingScreenFunctions';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { updateServerTimeDelta } from '../redux/clockSlice';
import { setStatsMatch } from '../redux/gameStatsSlice';
import { webConf } from './networkConfiguration';

const placeholderStringFindingServer = 'Finding server';

let firstUpdate = true;

type LifecycleState = {
  access: MatchAccess;
  currentEntry: QueueEntry | null;
  currentSelection: ChampionSelection | null;
  currentRound: Round | null;
  matchEnds: Dictionary<MatchEndSequence>;
};

export class MatchService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    if (game.isAutoConnectEnabled) {
      return [];
    }

    return [
      clientAPI.bindDefaultQueueListener(this.onDefaultQueueSelected.bind(this)),
      clientAPI.bindNetworkFailureListener(this.onNetworkFailure.bind(this)),
      await this.query<MatchQueryResult>({ query: matchQuery }, this.handleStatus.bind(this), InitTopic.Matchmaking),
      await this.subscribe<MatchSubscriptionResult>(
        { operationName: 'activity', query: matchSubscription },
        this.handleSubscription.bind(this)
      ),
      this.onInitialize(this.refresh.bind(this)),
      this.onDisconnect(this.disconnected.bind(this))
    ];
  }

  private onNetworkFailure(errorMsg: string, errorCode: number, fatal: boolean) {
    const round = this.reduxState.match.currentRound;
    this.dispatch(
      setConnectionError({
        errorMsg: errorMsg,
        errorCode: errorCode,
        fatal: fatal,
        serverName: round?.gameServerAddress,
        roundID: round?.roundID
      })
    );
    if (fatal) {
      this.dispatch(setMatchEnd({ matchID: round.roundID, sequence: MatchEndSequence.GotoLobby, refresh: false }));
    }
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    const toProcess = this.reduxState.match.requests.queued;
    if (toProcess === null || this.reduxState.match.requests.active !== null) {
      return;
    }
    this.dispatch(acceptMatchRequests(toProcess));
    window.setTimeout(this.handleRequests.bind(this, toProcess), 0);
  }

  private onDefaultQueueSelected(queueID: string): void {
    this.dispatch(setDefaultQueue(queueID));
  }

  private async refresh(): Promise<void> {
    await this.query<MatchQueryResult>({ query: matchQuery }, this.handleStatus.bind(this), InitTopic.Matchmaking);
  }

  private async disconnected(): Promise<void> {
    const access = MatchAccess.Offline;
    this.dispatch(setInitialized({ topic: InitTopic.Matchmaking, result: false }));
    this.dispatch(setMatchAccess(access));
    this.dispatch(resetMatchRequests());
    this.updateLifecycle({ ...this.reduxState.match, access });
  }

  private async handleRequests(requests: MatchRequests): Promise<void> {
    if (requests.recalculate) {
      this.updateLifecycle({ ...this.reduxState.match });
      this.dispatch(resolveMatchRequests({ recalculate: requests.recalculate }));
    }

    if (requests.enqueue) {
      const response = await ActivitiesAPI.EnterQueue(webConf, requests.enqueue.queueID, requests.enqueue.userTag);
      if (!response.ok) {
        this.dispatch(showError(response));
        this.dispatch(resolveMatchRequests({ enqueue: requests.enqueue }));
      }
    }

    if (requests.dequeue) {
      const currentEntry = this.reduxState.match.currentEntry;
      if (currentEntry?.entryID) {
        const response = await ActivitiesAPI.ExitQueue(webConf, currentEntry.queueID, currentEntry.entryID);
        if (!response.ok) {
          this.dispatch(showError(response));
          this.dispatch(resolveMatchRequests({ dequeue: requests.dequeue }));
        }
      } else {
        this.dispatch(resolveMatchRequests({ dequeue: requests.dequeue }));
      }
    }

    if (requests.select) {
      const response = await ActivitiesAPI.SetChampion(
        webConf,
        requests.select.reservationID,
        requests.select.championID,
        requests.select.locked
      );
      if (!response.ok) {
        if (response.data) this.dispatch(showError(response));
        this.dispatch(resolveMatchRequests({ select: requests.select }));
      }
    }

    // on success, we wait for graphql subscriptions to give us a state update vs.
    // immediately clearing the request -- this enables a consistent view of the
    // request lifecycle where we have our answer before the request is considered
    // finished.  This will be less messy once we're actually using mutations and
    // dual rest+graphql input systems have been consolidated.
  }

  private handleStatus(result: MatchQueryResult): void {
    if (result.serverTimestamp) {
      // attempt to accurately display times based on estimated server skew
      this.dispatch(updateServerTimeDelta(result.serverTimestamp));
    }

    const data = result.matchmaking;

    if (!data) {
      console.warn('Unable to process match status update');
      return;
    }

    this.dispatch(
      setGameModes(
        [...data.modes].sort((a, b) => {
          if (a.activityID < b.activityID) return -1;
          if (a.activityID > b.activityID) return 1;
          return 0;
        })
      )
    );
    this.dispatch(
      setQueues(
        [...data.queues].sort((a, b) => {
          if (a.queueID < b.queueID) return -1;
          if (a.queueID > b.queueID) return 1;
          return 0;
        })
      )
    );

    const unsortedMatches = data.currentMatches ?? [];
    const matches = [...unsortedMatches].sort((a, b) => {
      if (a.roundID < b.roundID) return -1;
      if (a.roundID > b.roundID) return 1;
      return 0;
    });

    const unsortedEntries = data.currentQueues ?? [];
    const entries = [...unsortedEntries].sort((a, b) => {
      if (a.entryID < b.entryID) return -1;
      if (a.entryID > b.entryID) return 1;
      return 0;
    });

    const unsortedSelections = data.currentSelections ?? [];
    const selections = [...unsortedSelections].sort((a, b) => {
      if (a.reservationID < b.reservationID) return -1;
      if (a.reservationID > b.reservationID) return 1;
      return 0;
    });

    const bestMatch = this.bestFitMatch(matches, this.reduxState.match.matchEnds);
    const currentEntry = this.oldestQueueEntry(entries);
    const currentSelection = this.matchingChampionSelection(bestMatch, selections);

    this.dispatch(setMatchAccess(data.matchAccess));
    this.dispatch(setMatches([matches, bestMatch]));
    this.dispatch(setQueueEntries([entries, currentEntry]));
    this.dispatch(setSelections([selections, currentSelection]));
    this.dispatch(setStatsMatch(bestMatch?.roundID));
    const matchEnds = this.updateMatchEnds(matches, bestMatch, this.reduxState.match.matchEnds);

    this.updateLifecycle({
      access: data.matchAccess,
      currentEntry,
      currentSelection,
      currentRound: bestMatch,
      matchEnds
    });
  }

  private handleSubscription(result: MatchSubscriptionResult): void {
    const msg = result.matchmaking;
    switch (msg.type) {
      case 'AccessChanged': {
        const val = msg as AccessChanged;
        const access = val.access ?? MatchAccess.Forbidden;
        this.dispatch(setMatchAccess(access));
        this.updateLifecycle({ ...this.reduxState.match, access });
        break;
      }
      case 'GameModeRemoved': {
        const val = msg as GameModeRemoved;
        this.dispatch(
          setGameModes(this.remove(this.reduxState.match.modes, (mode) => mode.activityID === val.activityID))
        );
        break;
      }
      case 'GameModeUpdated': {
        const val = msg as GameModeUpdated;
        if (!val.mode) break;
        this.dispatch(
          setGameModes(
            this.update(
              this.reduxState.match.modes,
              val.mode,
              (mode) => mode.activityID === val.mode.activityID,
              (mode) => mode.activityID >= val.mode.activityID
            )
          )
        );
        break;
      }
      case 'MatchRemoved': {
        const val = msg as MatchRemoved;

        const removedMatch = this.reduxState.match.matches.find((match) => match.roundID === val.roundID);
        if (!removedMatch) break;

        const matches = this.remove(this.reduxState.match.matches, (match) => match.roundID === val.roundID);
        const currentRound = this.bestFitMatch(matches, this.reduxState.match.matchEnds);
        const currentSelection = this.matchingChampionSelection(currentRound, this.reduxState.match.selections);
        this.dispatch(setMatches([matches, currentRound]));
        this.dispatch(setSelections([this.reduxState.match.selections, currentSelection]));
        this.dispatch(setStatsMatch(currentRound?.roundID));

        this.updateLifecycle({ ...this.reduxState.match, currentRound });
        break;
      }
      case 'MatchUpdated': {
        const val = msg as MatchUpdated;
        if (!val.match) break;
        const matches = this.update(
          this.reduxState.match.matches,
          val.match,
          (match) => match.roundID === val.match.roundID,
          (match) => match.roundID >= val.match.roundID
        );

        const bestMatch = this.bestFitMatch(matches, this.reduxState.match.matchEnds);
        const currentSelection = this.matchingChampionSelection(bestMatch, this.reduxState.match.selections);
        this.dispatch(setMatches([matches, bestMatch]));
        this.dispatch(setSelections([this.reduxState.match.selections, currentSelection]));
        this.dispatch(setStatsMatch(bestMatch?.roundID));

        const selection = this.dispatchRemovedSelection(val.match.roundID); // round clobbers selection
        const matchEnds = this.updateMatchEnds(matches, bestMatch, this.reduxState.match.matchEnds);

        this.updateLifecycle({
          ...this.reduxState.match,
          currentRound: bestMatch,
          currentSelection: selection[1],
          matchEnds
        });
        if (isServiceError(val.match.error) && val.match.roundID === bestMatch?.roundID) {
          this.dispatch(showError(convertError(val.match.error)));
        }
        break;
      }
      case 'QueueEntryUpdated': {
        const val = msg as QueueEntryUpdated;
        if (!val.entry) break;
        const entries = this.update(
          this.reduxState.match.entries,
          val.entry,
          (entry) => entry.entryID === val.entry.entryID,
          (entry) => entry.entryID >= val.entry.entryID
        );
        const currentEntry = this.oldestQueueEntry(entries);
        this.dispatch(setQueueEntries([entries, currentEntry]));
        this.dispatch(resolveMatchRequests({ enqueue: val.entry }));
        this.updateLifecycle({ ...this.reduxState.match, currentEntry });
        break;
      }
      case 'QueueEntryRemoved': {
        const val = msg as QueueEntryRemoved;
        if (isServiceError(val.error)) {
          this.dispatch(showError(convertError(val.error)));
          this.dispatch(clearQueueEntries());
          break;
        }
        // the queue completed successfully -- defer removal
        // so we visually transition directly into the selection
        window.setTimeout(() => this.dispatch(clearQueueEntries()), 1000);
        break;
      }
      case 'QueueRemoved': {
        const val = msg as QueueRemoved;
        this.dispatch(setQueues(this.remove(this.reduxState.match.queues, (queue) => queue.queueID === val.queueID)));
        break;
      }
      case 'QueueUpdated': {
        const val = msg as QueueUpdated;
        if (!val.queue) break;
        this.dispatch(
          setQueues(
            this.update(
              this.reduxState.match.queues,
              val.queue,
              (queue) => queue.queueID === val.queue.queueID,
              (queue) => queue.queueID >= val.queue.queueID
            )
          )
        );
        break;
      }
      case 'SelectionRemoved': {
        const val = msg as SelectionRemoved;
        const [found, currentSelection] = this.dispatchRemovedSelection(val.reservationID);
        if (found) {
          this.updateLifecycle({ ...this.reduxState.match, currentSelection });
        }
        break;
      }
      case 'SelectionUpdated': {
        const val = msg as SelectionUpdated;
        if (!val.selection) break;
        const selections = this.update(
          this.reduxState.match.selections,
          val.selection,
          (selection) => selection.reservationID === val.selection.reservationID,
          (selection) => selection.reservationID >= val.selection.reservationID
        );
        const currentSelection = this.matchingChampionSelection(this.reduxState.match.currentRound, selections);
        this.dispatch(setSelections([selections, currentSelection]));
        const player = val.selection.players.find((p) => p.id === this.reduxState.user.id);
        if (player?.champion) {
          this.dispatch(
            resolveMatchRequests({
              enqueue: { queueID: val.selection.fromQueue },
              select: {
                reservationID: val.selection.reservationID,
                championID: player.champion.championID,
                locked: player.locked
              }
            })
          );
        }
        this.updateLifecycle({ ...this.reduxState.match, currentSelection });
        break;
      }
    }
  }

  private updateMatchEnds(
    matches: Match[],
    bestMatch: Match | null,
    matchEnds: Dictionary<MatchEndSequence>
  ): Dictionary<MatchEndSequence> {
    // set up stats screen if the active round has completed
    const result = { ...matchEnds };
    for (const match of matches) {
      const sequence = this.calcEndSequence(match, bestMatch);
      if (sequence === undefined || (result[match.roundID] !== undefined && result[match.roundID] <= sequence))
        continue;
      result[match.roundID] = sequence;
      this.dispatch(setMatchEnd({ matchID: match.roundID, sequence, refresh: false }));
    }
    return result;
  }

  private calcEndSequence(match: Match, currentRound?: Round): MatchEndSequence | undefined {
    if (!match.completed) return undefined;
    if (match.error || !this.isRecentMatch(match)) return MatchEndSequence.GotoLobby;
    if (match.roundID == currentRound?.roundID) return MatchEndSequence.GotoStats;
    return MatchEndSequence.GotoLobby;
  }

  // Only process matches from the server that are within 5 minutes of completion; prevents showing stats
  // or reporting an error on an old match on reconnection.
  private isRecentMatch(match: Match) {
    if (!match.completed) {
      return true;
    }
    const delta = getServerTimeMS(this.reduxState.clock.serverTimeDeltaMS) - new Date(match.completed).valueOf();
    return delta < 5 * 60 * 1000;
  }

  // This determines which match the UI will use for display purposes when multiple are present
  private bestFitMatch(matches: Match[], matchEnds: Dictionary<MatchEndSequence>) {
    let bestMatch: Match = null;
    let best: [number, Date] = [0, new Date()];
    for (const match of matches ?? []) {
      const score = this.getScore(match, matchEnds);
      if (score && (score[0] > best[0] || (score[0] == best[0] && score[1] < best[1]))) {
        best = score;
        bestMatch = match;
      }
    }

    // If the match with the best score has already completed, that means that all candidates are completed.
    // We want to resort them so that we only show the most recent stats to the user; the previous sort
    // gives us the lower bound of the completed date range that we can use to initialize this second pass.
    if (bestMatch?.completed) {
      let latest = bestMatch.completed;
      for (const match of matches) {
        if (match.completed > latest) {
          latest = match.completed;
          bestMatch = match;
        }
      }
    }

    return bestMatch;
  }

  // first (integer) is how close we are to ideal state, higher is better
  // second (date) lower is better
  private getScore(match: Match, matchEnds: Dictionary<MatchEndSequence>): [number, Date] | null {
    // do not attempt to display old matches in a new session
    if (!this.isRecentMatch(match)) return null;
    // already seen by the client
    if (matchEnds[match.roundID] === MatchEndSequence.GotoLobby) return null;
    // still relevant for stat display only
    if (match.completed) return [1, new Date(match.completed)];
    // still playable but in epilogue
    if (match.ended) return [2, new Date(match.ended)];
    // best state for us -- started, not completed
    if (match.started) return [5, new Date(match.started)];
    // not started? still better than unconfigured
    if (match.configured) return [4, new Date(match.configured)];
    // newly created? likely we're getting a champion selection
    if (match.created) return [3, new Date(match.created)];
    // not created? can't use it
    return null;
  }

  private oldestQueueEntry(entries: QueueEntry[]) {
    let currentQueue: QueueEntry = null;
    let oldest = Number.MAX_SAFE_INTEGER;
    for (const entry of entries ?? []) {
      const date = new Date(entry.queuedTime).valueOf();
      if (date < oldest) {
        currentQueue = entry;
        oldest = date;
      }
    }
    return currentQueue;
  }

  private matchingChampionSelection(currentRound: Round, selections: ChampionSelection[]) {
    if (!currentRound) return null;
    for (const selection of selections ?? []) {
      if (selection.roundID == currentRound.roundID) return selection;
    }
    return null;
  }

  private updateLifecycle(state: LifecycleState): void {
    const shouldBeConnected = this.shouldBeConnected(state.currentRound, state.matchEnds);
    this.updateGameConnection(shouldBeConnected, state.currentRound);

    const phase = isDebugSession(state.currentRound)
      ? this.calcSessionLifecycle(state.currentRound, state.matchEnds)
      : this.calcMatchLifecycle(state, shouldBeConnected);

    const prev = this.reduxState.navigation.lifecyclePhase;
    const hasOverride = this.reduxState.navigation.phaseOverride != null;
    if (hasOverride || this.handleTransition(prev, phase)) {
      this.dispatch(updateLifecycle(phase));
    }
  }

  private calcSessionLifecycle(
    currentRound: DebugSession | null,
    endSequences: Dictionary<MatchEndSequence>
  ): LifecyclePhase {
    const showStats = endSequences[currentRound?.roundID] === MatchEndSequence.GotoStats;
    return showStats ? LifecyclePhase.GameStats : LifecyclePhase.Playing;
  }

  private calcMatchLifecycle(state: LifecycleState, shouldBeConnected: boolean): LifecyclePhase {
    if (shouldBeConnected) return LifecyclePhase.Playing;
    if (state.currentSelection && state.access == MatchAccess.Online) return LifecyclePhase.ChampionSelect;
    if (state.matchEnds[state.currentRound?.roundID] === MatchEndSequence.GotoStats) return LifecyclePhase.GameStats;
    if (this.isRoundActive(state.currentRound, state.matchEnds)) return LifecyclePhase.Playing;
    return LifecyclePhase.Lobby;
  }

  private isRoundActive(currentRound: Round, endSequences: Dictionary<MatchEndSequence>): boolean {
    return (
      currentRound &&
      !currentRound.completed &&
      (isDebugSession(currentRound) || endSequences[currentRound.roundID] === undefined)
    );
  }

  private shouldBeConnected(currentRound: Round, endSequences: Dictionary<MatchEndSequence>): boolean {
    return currentRound?.gameServerAddress && this.isRoundActive(currentRound, endSequences);
  }

  private updateGameConnection(shouldBeConnected: boolean, currentRound: Round): void {
    if (shouldBeConnected === game.isConnectedOrConnectingToServer) {
      return;
    }

    if (shouldBeConnected) {
      this.dispatch(setConnectionError(null));
      const fragments = currentRound.gameServerAddress.split(':');
      const host = fragments[0];
      const port = Number(fragments[1]);
      game.connectToServer(host, port);
      clientAPI.setVoiceChannel('match', currentRound.roundID ?? '');
      // TODO : connect chat
      return;
    }

    if (game.isConnectedOrConnectingToServer) {
      game.disconnectFromAllServers();
    }
    clientAPI.setVoiceChannel('none', '');
    // TODO : disconnect chat
  }

  private handleTransition(from: LifecyclePhase, to: LifecyclePhase): boolean {
    if (!firstUpdate && from === to) return false;
    firstUpdate = false;

    if (LifecyclePhase.Playing === to && !game.isConnectedToServer) {
      clientAPI.setLoadingScreenManually(LoadingScreenReason.Game, placeholderStringFindingServer);
    } else {
      clientAPI.clearManualLoadingScreen(LoadingScreenReason.Game);
    }

    switch (to) {
      case LifecyclePhase.ChampionSelect:
        // Make sure there are no popups in the way.
        this.dispatch(hideAllOverlays());
        game.playGameSound(SoundEvents.PLAY_USER_FLOW_CHAMP_SELECT);
        break;
      case LifecyclePhase.Playing:
        // Make sure there are no popups in the way.
        this.dispatch(hideAllOverlays());
        game.playGameSound(SoundEvents.PLAY_USER_FLOW_LOADING_SCREEN);
        break;
      default:
        break;
    }
    return true;
  }

  private dispatchRemovedSelection(reservationID: string): [boolean, ChampionSelection] {
    const selection = this.reduxState.match.selections.find((s) => s.reservationID == reservationID);
    if (selection == null) return [false, this.reduxState.match.currentSelection];

    const selections = this.remove(
      this.reduxState.match.selections,
      (selection) => selection.reservationID === reservationID
    );
    const currentSelection = this.matchingChampionSelection(this.reduxState.match.currentRound, selections);
    this.dispatch(setSelections([selections, currentSelection]));
    const active = this.reduxState.match.requests.active;
    if (active?.select?.reservationID === reservationID) {
      this.dispatch(resolveMatchRequests({ select: active.select }));
    }
    return [true, currentSelection];
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
