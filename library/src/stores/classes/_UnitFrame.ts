/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import events from '../../events/events';
import Combatant from '../../core/classes/Combatant';

const _UnitFrame = {
  started: false,
  init() {
    // Initialise the store is basic info.  This is so that React components
    // can use the Store to initialise their state in getDefaultState().
    this.info = new Combatant(<Combatant>{});
  },
  start() {
    const store = this;

    // If this store has already been started, then ingore subsequent start
    // request
    if (this.started) return;
    this.started = true;

    // Listen to the event group for this unit frame
    events.on(this.handles.topic, (instance: Combatant) => {

      // Update store info
      store.info = instance;

      // Trigger changed notification for this store
      store.trigger(store.info);
    });
  },
  stop() {
    // TODO()
  }
};

export default _UnitFrame;
