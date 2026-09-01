import { Draft, createSlice } from '@reduxjs/toolkit';
import { callListCharacters } from '../rest/calls';
import { CallState, clearErrors } from '../rest/callState';
import { buildCallTracking } from '../rest/thunkUtils';

export interface Character {
  id: string;
  name: string;
}

interface DataState extends CallState {
  characters: Character[] | null;
}

const initialState: DataState = {
  characters: null,
  calls: {}
};

export const dataSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    clearData: (state) => {
      state.characters = null;
    }
  },
  extraReducers: (builder) => {
    buildCallTracking(builder, callListCharacters, (state: Draft<DataState>, data: string) => {
      let characters: Character[] | null = null;
      try {
        const json = JSON.parse(data);
        characters = (json['data']['shardCharacters'] as Character[]) ?? null;
        state.calls = clearErrors(state.calls);
      } catch (e) {
        console.log(`Failed to fetch characters`, e);
      }
      state.characters = characters;
    });
  }
});

export const { clearData } = dataSlice.actions;
