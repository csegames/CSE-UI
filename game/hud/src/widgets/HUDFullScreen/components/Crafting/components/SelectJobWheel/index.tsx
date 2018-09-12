/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { fill, find, isEqual, isEmpty } from 'lodash';

import { CraftingContext } from '../../CraftingContext';
import SelectorWheel from '../SelectorWheel';
import SelectJobItem from './SelectJobItem';
import SelectAvailPatternItem from './SelectAvailPatternItem';
import SelectItemType from './SelectItemType';
import { getItemUnitCount } from '../../../../lib/utils';
import { getJobContext, voxJobToRecipeType, itemCanBeRepaired, itemCanBeSalvaged } from '../../lib/utils';
import {
  RecipeData,
  RecipeType,
  JobTypeToAvailablePatterns,
  RecipeIdToRecipe,
  ItemIdToAvailablePattern,
  InputItem,
} from '../../CraftingBase';
import { ItemType, VoxJobType, InventoryItem, CraftingBaseQuery } from 'gql/interfaces';

const OuterWheelContainer = styled.div`
  position: relative;
  left: 0;
  right: 0;
  bottom: -15%;
  margin: auto;
  z-index: 10;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const InnerWheelContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 80px;
  margin: auto;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 14;
`;

enum RingItemType {
  SelectJob,
  SelectItemType,
  SelectAvailablePattern,
}

interface RingItemBase {
  ringItemType: RingItemType;
}

interface JobTypeItem extends RingItemBase {
  jobType: VoxJobType;
  hide?: boolean;
}

interface ItemTypeItem extends RingItemBase {
  itemType: ItemType;
  hide?: boolean;
}

interface AvailablePatternItem extends RingItemBase {
  recipe: RecipeData;
  hide?: boolean;
}

interface FilteredAvailablePatterns {
  [recipeType: string]: RecipeData[];
}

export interface ComponentProps {
  jobNumber: number;
  mainRingDimensions: number;
}

export interface InjectedProps {
  loading: boolean;
  inputItems: InputItem[];
  recipeIdToRecipe: RecipeIdToRecipe;
  itemIdToAvailablePattern: ItemIdToAvailablePattern;
  jobTypeToAvailablePatterns: JobTypeToAvailablePatterns;
  onSelectRecipe: (recipe: RecipeData) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  selectedJobType: VoxJobType;
  selectedItemType: ItemType;
  outerRingPages: RingItemBase[][];
  innerRingPage: RingItemBase[];
  activeOuterRingPage: number;
}

const ITEMS_PER_PAGE = 5;
const FILLER_ITEMS_PER_PAGE = 4;
const TOTAL_ITEMS_PER_PAGE = ITEMS_PER_PAGE + FILLER_ITEMS_PER_PAGE;
const PREVIEW_ITEMS = 8;

const JOB_TYPE_PAGES: JobTypeItem[][] = [[
  { ringItemType: RingItemType.SelectJob, jobType: VoxJobType.Salvage },
  { ringItemType: RingItemType.SelectJob, jobType: null },
  { ringItemType: RingItemType.SelectJob, jobType: null },
  { ringItemType: RingItemType.SelectJob, jobType: null },
  { ringItemType: RingItemType.SelectJob, jobType: null },
  { ringItemType: RingItemType.SelectJob, jobType: VoxJobType.Purify },
  { ringItemType: RingItemType.SelectJob, jobType: VoxJobType.Shape },
  { ringItemType: RingItemType.SelectJob, jobType: VoxJobType.Make },
  { ringItemType: RingItemType.SelectJob, jobType: VoxJobType.Repair },
]];

