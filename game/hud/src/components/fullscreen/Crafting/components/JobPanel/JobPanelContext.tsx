/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { InventoryItem, VoxJob, SubItemSlot, JobPanelPageQuery, VoxJobLog } from 'gql/interfaces';
import { RecipeData, InputItem } from '../../CraftingBase';

function noOp(...params: any[]) {}
function noOpPromise(...params: any[]) { return new Promise<{ ok: boolean }>(res => res({ ok: true })); }

export const defaultJobContextState: ContextState = {
  voxJob: null,
  inputItems: [],
  selectedRecipe: null,
  shapeJobRunCount: 1,

  onAddInputItem: noOp,
  onRemoveInputItem: noOp,
  onSwapInputItem: noOp,
  onSelectRecipe: noOp,
  onItemCountChange: noOp,
  onQualityChange: noOp,
  onCustomNameChange: noOp,
  onClearJob: noOp,
  onStartJob: noOp,
  onCancelJob: noOp,
  onCollectJob: noOp,
  onShapeJobRunCountChange: noOp,
  onChangeInputItemCount: noOpPromise,

  refetchVoxJob: () => new Promise(res => res()),
};

export interface ContextState {
  voxJob: VoxJob.Fragment;
  inputItems: InputItem[];
  selectedRecipe: RecipeData;
  shapeJobRunCount: number;

  onAddInputItem: (item: InventoryItem.Fragment, slot: SubItemSlot, unitCount?: number) => void;
  onRemoveInputItem: (item: InventoryItem.Fragment, slot: SubItemSlot) => void;
  onSwapInputItem: (swappedItem: InventoryItem.Fragment, slot: SubItemSlot, newItem: InventoryItem.Fragment,
    newUnitCount: number) => void;
  onSelectRecipe: (recipe: RecipeData, voxJobLog?: VoxJobLog.Fragment) => void;
  onItemCountChange: (itemCount: number) => void;
  onQualityChange: (quality: number) => void;
  onCustomNameChange: (customName: string) => void;
  onClearJob: () => void;
  onStartJob: () => void;
  onCancelJob: (jobId: string, isQueued?: boolean) => void;
  onCollectJob: () => void;
  onShapeJobRunCountChange: (runCount: number) => void;
  onChangeInputItemCount: (item: InventoryItem.Fragment, slot: SubItemSlot, newAmount: number) => Promise<{ ok: boolean }>;

  refetchVoxJob: () => Promise<GraphQLResult<JobPanelPageQuery.Query>>;
}

export const JobContextMap: {[jobNumber: number]: React.Context<ContextState>} = {
  0: React.createContext(defaultJobContextState),
  1: React.createContext(defaultJobContextState),
  2: React.createContext(defaultJobContextState),
  3: React.createContext(defaultJobContextState),
  4: React.createContext(defaultJobContextState),
  5: React.createContext(defaultJobContextState),
};
