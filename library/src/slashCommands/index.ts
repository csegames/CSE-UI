/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import events from '../events';

const registry: string[] = [];

function prefix(command: string) : string { return `slash_${command}`}

/**
 * Registers a method to be executed when a slash command is entered in the chat
 * window.
 */
export function registerSlashCommand(command: string, callback: (args: string) => void) {
  if (registry.indexOf(command) == -1) registry.push(command);
  events.on(prefix(command), callback);
}

/**
 * Un registers a slash command.  WARNING: this will register all occurances
 * of this command. If this was registered by multiple modules, ALL other modules
 * listening for this command will stop working.
 */
export function unregisterSlashCommand(command: string) {
  var index = registry.indexOf(command);
  if (index == -1) return;
  registry.slice(index, 1);
  events.off(command);
}


/**
 * parseMessageForSlashCommand is meant to be run on every entered line of text
 * entered into the chat window. If the line of text was a registered slash 
 * command then an event is fired for that command and the function returns true.
 * If no slash command is found, the function returns false and the chat system
 * should handle it however it would normally.
 */
export function parseMessageForSlashCommand(message: string): boolean {
  if (!message.startsWith('/')) return false;
  const split = message.slice(1).split(/ (.+)/);
  if (registry.indexOf(split[0]) == -1) return false;
  events.fire(prefix(split[0]), split[1]);
  return false;
}
