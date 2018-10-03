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
  // Failed on the game client for any non-specific reason
  Failed,

  // Yay!
  Success,

  // Cancel was called by the UI
  UserCancelled,
}

export interface Task<T> {
  id: number;
  statusCode: TaskStatus;
  value: T;
  errorMessage: string;
  cancel: () => void;
}

export interface TaskResult<T> extends Task<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: any) => void;
}


export function makeClientPromise<T>(callMethod: (...args: any[]) => Task<T>) {
  return function(...args: any[]) {
    const task = callMethod(...args);
    _devGame._activeTasks[task.id] = task as TaskResult<T>;
    const promise =  new Promise<T>((resolve, reject) => {
      if (_devGame._activeTasks[task.id]) {
        _devGame._activeTasks[task.id].resolve = resolve;
        _devGame._activeTasks[task.id].reject = reject;
      }
    }) as CancellablePromise<T>;
    promise.cancel = () => {
      if (_devGame._activeTasks[task.id]) {
        _devGame._activeTasks[task.id].cancel();
      }
    };
    return promise;
  };
}

/**
 * Initializes client task handling
 */
export default function() {
  engine.on('taskComplete', (task: TaskResult<any>) => {
    if (task.statusCode === TaskStatus.Success) {
      task.resolve(task.value);
    } else {
      task.reject({ statusCode: task.statusCode, errorMessage: task.errorMessage });
    }
    delete _devGame._activeTasks[task.id];
  });
}
