/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseDevGameInterface } from "./BaseGameInterface";
import { CoherentEventHandle } from "./index";

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
  UserCancelled,
}

interface TaskResult {
  id: number;
  statusCode: TaskStatus;
  value: any;
  reason: string;
}

export function makeClientPromise<T>(callFn: (game: BaseDevGameInterface, ...args: any[]) => TaskHandle) {
  return function(...args: any[]) {
    const handle = callFn(game as BaseDevGameInterface, ...args);
    if (game.debug) {
      console.log(`GAME TASK: NEW ACTIVE TASK ${handle.id} cancel=${typeof handle.cancel}`);
    }

    _devGame._activeTasks[handle.id] = handle as Resolvable<T>;
    const promise =  new Promise<T>((resolve, reject) => {
      if (_devGame._activeTasks[handle.id]) {
        _devGame._activeTasks[handle.id].resolve = resolve;
        _devGame._activeTasks[handle.id].reject = reject;
        if (game.debug) {
          console.log(`GAME TASK: ACTIVE TASK ${JSON.stringify(_devGame._activeTasks[handle.id])}`);
        }
      }
    }) as CancellablePromise<T>;
    promise.cancel = () => {
      if (game.debug) {
        console.log(`GAME TASK: CANCEL TASK ${handle.id}`);
      }
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
  console.log('TASK COMPLETE callback');
  if (game.debug) {
    console.log(`GAME TASK: taskComplete | ${JSON.stringify(result)}`);
  }
  const resolver = _devGame._activeTasks[result.id];
  if (game.debug) {
    console.log(`GAME TASK: RESOLVE TASK ${JSON.stringify(_devGame._activeTasks[result.id])}`);
  }

  if (resolver && !resolver.cancelled) {
    if (result.statusCode === TaskStatus.Success) {
      resolver.resolve && resolver.resolve({ success: true, ...result.value });
    } else {
      resolver.reject && resolver.reject({ statusCode: result.statusCode, errorMessage: result.reason });
    }
  } else {
    console.error('CancellablePromise: resolved after being cancelled');
    resolver.reject && resolver.reject({ cancelled: true, errorMessage: 'promise has been cancelled' });
  }

  delete _devGame._activeTasks[resolver.id];
}

var handle: CoherentEventHandle = null;
export default function() {
  if (typeof engine !== 'undefined') {
    if (handle) {
      handle.clear();
    }

    handle = engine.on('taskComplete', handleResult);
  }
}
