/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { values, isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

import { VoxJobLogFragment } from '../../../gql/VoxJobLogFragment';
import OutputCraftHistory from './OutputCraftHistory';
import InputCraftHistory from './InputCraftHistory';
import PageSelector from '../PageSelector';
import { GroupLogData } from '../index';
import { RecipeIdToRecipe, RecipeData } from '../../../CraftingBase';
import {
  VoxJobLog,
  VoxJobGroupLog,
  CraftHistoryQuery,
  CraftHistoryLogCountQuery,
  VoxJobType,
} from 'gql/interfaces';
import { voxJobToRecipeType, getJobContext } from '../../../lib/utils';
import { CraftingContext } from '../../../CraftingContext';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const countQuery = gql`
  query CraftHistoryLogCountQuery($jobIdentifier: String!, $jobType: String!) {
    crafting {
      voxJobLogCount(jobIdentifier: $jobIdentifier, jobType: $jobType)
    }
  }
`;

const query = gql`
  query CraftHistoryQuery($page: Int!, $count: Int! $textFilter: String!, $jobIdentifier: String!, $jobType: String!) {
    crafting {
      voxJobLogs(page: $page, count: $count, textFilter: $textFilter, jobIdentifier: $jobIdentifier, jobType: $jobType) {
        ...VoxJobLog
      }
    }
  }
  ${VoxJobLogFragment}
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// #region JobPageSelectorPosition constants
const JOB_PAGE_SELECTOR_POSITION_TOP = -36;
const JOB_PAGE_SELECTOR_POSITION_RIGHT = 10;
// #endregion
const JobPageSelectorPosition = styled.div`
  position: absolute;
  top: ${JOB_PAGE_SELECTOR_POSITION_TOP}px;
  right: ${JOB_PAGE_SELECTOR_POSITION_RIGHT}px;

  @media (max-width: 2560px) {
    top: ${JOB_PAGE_SELECTOR_POSITION_TOP * MID_SCALE}px;
    right: ${JOB_PAGE_SELECTOR_POSITION_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${JOB_PAGE_SELECTOR_POSITION_TOP * HD_SCALE}px;
    right: ${JOB_PAGE_SELECTOR_POSITION_RIGHT * HD_SCALE}px;
  }
`;

// #region PaperCraftingButton constants
const PAPER_CRAFTING_BUTTON_WIDTH = 630;
const PAPER_CRAFTING_BUTTON_HEIGHT = 194;
const PAPER_CRAFTING_BUTTON_FONT_SIZE = 32;
// #endregion
const PaperCraftingButton = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-image: url(../images/crafting/1080/paper-craft-button.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: ${PAPER_CRAFTING_BUTTON_WIDTH}px;
  height: ${PAPER_CRAFTING_BUTTON_HEIGHT}px;
  font-size: ${PAPER_CRAFTING_BUTTON_FONT_SIZE}px;
  font-family: TradeWinds;
  text-transform: uppercase;
  cursor: pointer;
  pointer-events: all;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 2560px) {
    width: ${PAPER_CRAFTING_BUTTON_WIDTH * MID_SCALE}px;
    height: ${PAPER_CRAFTING_BUTTON_HEIGHT * MID_SCALE}px;
    font-size: ${PAPER_CRAFTING_BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/paper-craft-button.png);
    width: ${PAPER_CRAFTING_BUTTON_WIDTH * HD_SCALE}px;
    height: ${PAPER_CRAFTING_BUTTON_HEIGHT * HD_SCALE}px;
    font-size: ${PAPER_CRAFTING_BUTTON_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region PaperCraftText constants
const PAPER_CRAFT_TEXT_MARGIN_BOTTOM = -20;
// #endregion
const PaperCraftText = styled.div`
  margin-bottom: ${PAPER_CRAFT_TEXT_MARGIN_BOTTOM}px;

  @media (max-width: 2560px) {
    margin-bottom: ${PAPER_CRAFT_TEXT_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-bottom: ${PAPER_CRAFT_TEXT_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

export interface ComponentProps {
  jobNumber: number;
  jobIdentifier: string;
  groupLog: VoxJobGroupLog.Fragment;
  groupLogData: GroupLogData;
}

export interface InjectedProps {
  recipeIdToRecipe: RecipeIdToRecipe;
  onSelectRecipe: (recipe: RecipeData, voxJobLog: VoxJobLog.Fragment) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  currentPage: number;
  totalPages: number;
  itemHashVoxJobLogs: VoxJobLog.Fragment[][];
}

class CraftHistory extends React.Component<Props, State> {
  private evh: EventHandle;
  private countGraphQL: GraphQLResult<CraftHistoryLogCountQuery.Query>;
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPages: 0,
      itemHashVoxJobLogs: [],
    };
  }

  public render() {
    const { groupLog, groupLogData } = this.props;
    return (
      <GraphQL
        query={{
          query: countQuery,
          variables: {
            jobIdentifier: groupLog.jobIdentifier,
            jobType: groupLog.jobType,
          },
        }}>
        {(graphql: GraphQLResult<CraftHistoryLogCountQuery.Query>) => {
          this.countGraphQL = graphql;
          if (!graphql.data || !graphql.data.crafting) {
            return null;
          }

          const currentVoxJobLogs = this.getCurrentVoxJobLogs();
          return (
            <Container>
              <GraphQL
                query={{
                  query,
                  variables: {
                    page: 1,
                    count: graphql.data.crafting.voxJobLogCount,
                    jobIdentifier: groupLog.jobIdentifier,
                    jobType: groupLog.jobType,
                    textFilter: '',
                  },
                }}
                onQueryResult={this.handleQueryResult}
              />
              <JobPageSelectorPosition>
                <PageSelector
                  currentPage={this.state.currentPage}
                  numberOfPages={this.state.totalPages}
                  onChangeCurrentPage={this.onChangeCurrentPage}
                />
              </JobPageSelectorPosition>
              <OutputCraftHistory groupLogData={groupLogData} voxJobLogs={currentVoxJobLogs} />
              <InputCraftHistory groupLogData={groupLogData} voxJobLog={currentVoxJobLogs[0]} />
              <PaperCraftingButton onClick={this.onCraftClick}>
                <PaperCraftText>Prepare Job</PaperCraftText>
              </PaperCraftingButton>
            </Container>
          );
        }}
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.evh = game.on('refetch-craft-history', this.countGraphQL.refetch);
  }

  public componentWillUnmount() {
    this.evh.clear();
    this.evh = null;
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.jobNumber !== nextProps.jobNumber ||
      this.props.jobIdentifier !== nextProps.jobIdentifier ||
      !isEqual(this.state.itemHashVoxJobLogs, nextState.itemHashVoxJobLogs) ||
      !isEqual(this.props.groupLog, nextProps.groupLog) ||
      !isEqual(this.props.groupLogData, nextProps.groupLogData) ||
      !isEqual(this.props.recipeIdToRecipe, nextProps.recipeIdToRecipe);
  }

  private handleQueryResult = (graphql: GraphQLResult<CraftHistoryQuery.Query>) => {
    if (!graphql.data || !graphql.data.crafting) return graphql;

    this.initState(graphql.data.crafting.voxJobLogs);
    return graphql;
  }

  private initState = (voxJobLogs: VoxJobLog.Fragment[]) => {
    const itemHashToVoxJobLogs: {[id: string]: VoxJobLog.Fragment[]} = {};
    voxJobLogs.forEach((log) => {
      if (itemHashToVoxJobLogs[log.itemHash]) {
        itemHashToVoxJobLogs[log.itemHash].push(log);
      } else {
        itemHashToVoxJobLogs[log.itemHash] = [log];
      }
    });

    Object.keys(itemHashToVoxJobLogs).forEach((logHash) => {
      // Sort logs of an each item hash by most recent
      itemHashToVoxJobLogs[logHash] = itemHashToVoxJobLogs[logHash].sort((a, b) => {
        const aDate = Number(new Date(a.dateEnded));
        const bDate = Number(new Date(b.dateEnded));
        return bDate - aDate;
      });
    });

    const itemHashVoxJobLogs = values(itemHashToVoxJobLogs).sort((a, b) => {
      // Sort item hash groupings by most recent,
      // we only need to check first item of each grouping because it is the most recent
      const aDate = Number(new Date(a[0].dateEnded));
      const bDate = Number(new Date(b[0].dateEnded));
      return bDate - aDate;
    });

    this.setState({
      currentPage: 1,
      totalPages: itemHashVoxJobLogs.length,
      itemHashVoxJobLogs,
    });
  }

  private onCraftClick = () => {
    const { groupLogData, recipeIdToRecipe, jobIdentifier } = this.props;
    let recipeData = recipeIdToRecipe[jobIdentifier];

    // If a salvage/repair/purify job, just set the job to the jobType. No need to fill it out.
    if (groupLogData.log.jobType === VoxJobType.Salvage ||
        groupLogData.log.jobType === VoxJobType.Repair ||
        groupLogData.log.jobType === VoxJobType.Purify) {
      recipeData = { type: voxJobToRecipeType(groupLogData.log.jobType) };
    }

    const currentJobLog = this.getCurrentVoxJobLogs()[0];
    this.props.onSelectRecipe(recipeData, currentJobLog);
  }

  private getCurrentVoxJobLogs = () => {
    const jobLogs = this.state.itemHashVoxJobLogs[this.state.currentPage - 1];
    if (jobLogs) {
      return jobLogs;
    }
    return [];
  }

  private onChangeCurrentPage = (page: number) => {
    this.setState({ currentPage: page });
  }
}

class CraftHistoryWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ recipeIdToRecipe }) => {
          const JobContext = getJobContext(this.props.jobNumber);
          return (
            <JobContext.Consumer>
              {({ onSelectRecipe }) => (
                <CraftHistory {...this.props} recipeIdToRecipe={recipeIdToRecipe} onSelectRecipe={onSelectRecipe} />
              )}
            </JobContext.Consumer>
          );
        }}
      </CraftingContext.Consumer>
    );
  }
}

export default CraftHistoryWithInjectedContext;
