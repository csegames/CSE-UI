/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { find, debounce, isEqual } from 'lodash';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import { InventoryContext } from 'fullscreen/ItemShared/InventoryContext';
import { SlotNumberToItem } from 'fullscreen/ItemShared/InventoryBase';
import { ContextState, defaultJobContextState } from './JobPanelContext';
import { CraftingContext } from '../../CraftingContext';
import JobPanelPageView from './JobPanelPageView';
import JobPanelTab from './JobPanelTab';
import RecipeBook from '../RecipeBook';
import {
  getJobContext,
  getNearestVoxEntityID,
  getItemSlotForRecipe,
  // recipeTypeToVoxJob,
  jobIsConfigurable,
  recipeTypeToVoxJob,
} from '../../lib/utils';
import {
  RecipeData,
  RecipeType,
  JobIdToJobState,
  setItemCountServer,
  setQualityServer,
  clearJobServer,
  collectJobServer,
  setSelectedRecipeClient,
  setSelectedJobTypeServer,
  swapSelectedRecipeServer,
  addInputItemServer,
  addInputItemClient,
  removeInputItemServer,
  removeInputItemClient,
  RecipeIdToRecipe,
  startJobServer,
  cancelJobServer,
  setCustomNameServer,
  ItemIdToAvailablePattern,
  setRecipeIDServer,
} from '../../CraftingBase';
import {
  MakeRecipeDefRef,
  InventoryItem,
  CraftingBaseQuery,
  SubItemSlot,
  JobPanelPageQuery,
  VoxStatusQuery,
  VoxJobType,
  VoxJobState,
  VoxJobLog,
} from 'gql/interfaces';
import { VoxJobFragment } from '../../gql/VoxJobFragment';
import { getItemUnitCount } from 'fullscreen/lib/utils';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const JobPanelContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
`;

const JobContainer = styled.div`
  width: 100%;
  height: calc(100% - 25px);
`;

const RecipeBookContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 50%;
  height: 100%;
`;

const CraftOrnamentRight = styled.div`
  position: absolute;
  top: 7px;
  right: 5px;
  width: 173px;
  height: 304px;
  background: url(../images/crafting/1080/craft-ornament-right.png);
  background-size: contain;
  z-index: 0;
  pointer-events: none;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/craft-ornament-right.png);
    background-size: contain;
    width: 422px;
    height: 741px;
    top: 21px;
    right: 15px;
  }
`;

const CraftOrnamentLeft = styled.div`
  position: absolute;
  top: 7px;
  left: 5px;
  width: 173px;
  height: 304px;
  background: url(../images/crafting/1080/craft-ornament-left.png);
  background-size: contain;
  z-index: 0;
  pointer-events: none;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/craft-ornament-left.png);
    background-size: contain;
    width: 422px;
    height: 741px;
    top: 21px;
    right: 15px;
  }
`;

const TabsContainer = styled.div`
  position: relative;
  display: flex;
  height: 25px;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: fit-content;
  padding: 0px 10px;
  border: 1px solid #B29267;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
  &:before {
    content: '';
    position: absolute;
    top: 1px;
    left: -18px;
    width: 36px;
    height: 24px;
    background: url(../images/crafting/1080/que-ornament-left.png);
  }
  &:after {
    content: '';
    position: absolute;
    top: 1px;
    right: -18px;
    width: 36px;
    height: 24px;
    background: url(../images/crafting/1080/que-ornament-right.png);
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    height: 55px;
    min-height: 55px;
    &:before {
      background: url(../images/crafting/4k/que-ornament-left.png);
      width: 90px;
      height: 54px;
      left: -45px;
    }

    &:after {
      background: url(../images/crafting/4k/que-ornament-right.png);
      width: 90px;
      height: 54px;
      right: -45px;
    }
  }
`;

declare const toastr: any;

const query = gql`
  query JobPanelPageQuery($entityID: String!, $voxJobID: String!) {
    voxJob(entityID: $entityID, voxJobID: $voxJobID) {
      status {
        ...VoxJob
      }
    }
  }
  ${VoxJobFragment}
`;

