/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Mock } from './index';
import { EE_OnObjectivesUpdate } from '../engineEvents';

// objectives: ObjectiveEntityState[]

const testData = [{"statuses":{"0":{"duration":null,"startTime":113175439.5,"id":-605420248}},"health":{"current":0,"max":0},"faction":3,"entityID":"29b9462e","itemDefID":3925901537,"objective":{"indicator":0,"visibility":11,"bearingDegrees":316.510498046875,"state":1,"progress":{"current":3000,"max":3000},"footprintRadius":12},"name":"Flamebreath Tower","isAlive":true,"type":"item","iconClass":"fs-icon-point-tower","position":{"x":0,"y":300,"z":50.71875}}];
export const mock: Mock = {
  name: 'Normal Add',
  expectedOutcomeDescription: 'An objective indicator should pop up',
  function: () => {
    console.log('-- Mock adding objective indicator');
    engine.trigger(EE_OnObjectivesUpdate, testData);
  },
}

export const mockRemove: Mock = {
  name: 'Normal Remove',
  expectedOutcomeDescription: 'All objective indicators should be removed',
  function: () => {
    console.log('-- Mock removing objective indicator');
    engine.trigger(EE_OnObjectivesUpdate, []);
  },
}

export const mockNull: Mock = {
  name: 'Null data',
  expectedOutcomeDescription: 'Client should never send this, but if it does, the UI should handle gracefully.',
  function: () => {
    console.log('-- Mock null data to objective indicators');
    engine.trigger(EE_OnObjectivesUpdate, null);
  },
}
