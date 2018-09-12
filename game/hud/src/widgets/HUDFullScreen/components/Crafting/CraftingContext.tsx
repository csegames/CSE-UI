/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { CraftingBaseQuery, VoxStatusQuery, VoxJobType } from 'gql/interfaces';
import {
  ItemIdToAvailablePattern,
  RecipeIdToRecipe,
  ItemIdToIngredientDefInfo,
  JobTypeToAvailablePatterns,
  JobIdentifierToVoxJobGroupLog,
  JobIdToJobState,
} from './CraftingBase';

function noOp(...params: any[]) {}

export interface CraftingContextState {
  loading: boolean;
  activeJobNumber: number;
  crafting: CraftingBaseQuery.Crafting;
  voxJobIDs: string[];
  voxContainerID: string;
  itemIdToAvailablePattern: ItemIdToAvailablePattern;
  itemIdToIngredientDefInfo: ItemIdToIngredientDefInfo;
  recipeIdToRecipe: RecipeIdToRecipe;
  jobTypeToAvailablePatterns: JobTypeToAvailablePatterns;
  jobIdentifierToVoxJobGroupLog: JobIdentifierToVoxJobGroupLog;
  jobIdToJobState: JobIdToJobState;

  addVoxJobID: (voxJobID: string, jobType: VoxJobType, jobIdentifier?: string) => void;
  removeVoxJobID: (voxJobID: string) => void;
  refetchCrafting: () => Promise<GraphQLResult<CraftingBaseQuery.Query>>;
  refetchVoxJobIDs: () => Promise<GraphQLResult<VoxStatusQuery.Query>>;
  onToggleFavoriteVoxJobGroupLog: (jobIdentifier: string, jobtype: VoxJobType) => void;
  onUpdateJobIdToJobState: (jobIdToJobState: JobIdToJobState) => void;
  onUpdateActiveJobNumber: (jobNumber: number) => void;
}

export const defaultCraftingContextState: CraftingContextState = {
  loading: true,
  activeJobNumber: 0,
  crafting: null,
  voxJobIDs: [],
  voxContainerID: null,
  itemIdToAvailablePattern: {},
  itemIdToIngredientDefInfo: {},
  recipeIdToRecipe: {},
  jobTypeToAvailablePatterns: {},
  jobIdentifierToVoxJobGroupLog: {},
  jobIdToJobState: {},

  addVoxJobID: noOp,
  removeVoxJobID: noOp,
  refetchCrafting: () => new Promise(res => res()),
  refetchVoxJobIDs: () => new Promise(res => res()),
  onToggleFavoriteVoxJobGroupLog: noOp,
  onUpdateJobIdToJobState: noOp,
  onUpdateActiveJobNumber: noOp,
};

export const CraftingContext = React.createContext<CraftingContextState>(defaultCraftingContextState);
