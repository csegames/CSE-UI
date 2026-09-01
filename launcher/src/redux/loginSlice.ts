import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginInfo } from '../api/patcher/loginInfo';
import { PatchPermissions } from '../api/patcher/patchPermissions';

interface TokenState {
  accessToken: string | null;
  permissions: Record<number, PatchPermissions>;
}

type LoginState = LoginInfo & TokenState;

const DefaultState: LoginState = {
  accessToken: null,
  permissions: {},
  email: '',
  name: '',
  error: '',
  remember: false
};

export const loginSlice = createSlice({
  name: 'login',
  initialState: DefaultState,
  reducers: {
    clearLoginError: (state: LoginState) => {
      return { ...state, error: '' };
    },
    updateEmail: (state: LoginState, action: PayloadAction<string>) => {
      return { ...state, email: action.payload };
    },
    updateLogin: (state: LoginState, action: PayloadAction<LoginInfo>) => {
      return { ...state, ...action.payload };
    },
    updateRemember: (state: LoginState, action: PayloadAction<boolean>) => {
      return { ...state, remember: action.payload };
    },
    updateToken: (state: LoginState, action: PayloadAction<TokenState>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { clearLoginError, updateLogin, updateToken, updateEmail, updateRemember } = loginSlice.actions;
