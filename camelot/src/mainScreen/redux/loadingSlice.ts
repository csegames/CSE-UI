/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO: [CU-12497] Add back interactive alerts query to phoenixed CU UI

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';
import { graphQL } from './graphQL';
import { store } from './store';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { addErrorNotice } from '../redux/errorNoticesSlice';

// BEGIN QUEUE FAILURE/TIMEOUT HELPERS

const QUEUE_TIMEOUT_MS = 5000;
let queueTimeoutID: number = 0;
const StringIDNetworkFailureConnectFailed = 'NetworkFailureConnectFailed';

// Disconnect and show an error
function handleQueueFailure(): void {
  clientAPI.disconnect();
  clientAPI.setCharacter('').then(() => {
      if (graphQL.connected) {
        graphQL.reset();
      }
    });
  let stringTable = store.getState().stringTable.stringTable;
  store.dispatch(addErrorNotice(getStringTableValue(StringIDNetworkFailureConnectFailed, stringTable)));
}

function startQueueTimeout(): void {
  queueTimeoutID = window.setTimeout(() => {
    handleQueueFailure();
  }, QUEUE_TIMEOUT_MS);
}

function cancelQueueTimeout(): void {
  if (queueTimeoutID !== 0) {
    window.clearTimeout(queueTimeoutID);
    queueTimeoutID = 0;
  }
}

function shouldStartQueueTimeout(loadingState: LoadingState): boolean {
  const isWaitingOnServer = loadingState.connectionStatus === ConnectionStatus.Connecting ||
    (loadingState.connectionStatus === ConnectionStatus.Connected && loadingState.loadingPhase !== null);
  return isWaitingOnServer &&
    loadingState.queueID === null &&
    loadingState.roundID === null;
}

// BEGIN INTERFACES AND STATES

export const ZONE_ID_NONE = '0';

export enum LoadingTopic {
  Abilities = 'abilities',
  HUDWidgets = 'hudWidgets',
  // InteractiveAlerts = 'interactiveAlerts',
  ShardCharacters = 'shardCharacters',
  Party = 'party',
  Zones = 'zones'
}

export interface LoadingState {
  connectionStatus: ConnectionStatus;
  zoneID: string;
  componentStatus: Dictionary<boolean | null>;
  initCompleted: boolean;
  loadingPhase: string | null;
  uninitializedTopics: LoadingTopic[];
  gameDefsLoaded: boolean;
  subscribedToQueues: boolean;
  queueID: string | null;
  roundID: string | null;
}

export interface InitializationResult {
  topic: LoadingTopic;
  result: boolean;
}

const initialStatus: Dictionary<boolean | null> = {};

Object.values(LoadingTopic).forEach((topic) => {
  initialStatus[topic] = null;
});

const defaultState: LoadingState = {
  connectionStatus: ConnectionStatus.Unknown,
  zoneID: ZONE_ID_NONE,
  componentStatus: initialStatus,
  initCompleted: false,
  loadingPhase: null,
  uninitializedTopics: Object.values(LoadingTopic),
  gameDefsLoaded: false,
  subscribedToQueues: false,
  queueID: null,
  roundID: null
};

export const loadingSlice = createSlice({
  name: 'initialization',
  initialState: defaultState,
  reducers: {
    setInitialized: (state: LoadingState, action: PayloadAction<InitializationResult>) => {
      // If this has already been initialized, no need to do it again!
      if (state.componentStatus[action.payload.topic] === action.payload.result) {
        return;
      }

      state.componentStatus[action.payload.topic] = action.payload.result;
      state.uninitializedTopics = Object.keys(state.componentStatus).filter(
        (key) => !state.componentStatus[key]
      ) as LoadingTopic[];
      let completed = true;
      let readyCount: number = 0;
      for (const status of Object.values(state.componentStatus)) {
        switch (status) {
          case undefined:
          case null:
            completed = false;
            break;
          default:
            ++readyCount;
            break;
        }
      }

      const debugText = `Init ${readyCount}/${Object.keys(initialStatus).length}: ${action.payload.topic} ${
        action.payload.result ? 'ready!' : 'failed!'
      }`;
      if (action.payload.result) {
        console.log(debugText);
      } else {
        console.warn(debugText);
      }

      if (completed && !state.initCompleted) {
        // We set and clear to erase the hardcoded initial value.
        clientAPI.setInitializationComplete();
      }
      state.initCompleted = completed;
    },
    setLoadingPhase: (state: LoadingState, action: PayloadAction<string | null>) => {
      state.loadingPhase = action.payload;
    },
    setConnectionStatus: (state: LoadingState, action: PayloadAction<{ status: ConnectionStatus; zoneID: string }>) => {
      state.connectionStatus = action.payload.status;
      state.zoneID = action.payload.zoneID;
      cancelQueueTimeout();
      if (shouldStartQueueTimeout(state)) {
        startQueueTimeout();
      }
    },
    setGameDefsLoaded: (state: LoadingState) => {
      state.gameDefsLoaded = true;
    },
    setSubscribedToQueues: (state: LoadingState, action: PayloadAction<boolean>) => {
      state.subscribedToQueues = action.payload;
    },
    setQueueID: (state: LoadingState, action: PayloadAction<{ queueID: string | null, error: string | null }>) => {
      state.queueID = action.payload.queueID;
      cancelQueueTimeout();
      if (action.payload.error) {
        window.setTimeout(() => {
          handleQueueFailure();
        });
      }
      else if (shouldStartQueueTimeout(state)) {
        startQueueTimeout();
      }
    },
    setRoundID: (state: LoadingState, action: PayloadAction<string | null>) => {
      state.roundID = action.payload;
      cancelQueueTimeout();
      if (shouldStartQueueTimeout(state)) {
        startQueueTimeout();
      }
    }
  }
});

export const { setConnectionStatus, setLoadingPhase, setGameDefsLoaded, setInitialized, setSubscribedToQueues, setQueueID, setRoundID } = loadingSlice.actions;
