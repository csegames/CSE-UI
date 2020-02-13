/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { filter } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

import { ErrorBoundary } from 'cseshared/components/ErrorBoundary';
import { CraftingBaseQuery, VoxStatusQuery, VoxJobType, VoxJobState } from 'gql/interfaces';
import JobPanel from './components/JobPanel';
import VoxInventory from './components/VoxInventory';
import CraftingGQLProvider from './components/CraftingGQLProvider';
import VoxStatusGQLProvider from './components/VoxStatusGQLProvider';
import VoxHeader from './components/VoxHeader/Header';
import { initializeContextState, JobIdToJobState } from './CraftingBase';
import { CraftingContext, CraftingContextState, defaultCraftingContextState } from './CraftingContext';
import { getNearestVoxEntityID } from './lib/utils';

declare const toastr: any;

const CraftingJobContainer = styled.div`
  display: flex;
  height: 75%;
  background: url(../images/crafting/1080/wood-bg.png);
  overflow: hidden;
`;

const JobPanelContainer = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
`;

const VoxInventoryContainer = styled.div`
  height: 25%;
`;

export interface Props {
}

class Crafting extends React.Component<Props, CraftingContextState> {
  private craftingGQL: GraphQLResult<CraftingBaseQuery.Query>;
  private voxStatusGQL: GraphQLResult<VoxStatusQuery.Query>;
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultCraftingContextState,
      addVoxJobID: this.addVoxJobID,
      removeVoxJobID: this.removeVoxJobID,
      refetchCrafting: this.refetchCrafting,
      refetchVoxJobIDs: this.refetchVoxJobIDs,
      onToggleFavoriteVoxJobGroupLog: this.onToggleFavoriteVoxJobGroupLog,
      onUpdateJobIdToJobState: this.onUpdateJobIdToJobState,
      onUpdateActiveJobNumber: this.onUpdateActiveJobNumber,
    };
  }

  public render() {
    const { crafting, activeJobNumber, onUpdateActiveJobNumber } = this.state;
    return (
      <ErrorBoundary>
        <CraftingGQLProvider onQueryResult={this.handleCraftingQueryResult}>
          {(craftingGQL: GraphQLResult<CraftingBaseQuery.Query>) => {
            this.craftingGQL = craftingGQL;
            return (
              <>
                {crafting &&
                  <VoxStatusGQLProvider
                    voxEntityId={getNearestVoxEntityID(crafting)}
                    onQueryResult={this.handleVoxStatusQueryResult}
                  />
                }
                <CraftingContext.Provider value={this.getCraftingContextState()}>
                  <VoxHeader />
                  <CraftingJobContainer>
                    <JobPanelContainer>
                      <JobPanel
                        jobNumber={activeJobNumber}
                        onUpdateActiveJobNumber={onUpdateActiveJobNumber}
                      />
                    </JobPanelContainer>
                  </CraftingJobContainer>
                  <VoxInventoryContainer>
                    <VoxInventory
                      voxContainerID={this.state.voxContainerID}
                      voxEntityID={getNearestVoxEntityID(crafting)}
                    />
                  </VoxInventoryContainer>
                </CraftingContext.Provider>
              </>
            );
          }}
        </CraftingGQLProvider>
      </ErrorBoundary>
    );
  }

  private handleCraftingQueryResult = (graphql: GraphQLResult<CraftingBaseQuery.Query>) => {
    if (graphql.loading || !graphql.data || !graphql.data.crafting) return graphql;
    this.initContextState(graphql.data.crafting);
    return graphql;
  }

  private handleVoxStatusQueryResult = (graphql: GraphQLResult<VoxStatusQuery.Query>) => {
    this.voxStatusGQL = graphql;
    if (graphql.loading || !graphql.data || !graphql.data.entityItems || !graphql.data.entityItems.items) return graphql;

    // Vox entityItems will always return one item (which is the vox)
    const voxItem = graphql.data.entityItems.items[0];
    this.setState({ voxJobIDs: voxItem.voxStatus.jobs.map(job => job.id), voxContainerID: voxItem.id });
    return graphql;
  }

  private initContextState = (crafting: CraftingBaseQuery.Crafting) => {
    const contextState = initializeContextState(crafting);
    this.setState({
      ...contextState,
    });
  }

  private getCraftingContextState = () => {
    return {
      ...this.state,
      loading: (this.craftingGQL && this.craftingGQL.loading === true) ||
        (this.voxStatusGQL && this.voxStatusGQL.loading === true),
    };
  }

  private addVoxJobID = (voxJobID: string, jobType: VoxJobType, jobIdentifier?: string) => {
    const hasJobId = this.state.voxJobIDs.find(jobId => jobId === voxJobID);
    const updatedVoxJobIDs = [...this.state.voxJobIDs];
    if (!hasJobId) {
      // We don't have the voxJobID, add it.
      updatedVoxJobIDs.push(voxJobID);
    }

    const jobIdToJobState = cloneDeep(this.state.jobIdToJobState);
    jobIdToJobState[voxJobID] = {
      jobNumber: updatedVoxJobIDs.length - 1,
      jobState: VoxJobState.Configuring,
      jobType,
      jobIdentifier,
    };
    this.setState({ voxJobIDs: updatedVoxJobIDs, jobIdToJobState });
  }

  private removeVoxJobID = (voxJobID: string) => {
    const filteredVoxJobIDs = filter(this.state.voxJobIDs, jobID => voxJobID !== jobID);
    const jobIdToJobState = cloneDeep(this.state.jobIdToJobState);
    delete jobIdToJobState[voxJobID];
    this.setState({ voxJobIDs: filteredVoxJobIDs, jobIdToJobState });
  }

  private onToggleFavoriteVoxJobGroupLog = (jobIdentifier: string, jobType: VoxJobType) => {
    const jobIdentifierToVoxJobGroupLog = { ...this.state.jobIdentifierToVoxJobGroupLog };
    const newFavorite = !jobIdentifierToVoxJobGroupLog[jobIdentifier].favorite;
    jobIdentifierToVoxJobGroupLog[jobIdentifier] = {
      ...jobIdentifierToVoxJobGroupLog[jobIdentifier],
      favorite: newFavorite,
    };
    this.setState({ jobIdentifierToVoxJobGroupLog });

    webAPI.CraftingAPI.SetVoxJobGroupFavorite(
      webAPI.defaultConfig,
      jobIdentifier,
      jobType,
      newFavorite,
    ).then((res) => {
      if (!res.ok) {
        toastr.error('There was an error trying to favorite', 'Oh No!!', { timeout: 5000 });
        jobIdentifierToVoxJobGroupLog[jobIdentifier] = {
          ...jobIdentifierToVoxJobGroupLog[jobIdentifier],
          favorite: !newFavorite,
        };
        this.setState({ jobIdentifierToVoxJobGroupLog });
      }
    });
  }

  private onUpdateJobIdToJobState = (jobIdToJobState: JobIdToJobState) => {
    this.setState({ jobIdToJobState });
  }

  private onUpdateActiveJobNumber = (jobNumber: number) => {
    this.setState({ activeJobNumber: jobNumber });
  }

  private refetchCrafting = async () => {
    if (!this.craftingGQL) return;
    return await this.craftingGQL.refetch();
  }

  private refetchVoxJobIDs = async () => {
    if (!this.voxStatusGQL) return;
    return await this.voxStatusGQL.refetch();
  }
}

export default Crafting;
