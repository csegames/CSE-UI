/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Promises as results of async method calls to the game client.
 *
 * Due to the synchonous nature of communication between the client and the UI, this promise implementation utilizes
 * objects passed by reference and the coherent event system to provide a promise-like API to async game client calls.
 */

/**
 * Engine Event names
 */
export const EE_OnPromiseFulfilled = 'promiseFulfilled';
export const EE_OnPromiseRejected = 'promiseRejected';

export default function() {
  engine.on(EE_OnPromiseFulfilled, promiseFulfilled);
}

export class ClientPromise<T> implements Promise<T> {
  private onFulfilled: (value: T) => any;
  private onRejected: (reason: any) => any;
  private onFinally: () => void;

  public [Symbol.toStringTag]: 'Promise';
  public then<TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
   onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): ClientPromise<TResult1 | TResult2> {
    this.onFulfilled = onfulfilled;
    this.onRejected = onrejected;
    return new ClientPromise<TResult1 | TResult2>();
  }

  public catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>)
    : ClientPromise<T | TResult> {
    this.onRejected = onrejected;
    return new ClientPromise<T | TResult>();
  }

  public finally(onfinally?: () => void): ClientPromise<T> {
    this.onFinally = onfinally;
    return new ClientPromise<T>();
  }
}


function promiseFulfilled(promise: Promise<any>) {
}
