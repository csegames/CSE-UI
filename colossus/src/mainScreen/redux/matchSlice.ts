/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  ChampionSelection,
  DebugSession,
  GameMode,
  Match,
  MatchAccess,
  Queue,
  QueueEntry
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const AUTOCONNECT_MATCH_PLACEHOLDER = 'autoconnect-match-placeholder';

// HACK : the client is currently authoritative over this data -- once the
// game server can update the status of the match it'll be possible to
// move this to server control
export enum MatchEndSequence {
  GotoStats = 1,
  GotoLobby = 2
}

export interface MatchEndState {
  matchID: string;
  sequence: MatchEndSequence;
}

export interface MatchEndRequest extends MatchEndState {
  refresh: boolean;
}

export interface ConnectionError {
  errorCode: number;
  errorMsg: string;
  fatal: boolean;
  serverName: string;
  roundID: string;
}

export interface QueueRequest {
  queueID: string;
  userTag?: string;
}

export interface SelectionRequest {
  roundID: string;
  championID: string;
  locked: boolean;
}

export interface MatchRequests {
  recalculate?: boolean;
  enqueue?: QueueRequest;
  dequeue?: string;
  select?: SelectionRequest;
}

export interface MatchRequestState {
  active: MatchRequests | null; // async match network processing calls in flight
  queued: MatchRequests | null; // client code -> match network processing
}

export function hasRequest(state: MatchRequestState): boolean {
  return !(!state.active && !state.queued);
}

export function mergeRequests(prev: MatchRequests | null, requested: MatchRequests): MatchRequests {
  if (prev === null) return requested;
  return { ...prev, ...requested };
}

function clearEnqueue(current?: QueueRequest, toClear?: QueueRequest): boolean {
  // only need 1 factor to match for it to be considered the same request
  return !current || (toClear && (current.queueID == toClear.queueID || current.userTag == toClear.userTag));
}

function clearSelect(current?: SelectionRequest, toClear?: SelectionRequest): boolean {
  return (
    !current ||
    (toClear &&
      current.championID == toClear.championID &&
      current.roundID == toClear.roundID &&
      (!current.locked || toClear.locked)) // if current is locked, toClear must be locked
  );
}

function resolveRequests(current: MatchRequests | null, toClear: MatchRequests): MatchRequests {
  if (current === null) return null;

  const result = cloneDeep(current); // strip proxy for compare

  if (result.recalculate === toClear.recalculate) delete result.recalculate;
  if (result.dequeue === toClear.dequeue) delete result.dequeue;
  if (clearEnqueue(result.enqueue, toClear.enqueue)) delete result.enqueue;
  if (clearSelect(result.select, toClear.select)) delete result.select;
  return Object.keys(result).length === 0 ? null : result;
}

export type Round = DebugSession | Match;

export function isMatch(round: Round): round is Match {
  return round && (round as Match).rosters !== undefined;
}

export function isDebugSession(round: Round): round is DebugSession {
  return round && (round as DebugSession).createdBy !== undefined;
}

interface MatchState {
  access: MatchAccess;
  currentEntry: QueueEntry | null;
  currentRound: Round | null;
  currentSelection: ChampionSelection | null;
  defaultQueueID: string;
  debugSessions: DebugSession[];
  entries: QueueEntry[];
  matches: Match[];
  matchEnds: Dictionary<MatchEndSequence>;
  modes: GameMode[];
  queues: Queue[];
  selections: ChampionSelection[];
  connectionError: ConnectionError | null;
  requests: MatchRequestState;
}

const defaultMatchState: MatchState = {
  access: MatchAccess.Offline,
  currentEntry: null,
  currentRound: null,
  currentSelection: null,
  defaultQueueID: null,
  debugSessions: [],
  entries: [],
  matches: [],
  matchEnds: {},
  modes: [],
  queues: [],
  selections: [],
  connectionError: null,
  requests: {
    queued: null,
    active: null
  }
};

