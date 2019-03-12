/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import { VoxJobType, ItemType, InventoryItem, CraftingBaseQuery, VoxJob } from 'gql/interfaces';
import { GroupLogData } from '../index';
import CategorySelect from './CategorySelect';
import GroupLogQuickView from '../GroupLogQuickView';
import JobLogFullView from '../JobLogFullView';
import BackButton from '../JobLogFullView/BackButton';
import SearchInput from '../SearchInput';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';
import { itemCanBeRepaired, itemCanBeSalvaged, getJobContext } from '../../../lib/utils';
import { getItemUnitCount } from 'fullscreen/lib/utils';
import { CraftingContext } from '../../../CraftingContext';
import {
  AlloyType,
  RecipeData,
  InputItem,
  RecipeIdToRecipe,
  ItemIdToAvailablePattern,
  RecipeType,
} from '../../../CraftingBase';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const BackButtonStyle = css`
  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    top: 15px;
  }
`;

export interface FilteredAvailablePatterns {
  [recipeType: string]: RecipeData[];
}

export interface ComponentProps {
  isSelect: boolean;
  jobNumber: number;
  groupLogs: GroupLogData[];
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
}

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  inputItems: InputItem[];
  recipeIdToRecipe: RecipeIdToRecipe;
  itemIdToAvailablePattern: ItemIdToAvailablePattern;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  currentPage: number;
  selectedCategory: VoxJobType;
  selectedItemType: ItemType;
  selectedAlloyType: AlloyType;
  selectedGroupLog: GroupLogData;
}

const defaultState: State  = {
  currentPage: 1,
  selectedCategory: null,
  selectedItemType: null,
  selectedAlloyType: null,
  selectedGroupLog: null,
};

