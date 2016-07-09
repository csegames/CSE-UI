/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {BuildPane, BuildPaneType} from '../../lib/BuildPane';
import Blocks from '../../widgets/Blocks';
import RecentSelections from '../../widgets/RecentSelections';
import DropLight from '../../widgets/DropLight';
import Blueprints from '../../widgets/Blueprints';
const assign = require('object-assign');

const SELECT_TAB = 'buildpanel/panes/SELECT_TAB';

export function selectTab(row: number, index: number) {
  return {
    type: SELECT_TAB,
    row: row,
    index: index,
  }
}

function generateBuildPane(type: BuildPaneType) : BuildPane {
  // we generate each pane by type. This allows us to
  // save sorting information between sessions.
  switch(type) {
    case BuildPaneType.Blocks:
      return {
        type: type,
        title: 'blocks',
        minTitle: 'blocks',
        data: {},
        component: Blocks,
      };
    case BuildPaneType.Recent:
      return {
        type: type,
        title: 'recently used',
        minTitle: 'recent',
        data: {},
        component: RecentSelections
      }
    case BuildPaneType.DropLight:
      return {
        type: type,
        title: 'drop light',
        minTitle: 'drop light',
        data: {},
        component: DropLight
      }
    case BuildPaneType.Blueprints:
      return {
        type: type,
        title: 'blueprints',
        minTitle: 'blueprints',
        data: {},
        component: Blueprints
      }
  }
}

function generatePanes() : BuildPane[][] {
  const panes: BuildPane[][] = [];
  panes.push([]);
  panes[0].push(generateBuildPane(BuildPaneType.Blocks))
  panes.push([]);
  panes[1].push(generateBuildPane(BuildPaneType.Recent));
  panes.push([]);
  panes[2].push(generateBuildPane(BuildPaneType.Blueprints));
  panes.push([]);
  panes[3].push(generateBuildPane(BuildPaneType.DropLight));
  return panes;
}

function generateActiveIndices() : number[] {
  return [0,0,0,0];
}

export interface PanesState {
  
  // 2d grid of panes, sorted [rows][index]
  panes?: BuildPane[][];
  
  // within each row which index is active? default 0
  activeIndices?: number[];
}

const initialState : PanesState = {
  panes: generatePanes(),
  activeIndices: generateActiveIndices(),
}

export default function reducer(state: PanesState = initialState, action: any = {}) {
  switch(action.type) {
    case SELECT_TAB:
      const activeIndices = state.activeIndices.slice();
      activeIndices[action.row] = action.index;
      return assign({}, state, {
        activeIndices: activeIndices,
      });
    default: return state;
  }
}
