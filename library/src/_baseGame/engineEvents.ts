import { CoherentEventHandle } from "./coherent";

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Mapping of Engine Event name => GameInterface callback registration method name for creating
 * event forwarding methods on the GameInterface upon initialization
 */
export const regMap: {[key: string]: string} = {};

/**
 * Begin chat is fired by the game client to tell the UI that the user wishes to begin sending a chat message.
 *
 * Expected behavior: The chat input element will gain focus and accept text input.
 *
 * @param {String} message Optional: A message to auto-populate into the chat input.
 */
export const EE_BeginChat = 'beginChat';
regMap[EE_BeginChat] = 'onBeginChat';

/**
 * Send a string to be displayed in the UI's console interface
 *
 * Expected behavior: Display the provided text in the console
 *
 * @param {String} text Text to be displayed in the console
 */
export const EE_ConsoleText = 'consoleText';
regMap[EE_ConsoleText] = 'onConsoleText';

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
 * Notify the UI of one or more combat log events
 *
 * Expected behavior: Display combat events information in the UI combat log
 *
 * @param {CombatEvent[]} events An array of Combat events to display in the log
 */
export const EE_CombatEvent = 'combatEvent';
regMap[EE_CombatEvent] = 'onCombatEvent';

/**
 * A new / updated DevUI is provided by the client
 *
 * Expected behavior: Displays or hides a DevUI based on the given update information
 *
 * @param {String} id Identifer to uniquely ID a specific DevUI
 * @param {String} rootPage JSON string of a DevUI RootPage.
 */
export const EE_OnUpdateDevUI = 'updateDevUI';
regMap[EE_OnUpdateDevUI] = 'onUpdateDevUI';

/**
 * Called when a keybind is changed.
 *
 * @param {Keybind} keybind The Keybind that changed
 */
export const EE_OnKeybindChanged = 'keybindChanged';
regMap[EE_OnKeybindChanged] = 'onKeybindChanged';

/**
 * PerfHUD - Works on Protected HUD only
 */
export const EE_OnPerfHUDUpdate = 'perfhud.update';
regMap[EE_OnPerfHUDUpdate] = 'onPerfHUDUpdate';

/**
 * Called when the "select" keybind for controllers is pressed.
 */
export const EE_OnControllerSelect = 'select';
regMap[EE_OnControllerSelect] = 'onControllerSelect';

/**
 * Called when there is a network failure. e.g. Game Server shuts down unexpectedly
 */
export const EE_OnNetworkFailure = 'networkFailure';
regMap[EE_OnNetworkFailure] = 'onNetworkFailure';

export const EE_OnAnchorVisibilityChanged = 'anchorVisibilityChanged';
regMap[EE_OnAnchorVisibilityChanged] = 'onAnchorVisibilityChanged';

/**
 * Initialize engine event forwarding
 */
const engineEventHandleMap: { [key: string]: CoherentEventHandle } = {};
export default function() {
  for (const key in regMap) {
    createForwardingMethod(key, regMap[key]);
    if (typeof engine !== 'undefined') {
      if (engineEventHandleMap[key]) {
        engineEventHandleMap[key].clear();
      }

      const handle = engine.on(key, (...args: any[]) => game.trigger(key, ...args));
      engineEventHandleMap[key] = handle;
    }
  }
}

function createForwardingMethod(engineEvent: string, methodName: string) {
  _devGame[methodName] = function(callback: (...args: any[]) => any): CoherentEventHandle {
    return engine.on(engineEvent, callback);
  };
}

