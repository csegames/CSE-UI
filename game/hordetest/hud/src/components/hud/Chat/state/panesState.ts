/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSharedState } from 'cseshared/lib/sharedState';

export interface ChatPane {
  id: string;
  views: string[]; // what views to show and the order they are shown
  tabs: string[];
  position: {
    width: number;
    height: number;
    bottom: number;
    left: number;
  };
}

interface PanesState {
  activePane: string;
  panes: { [id: string]: ChatPane; }
}

function initialState(): PanesState {
  return {
    activePane: 'default',
    panes: {
      default: {
        id: 'default',
        views: ['default'],
        tabs: ['default'],
        position: {
          width: 500,
          height: 200,
          bottom: 260,
          left: 25,
        },
      },
    },
  };
}

export const useChatPanes = createSharedState(
  'chatpanes',
  initialState()
);
