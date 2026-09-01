import { getCharacterID } from '@csegames/library/dist/_baseGame/utils/characterUtils';
import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { callAuthRenew, callEmailLogin, callSetCharacter, renewCredentials } from '../rest/calls';
import { CallState, clearErrors } from '../rest/callState';
import { buildCallTracking } from '../rest/thunkUtils';

let renewHandle = 0;

function updateCredentials(state: Draft<AuthState>, data: string) {
  const input = JSON.parse(data);
  const timeout = (input['expires_in'] as number) * 10; // * 1000;
  const expires = Date.now() + timeout;
  state.credentials = {
    accessToken: input['access_token'] as string,
    refreshToken: input['refresh_token'] as string,
    screenName: input['screen_name'] as string,
    characterID: getCharacterID(input['access_token' as string]) ?? null,
    expires
  };

  window.clearTimeout(renewHandle);
  renewHandle = window.setTimeout(renewCredentials, timeout);
  state.renewFailures = 0;
}

function retryRenew(state: Draft<AuthState>, requestId: string) {
  const err = state.calls[requestId];
  delete state.calls[requestId];
  state.renewFailures++;
}

interface AuthState extends CallState {
  credentials: Credentials | null;
  renewFailures: number;
}

const initialState: AuthState = {
  credentials: null,
  renewFailures: 0,
  calls: {}
};

export interface Credentials {
  screenName: string;
  accessToken: string;
  refreshToken: string;
  characterID: string | null;
  expires: number;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.calls = clearErrors(state.calls);
    },
    logOut: (state) => {
      state.credentials = null;
      state.renewFailures = 0;
      window.clearTimeout(renewHandle);
      renewHandle = 0;
    },
    updateAuthData: (state, action: PayloadAction<Credentials | null>) => {
      state.credentials = action.payload;
    }
  },
  extraReducers: (builder) => {
    buildCallTracking(builder, callEmailLogin, updateCredentials);
    buildCallTracking(builder, callAuthRenew, updateCredentials, retryRenew);
    buildCallTracking(builder, callSetCharacter, updateCredentials);
  }
});

export const { clearAuthErrors, logOut, updateAuthData } = authSlice.actions;
