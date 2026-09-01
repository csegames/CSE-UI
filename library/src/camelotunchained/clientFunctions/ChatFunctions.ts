/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import Store from '../../_baseGame/utils/local-storage';
import { CHAT_TAB_NAME_MAIN, ChatScopes, ChatTab } from '../game/types/ChatTypes';

// All valid keys for use with this local store should be defined here.
const keyChatTabs = 'ChatTabs';

export type BeginChatListener = (initialText: string) => void;
export type EndChatListener = () => void;
export type TabsUpdatedListener = (tabs: ChatTab[]) => void;

const DEFAULT_CHAT_TABS: ChatTab[] = [
  {
    name: CHAT_TAB_NAME_MAIN,
    scopes: [
      ChatScopes.Console,
      ChatScopes.Error,
      ChatScopes.Global,
      ChatScopes.Guild,
      ChatScopes.Local,
      ChatScopes.Loopback,
      ChatScopes.Officer,
      ChatScopes.Party,
      ChatScopes.Shout,
      ChatScopes.Trade,
      ChatScopes.Warband,
      ChatScopes.Whisper,
      ChatScopes.Zone
    ]
  }
];

const beginChatEvent = 'beginChat';
const endChatEvent = 'endChat';
const tabsUpdatedEvent = 'chat.tabs.updated';

export interface ChatFunctions {
  bindBeginChatListener(listener: BeginChatListener): ListenerHandle;
  bindEndChatListener(listener: EndChatListener): ListenerHandle;
  bindTabsUpdatedListener(listener: TabsUpdatedListener): ListenerHandle;
  getChatTabs(): ChatTab[];
  updateChatTab(tab: ChatTab, renamedFrom?: string): void;
  removeChatTab(name: string): void;
}

export interface ChatMocks {}

abstract class ChatFunctionsBase implements ChatFunctions, ChatMocks {
  private readonly store = new Store('CUChat');
  private readonly events = new EventEmitter();

  public bindTabsUpdatedListener(listener: TabsUpdatedListener): ListenerHandle {
    return this.events.on(tabsUpdatedEvent, listener);
  }
  public getChatTabs(): ChatTab[] {
    return this.store.get<ChatTab[]>(keyChatTabs) ?? DEFAULT_CHAT_TABS;
  }
  public updateChatTab(tab: ChatTab, renamedFrom?: string): void {
    const targetName = renamedFrom ?? tab.name;
    let tabs = this.getChatTabs();

    const index = tabs.findIndex((t) => t.name === targetName);
    if (index >= 0) {
      tabs[index] = tab;
    } else {
      tabs.push(tab);
    }
    this.store.set(keyChatTabs, tabs);
    this.events.trigger(tabsUpdatedEvent, tabs);
  }

  public removeChatTab(name: string): void {
    let tabs = this.getChatTabs();

    const index = tabs.findIndex((t) => t.name === name);
    if (index >= 0) {
      tabs.splice(index, 1);
      this.store.set(keyChatTabs, tabs);
      this.events.trigger(tabsUpdatedEvent, tabs);
    }
  }

  abstract bindBeginChatListener(listener: BeginChatListener): ListenerHandle;
  abstract bindEndChatListener(listener: EndChatListener): ListenerHandle;
}

class CoherentChatFunctions extends ChatFunctionsBase {
  bindBeginChatListener(listener: BeginChatListener): ListenerHandle {
    const innerHandle = engine.on(beginChatEvent, listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }

  bindEndChatListener(listener: EndChatListener): ListenerHandle {
    const innerHandle = engine.on(endChatEvent, listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
}

class BrowserChatFunctions extends ChatFunctionsBase {
  bindBeginChatListener(listener: BeginChatListener): ListenerHandle {
    return { close() {} };
  }
  bindEndChatListener(listener: EndChatListener): ListenerHandle {
    return { close() {} };
  }
}

export const impl: ChatFunctions & ChatMocks = engine.isAttached
  ? new CoherentChatFunctions()
  : new BrowserChatFunctions();
