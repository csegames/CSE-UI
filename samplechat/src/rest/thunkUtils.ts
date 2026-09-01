import { ActionReducerMapBuilder, AsyncThunk, createAsyncThunk, Draft, GetThunkAPI } from '@reduxjs/toolkit';
import { CallError, isCallError, toCallError } from './CallError';
import { CallState } from './callState';
import { RequestResult } from './request';

function buildError(msg: RequestResult): CallError {
  try {
    const parsed = msg.json();
    if (isCallError(parsed)) {
      return parsed;
    }
  } catch {}
  const message = msg.statusText || 'Server connection refused';
  return {
    system: 'Legacy',
    type: msg.status.toString(),
    fields: { message }
  };
}

export const createCallThunk = createAsyncThunk.withTypes<{ rejectValue: CallError }>();

export async function handleCall(thunkAPI: GetThunkAPI<{ rejectValue: CallError }>, promise: Promise<RequestResult>) {
  try {
    var result = await promise;
    if (result.ok) {
      return thunkAPI.fulfillWithValue(result.data);
    } else {
      return thunkAPI.rejectWithValue(buildError(result));
    }
  } catch (unknown) {
    return thunkAPI.rejectWithValue(toCallError(unknown));
  }
}

export function buildCallTracking<State extends CallState, Returned, Arg>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, Arg, { rejectValue: CallError }>,
  onSuccess: (state: Draft<State>, returned: Returned) => void,
  onFailure?: (state: Draft<State>, requestID: string) => void
) {
  builder.addCase(thunk.pending, (state, action) => {
    const { requestId } = action.meta;
    state.calls[requestId] = 'pending';
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    const { requestId } = action.meta;
    delete state.calls[requestId];
    onSuccess(state, action.payload);
  });
  builder.addCase(thunk.rejected, (state, action) => {
    const { requestId, aborted } = action.meta;
    if (aborted) {
      delete state.calls[requestId];
      return;
    }
    if (action.payload) state.calls[requestId] = action.payload;
    else if (action.error) state.calls[requestId] = toCallError(action.error);
    if (onFailure) onFailure(state, requestId);
  });
}