class SelectJobWheel extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedJobType: null,
      selectedItemType: null,
      outerRingPages: JOB_TYPE_PAGES,
      innerRingPage: [],
      activeOuterRingPage: 0,
    };
  }

  public render() {
    return !this.props.loading && [
      <OuterWheelContainer key={0}>
        <SelectorWheel
          selectedPageIndex={this.state.activeOuterRingPage}
          data={this.state.outerRingPages}
          renderItem={this.renderOuterRingItem}
          ringDimensions={this.props.mainRingDimensions * 0.75}
          onMouseOverItem={this.onMouseOverOuterItem}
          onMouseLeaveItem={this.onMouseLeaveOuterItem}
          disableTopArrow={this.isTopArrowDisabled()}
          disableBotArrow={this.isBotArrowDisabled()}
          disableLeftArrow={this.isLeftArrowDisabled()}
          disableRightArrow={this.isRightArrowDisabled()}
          onTopClick={this.onTopArrowClick}
          onBotClick={this.onBotArrowClick}
          onLeftClick={this.onBackClick}
          onRightClick={this.onNextClick}
        />
      </OuterWheelContainer>,
      <InnerWheelContainer key={1}>
        <SelectorWheel
          disableNavArrows
          selectedPageIndex={0}
          data={[this.state.innerRingPage]}
          renderItem={this.renderInnerRingItem}
          ringDimensions={this.props.mainRingDimensions * 0.35}
        />
      </InnerWheelContainer>,
    ];
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.inputItems, prevProps.inputItems)) {
      // Input items have changed, filter down avail patterns select to match input items

      if (!this.state.selectedJobType) {
        this.setState({ outerRingPages: this.getFilteredJobTypes() });
      } else {
        // Job type has been selected, update available pattern items.
        const outerRingPages = this.getAvailPatternPagesForJobType(this.state.selectedJobType);
        this.setState({ outerRingPages, activeOuterRingPage: 0 });
      }
    }
  }

  private renderOuterRingItem = (item: RingItemBase) => {
    switch (item.ringItemType) {
      case RingItemType.SelectJob: {
        return this.renderJobItem(item as JobTypeItem);
      }
      case RingItemType.SelectItemType: {
        return this.renderItemTypeItem(item as ItemTypeItem);
      }
      case RingItemType.SelectAvailablePattern: {
        return this.renderSelectAvailPatternItem(item as AvailablePatternItem);
      }
      default: {
        return null;
      }
    }
  }

  private renderInnerRingItem = (item: RingItemBase) => {
    switch (item.ringItemType) {
      case RingItemType.SelectItemType: {
        return this.renderItemTypeItem(item as ItemTypeItem, true);
      }
      case RingItemType.SelectAvailablePattern: {
        return this.renderSelectAvailPatternItem(item as AvailablePatternItem);
      }
      default: {
        return null;
      }
    }
  }

  private renderJobItem = (item: JobTypeItem) => {
    if (item.jobType === null) return null;

    return (
      <SelectJobItem
        hide={item.hide}
        selectedJobType={this.state.selectedJobType}
        jobType={item.jobType}
        onClick={this.onSelectJobItem}
      />
    );
  }

  private renderItemTypeItem = (item: ItemTypeItem, isPreview?: boolean) => {
    if (item.itemType === null) return null;

    return (
      <SelectItemType
        hide={item.hide}
        isPreview={isPreview}
        itemType={item.itemType}
        onClick={this.onSelectItemType}
      />
    );
  }

  private renderSelectAvailPatternItem = (item: AvailablePatternItem) => {
    if (item.hide) return null;

    return (
      <SelectAvailPatternItem recipe={item.recipe} onClick={this.onSelectPattern} />
    );
  }

  private getFilteredJobTypes = () => {
    const filteredAvailPatterns = this.getFilteredAvailablePatterns();
    if (isEmpty(filteredAvailPatterns) && isEmpty(this.props.inputItems)) {
      return JOB_TYPE_PAGES;
    }
    const newOuterRingPage = [...JOB_TYPE_PAGES];
    newOuterRingPage[0] = (newOuterRingPage[0] as JobTypeItem[]).map((jobItem) => {
      if (filteredAvailPatterns[voxJobToRecipeType(jobItem.jobType)]) {
        return {
          ...jobItem,
          hide: false,
        };
      }

      return {
        ...jobItem,
        hide: true,
      };
    });

    return newOuterRingPage;
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

    // Reiterate over sharedAvailablePatterns to check if there are any that only allow for one recipe.
    // If so, just fill out all the select slots with that recipe.
    Object.keys(sharedAvailablePatterns).forEach((patternId) => {
      if (sharedAvailablePatterns[patternId] === inputItemsLength) {
        const recipe = recipeIdToRecipe[patternId];
        const type = recipe.type === RecipeType.Block ? RecipeType.Make : recipe.type;
        if (filteredAvailablePatterns[type].length === 1) {
          for (let i = 0; i < 4; i++) {
            filteredAvailablePatterns[type].push(recipe);
          }
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
        const matchingIngredient = find((recipe.def as CraftingBaseQuery.MakeRecipes).ingredients,
          i => i.ingredient.id === item.staticDefinition.id);
        if (matchingIngredient) {
          const itemQuality = item.stats.item.quality;
          return itemQuality <= matchingIngredient.maxQuality &&
            itemQuality >= matchingIngredient.minQuality;
        }

        return false;
      }
      case RecipeType.Shape: {
        const matchingIngredient = find((recipe.def as CraftingBaseQuery.ShapeRecipes).ingredients,
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
        const matchingIngredient = find((recipe.def as CraftingBaseQuery.BlockRecipes).ingredients,
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

  private getAvailPatternPagesForJobType = (jobType: VoxJobType, itemType?: ItemType) => {
    const arrayOfPages: AvailablePatternItem[][] = [];
    const filteredPatterns = this.getFilteredPatterns(jobType, itemType);

    if (!filteredPatterns || isEmpty(filteredPatterns)) {
      return arrayOfPages;
    }

    const availablePatterns = filteredPatterns.sort((a, b) => {
      return a.def.outputItem.name.localeCompare(b.def.outputItem.name);
    });
    if (availablePatterns) {
      const amountOfPages = Math.ceil(availablePatterns.length / ITEMS_PER_PAGE) +
      (availablePatterns.length % ITEMS_PER_PAGE > 0 ? 1 : 0) || 1;
      let nextIndex = 0;

      if (amountOfPages > 1) {
        for (let i = 1; i < amountOfPages; i++) {
          const items: AvailablePatternItem[] = this.convertAvailPatternToRingItems(
            availablePatterns.slice(nextIndex, nextIndex + ITEMS_PER_PAGE),
            FILLER_ITEMS_PER_PAGE,
          );

          arrayOfPages.push(items);
          nextIndex += ITEMS_PER_PAGE;
        }
      } else {
        const items = this.convertAvailPatternToRingItems(
          availablePatterns.slice(nextIndex, ITEMS_PER_PAGE),
          FILLER_ITEMS_PER_PAGE,
        );
        arrayOfPages.push(items);
      }
    }

    return arrayOfPages;
  }

  private getAvailPatternPreviewForJobType = (jobType: VoxJobType) => {
    if (jobType === VoxJobType.Salvage || jobType === VoxJobType.Repair) {
      return [];
    }

    const filteredPatterns = this.getFilteredPatterns(jobType);

    let items: RingItemBase[] = [];
    if (!filteredPatterns) {
      return items;
    }

    const availablePatterns = filteredPatterns.sort((a, b) => {
      return a.def.outputItem.name.localeCompare(b.def.outputItem.name);
    }).slice(0, PREVIEW_ITEMS);
    if (availablePatterns) {
      items = this.convertAvailPatternToRingItems(availablePatterns, 2, 2);
    }

    return items;
  }

  private getAvailItemTypesForJobType = (jobType: VoxJobType) => {
    const filteredPatterns = this.getFilteredPatterns(jobType);
    const availableItemTypes: { [type: string]: ItemType } = {};

    filteredPatterns.forEach((pattern) => {
      if (!availableItemTypes[pattern.def.outputItem.itemType]) {
        availableItemTypes[pattern.def.outputItem.itemType] = pattern.def.outputItem.itemType;
      }
    });

    const items: RingItemBase[] = this.convertAvailItemTypeToRingItems(
      Object.values(availableItemTypes),
      FILLER_ITEMS_PER_PAGE,
    );
    return items;
  }

  private getFilteredPatterns = (jobType: VoxJobType, itemType?: ItemType) => {
    const { inputItems, jobTypeToAvailablePatterns } = this.props;
    let filteredPatterns: RecipeData[] = [];

    if (isEmpty(inputItems)) {
      if (jobType === VoxJobType.Make) {
        // Combine block jobs with make jobs
        const makePatterns = jobTypeToAvailablePatterns[jobType];
        const blockPatterns = jobTypeToAvailablePatterns[VoxJobType.Block];
        if (makePatterns && blockPatterns) {
          filteredPatterns = makePatterns.concat(blockPatterns);
        } else if (makePatterns) {
          filteredPatterns = makePatterns;
        } else {
          filteredPatterns = blockPatterns;
        }
      } else {
        filteredPatterns = jobTypeToAvailablePatterns[jobType];
      }
    } else {
      const patterns = this.getFilteredAvailablePatterns();
      if (jobType === VoxJobType.Make) {
        // Combine block jobs with make jobs
        const makePatterns = patterns[RecipeType.Make];
        const blockPatterns = patterns[RecipeType.Block];
        if (makePatterns && blockPatterns) {
          filteredPatterns = makePatterns.concat(blockPatterns);
        } else if (makePatterns) {
          filteredPatterns = makePatterns;
        } else {
          filteredPatterns = blockPatterns;
        }
      } else {
        filteredPatterns = patterns[voxJobToRecipeType(jobType)];
      }
    }

    if (itemType) {
      // Filter by item type now if there is one selected
      filteredPatterns = filteredPatterns.filter((pattern) => {
        return pattern.def.outputItem.itemType === itemType;
      });
    }

    return filteredPatterns;
  }

  private convertAvailPatternToRingItems = (availablePatterns: RecipeData[],
                                            fillerItemsPerPage: number,
                                            startFillerIndex?: number) => {
    const availPatternItems: AvailablePatternItem[] = availablePatterns.map((pattern) => {
      if (pattern.def) {
        return {
          ringItemType: RingItemType.SelectAvailablePattern,
          recipe: pattern,
        };
      }

      return {
        ringItemType: RingItemType.SelectAvailablePattern,
        recipe: null,
      };
    });

    let ringItems = [];
    if (startFillerIndex) {
      ringItems = [
        ...availPatternItems.slice(0, startFillerIndex),
        ...fill(Array(fillerItemsPerPage), { ringItemType: RingItemType.SelectAvailablePattern, recipe: null, hide: true }),
        ...availPatternItems.slice(startFillerIndex, availPatternItems.length),
      ];
    } else {
      ringItems = [
        availPatternItems[0],
        ...fill(Array(fillerItemsPerPage), { ringItemType: RingItemType.SelectAvailablePattern, recipe: null, hide: true }),
        ...availPatternItems.slice(1, availPatternItems.length),
      ];
    }

    if (ringItems.length < TOTAL_ITEMS_PER_PAGE) {
      ringItems = ringItems.concat(fill(Array(
        TOTAL_ITEMS_PER_PAGE - ringItems.length),
        { ringItemType: RingItemType.SelectAvailablePattern, recipe: null },
      ));
    }

    return ringItems;
  }

  private convertAvailItemTypeToRingItems = (availableItemTypes: ItemType[],
                                              fillerItemsPerPage: number,
                                              startFillerIndex?: number) => {
    const availItemTypeItems: ItemTypeItem[] = availableItemTypes.map((itemType) => {
      return {
        ringItemType: RingItemType.SelectItemType,
        itemType,
      };
    });

    let ringItems = [];
    if (startFillerIndex) {
      ringItems = [
        ...availItemTypeItems.slice(0, startFillerIndex),
        ...fill(Array(fillerItemsPerPage), { ringItemType: RingItemType.SelectItemType, itemType: null, hide: true }),
        ...availItemTypeItems.slice(startFillerIndex, availItemTypeItems.length),
      ];
    } else {
      ringItems = [
        availItemTypeItems[0],
        ...fill(Array(fillerItemsPerPage), { ringItemType: RingItemType.SelectItemType, itemType: null, hide: true }),
        ...availItemTypeItems.slice(1, availItemTypeItems.length),
      ];
    }

    if (ringItems.length < TOTAL_ITEMS_PER_PAGE) {
      ringItems = ringItems.concat(fill(Array(
        TOTAL_ITEMS_PER_PAGE - ringItems.length),
        { ringItemType: RingItemType.SelectItemType, itemType: null },
      ));
    }

    return ringItems;
  }

  private onTopArrowClick = () => {
    const { selectedJobType, selectedItemType } = this.state;
    if (selectedJobType) {
      if (selectedItemType && (selectedJobType === VoxJobType.Make || selectedJobType === VoxJobType.Block)) {
        const outerRingPages = [this.getAvailItemTypesForJobType(selectedJobType)];
        this.setState({ selectedItemType: null, outerRingPages, activeOuterRingPage: 0 });
      } else {
        this.setState({ selectedJobType: null, outerRingPages: this.getFilteredJobTypes(), activeOuterRingPage: 0 });
      }
    }
  }

  private onBotArrowClick = (index: number) => {
    const { selectedJobType, selectedItemType } = this.state;
    if (!selectedJobType) {
      this.onSelectJobItem((this.state.outerRingPages[0][index] as JobTypeItem).jobType);
      return;
    }

    if (selectedJobType === VoxJobType.Make && !selectedItemType) {
      this.onSelectItemType((this.state.outerRingPages[0][index] as ItemTypeItem).itemType);
      return;
    }
  }

  private onNextClick = () => {
    if (!this.isRightArrowDisabled()) {
      this.setState({ activeOuterRingPage: this.state.activeOuterRingPage + 1 });
    }
  }

  private onBackClick = () => {
    if (!this.isLeftArrowDisabled()) {
      this.setState({ activeOuterRingPage: this.state.activeOuterRingPage - 1 });
    }
  }

  private isTopArrowDisabled = () => {
    return !this.state.selectedJobType;
  }

  private isBotArrowDisabled = () => {
    const { selectedItemType, selectedJobType } = this.state;
    if (!selectedJobType) {
      return false;
    }

    if (selectedJobType === VoxJobType.Make && !selectedItemType) {
      return false;
    }

    return true;
  }

  private isLeftArrowDisabled = () => {
    return this.state.activeOuterRingPage - 1 < 0;
  }

  private isRightArrowDisabled = () => {
    return !this.state.outerRingPages[this.state.activeOuterRingPage + 1];
  }

  private onSelectJobItem = (jobType: VoxJobType) => {
    switch (jobType) {
      case VoxJobType.Repair:
      case VoxJobType.Salvage: {
        this.props.onSelectRecipe({ type: voxJobToRecipeType(jobType) });
        break;
      }
      case VoxJobType.Make:
      case VoxJobType.Block: {
        const outerRingPages = [this.getAvailItemTypesForJobType(jobType)];
        this.setState({ selectedJobType: jobType, outerRingPages, innerRingPage: [], activeOuterRingPage: 0 });
        break;
      }
      default: {
        const outerRingPages = this.getAvailPatternPagesForJobType(jobType);
        this.setState({ selectedJobType: jobType, outerRingPages, innerRingPage: [], activeOuterRingPage: 0 });
        break;
      }
    }
  }

  private onSelectItemType = (itemType: ItemType) => {
    const outerRingPages = this.getAvailPatternPagesForJobType(this.state.selectedJobType, itemType);
    this.setState({ selectedItemType: itemType, outerRingPages, innerRingPage: [], activeOuterRingPage: 0 });
  }

  private onSelectPattern = (recipe: RecipeData) => {
    this.props.onSelectRecipe(recipe);
  }

  private onMouseOverOuterItem = (e: MouseEvent, index: number) => {
    if (!this.state.selectedJobType) {
      this.onMouseOverJobItem((this.state.outerRingPages[0][index] as JobTypeItem).jobType);
      return;
    }
  }

  private onMouseLeaveOuterItem = () => {
    if (!this.state.selectedJobType) {
      this.onMouseLeaveJobItem();
      return;
    }
  }

  private onMouseOverJobItem = (jobType: VoxJobType) => {
    if (this.state.selectedJobType == null) {
      if (jobType === VoxJobType.Make) {
        const page = this.getAvailItemTypesForJobType(jobType);
        this.setState({ innerRingPage: page });
        return;
      }

      const page = this.getAvailPatternPreviewForJobType(jobType);
      this.setState({ innerRingPage: page });
      return;
    }
  }

  private onMouseLeaveJobItem = () => {
    if (this.state.selectedJobType == null) {
      this.setState({ innerRingPage: [] });
    }
  }
}

class SelectJobWheelWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <CraftingContext.Consumer>
        {({ loading, recipeIdToRecipe, itemIdToAvailablePattern, jobTypeToAvailablePatterns }) => (
          <JobContext.Consumer>
            {({ inputItems, onSelectRecipe }) => (
              <SelectJobWheel
                {...this.props}
                loading={loading}
                inputItems={inputItems}
                recipeIdToRecipe={recipeIdToRecipe}
                itemIdToAvailablePattern={itemIdToAvailablePattern}
                jobTypeToAvailablePatterns={jobTypeToAvailablePatterns}
                onSelectRecipe={onSelectRecipe}
              />
            )}
          </JobContext.Consumer>
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default SelectJobWheelWithInjectedContext;