export interface ComponentProps {
  jobNumber: number;
  onUpdateActiveJobNumber: (jobNumber: number) => void;
}

export interface InjectedProps {
  craftingLoading: boolean;
  inventoryItems: InventoryItem.Fragment[];
  slotNumberToItem: SlotNumberToItem;
  crafting: CraftingBaseQuery.Crafting;
  voxJobIDs: string[];
  voxContainerID: string;
  recipeIdToRecipe: RecipeIdToRecipe;
  jobIdToJobState: JobIdToJobState;
  itemIdToAvailablePattern: ItemIdToAvailablePattern;

  refetchVoxJobIDs: () => Promise<GraphQLResult<VoxStatusQuery.Query>>;
  refetchCrafting: () => void;
  refetchInventory: (disableLoading?: boolean) => void;
  addVoxJobID: (voxJobID: string, jobType: VoxJobType, jobIdentifier?: string) => void;
  removeVoxJobID: (voxJobID: string) => void;
  onUpdateJobIdToJobState: (jobIdToJobState: JobIdToJobState) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface Tab {
  jobId: string;
  jobNumber: number;
}

export interface State extends ContextState {
  tabs: Tab[];
}

class JobPanelPage extends React.Component<Props, State> {
  private evh: EventHandle[] = [];
  private graphql: GraphQLResult<JobPanelPageQuery.Query>;
  private defaultContextState: ContextState;
  constructor(props: Props) {
    super(props);
    this.defaultContextState = {
      ...defaultJobContextState,
      onAddInputItem: this.onAddInputItem,
      onRemoveInputItem: this.onRemoveInputItem,
      onSwapInputItem: this.onSwapInputItem,
      onSelectRecipe: this.onSelectRecipe,
      onItemCountChange: debounce(this.onItemCountChange, 100),
      onQualityChange: debounce(this.onQualityChange, 100),
      onCustomNameChange: debounce(this.onCustomNameChange, 100),
      onClearJob: this.onClearJob,
      onStartJob: this.onStartJob,
      onCancelJob: this.onCancelJob,
      onCollectJob: this.onCollectJob,
      onShapeJobRunCountChange: this.onShapeJobRunCountChange,
      onChangeInputItemCount: this.onChangeInputItemCount,
      refetchVoxJob: this.refetchVoxJob,
    };

    this.state = {
      ...this.defaultContextState,
      tabs: [],
    };
  }

  public render() {
    const { jobNumber, crafting, voxJobIDs } = this.props;
    const JobContext = getJobContext(jobNumber);
    const voxEntityID = getNearestVoxEntityID(crafting);

    return (
      <JobContext.Provider value={this.state}>
        {voxJobIDs[jobNumber] &&
          <GraphQL
            query={{
              query,
              variables: {
                entityID: voxEntityID,
                voxJobID: voxJobIDs[jobNumber],
              },
            }}
            onQueryResult={this.handleQueryResult}
          />
        }
        <Container>
          <JobPanelContainer>
            <CraftOrnamentLeft />
            <CraftOrnamentRight />
            <TabsContainer>
              {this.state.tabs.map((tabData, i) => {
                return (
                  <JobPanelTab
                    key={i}
                    active={this.getActiveTab().jobNumber === tabData.jobNumber}
                    jobId={tabData.jobId}
                    jobNumber={tabData.jobNumber}
                    voxEntityID={getNearestVoxEntityID(this.props.crafting)}
                    onClick={this.props.onUpdateActiveJobNumber}
                  />
                );
              })}
            </TabsContainer>
            <JobContainer>
              <JobPanelPageView {...this.state} jobNumber={jobNumber} voxEntityID={voxEntityID} />
            </JobContainer>
          </JobPanelContainer>
          <RecipeBookContainer>
            <RecipeBook jobNumber={jobNumber} />
          </RecipeBookContainer>
        </Container>
      </JobContext.Provider>
    );
  }

