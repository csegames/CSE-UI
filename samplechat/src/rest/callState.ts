import { CallError, isCallError } from './CallError';

export type CallStatus = 'pending' | CallError;

/**
 * Any redux slice that extends CallState can use `buildCallTracking` from thunkUtils and the functions
 * below to automatically handle pending and errored calls gracefully
 */
export type CallState = {
  calls: Record<string, CallStatus>;
};

export function hasPendingCall(calls: Record<string, CallStatus>): boolean {
  for (const value of Object.values(calls)) {
    if (value == 'pending') return true;
  }
  return false;
}

export function getFirstError(calls: Record<string, CallStatus>): CallError | undefined {
  for (const value of Object.values(calls)) {
    if (value == 'pending') continue;
    return value;
  }
  return undefined;
}

export function clearErrors(calls: Record<string, CallStatus>): Record<string, CallStatus> {
  const cleared: Record<string, CallStatus> = {};
  for (const [key, value] of Object.entries(calls)) {
    if (isCallError(value)) continue;
    cleared[key] = value;
  }
  return cleared;
}
