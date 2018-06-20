/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as events  from '../events';

export interface SlashCommand {
  command: string;
  helpText: string;
}

if (!window['cu']) window['cu'] = {};
window['cu'].slashCommandRegistry = [];

function prefix(command: string): string {
  return `slash_${command}`;
}

/**
 * Registers a method to be executed when a slash command is entered in the chat
 * window.
 */
export function registerSlashCommand(command: string, helpText: string, callback: (args: string) => void) {
  const cmd = command.toLowerCase();
  let found = false;
  for (let i = 0; i < window['cu'].slashCommandRegistry.length; ++i) {
    if (window['cu'].slashCommandRegistry[i].command === cmd) {
      found = true;
      break;
    }
  }
  if (!found) window['cu'].slashCommandRegistry.push({ helpText, command: cmd });
  events.on(prefix(cmd), callback);
}

/**
 * Un registers a slash command.  WARNING: this will register all occurances
 * of this command. If this was registered by multiple modules, ALL other modules
 * listening for this command will stop working.
 */
export function unregisterSlashCommand(command: string) {
  const cmd = command.toLowerCase();
  let index = -1;
  for (let i = 0; i < window['cu'].slashCommandRegistry.length; ++i) {
    if (window['cu'].slashCommandRegistry[i].command === cmd) {
      index = i;
      break;
    }
  }
  if (index >= 0) window['cu'].slashCommandRegistry.slice(index, 1);
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
  const cmd = split[0].toLowerCase();
  let found = false;
  for (let i = 0; i < window['cu'].slashCommandRegistry.length; ++i) {
    if (window['cu'].slashCommandRegistry[i].command === cmd.toLowerCase()) {
      events.fire(prefix(cmd), split[1]);
      found = true;
      break;
    }
  }
  return found;
}

export function getSlashCommands(): SlashCommand[] {
  return window['cu'].slashCommandRegistry.slice(0);
}