  public componentDidMount() {
    this.setState(this.initializeTabs());
    this.evh.push(game.on('refetch-vox-job', this.refetchVoxJob));
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { jobNumber, voxJobIDs } = this.props;
    if (prevProps.voxJobIDs[prevProps.jobNumber] && !voxJobIDs[jobNumber]) {
      this.setState(this.defaultContextState);
      this.graphql = null;
      return;
    }

    if (!isEqual(prevProps.voxJobIDs, this.props.voxJobIDs)) {
      this.setState(this.initializeTabs());
    }

    const jobID = voxJobIDs[jobNumber];
    const prevJobState = prevProps.jobIdToJobState[jobID];
    const currentJobState = this.props.jobIdToJobState[jobID];
    if (jobID && prevJobState && currentJobState &&
      (prevJobState.jobIdentifier !== currentJobState.jobIdentifier || prevJobState.jobType !== currentJobState.jobType)) {
      // Refetch vox job if jobIdentifier or jobType was changed in top level CraftingContext. This means there was
      // another component that wanted to change the current job. Ex.) Recipe Book "Prepare Job" Button.
      this.refetchVoxJob();
    }
  }

  public componentWillUnmount() {
    this.evh.forEach(ev => ev.clear());
  }

  private handleQueryResult = (graphql: GraphQLResult<JobPanelPageQuery.Query>) => {
    this.graphql = graphql;
    if (!graphql.data || !graphql.data.voxJob || !graphql.data.voxJob.status) return graphql;

    const voxJobStatus = graphql.data.voxJob.status;
    let selectedRecipe = this.props.recipeIdToRecipe[voxJobStatus.recipeID] || this.state.selectedRecipe;
    if (voxJobStatus.jobType === 'Salvage') {
      selectedRecipe = { type: RecipeType.Salvage };
    }

    if (voxJobStatus.jobType === 'Repair') {
      selectedRecipe = { type: RecipeType.Repair };
    }

    if (!voxJobStatus.recipeID && voxJobStatus.jobType === 'Purify') {
      selectedRecipe = { type: RecipeType.Purify };
    }

    const jobIdToJobState = cloneDeep(this.props.jobIdToJobState);
    jobIdToJobState[voxJobStatus.id] = {
      jobNumber: this.props.jobNumber,
      jobState: voxJobStatus.jobState,
      jobType: voxJobStatus.jobType,
      jobIdentifier: voxJobStatus.jobType,
    };
    this.props.onUpdateJobIdToJobState(jobIdToJobState);

    this.setState({
      voxJob: voxJobStatus,
      selectedRecipe,
      inputItems: voxJobStatus.ingredients.map(ingredient => ({
        item: ingredient,
        slot: ingredient.location.inVox.itemSlot,
      })),
    });
    return graphql;
  }

  private initializeTabs = () => {
    const tabs: Tab[] = [];
    // tslint:disable-next-line
    const pageFillers = Array(6 - this.props.voxJobIDs.length).map(() => null);
    [...this.props.voxJobIDs, ...pageFillers].forEach((jobId: string, i) => {
      const jobNumber = i;
      tabs.push({ jobId, jobNumber });
    });

    return {
      tabs,
    };
  }

  private getActiveTab = () => {
    if (this.state.tabs.length > 0) {
      return this.state.tabs[this.props.jobNumber];
    }

    return {
      jobId: '',
      jobNumber: 0,
    };
  }

