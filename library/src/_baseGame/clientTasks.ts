/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseDevGameInterface } from './BaseGameInterface';
import { _devGame } from '.';
import { engine, EngineHandle } from './engine';

export interface CancellablePromise<T> extends Promise<T> {
  /**
   * Cancels the execution on the client related to this promise.
   * The promise's reject handler will be called with a user cancellation
   * message.
   */
  cancel: () => void;
}

export interface TaskHandle {
  id: number;
  cancel: () => void;
}

export interface Resolvable<T> extends TaskHandle {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: any) => void;
  cancelled: boolean;
}

enum TaskStatus {
  Pending,

  // Failed on the game client for any non-specific reason
  Failed,

  // Yay!
  Success,

  // Cancel was called by the UI
  UserCancelled
}

interface TaskResult {
  id: number;
  statusCode: TaskStatus;
  value: any;
  reason: string;
}

export function makeClientPromise<T>(callFn: (_devGame: BaseDevGameInterface, ...args: any[]) => TaskHandle) {
  return function (...args: any[]) {
    const handle = callFn(_devGame, ...args);
    _devGame._activeTasks[handle.id] = handle as Resolvable<T>;
    const promise = new Promise<T>((resolve, reject) => {
      if (_devGame._activeTasks[handle.id]) {
        _devGame._activeTasks[handle.id].resolve = resolve;
        _devGame._activeTasks[handle.id].reject = reject;
      }
    }) as CancellablePromise<T>;
    promise.cancel = () => {
      engine.trigger('CancelTask', handle.id);
      if (_devGame._activeTasks[handle.id]) {
        _devGame._activeTasks[handle.id].cancelled = true;
      }
    };
    return promise;
  };
}

/**
 * Initializes client task handling
 */

function handleResult(result: TaskResult) {
  const resolver = _devGame._activeTasks[result.id];
  const hasResolver = resolver !== null && resolver !== undefined;
  if (_devGame.debug) {
    console.debug(`GAME TASK: taskComplete | ${JSON.stringify(result)} | hasResolver : ${hasResolver}`);
  }
  if (!hasResolver || (result && result.id === 0)) {
    console.error('ClientTasks:handleResult() received result for invalid task', result);
    return;
  }

  if (resolver.cancelled) {
    resolver.reject && resolver.reject({ cancelled: true, errorMessage: 'promise has been cancelled' });
  } else if (result.statusCode === TaskStatus.Success) {
    resolver.resolve && resolver.resolve({ success: true, ...result.value });
  } else {
    resolver.reject && resolver.reject({ statusCode: result.statusCode, errorMessage: result.reason });
  }
  delete _devGame._activeTasks[resolver.id];
}

var handle: EngineHandle | null = null;
export function initClientTasks() {
  if (handle) {
    handle.clear();
  }
  handle = engine.on('taskComplete', handleResult);
}
