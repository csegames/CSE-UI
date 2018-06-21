/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// This listener handles the cuAPI.OnInitialized.  When the cuAPI is
// initialised, any handlers for the "init" topic (see cu-events.on())
// are triggered.  If a handler is registered for the topic after
// initialisation has already occured, it is triggered immediately.
//
// The cu-events.on() method always calls a listeners start method to
// ensure it is started, this allows this listener to respond to post
// init requests for notification that initialsiation has accured.
// It also checks a listener's once property which if set causes the
// registered handler to be deregistered as soon as it is fired,
// (once time only events).
//
// Usage:
//  import events from 'cu-events';
//  events.on("init", () => {
// // cuAPI initialised / already initialised.
//  });
//

import { EventEmitter } from '../EventEmitter';
import client from '../../core/client';

const EVENT_NAME = 'init';
let initialised = false;

function run(emitter: EventEmitter) {
  function notify() {
    emitter.emit(EVENT_NAME, {});
  }

  if (initialised) {
    notify();
  } else {
    client.OnInitialized(() => {
      initialised = true;
      notify();
    });
  }
}

export default class InitListener {
  public once: boolean;

  constructor() {
    this.once = true;
  }

  public start(emitter: EventEmitter): void {
    // for the init listener, we always want to run it
    // because it may be called post-init, in which case
    // it needs to fire the handler immediately
    run(emitter);
  }
}