  private onAddInputItem = (item: InventoryItem.Fragment, slot: SubItemSlot, unitCount?: number) => {
    if (!jobIsConfigurable(this.state.voxJob)) return;

    let selectedRecipe = cloneDeep(this.state.selectedRecipe);
    if (this.state.voxJob && this.state.voxJob.jobType === VoxJobType.Purify) {
      // Search for recipe and select it before adding the item.
      const itemIngredient = this.props.itemIdToAvailablePattern[item.staticDefinition.id];
      const recipeId = itemIngredient && itemIngredient.availablePatterns.find((availPat) => {
        return this.props.recipeIdToRecipe[availPat].type === RecipeType.Purify;
      });

      if (recipeId) {
        selectedRecipe = this.props.recipeIdToRecipe[recipeId];
        setRecipeIDServer(recipeId, getNearestVoxEntityID(this.props.crafting)).then(() => {
          this.internalAddInputItem(item, slot, selectedRecipe, unitCount);
        });
        return;
      } else {
        toastr.error('There are no purify jobs for that ingredient.', 'Oh No!', { timeout: 3000 });
        return;
      }
    }

    this.internalAddInputItem(item, slot, selectedRecipe, unitCount);
  }

  private internalAddInputItem = (item: InventoryItem.Fragment,
                                  slot: SubItemSlot,
                                  selectedRecipe: RecipeData,
                                  unitCount?: number) => {
    this.setState((state: ContextState) => {
      return {
        ...addInputItemClient(state.inputItems, item, slot, unitCount),
        selectedRecipe,
      };
    });

    if (this.state.voxJob) {
      const { voxContainerID, crafting } = this.props;
      addInputItemServer(
        this.state.inputItems,
        item,
        unitCount,
        slot,
        getNearestVoxEntityID(crafting),
        voxContainerID,
      ).then((result) => {
        this.refetchVoxJob();
        const disableLoading = true;
        this.props.refetchInventory(disableLoading);

        if (!result.res.ok && this.state.voxJob.jobType === VoxJobType.Purify) {
          this.onSelectRecipe({ type: RecipeType.Purify });
        }
      });
    }
  }

  private onSwapInputItem = (swappedItem: InventoryItem.Fragment,
                              slot: SubItemSlot,
                              newItem: InventoryItem.Fragment,
                              newUnitCount?: number) => {
    let inputItems = removeInputItemClient(this.state.inputItems, swappedItem).inputItems;
    inputItems = addInputItemClient(inputItems, newItem, slot, newUnitCount).inputItems;
    this.setState({ inputItems });
  }

  private onRemoveInputItem = (item: InventoryItem.Fragment, slot: SubItemSlot, unitCount?: number) => {
    if (!jobIsConfigurable(this.state.voxJob)) return;

    let selectedRecipe = cloneDeep(this.state.selectedRecipe);
    if (this.state.inputItems.length === 1 && this.state.voxJob && this.state.voxJob.jobType === VoxJobType.Purify) {
      selectedRecipe = { type: RecipeType.Purify };
      setRecipeIDServer('', getNearestVoxEntityID(this.props.crafting)).then(() => {
        setTimeout(() => this.internalRemoveInputItem(item, slot, selectedRecipe, unitCount), 100);
      });

      return;
    }

    this.internalRemoveInputItem(item, slot, selectedRecipe, unitCount);
  }

  private internalRemoveInputItem = (item: InventoryItem.Fragment,
                                      slot: SubItemSlot,
                                      selectedRecipe: RecipeData,
                                      unitCount?: number) => {
    this.setState((state) => {
      return {
        ...removeInputItemClient(state.inputItems, item, unitCount),
        selectedRecipe,
      };
    });

    if (this.state.voxJob) {
      const { crafting, slotNumberToItem, voxContainerID } = this.props;
      removeInputItemServer(item, slot, getNearestVoxEntityID(crafting), voxContainerID, slotNumberToItem, unitCount)
        .then(() => {
          this.refetchVoxJob();

          const disableLoading = true;
          this.props.refetchInventory(disableLoading);
        });
    }
  }

