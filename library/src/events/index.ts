/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { emitter } from './EventEmitter';
import { clientEventTopics } from './defaultTopics';

import BuildingEventTopics from '../building/events/BuildingEventTopics';

import InitListener from './listeners/Init';
import AnnouncementsListener from './listeners/Announcements';
import BeginChatListener from './listeners/BeginChat';
import ChatListener from './listeners/Chat';
import ControlGameListener from './listeners/ControlGame';
import ControlGameScoreListener from './listeners/ControlGameScore';
import InventoryListener from './listeners/Inventory';
import EquippedGearListener from './listeners/EquippedGear';
import ConsoleListener from './listeners/Console';
import LoggingListener from './listeners/Logging';
import PlotListener from './listeners/Plot';
import BlockSelectListener from '../building/events/BlockSelect';
import BuildingModeListener from '../building/events/BuildingMode';
import BlueprintSelectListener from '../building/events/BlueprintSelect';
import BlueprintCopyListener from '../building/events/BlueprintCopy';

export const buildingEventTopics = BuildingEventTopics;
// Listeners
const listeners: any = {
  [clientEventTopics.initialize]: new InitListener(),
  [clientEventTopics.handlesAnnouncements]: new AnnouncementsListener(),
  [clientEventTopics.handlesBeginChat]: new BeginChatListener(),
  [clientEventTopics.handlesChat]: new ChatListener(),
  [clientEventTopics.handlesControlGame]: new ControlGameListener(),
  [clientEventTopics.handlesControlGameScore]: new ControlGameScoreListener(),
  [clientEventTopics.handlesInventory]: new InventoryListener(),
  [clientEventTopics.handlesEquippedGear]: new EquippedGearListener(),
  [clientEventTopics.handlesConsole]: new ConsoleListener(),
  [clientEventTopics.handlesLogging]: new LoggingListener(),
  [clientEventTopics.handlesPlot]: new PlotListener(),
  [buildingEventTopics.handlesBlockSelect]: new BlockSelectListener(),
  [buildingEventTopics.handlesBuildingMode]: new BuildingModeListener(),
  [buildingEventTopics.handlesBlueprintSelect]: new BlueprintSelectListener(),
  [buildingEventTopics.handlesBlueprintCopy]: new BlueprintCopyListener(),
};

/**
 * Register a callback for specified topic.
 * @method on
 * @param topic {string}      The topic name of the event
 * @param callback {function} The handler to be called when the event is triggered.
 *                            Passed the event data as the first argument
 * @return {number} an event handler id (used to stop listening for the event)
 */

export function on(topic: string, callback: (...params: any[]) => void) {
  const listener = listeners[topic];
  if (listener) {
    const handle = emitter.addListener(topic, listener.once, callback);
    listener.start(emitter);
    return handle;
  }
  return emitter.addListener(topic, false, callback);
}

/**
 * Register a callback for specified topic, once only.  Automatically unregisters
 * from the event one triggered.
 * @method once
 * @param topic {string}      The topic name of the event
 * @param callback {function} The handler to be called when the event is triggered.
 *                            Passed the event data as the first argument
 * @return {number} an event handler id (used to stop listening for the event)
 */

export function once(topic: string, callback: (...params: any[]) => void) {
  const listener = listeners[topic];
  if (listener) {
    const handle = emitter.addListener(topic, true, callback);
    listener.start(emitter);
    return handle;
  }
  return emitter.addListener(topic, true, callback);
}

// Unregister from events
/**
 * Register a callback for specified topic, once only.  Automatically unregisters
 * from the event one triggered.
 * @method off
 * @param listener {number} Handle returned from a call to on() once() or addEventListener()
 */

export function off(handle: number) {
  emitter.removeListener(handle);
}

// Fire events
/**
 * Trigger an event for a topic, passing the event data (by reference) to any registered
 * handlers.  If passing by reference is an issue, the caller is responsible for cloning.
 * @method fire
 * @param topic {string}  The topic name of the event
 * @param data {any}      Data to be passed to registered handlers
 */

export function fire(topic: string, ...params: any[]) {
  emitter.emit(topic, ...params);
}

export function diagnostics(): void {
  emitter.diagnostics();
}

export function addListener(topic: string, callback: (...params: any[]) => void) {
  return on(topic, callback);
}

export function removeListener(handle: number) {
  off(handle);
}
