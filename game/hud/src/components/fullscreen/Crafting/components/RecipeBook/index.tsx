/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import Fuse, { FuseOptions } from 'fuse.js';
import { find, values, isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { VoxJobGroupLog, ItemDefRef } from 'gql/interfaces';
import { getDefaultGroupLog, getNearestVoxEntityID, isNearbyVox } from '../../lib/utils';
import { JobIdentifierToVoxJobGroupLog, RecipeIdToRecipe, RecipeData } from '../../CraftingBase';
import { CraftingContext } from '../../CraftingContext';
import Tab, { Routes } from './Tab';
import RecipeHeader from '../VoxHeader/RecipeHeader';
import Recent from './Recent';
import Favorites from './Favorites';
import Category from './Category';
import Notes from './Notes';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

// #region ContentContainer constants
const CONTENT_CONTAINER_TOP = -20;
// #endregion
const ContentContainer = styled.div`
  position: relative;
  top: ${CONTENT_CONTAINER_TOP}px;
  height: calc(100% - 25px);
  width: 100%;
  -webkit-mask-image: url(../images/crafting/uhd/paper-mask-x-repeat.png);
  -webkit-mask-size: cover;
  pointer-events: none;
  z-index: 1;

  @media (max-width: 2560px) {
    top: ${CONTENT_CONTAINER_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CONTENT_CONTAINER_TOP * HD_SCALE}px;
    -webkit-mask-image: url(../images/crafting/hd/paper-mask-x-repeat.png);
  }
`;

// #region PageBG constants
const PAGE_BG_LEFT = 24;
// #endregion
const PageBG = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: ${PAGE_BG_LEFT}px;
  background: url(../images/crafting/1080/paper-bg.png);
  pointer-events: none;

  @media (max-width: 2560px) {
    left: ${PAGE_BG_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    left: ${PAGE_BG_LEFT * HD_SCALE}px;
  }
`;

// #region PageRip constants
const PAGE_RIP_WIDTH = 78;
const PAGE_RIP_LEFT = -26;
// #endregion
const PageRip = styled.div`
  position: absolute;
  width: ${PAGE_RIP_WIDTH}px;
  left: ${PAGE_RIP_LEFT}px;
  top: 0;
  bottom: 0;
  background-image: url(../images/crafting/uhd/page-rip-pattern.png);
  pointer-events: none;

  @media (max-width: 2560px) {
    width: ${PAGE_RIP_WIDTH * MID_SCALE}px;
    left: ${PAGE_RIP_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${PAGE_RIP_WIDTH * HD_SCALE}px;
    left: ${PAGE_RIP_LEFT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/page-rip-pattern.png);
  }
`;

// #region CornerOrnament constants
const CORNER_ORNAMENT_TOP = 10;
const CORNER_ORNAMENT_LEFT = 10;
// #endregion
const CornerOrnament = styled.div`
  position: absolute;
  top: ${CORNER_ORNAMENT_TOP}px;
  left: ${CORNER_ORNAMENT_LEFT}px;
  background-image: url(../images/crafting/uhd/paper-top-left-border.png);
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  pointer-events: none;

  @media (max-width: 2560px) {
    top: ${CORNER_ORNAMENT_TOP * MID_SCALE}px;
    left: ${CORNER_ORNAMENT_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/paper-top-left-border.png);
    top: ${CORNER_ORNAMENT_TOP * HD_SCALE}px;
    left: ${CORNER_ORNAMENT_LEFT * HD_SCALE}px;
  }
`;

// #region TabsContainer constants
const TABS_CONTAINER_TOP = 18;
// #endregion
const TabsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  top: ${TABS_CONTAINER_TOP}px;
  right: 0;
  z-index: 1;

  @media (max-width: 2560px) {
    top: ${TABS_CONTAINER_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${TABS_CONTAINER_TOP * HD_SCALE}px;
  }
`;

// #region Content constants
const CONTENT_TOP = 20;
const CONTENT_PADDING_TOP = 40;
const CONTENT_PADDING_LEFT = 40;
const CONTENT_MARGIN_RIGHT = 6;
// #endregion
const Content = styled.div`
  position: absolute;
  top: ${CONTENT_TOP}px;
  padding-top: ${CONTENT_PADDING_TOP}px;
  padding-left: ${CONTENT_PADDING_LEFT}px;
  margin-right: ${CONTENT_MARGIN_RIGHT}px;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: all;

  @media (max-width: 2560px) {
    top: ${CONTENT_TOP * MID_SCALE}px;
    padding-top: ${CONTENT_PADDING_TOP * MID_SCALE}px;
    padding-left: ${CONTENT_PADDING_LEFT * MID_SCALE}px;
    margin-right: ${CONTENT_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CONTENT_TOP * HD_SCALE}px;
    padding-top: ${CONTENT_PADDING_TOP * HD_SCALE}px;
    padding-left: ${CONTENT_PADDING_LEFT * HD_SCALE}px;
    margin-right: ${CONTENT_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

export interface GroupLogData {
  log: VoxJobGroupLog.Fragment;
  recipeItem: ItemDefRef.Fragment;
  ingredients?: ItemDefRef.Fragment[];
}

export interface ComponentProps {
  jobNumber: number;
}

export interface InjectedProps {
  voxEntityID: string;
  jobIdentifierToVoxJobGroupLog: JobIdentifierToVoxJobGroupLog;
  recipeIdToRecipe: RecipeIdToRecipe;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  allGroupLogs: GroupLogData[];
  selectedRoute: Routes;
  searchValue: string;
}

const fuseSearchOptions: FuseOptions<any> = {
  shouldSort: true,
  threshold: 0.3,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  includeScore: true,
  keys: [
    { name: 'recipeItem.name', weight: 1 },
    { name: 'ingredients.ingredient.name', weight: 0.1 },
    { name: 'log.notes', weight: 0.1 },
  ],
};

class RecipeBook extends React.Component<Props, State> {
  private fuseSearch: Fuse<any>;
  private jobIdentifierToNonRecipeItem: {[id: string]: ItemDefRef.Fragment} = {};
  constructor(props: Props) {
    super(props);
    this.state = {
      allGroupLogs: [],
      selectedRoute: Routes.Select,
      searchValue: '',
    };
  }

  public render() {
    return (
      <Container>
        <RecipeHeader />
        <TabsContainer>
          <Tab route={Routes.Notes} selectedRoute={this.state.selectedRoute} onClick={this.onSelectRoute} />
          <Tab route={Routes.Favorites} selectedRoute={this.state.selectedRoute} onClick={this.onSelectRoute} />
          <Tab route={Routes.Recent} selectedRoute={this.state.selectedRoute} onClick={this.onSelectRoute} />
          <Tab route={Routes.Category} selectedRoute={this.state.selectedRoute} onClick={this.onSelectRoute} />
          {isNearbyVox(this.props.voxEntityID) &&
            <Tab route={Routes.Select} selectedRoute={this.state.selectedRoute} onClick={this.onSelectRoute} />
          }
        </TabsContainer>
        <ContentContainer>
          <PageBG />
          <PageRip />
          <CornerOrnament />
          <Content>
            {this.renderSelectedPage()}
          </Content>
        </ContentContainer>
      </Container>
    );
  }

  public componentDidMount() {
    this.initAllGroupLogs();
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.voxEntityID !== nextProps.voxEntityID ||
      !isEqual(this.props.jobIdentifierToVoxJobGroupLog, nextProps.jobIdentifierToVoxJobGroupLog) ||
      !isEqual(this.props.recipeIdToRecipe, nextProps.recipeIdToRecipe) ||
      !isEqual(this.state, nextState);
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.jobIdentifierToVoxJobGroupLog, prevProps.jobIdentifierToVoxJobGroupLog) ||
        !isEqual(this.props.recipeIdToRecipe, prevProps.recipeIdToRecipe)) {
      this.initAllGroupLogs();
    }

    if (!isNearbyVox(this.props.voxEntityID) && this.state.selectedRoute === Routes.Select) {
      this.onSelectRoute(Routes.Category);
    }
  }

  private onSelectRoute = (route: Routes) => {
    game.trigger('crafting-recipe-book-nav', route);
    this.setState({ selectedRoute: route, searchValue: '' });
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }

  private renderSelectedPage = () => {
    const groupLogs = this.getGroupLogs();
    const { selectedRoute, searchValue } = this.state;
    switch (selectedRoute) {
      case Routes.Recent: {
        const recentGroupLogs = groupLogs.filter(log => log.log.timesCrafted > 0);
        return (
          <Recent
            jobNumber={this.props.jobNumber}
            groupLogs={recentGroupLogs}
            searchValue={searchValue}
            onSearchChange={this.onSearchChange}
          />
        );
      }
      case Routes.Favorites: {
        return (
          <Favorites
            jobNumber={this.props.jobNumber}
            groupLogs={groupLogs}
            searchValue={searchValue}
            onSearchChange={this.onSearchChange}
          />
        );
      }
      case Routes.Category: {
        return (
          <Category
            isSelect={false}
            jobNumber={this.props.jobNumber}
            groupLogs={groupLogs}
            searchValue={searchValue}
            onSearchChange={this.onSearchChange}
          />
        );
      }
      case Routes.Select: {
        return (
          <Category
            isSelect
            jobNumber={this.props.jobNumber}
            groupLogs={groupLogs}
            searchValue={searchValue}
            onSearchChange={this.onSearchChange}
          />
        );
      }
      case Routes.Notes: {
        return <Notes />;
      }
    }
  }

  private initAllGroupLogs = () => {
    const craftedRecipes: { [id: string]: ItemDefRef.Fragment } = {};
    const allGroupLogs = values(this.props.jobIdentifierToVoxJobGroupLog).map((log) => {
      const recipeDef = this.getRecipeDefForJobIdentifier(log.jobIdentifier);
      const recipeItem = this.getRecipeItemForJobIdentifier(log.jobIdentifier);
      craftedRecipes[log.jobIdentifier] = recipeItem;
      return {
        log,
        recipeItem,
        ingredients: this.getIngredientsForRecipeDef(recipeDef),
      };
    });

    Object.keys(this.props.recipeIdToRecipe).forEach((recipeId) => {
      const recipe = this.props.recipeIdToRecipe[recipeId];

      // Add recipe items that have not been crafted ever
      if (recipe && recipe.def && !craftedRecipes[recipeId]) {
        allGroupLogs.push({
          log: getDefaultGroupLog(recipe.type, recipeId),
          recipeItem: recipe.def.outputItem,
          ingredients: this.getIngredientsForRecipeDef(recipe),
        });
      }
    });

    this.setState({ allGroupLogs });
  }

  private getGroupLogs = () => {
    if (this.state.searchValue === '') {
      return this.state.allGroupLogs;
    }

    this.updateFuseSearch();
    const searchItems: { score: number, item: GroupLogData }[] = this.fuseSearch.search(this.state.searchValue);
    return searchItems.sort((a, b) => a.score - b.score).map(item => item.item);
  }

  private getRecipeDefForJobIdentifier = (jobIdentifier: string) => {
    return this.props.recipeIdToRecipe[jobIdentifier];
  }

  private getIngredientsForRecipeDef = (recipe: RecipeData) => {
    return recipe && (recipe.def['ingredients'] || [{ ingredient: recipe.def['ingredientItem'] }]);
  }

  private getRecipeItemForJobIdentifier = (jobIdentifier: string) => {
    const recipeDef = this.getRecipeDefForJobIdentifier(jobIdentifier);
    if (recipeDef) {
      return recipeDef.def.outputItem;
    }

    // Check cache for items for non recipe's (Salvage, Repair)
    let potentialRecipeItem = this.jobIdentifierToNonRecipeItem[jobIdentifier];
    if (potentialRecipeItem) {
      return potentialRecipeItem;
    }

    // Wasn't found in cache, look through itemDefRefs array and add to cache
    potentialRecipeItem = find(game.store.game.items, itemDefRef => itemDefRef.id === jobIdentifier) as any;
    this.jobIdentifierToNonRecipeItem[jobIdentifier] = potentialRecipeItem;
    return potentialRecipeItem;
  }

  private updateFuseSearch = () => {
    if (!this.fuseSearch) {
      this.fuseSearch = new Fuse(this.state.allGroupLogs, fuseSearchOptions);
    } else {
      this.fuseSearch.setCollection(this.state.allGroupLogs);
    }
  }
}

class RecipeBookWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ crafting, jobIdentifierToVoxJobGroupLog, recipeIdToRecipe }) => (
          <RecipeBook
            {...this.props}
            voxEntityID={getNearestVoxEntityID(crafting)}
            jobIdentifierToVoxJobGroupLog={jobIdentifierToVoxJobGroupLog}
            recipeIdToRecipe={recipeIdToRecipe}
          />
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default RecipeBookWithInjectedContext;