  private onSelectRecipe = async (recipe: RecipeData, voxJobLog?: VoxJobLog.Fragment) => {
    const hasConfiguringJob = Object.values(this.props.jobIdToJobState)
      .find(jobInfo => jobInfo.jobState === VoxJobState.Configuring);
    const hasSwappableJob = (this.state.voxJob && this.state.voxJob.jobState === VoxJobState.Configuring) ||
      hasConfiguringJob;

    if (hasSwappableJob) {
      // We need to swap jobs
      const { crafting } = this.props;
      this.setState(() => setSelectedRecipeClient(recipe));
      const swapJobResponse = await swapSelectedRecipeServer(recipe, getNearestVoxEntityID(crafting));
      if (swapJobResponse.ok) {
        window.setTimeout(() => this.addRecipeInputItems(recipe, voxJobLog), 1000);

        if (hasConfiguringJob && this.props.jobNumber !== hasConfiguringJob.jobNumber) {
          this.props.onUpdateActiveJobNumber(hasConfiguringJob.jobNumber);
        } else {
          this.refetchVoxJob();
        }
      }
    } else {
      // We need to append job
      const { crafting } = this.props;
      this.setState(() => setSelectedRecipeClient(recipe));
      const jobTypeResponse = await setSelectedJobTypeServer(recipe, getNearestVoxEntityID(crafting));
      const resData = tryParseJSON<{ FieldCodes: { Result: ModifyVoxJobResult }[] }>(jobTypeResponse.data, true);

      if (jobTypeResponse.ok) {
        // Add new vox job id to list
        if (resData && resData.FieldCodes && resData.FieldCodes[0] && resData.FieldCodes[0].Result) {
          const voxJobId = resData.FieldCodes[0].Result['NewVoxJobID'];
          this.props.addVoxJobID(voxJobId, recipeTypeToVoxJob(recipe.type), recipe.def ? recipe.def.id : '');
          this.props.onUpdateActiveJobNumber(this.props.voxJobIDs.length - 1);
        }

        this.addRecipeInputItems(recipe, voxJobLog);
      } else {
        // There was some sort of error, possibly because a previous job has not been started yet.
        if (resData && resData.FieldCodes && resData.FieldCodes[0] && resData.FieldCodes[0]['Message']) {
          const errorMessage = resData.FieldCodes[0]['Message'];
          toastr.error(errorMessage, 'Oh No!', { timeout: 3000 });
        }
      }

      return jobTypeResponse;
    }
  }

  private addRecipeInputItems = (recipe: RecipeData, voxJobLog?: VoxJobLog.Fragment) => {
    const { crafting } = this.props;
    const inputItems = [...this.state.inputItems];

    if (!this.state.voxJob && this.state.inputItems.length > 0) {
      // There are items that have been put into input slots prior to selection of recipe, add input them to job
      if (recipe.type === RecipeType.Purify) {
        // Search for recipe and select it before adding the item.
        const { item, slot } = inputItems[0];
        const itemIngredient = this.props.itemIdToAvailablePattern[item.staticDefinition.id];
        const recipeId = itemIngredient && itemIngredient.availablePatterns.find((availPat) => {
          return this.props.recipeIdToRecipe[availPat].type === RecipeType.Purify;
        });
        const selectedRecipe = this.props.recipeIdToRecipe[recipeId];

        setRecipeIDServer(recipeId, getNearestVoxEntityID(this.props.crafting)).then(() => {
          this.internalAddInputItem(item, slot, selectedRecipe);
        });
        return;
      }

      inputItems.forEach((inputItem, i) => {
        addInputItemServer(
          inputItems,
          inputItem.item,
          inputItem.item.stats.item.unitCount,
          getItemSlotForRecipe(inputItem.item.staticDefinition, recipe, i),
          getNearestVoxEntityID(crafting),
          this.props.voxContainerID,
        ).then(() => {
          if (i === inputItems.length - 1) {
            this.refetchVoxJob();
            this.props.refetchInventory(true);
          }
        });
      });

      return;
    }

    // If we get here, check to see if there are items in the inventory that fulfill the ingredients for the recipe.
    if (voxJobLog) {
      // If we have a voxJobLog, that means the job has been run. Try to find ingredient items with same quality used.
      voxJobLog.inputItems.forEach((inputItem, i) => {
        const potentialInventoryItem = this.props.inventoryItems.find(invItem =>
          invItem.staticDefinition.id === inputItem.staticDefinition.id &&
          invItem.stats.item.quality === inputItem.stats.item.quality &&
          invItem.stats.item.unitCount >= inputItem.stats.item.unitCount);

        if (potentialInventoryItem) {
          addInputItemServer(
            this.state.inputItems,
            potentialInventoryItem,
            inputItem.stats.item.unitCount,
            inputItem.location.inVox.itemSlot || getItemSlotForRecipe(inputItem.staticDefinition, recipe, i),
            getNearestVoxEntityID(crafting),
            this.props.voxContainerID,
          ).then(() => {
            if (i === voxJobLog.inputItems.length - 1) {
              this.refetchVoxJob();
              this.props.refetchInventory(true);
            }
          });
        }
      });
      return;
    }
  }

