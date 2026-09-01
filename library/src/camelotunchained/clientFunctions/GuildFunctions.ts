/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { GuildSnapshot } from '../game/GameClientModels/GuildSnapshot';

const guildUpdatedEvent = 'guild.updated';

export type GuildListener = (guild: GuildSnapshot) => void;

export interface GuildMocks {
  triggerGuildUpdated(guild: GuildSnapshot): void;
}

export interface GuildFunctions {
  bindGuildListener(listener: GuildListener): ListenerHandle;
}

class GuildFunctionsBase implements GuildFunctions, GuildMocks {
  private readonly events = new EventEmitter();

  bindGuildListener(listener: GuildListener): ListenerHandle {
    return this.events.on(guildUpdatedEvent, listener);
  }
  triggerGuildUpdated(guild: GuildSnapshot): void {
    this.events.trigger(guildUpdatedEvent, guild);
  }
}

class CoherentGuildFunctions extends GuildFunctionsBase {
  bindGuildListener(listener: GuildListener): ListenerHandle {
    const mockHandle = super.bindGuildListener(listener);
    const engineHandle = engine.on(guildUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserGuildFunctions extends GuildFunctionsBase {}

export const impl: GuildFunctions & GuildMocks = engine.isAttached
  ? new CoherentGuildFunctions()
  : new BrowserGuildFunctions();
