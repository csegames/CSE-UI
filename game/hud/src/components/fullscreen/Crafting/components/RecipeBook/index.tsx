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
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  position: relative;
  top: -10px;
  width: 100%;
  height: calc(100% - 25px);
  -webkit-mask-image: url(../images/crafting/1080/paper-mask-x-repeat.png);
  -webkit-mask-size: cover;
  z-index: 1;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    -webkit-mask-image: url(../images/crafting/4k/paper-mask-x-repeat.png);
    -webkit-mask-size: cover;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    top: -30px;
    -webkit-mask-image: url(../images/crafting/4k/paper-mask-x-repeat.png);
    -webkit-mask-size: cover;
  }
`;

const PageBG = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 12px;
  background: url(../images/crafting/1080/paper-bg.png);
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    background: url(../images/crafting/4k/paper-bg.png);
  }
`;

const PageRip = styled.div`
  position: absolute;
  width: 39px;
  top: 0;
  bottom: 0;
  left: -13px;
  background: url(../images/crafting/1080/page-rip-pattern.png);
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 51px;
    background: url(../images/crafting/4k/page-rip-pattern.png);
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 129px;
    background: url(../images/crafting/4k/page-rip-pattern.png);
  }
`;

const CornerOrnament = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  background: url(../images/crafting/1080/paper-top-left-border.png) no-repeat;
  width: 100%;
  height: 100%;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    background: url(../images/crafting/4k/paper-top-left-border.png) no-repeat;
    top: 10px;
    left: 10px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/paper-top-left-border.png) no-repeat;
    top: 15px;
    left: 15px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  top: 9px;
  right: 0;
  z-index: 1;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    top: 20px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    top: 30px;
  }
`;

const Content = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 0;
  left: 0;
  padding-top: 20px;
  padding-left: 20px;
  margin-right: 3px;
  pointer-events: all;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    padding-top: 40px;
    padding-left: 40px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    padding-top: 60px;
    padding-left: 60px;
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