  private onItemCountChange = (itemCount: number) => {
    if (!jobIsConfigurable(this.state.voxJob) || itemCount <= 0) return;

    const { crafting } = this.props;
    setItemCountServer(itemCount, getNearestVoxEntityID(crafting)).then(() => this.refetchVoxJob());
  }

  private onQualityChange = (quality: number) => {
    if (!jobIsConfigurable(this.state.voxJob)) return;

    const { crafting } = this.props;
    setQualityServer(quality, getNearestVoxEntityID(crafting)).then(() => this.refetchVoxJob());
  }

  private onClearJob = async () => {
    const { crafting } = this.props;

    if (!this.state.voxJob) {
      toastr.error('There was no job attached to this vox.', 'Oh No!!', { timeout: 3000 });
      return;
    }

    const res = await clearJobServer(getNearestVoxEntityID(crafting), this.state.voxJob.id);
    if (res.ok) {
      this.props.removeVoxJobID(this.state.voxJob.id);
      this.props.refetchInventory();
      return res;
    } else {
      toastr.error('There was an error when trying to clear this job', 'Oh No!!', { timeout: 3000 });
      return res;
    }
  }

  private onStartJob = async () => {
    const { crafting } = this.props;
    const { voxJob } = this.state;
    if (voxJob.jobType === VoxJobType.Make) {
      await this.filterInputItems();
    }

    const res = await startJobServer(getNearestVoxEntityID(crafting));
    if (res.ok) {
      this.refetchVoxJob();
    }
  }

  private onCancelJob = async (jobId: string, isQueued?: boolean) => {
    const { crafting } = this.props;
    const voxEntityID = getNearestVoxEntityID(crafting);
    if (isQueued) {
      // Just clear job
      const res = await clearJobServer(voxEntityID, jobId);
      if (res.ok) {
        this.refetchVoxJob();
      }
    } else {
      // Cancel then clear job
      const cancelRes = await cancelJobServer(getNearestVoxEntityID(crafting));
      if (cancelRes.ok) {
        this.onClearJob();
      }
    }
  }

  private onCollectJob = async () => {
    const { crafting } = this.props;
    const res = await collectJobServer(getNearestVoxEntityID(crafting), this.state.voxJob.id);
    if (res.ok) {
      this.props.removeVoxJobID(this.state.voxJob.id);
      this.props.refetchInventory();
      this.props.refetchCrafting();
    }
  }

  private onCustomNameChange = async (customName: string) => {
    if (!jobIsConfigurable(this.state.voxJob)) return;

    const { crafting } = this.props;
    const res = await setCustomNameServer(getNearestVoxEntityID(crafting), customName);
    if (res.ok) {
      this.refetchVoxJob();
    }
  }

