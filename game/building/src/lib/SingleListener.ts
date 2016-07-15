/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class SingleListener {

  /*
  There is no way to remove listeners from the camelot-unchained client,so we need to track the listeners ourselves. 
  This class allows us to register one primary listener that will notify a list of listeners that we control
  Be careful where this is constructed or you will end registering this listener multiple times and end up with
   the same issue that it is trying to solve.
  */

  private initialized: boolean = false;

  private initializer: any;

  private callbacks: any[] = [];

  constructor(initialize: (callback: any) => void) {
    this.initializer = initialize;
  }

  public listen(callback: any) {

    this.callbacks.push(callback);

    if (!this.initialized) {
      this.initialized = true;
      let me: SingleListener = this;

      //have to use a standard function declaration here because the 
      //real arguments variable is not available in the ()=> syntax
      this.initializer(function() {
         me.invokeCallbacks([].slice.call(arguments))
        }
      )
    }
  }

  public unlisten(callback: any) {
    const index: number = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  private invokeCallbacks(callbackArgs: any[]) {
    this.callbacks.forEach((callback: Function) => {
      callback.apply(this, callbackArgs);
    })
  }
}

export default SingleListener;