class Category extends React.Component<Props, State> {
  private navEventHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultState,
    };
  }

  public render() {
    const { searchValue, onSearchChange } = this.props;
    return (
      <Container>
        <SearchInput searchValue={searchValue} onSearchChange={onSearchChange} />
        {this.shouldShowBack() && <BackButton className={BackButtonStyle} onClick={this.onBackClick} />}
        {this.renderView()}
      </Container>
    );
  }

  public componentDidMount() {
    this.navEventHandle = game.on('crafting-recipe-book-nav', this.handleRecipeBookNav);
  }

  public componentWillUnmount() {
    this.navEventHandle.clear();
  }

  private renderView = () => {
    const { selectedCategory, selectedItemType, selectedAlloyType, selectedGroupLog } = this.state;
    if ((!selectedCategory ||
          (!selectedItemType && selectedCategory === VoxJobType.Make) ||
          (!selectedAlloyType && selectedCategory === VoxJobType.Shape)) &&
        this.props.searchValue === '') {
      return (
        <CategorySelect
          isSelect={this.props.isSelect}
          filteredAvailablePatterns={this.getFilteredAvailablePatterns()}
          jobNumber={this.props.jobNumber}
          selectedCategory={selectedCategory}
          onSelectCategory={this.onSelectCategory}
          onSelectItemType={this.onSelectItemType}
          onSelectAlloyType={this.onSelectAlloyType}
        />
      );
    }

    if (!selectedGroupLog) {
      if (selectedCategory) {
        let groupLogs: GroupLogData[] = [];
        if (selectedCategory === VoxJobType.Make && this.state.selectedItemType) {
          groupLogs = this.getItemTypeGroupLogs();
        } else if (selectedCategory === VoxJobType.Shape && this.state.selectedAlloyType) {
          groupLogs = this.getAlloyTypeGroupLogs();
        } else {
          groupLogs = this.getCategoryGroupLogs();
        }

        return (
          <GroupLogQuickView
            searchValue={this.props.searchValue}
            groupLogs={groupLogs}
            currentPage={this.state.currentPage}
            onChangeCurrentPage={this.onChangeCurrentPage}
            onSelectGroupLog={this.onSelectGroupLog}
            showingBackButton={this.shouldShowBack()}
          />
        );
      }

      return (
        <GroupLogQuickView
          searchValue={this.props.searchValue}
          groupLogs={this.props.groupLogs}
          currentPage={this.state.currentPage}
          onChangeCurrentPage={this.onChangeCurrentPage}
          onSelectGroupLog={this.onSelectGroupLog}
          showingBackButton={this.shouldShowBack()}
        />
      );
    }

    return (
      <JobLogFullView jobNumber={this.props.jobNumber} selectedGroupLog={this.state.selectedGroupLog} />
    );
  }

  private handleRecipeBookNav = () => {
    this.setState({ ...defaultState });
  }

  private onSelectCategory = (category: VoxJobType) => {
    this.setState({ selectedCategory: category });
  }

  private onSelectItemType = (itemType: ItemType) => {
    this.setState({ selectedItemType: itemType });
  }

  private onSelectAlloyType = (alloyType: AlloyType) => {
    this.setState({ selectedAlloyType: alloyType });
  }

  private getCategoryGroupLogs = () => {
    let groupLogs: GroupLogData[] = [];
    if (this.state.selectedCategory === VoxJobType.Make) {
      // Show block and make.
      groupLogs = this.props.groupLogs.filter(groupLog =>
        groupLog.log.jobType === VoxJobType.Make || groupLog.log.jobType === VoxJobType.Block);
    } else {
      groupLogs = this.props.groupLogs.filter(groupLog => groupLog.log.jobType === this.state.selectedCategory);
    }

    if (this.props.voxJob || !this.props.isSelect || this.props.inputItems.length === 0) {
      return groupLogs;
    }

    const filteredAvailablePatterns = this.getFilteredAvailablePatterns();
    const filteredGroupLogs: GroupLogData[] = [];
    Object.keys(filteredAvailablePatterns).forEach((recipeType) => {
      filteredAvailablePatterns[recipeType].forEach((recipe) => {
        const log = groupLogs.find(log => log.log.jobIdentifier === recipe.def.id);
        if (log) {
          filteredGroupLogs.push(log);
        }
      });
    });

    return filteredGroupLogs;
  }

  private getItemTypeGroupLogs = () => {
    const categoryGroupLogs = this.getCategoryGroupLogs();
    return categoryGroupLogs.filter(log => log.recipeItem.itemType === this.state.selectedItemType);
  }

  private getAlloyTypeGroupLogs = () => {
    const categoryGroupLogs = this.getCategoryGroupLogs();
    return categoryGroupLogs.filter((log) => {
      if (log.recipeItem.alloyDefinition) {
        return log.recipeItem.alloyDefinition.type === this.state.selectedAlloyType;
      }

      return false;
    });
  }

  private onChangeCurrentPage = (page: number) => {
    this.setState({ currentPage: page });
  }

  private onSelectGroupLog = (groupLog: GroupLogData) => {
    this.setState({ selectedGroupLog: groupLog });
  }

  private onBackClick = () => {
    this.props.onSearchChange('');
    this.setState((state) => {
      if (state.selectedGroupLog) {
        return {
          ...state,
          selectedGroupLog: null,
          selectedRecipeItem: null,
        };
      }

      if (state.selectedItemType) {
        return {
          ...state,
          currentPage: 1,
          selectedItemType: null,
        };
      }

      if (state.selectedAlloyType) {
        return {
          ...state,
          currentPage: 1,
          selectedAlloyType: null,
        };
      }

      return {
        ...defaultState,
      };
    });
  }

  private getFilteredAvailablePatterns = () => {
    const { inputItems, itemIdToAvailablePattern, recipeIdToRecipe } = this.props;
    const sharedAvailablePatterns: {[patternId: string]: number} = {};
    const filteredAvailablePatterns: FilteredAvailablePatterns = {};

    // Figure out which available patterns are actually available for each input item
    inputItems.forEach((item) => {
      if (itemIdToAvailablePattern[item.item.staticDefinition.id]) {
        itemIdToAvailablePattern[item.item.staticDefinition.id].availablePatterns.forEach((patternId) => {
          if (!this.meetsIngredientRequirements(item.item, recipeIdToRecipe[patternId])) return;

          if (sharedAvailablePatterns[patternId]) {
            sharedAvailablePatterns[patternId] += 1;
          } else {
            sharedAvailablePatterns[patternId] = 1;
          }
        });
      }
    });

    // Iterate through the shared patterns and figure out which is shared by EVERY input item
    const inputItemsLength = inputItems.length;
    Object.keys(sharedAvailablePatterns).forEach((patternId) => {
      if (sharedAvailablePatterns[patternId] === inputItemsLength) {
        const recipe = recipeIdToRecipe[patternId];
        const type = recipe.type === RecipeType.Block ? RecipeType.Make : recipe.type;
        if (!filteredAvailablePatterns[type]) {
          filteredAvailablePatterns[type] = [recipe];
        } else {
          filteredAvailablePatterns[type].push(recipe);
        }
      }
    });

    // Check if Salvage and Repair is allowed
    if (inputItems.length === 1) {
      const item = inputItems[0];
      if (itemCanBeRepaired(item.item)) {
        filteredAvailablePatterns[RecipeType.Repair] = [];
      }

      if (itemCanBeSalvaged(item.item)) {
        filteredAvailablePatterns[RecipeType.Salvage] = [];
      }
    } else {
      delete filteredAvailablePatterns[RecipeType.Repair];
      delete filteredAvailablePatterns[RecipeType.Salvage];
    }

    return filteredAvailablePatterns;
  }

  private meetsIngredientRequirements = (item: InventoryItem.Fragment, recipe: RecipeData) => {
    switch (recipe.type) {
      case RecipeType.Make: {
        const matchingIngredient = (recipe.def as CraftingBaseQuery.MakeRecipes).ingredients.find(
          i => i.ingredient.id === item.staticDefinition.id);
        if (matchingIngredient) {
          const itemQuality = item.stats.item.quality;
          return itemQuality <= matchingIngredient.maxQuality &&
            itemQuality >= matchingIngredient.minQuality;
        }

        return false;
      }
      case RecipeType.Shape: {
        const matchingIngredient = (recipe.def as CraftingBaseQuery.ShapeRecipes).ingredients.find(
          i => i.ingredient.id === item.staticDefinition.id);
        if (matchingIngredient) {
          const itemQuality = item.stats.item.quality;
          const itemUnitCount = getItemUnitCount(item);
          return itemQuality <= matchingIngredient.maxQuality &&
            itemQuality >= matchingIngredient.minQuality &&
            itemUnitCount <= matchingIngredient.maxUnitCount &&
            itemUnitCount >= matchingIngredient.minUnitCount;
        }

        return false;
      }
      case RecipeType.Block: {
        const matchingIngredient = (recipe.def as CraftingBaseQuery.BlockRecipes).ingredients.find(
          i => i.ingredient.id === item.staticDefinition.id);
        if (matchingIngredient) {
          const itemQuality = item.stats.item.quality;
          return itemQuality <= matchingIngredient.maxQuality &&
            itemQuality >= matchingIngredient.minQuality;
        }

        return false;
      }
      case RecipeType.Purify: {
        const recipeDef = (recipe.def as CraftingBaseQuery.PurifyRecipes);
        if (recipeDef.ingredientItem.id === recipeDef.outputItem.id) {
          return item.stats.item.quality < 1;
        }
        return true;
      }
      default: {
        return true;
      }
    }
  }

  private shouldShowBack = () => {
    return this.state.selectedGroupLog !== null || this.state.selectedCategory !== null;
  }
}

class CategoryWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <CraftingContext.Consumer>
        {({ itemIdToAvailablePattern, recipeIdToRecipe }) => (
          <JobContext.Consumer>
            {({ inputItems, voxJob }) => (
              <Category
                {...this.props}
                voxJob={voxJob}
                inputItems={inputItems}
                itemIdToAvailablePattern={itemIdToAvailablePattern}
                recipeIdToRecipe={recipeIdToRecipe}
              />
            )}
          </JobContext.Consumer>
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default CategoryWithInjectedContext;
