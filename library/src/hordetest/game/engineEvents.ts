/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CoherentEventHandle } from '../../_baseGame/coherent';

/**
 * Mapping of Engine Event name => GameInterface callback registration method name for creating
 * event forwarding methods on the GameInterface upon initialization
 */
const regMap: {[key: string]: string} = {};

/**
 * Notify the UI of one or more combat log events
 *
 * Expected behavior: Display combat events information in the UI combat log
 *
 * @param {CombatEvent[]} events An array of Combat events to display in the log
 */
export const EE_CombatEvent = 'combatEvent';
regMap[EE_CombatEvent] = 'onCombatEvent';

/**
 * Announcement message sent from the game client
 *
 * Expected behavior: Displays announcement text on screen
 *
 * @param {AnnouncementType} type Type of the announcement to display
 * @param {String} message Text contents of the announcement to display
 */
export const EE_OnAnnouncement = 'announcement';
regMap[EE_OnAnnouncement] = 'onAnnouncement';

/**
 * Client requests UI navigation for a specific target.
 *
 * Expected behavior: UI toggles element requested by the navigation trigger.
 * eg. navigation request is to 'inventory.open', the UI will open the inventory if it is not open.
 *
 * @param {String} target Navigation target
 */
export const EE_OnNavigate = 'navigate';
regMap[EE_OnNavigate] = 'onNavigate';

/**
 * Called when an option is changed.
 *
 * @param {GameOption} option The changed option
 */
export const EE_OnOptionChanged = 'optionChanged';
regMap[EE_OnOptionChanged] = 'onOptionChanged';

/**
 * Called when a another players position changes relative to your facing.
 */
export const EE_OnPlayerDirectionUpdate = 'playerDirections.update';
regMap[EE_OnPlayerDirectionUpdate] = 'onPlayerDirectionUpdate';

/**
 * Initialize engine event forwarding
 */
export function initEventForwarding() {
  for (const key in regMap) {
    createForwardingMethod(key, regMap[key]);
    if (typeof engine !== 'undefined') {
      engine.on(key, (...args: any[]) => game.trigger(key, ...args));
    }
  }
}

function createForwardingMethod(engineEvent: string, methodName: string) {
  hordetest._devGame[methodName] = function(callback: (...args: any[]) => any): CoherentEventHandle {
    return engine.on(engineEvent, callback);
  };
}