  private onChangeInputItemCount = (item: InventoryItem.Fragment, slot: SubItemSlot, newItemCount: number) => {
    if (!jobIsConfigurable(this.state.voxJob)) return;

    return new Promise<{ ok: boolean }>((res) => {
      if (newItemCount < item.stats.item.unitCount) {
        // Decreasing unit count
        this.onRemoveInputItem(item, slot, item.stats.item.unitCount - newItemCount);
        res({ ok: true });
      } else {
        // Increasing unit count
        const itemInInventory = find(this.props.inventoryItems, invItem =>
          invItem.staticDefinition.id === item.staticDefinition.id &&
          invItem.stats.item.quality === item.stats.item.quality);

        if (itemInInventory && newItemCount <= itemInInventory.stats.item.unitCount + item.stats.item.unitCount) {
          this.onAddInputItem(itemInInventory, slot, newItemCount - item.stats.item.unitCount);
          res({ ok: true });
        } else {
          res({ ok: false });
        }
      }
    });
  }

  private refetchVoxJob = async () => {
    if (!this.graphql) return;
    return await this.graphql.refetch();
  }

  private filterInputItems = () => {
    const { recipeIdToRecipe } = this.props;
    const { voxJob } = this.state;
    let updatedInputItems = [...this.state.inputItems];

    return new Promise((res) => {
      for (let i = 0; i < voxJob.ingredients.length; i++) {
        const inputItem = voxJob.ingredients[i];
        // Find the ingredient item info
        const ingredientItem = (recipeIdToRecipe[voxJob.recipeID].def as MakeRecipeDefRef)
          .ingredients.find((ingredientInfo) => {
            return ingredientInfo.ingredient.id === inputItem.staticDefinition.id;
          });

        const requiredIngredientUnitCount = ingredientItem.unitCount * voxJob.itemCount;
        const currentInputUnitCount = getItemUnitCount(inputItem);
        if (currentInputUnitCount > requiredIngredientUnitCount) {
          // Remove the unneeded ingredients
          const { crafting, slotNumberToItem, voxContainerID } = this.props;
          const updatedUnitCount = currentInputUnitCount - requiredIngredientUnitCount;

          updatedInputItems = removeInputItemClient(updatedInputItems, inputItem, updatedUnitCount).inputItems;

          removeInputItemServer(
            inputItem,
            ingredientItem.slot,
            getNearestVoxEntityID(crafting),
            voxContainerID,
            slotNumberToItem,
            updatedUnitCount,
          ).then(() => {
            if (i === voxJob.ingredients.length - 1) {
              res();
            }
          });
        }
      }

      res();
      this.setState({ inputItems: updatedInputItems });
    });
  }

  private onShapeJobRunCountChange = (runCount: number) => {
    if (!jobIsConfigurable(this.state.voxJob)) return;

    this.setState({ shapeJobRunCount: runCount });
  }
}

class JobPanelPageWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ graphql, inventoryItems, slotNumberToItem }) => {
          return (
            <CraftingContext.Consumer>
              {({
                loading,
                crafting,
                refetchCrafting,
                voxJobIDs,
                voxContainerID,
                refetchVoxJobIDs,
                recipeIdToRecipe,
                itemIdToAvailablePattern,
                addVoxJobID,
                removeVoxJobID,
                jobIdToJobState,
                onUpdateJobIdToJobState,
              }) => {
                return (
                  <JobPanelPage
                    {...this.props}
                    craftingLoading={loading}
                    crafting={crafting}
                    refetchCrafting={refetchCrafting}
                    refetchInventory={graphql.refetch}
                    voxJobIDs={voxJobIDs}
                    voxContainerID={voxContainerID}
                    inventoryItems={inventoryItems}
                    slotNumberToItem={slotNumberToItem}
                    refetchVoxJobIDs={refetchVoxJobIDs}
                    itemIdToAvailablePattern={itemIdToAvailablePattern}
                    recipeIdToRecipe={recipeIdToRecipe}
                    addVoxJobID={addVoxJobID}
                    removeVoxJobID={removeVoxJobID}
                    jobIdToJobState={jobIdToJobState}
                    onUpdateJobIdToJobState={onUpdateJobIdToJobState}
                  />
                );
              }}
            </CraftingContext.Consumer>
          );
        }}
      </InventoryContext.Consumer>
    );
  }
}

export default JobPanelPageWithInjectedContext;
