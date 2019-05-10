/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSharedState } from 'cseshared/lib/sharedState';

export interface View {
  id: string;
  name: string;
  activeFilter: string; // active room shortcut for this tab
  filter: {
    local: boolean;
    system: boolean;
    combat: boolean;
    rooms: string[]; // ids of rooms shown in this tab
  }
  allowChat: () => boolean;
}

function allowChat(this: View) {
  return this.filter.local ||
    this.filter.rooms.length > 0;
}

interface ViewsState {
  views: { [id: string]: View; }
}

function initialState(): ViewsState {
  return {
    views: {
      default: {
        id: 'default',
        name: 'Default',
        activeFilter: '0000000000000000000001',
        filter: {
          local: true,
          system: true,
          combat: true,
          rooms: ['0000000000000000000001'],
        },
        allowChat,
      },
    },
  };
}

export const useChatViews = createSharedState(
  'chatviews',
  initialState()
);
