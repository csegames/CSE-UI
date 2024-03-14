/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';
import { ObjectiveDetailMessageState } from '../types/Objective';

export type ObjectiveDetailListener = (details: ObjectiveDetailMessageState[]) => void;

export interface ObjectiveDetailMocks {
  triggerObjectiveDetails(details: ObjectiveDetailMessageState[]): void;
}

export interface ObjectiveDetailFunctions {
  bindObjectiveDetailListener(listener: ObjectiveDetailListener): ListenerHandle;
}

const objectiveEventName = 'objectiveDetails.update';

class ObjectiveDetailFunctionsBase implements ObjectiveDetailFunctions, ObjectiveDetailMocks {
  private readonly events = new EventEmitter();

  bindObjectiveDetailListener(listener: ObjectiveDetailListener): ListenerHandle {
    return this.events.on(objectiveEventName, listener);
  }
  triggerObjectiveDetails(details: ObjectiveDetailMessageState[]) {
    this.events.trigger(objectiveEventName, details);
  }
}

class CoherentObjectiveDetailFunctions extends ObjectiveDetailFunctionsBase {
  bindObjectiveDetailListener(listener: ObjectiveDetailListener): ListenerHandle {
    const mockHandle = super.bindObjectiveDetailListener(listener);
    const engineHandle = engine.on(objectiveEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserObjectiveDetailFunctions extends ObjectiveDetailFunctionsBase {}

export const impl: ObjectiveDetailFunctions & ObjectiveDetailMocks = engine.isAttached
  ? new CoherentObjectiveDetailFunctions()
  : new BrowserObjectiveDetailFunctions();
