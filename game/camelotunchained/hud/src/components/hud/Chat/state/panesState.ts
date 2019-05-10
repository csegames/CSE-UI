/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSharedState } from 'cseshared/lib/sharedState';

export interface ChatPane {
  id: string;
  tabs: string[]; // what tabs to show and the order they are shown
  position: {
    width: number;
    height: number;
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
        tabs: ['default', 'combat'],
        position: {
          width: 500,
          height: 300,
        },
      },
    },
  };
}

export const useChatPanes = createSharedState(
  'chatpanes',
  initialState()
);
