/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSharedState } from '../../../lib/sharedState';

export interface ChatTab {
  id: string;
  name: string;
  activeShortcut: string; // active room shortcut for this tab
  filter: {
    local: boolean;
    system: boolean;
    combat: boolean;
    rooms: string[]; // ids of rooms shown in this tab
  }
  allowChat: () => boolean;
}

function allowChat(this: ChatTab) {
  return this.filter.local ||
    this.filter.rooms.length > 0;
}

interface TabsState {
  activeTab: string;
  tabs: { [id: string]: ChatTab; }
}

function initialState(): TabsState {
  return {
    activeTab: 'default',
    tabs: {
      default: {
        id: 'default',
        name: 'Default',
        activeShortcut: null,
        filter: {
          local: true,
          system: true,
          combat: false,
          rooms: [],
        },
        allowChat,
      },
      combat: {
        id: 'combat',
        name: 'Combat',
        activeShortcut: null,
        filter: {
          local: false,
          system: false,
          combat: true,
          rooms: [],
        },
        allowChat,
      }
    },
  };
}

export const useChatTabs = createSharedState(
  'chattabs',
  initialState()
);
