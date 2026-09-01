import { clearAuthErrors, Credentials } from '../redux/authSlice';
import { createCallThunk, handleCall } from './thunkUtils';
import { request, requestConfig, RequestResult } from './request';
import { store } from '../redux/store';
import { clearErrors } from './callState';

interface LoginParams {
  email: string;
  password: string;
}

interface RefreshParams {
  accessToken: string;
  refreshToken: string;
}

interface SetCharacterInput {
  credentials: Credentials;
  characterID: string;
}

interface SetCharacterParams {
  accessToken: string;
  characterID: string;
  refreshToken: string;
}

const authConfig = requestConfig(process.env.AUTH_HOST ?? 'https://auth.camelotunchained.com');
const apiConfig = requestConfig(process.env.API_HOST ?? 'https://hatcheryapi.camelotunchained.com');

export const API = {
  Login: function (data: LoginParams): Promise<RequestResult> {
    const conf = authConfig();
    return request('POST', conf.url + 'auth/token', { ...conf.headers, Accept: 'application/json' }, {}, data);
  },

  RenewToken: function (data: RefreshParams): Promise<RequestResult> {
    const conf = authConfig();
    return request('PUT', conf.url + 'auth/token', { ...conf.headers, Accept: 'application/json' }, {}, data);
  },

  ListCharacters: function (data: RefreshParams): Promise<RequestResult> {
    const conf = apiConfig();
    return request(
      'POST',
      conf.url + 'graphql',
      { ...conf.headers, Accept: 'application/json' },
      {},
      { query: 'query Query { shardCharacters { id name } }' }
    );
  },

  SetCharacter: function (data: SetCharacterParams): Promise<RequestResult> {
    const conf = apiConfig();
    return request(
      'PUT',
      conf.url + 'v1/characters/token',
      { ...conf.headers, Accept: 'application/json' },
      {},
      { ...data }
    );
  }
};

export const callEmailLogin = createCallThunk('authAPI/emailLogin', async (request: LoginParams, thunkAPI) => {
  return await handleCall(thunkAPI, API.Login(request));
});

export const callAuthRenew = createCallThunk('authAPI/renew', async (credentials: Credentials, thunkAPI) => {
  return await handleCall(
    thunkAPI,
    API.RenewToken({ accessToken: credentials.accessToken, refreshToken: credentials.refreshToken })
  );
});

export const callListCharacters = createCallThunk(
  'shardAPI/listCharacters',
  async (credentials: Credentials, thunkAPI) => {
    return await handleCall(
      thunkAPI,
      API.ListCharacters({ accessToken: credentials.accessToken, refreshToken: credentials.refreshToken })
    );
  }
);

export const callSetCharacter = createCallThunk('shardAPI/setCharacter', async (input: SetCharacterInput, thunkAPI) => {
  const { characterID, credentials } = input;
  return await handleCall(
    thunkAPI,
    API.SetCharacter({ accessToken: credentials.accessToken, characterID, refreshToken: credentials.refreshToken })
  );
});

export function renewCredentials() {
  const creds = store.getState().auth.credentials;
  if (creds) {
    store.dispatch(callAuthRenew(creds));
    store.dispatch(clearAuthErrors());
  }
}
