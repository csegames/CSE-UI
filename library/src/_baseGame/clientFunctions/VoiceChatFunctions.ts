/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { EventEmitter } from '../types/EventEmitter';
import { ListenerHandle } from '../listenerHandle';
import { VoiceChatMemberSettings } from '../types/VoiceChatMemberSettings';

export type VoiceChatUpdateListener = (accountID: string, settings: VoiceChatMemberSettings) => void;
export type VoiceChatRemoveListener = (accountID: string) => void;
export type ChannelType = 'match' | 'none';

// client -> UI (see UIEvents.h)
const VoiceChatMemberUpdatedEventName = 'voiceChat.memberUpdated';
const VoiceChatMemberRemovedEventName = 'voiceChat.memberRemoved';

// UI -> client (see UIViewListener.cpp)
const SetVoiceChatMemberMutedFuncName = 'voiceChat.SetMemberMuted';
const SetVoiceChannelFuncName = 'voiceChat.SetVoiceChannel';

export interface VoiceChatFunctions {
  bindVoiceChatMemberUpdatedListener(listener: VoiceChatUpdateListener): ListenerHandle;
  bindVoiceChatMemberRemovedListener(listener: VoiceChatRemoveListener): ListenerHandle;
  setVoiceChatMemberMuted(accountID: string, isMuted: boolean): void;
  setVoiceChannel(type: ChannelType, roomID: string): void;
}

export interface VoiceChatMocks {
  triggerVoiceChatMemberUpdated(accountID: string, settings: VoiceChatMemberSettings): void;
  triggerVoiceChatMemberRemoved(accountID: string): void;
}

abstract class VoiceChatFunctionsBase implements VoiceChatFunctions, VoiceChatMocks {
  private readonly events = new EventEmitter();

  bindVoiceChatMemberUpdatedListener(listener: VoiceChatUpdateListener): ListenerHandle {
    return this.events.on(VoiceChatMemberUpdatedEventName, listener);
  }

  bindVoiceChatMemberRemovedListener(listener: VoiceChatRemoveListener): ListenerHandle {
    return this.events.on(VoiceChatMemberRemovedEventName, listener);
  }

  triggerVoiceChatMemberUpdated(accountID: string, settings: VoiceChatMemberSettings): void {
    this.events.trigger(VoiceChatMemberUpdatedEventName, accountID, settings);
  }

  triggerVoiceChatMemberRemoved(accountID: string): void {
    this.events.trigger(VoiceChatMemberRemovedEventName, accountID);
  }

  abstract setVoiceChatMemberMuted(accountID: string, isMuted: boolean): void;
  abstract setVoiceChannel(type: ChannelType, roomID: string): void;
}

class CoherentVoiceChatFunctions extends VoiceChatFunctionsBase {
  bindVoiceChatMemberUpdatedListener(listener: VoiceChatUpdateListener): ListenerHandle {
    const mockHandle = super.bindVoiceChatMemberUpdatedListener(listener);
    const engineHandle = engine.on(VoiceChatMemberUpdatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindVoiceChatMemberRemovedListener(listener: VoiceChatRemoveListener): ListenerHandle {
    const mockHandle = super.bindVoiceChatMemberRemovedListener(listener);
    const engineHandle = engine.on(VoiceChatMemberRemovedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  setVoiceChatMemberMuted(accountID: string, isMuted: boolean): void {
    engine.trigger(SetVoiceChatMemberMutedFuncName, accountID, isMuted);
  }

  setVoiceChannel(type: ChannelType, roomID: string): void {
    engine.trigger(SetVoiceChannelFuncName, type, roomID);
  }
}

class BrowserVoiceChatFunctions extends VoiceChatFunctionsBase {
  setVoiceChatMemberMuted(accountID: string, isMuted: boolean): void {
    console.log(`Set ${accountID} muted = ${isMuted}`);
  }

  setVoiceChannel(type: ChannelType, roomID: string): void {
    console.log(`Set voice channel to ${type} ${roomID}`);
  }
}

export const impl: VoiceChatFunctions & VoiceChatMocks = engine.isAttached
  ? new CoherentVoiceChatFunctions()
  : new BrowserVoiceChatFunctions();