export const matchSlice = createSlice({
  name: 'match',
  initialState: defaultMatchState,
  reducers: {
    acceptMatchRequests: (state: MatchState, action: PayloadAction<MatchRequests>) => {
      state.requests.active = mergeRequests(state.requests.active, action.payload);
      state.requests.queued = resolveRequests(state.requests.queued, action.payload);
    },
    resolveMatchRequests: (state: MatchState, action: PayloadAction<MatchRequests>) => {
      state.requests.active = resolveRequests(state.requests.active, action.payload);
    },
    resetMatchRequests: (state: MatchState) => {
      state.requests.queued = null;
      state.requests.active = null;
    },
    clearQueueEntries: (state: MatchState) => {
      // clobber all queue state because we have a selection
      if (state.requests.active) {
        const { enqueue, dequeue } = state.requests.active;
        state.requests.active = resolveRequests(state.requests.active, { enqueue, dequeue });
      }
      if (state.requests.queued) {
        const { enqueue, dequeue } = state.requests.queued;
        state.requests.active = resolveRequests(state.requests.queued, { enqueue, dequeue });
      }
      state.currentEntry = null;
      state.entries = [];
    },
    enterQueue: (state: MatchState, action: PayloadAction<QueueRequest>) => {
      // by queue id
      state.requests.queued = mergeRequests(state.requests.queued, { enqueue: action.payload });
    },
    leaveQueue: (state: MatchState, action: PayloadAction<string>) => {
      // by queue or entry id
      state.requests.queued = mergeRequests(state.requests.queued, { dequeue: action.payload });
    },
    setDefaultQueue: (state: MatchState, action: PayloadAction<string>) => {
      state.defaultQueueID = action.payload;
    },
    selectChampion: (state: MatchState, action: PayloadAction<SelectionRequest>) => {
      state.requests.queued = mergeRequests(state.requests.queued, { select: action.payload });
    },
    setConnectionError: (state: MatchState, action: PayloadAction<ConnectionError>) => {
      state.connectionError = action.payload;
      state.requests.queued = mergeRequests(state.requests.queued, { recalculate: true });
    },
    setDebugSessions: (state: MatchState, action: PayloadAction<[DebugSession[], DebugSession]>) => {
      state.debugSessions = action.payload[0];
      const session = action.payload[1];

      if (isMatch(state.currentRound)) return; // do not overwrite a match with a debug session

      state.currentRound = session;
      state.requests.queued = mergeRequests(state.requests.queued, { recalculate: true });
    },
    setGameModes: (state: MatchState, action: PayloadAction<GameMode[]>) => {
      state.modes = action.payload;
    },
    setMatches: (state: MatchState, action: PayloadAction<[Match[], Match]>) => {
      const [matches, currentRound] = action.payload;
      const roundID = currentRound?.roundID;
      if (roundID !== state.currentRound?.roundID) {
        if (roundID) console.log(`Entered match ${roundID}`);
        else console.log('Exited match');
      }
      state.matches = matches;
      state.currentRound = currentRound ?? state.currentRound; // stomp debug session with match if necessary
    },
    setMatchAccess: (state: MatchState, action: PayloadAction<MatchAccess>) => {
      state.access = action.payload;
    },
    setMatchEnd: (state: MatchState, action: PayloadAction<MatchEndRequest>) => {
      if (!action.payload.matchID) return;
      var prev = state.matchEnds[action.payload.matchID];
      if (
        prev === undefined ||
        prev < action.payload.sequence ||
        action.payload.matchID == AUTOCONNECT_MATCH_PLACEHOLDER
      ) {
        // never go backward if the matchmaker is enabled
        state.matchEnds[action.payload.matchID] = action.payload.sequence;
      }
      if (action.payload.refresh) {
        state.requests.queued = mergeRequests(state.requests.queued, { recalculate: true });
      }
    },
    setQueues: (state: MatchState, action: PayloadAction<Queue[]>) => {
      state.queues = action.payload;
    },
    setQueueEntries: (state: MatchState, action: PayloadAction<[QueueEntry[], QueueEntry]>) => {
      [state.entries, state.currentEntry] = action.payload;
    },
    setSelections: (state: MatchState, action: PayloadAction<[ChampionSelection[], ChampionSelection]>) => {
      [state.selections, state.currentSelection] = action.payload;
    }
  }
});

export const {
  acceptMatchRequests,
  resolveMatchRequests,
  resetMatchRequests,
  clearQueueEntries,
  enterQueue,
  leaveQueue,
  selectChampion,
  setConnectionError,
  setDebugSessions,
  setDefaultQueue,
  setGameModes,
  setMatches,
  setMatchAccess,
  setMatchEnd,
  setQueues,
  setQueueEntries,
  setSelections
} = matchSlice.actions;
