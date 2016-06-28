/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import events from '../events';

export interface SlashCommand {
  command: string;
  helpText: string;
}

const registry: SlashCommand[] = [];

function prefix(command: string) : string { return `slash_${command}`}

/**
 * Registers a method to be executed when a slash command is entered in the chat
 * window.
 */
export function registerSlashCommand(command: string, helpText: string, callback: (args: string) => void) {
  let found = false;
  for (var i = 0; i < registry.length; ++i) {
    if (registry[i].command == command) {
      found = true;
      break;
    }
  }
  if (!found) registry.push({command: command, helpText: helpText});  
  events.on(prefix(command), callback);
}

/**
 * Un registers a slash command.  WARNING: this will register all occurances
 * of this command. If this was registered by multiple modules, ALL other modules
 * listening for this command will stop working.
 */
export function unregisterSlashCommand(command: string) {
  let index = -1;
  for (var i = 0; i < registry.length; ++i) {
    if (registry[i].command == command) {
      events.off(command);
      index = i;
      break;
    }
  }
  if (index >= 0) registry.slice(index, 1);
}


/**
 * parseMessageForSlashCommand is meant to be run on every entered line of text
 * entered into the chat window. If the line of text was a registered slash 
 * command then an event is fired for that command and the function returns true.
 * If no slash command is found, the function returns false and the chat system
 * should handle it however it would normally.
 */
export function parseMessageForSlashCommand(command: string): boolean {
  const split = command.split(/ (.+)/);
  let found = false;
  for (var i = 0; i < registry.length; ++i) {
    if (registry[i].command == split[0]) {
      events.fire(prefix(split[0]), split[1]);
      found = true;
      break;
    }
  }
  return found;
}

export function getSlashCommands(): SlashCommand[] {
  return registry.slice(0);
}
