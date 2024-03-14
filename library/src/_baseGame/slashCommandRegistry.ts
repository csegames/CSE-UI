/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from './types/EventEmitter';
import { ListenerHandle } from './listenerHandle';

// look for clusters of non-space characters or any block in quotes
const argFinder = /\"(?:\\\"|[^"])*\"|\'(?:\\\'|[^'])*\'|[^"'\s]+/g;

function parseArgs(args: string): string[] {
  const result: string[] = [];
  const matches: string[] = argFinder.exec(args) ?? [''];
  for (const match of matches.slice(1)) {
    switch (match[0]) {
      case '"':
      case "'":
        result.push(match.substring(1, match.length - 1));
        break;
      default:
        result.push(match);
    }
  }
  return result;
}

export interface SlashCommand {
  command: string;
  helpText: string;
}

interface CommandEntry extends SlashCommand {
  handles: CommandListenerHandle[];
}

interface CommandListenerHandle extends ListenerHandle {
  id: number;
  inner: ListenerHandle;
}

export class SlashCommandRegistry<State> {
  private readonly commandBus = new EventEmitter();
  private readonly commands = new Map<string, CommandEntry>();
  private nextId = 1;

  constructor(readonly readState: () => State) {}

  public add(command: string, helpText: string, callback: (data: State, args: string[]) => void): ListenerHandle {
    const cmd = command.toLowerCase();
    let entry = this.commands.get(cmd);
    if (!entry) {
      entry = {
        command,
        helpText,
        handles: []
      };
      this.commands.set(cmd, entry);
    }
    const id = this.nextId++;
    const handle: CommandListenerHandle = {
      id,
      inner: this.commandBus.on(cmd, this.execute.bind(this, callback)),
      close: this.remove.bind(this, cmd, id)
    };
    entry.handles.push(handle);
    return handle;
  }

  // to be called on every entered console line or chat line prefaced with a slash; when
  // this function returns true a command has been executed and the line should be ignored
  // by downstream systems.
  public parse(message: string): boolean {
    const wordEnd = message.indexOf(' ');
    const [cmd, params] =
      wordEnd === -1
        ? [message.substring(wordEnd).toLowerCase(), '']
        : [message.substring(1, wordEnd).toLowerCase(), message.substring(wordEnd + 1)];

    if (this.commands.has(cmd)) {
      this.commandBus.trigger(cmd, params);
      return true;
    }
    return false;
  }

  public list(): SlashCommand[] {
    const commands: SlashCommand[] = [];
    for (const [_, cmd] of this.commands) {
      commands.push(cmd);
    }
    return commands;
  }

  private execute(callback: (data: State, args: string[]) => void, args: string): void {
    callback(this.readState(), parseArgs(args));
  }

  private remove(cmd: string, id: number): void {
    const entry = this.commands.get(cmd);
    const index = entry?.handles.findIndex((h) => h.id === id) ?? -1;
    if (index === -1) {
      return;
    }
    const handler = entry.handles[index];
    handler.inner.close();
    delete entry.handles[index];
    if (entry.handles.length === 0) {
      this.commands.delete(cmd);
    }
  }
}
