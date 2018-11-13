import { DevGameInterface } from './GameInterface';

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare global {
  interface CancellablePromise<T> extends Promise<T> {
    /**
     * Cancels the execution on the client related to this promise.
     * The promise's reject handler will be called with a user cancellation
     * message.
     */
    cancel: () => void;
  }
}

enum TaskStatus {
  Pending,

  // Failed on the game client for any non-specific reason
  Failed,

  // Yay!
  Success,

  // Cancel was called by the UI
  UserCancelled,
}

export interface TaskHandle {
  id: number;
  cancel: () => void;
}

export interface Resolvable<T> extends TaskHandle {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: any) => void;
}

interface TaskResult {
  id: number;
  statusCode: TaskStatus;
  value: any;
  reason: string;
}

export function makeClientPromise<T>(callFn: (game: DevGameInterface, ...args: any[]) => TaskHandle) {
  return function(...args: any[]) {
    const handle = callFn(game as DevGameInterface, ...args);
    _devGame._activeTasks[handle.id] = handle as Resolvable<T>;
    const promise =  new Promise<T>((resolve, reject) => {
      if (_devGame._activeTasks[handle.id]) {
        _devGame._activeTasks[handle.id].resolve = resolve;
        _devGame._activeTasks[handle.id].reject = reject;
      }
    }) as CancellablePromise<T>;
    promise.cancel = () => {
      engine.trigger('CancelTask', handle.id);
    };
    return promise;
  };
}

/**
 * Initializes client task handling
 */
export default function() {
  engine.on('taskComplete', (result: TaskResult) => {
    if (game.debug) {
      console.log(`taskComplete | ${JSON.stringify(result)}`);
    }
    const resolver = _devGame._activeTasks[result.id];
    if (result.statusCode === TaskStatus.Success) {
      resolver.resolve && resolver.resolve(result.value);
    } else {
      resolver.reject && resolver.reject({ statusCode: result.statusCode, errorMessage: result.reason });
    }
    delete _devGame._activeTasks[resolver.id];
  });
}
