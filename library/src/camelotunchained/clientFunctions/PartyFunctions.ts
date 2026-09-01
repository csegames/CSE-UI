/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { PartySnapshot } from '../game/GameClientModels/PartySnapshot';

const partyUpdatedEvent = 'party.updated';

export type PartyListener = (party: PartySnapshot) => void;

export interface PartyMocks {
  triggerPartyUpdated(party: PartySnapshot): void;
}

export interface PartyFunctions {
  bindPartyListener(listener: PartyListener): ListenerHandle;
}

class PartyFunctionsBase implements PartyFunctions, PartyMocks {
  private readonly events = new EventEmitter();

  bindPartyListener(listener: PartyListener): ListenerHandle {
    return this.events.on(partyUpdatedEvent, listener);
  }
  triggerPartyUpdated(party: PartySnapshot): void {
    this.events.trigger(partyUpdatedEvent, party);
  }
}

class CoherentPartyFunctions extends PartyFunctionsBase {
  bindPartyListener(listener: PartyListener): ListenerHandle {
    const mockHandle = super.bindPartyListener(listener);
    const engineHandle = engine.on(partyUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserPartyFunctions extends PartyFunctionsBase {}

export const impl: PartyFunctions & PartyMocks = engine.isAttached
  ? new CoherentPartyFunctions()
  : new BrowserPartyFunctions();
