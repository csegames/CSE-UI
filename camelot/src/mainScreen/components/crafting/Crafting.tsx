/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { BorderBackground, FactionBorder, BorderType } from '../FactionBorder';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAny,
  // StringIDGeneralCancel, // unused while cancel button is hidden
  StringIDGeneralClose,
  StringIDGeneralCollect,
  StringIDGeneralComplete,
  StringIDGeneralError,
  StringIDGeneralFilters,
  StringIDGeneralPlus
} from '../../helpers/stringTableHelpers';
import Escapable from '../Escapable';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { FactionScrollArea } from '../FactionScrollArea';
import { FactionButton } from '../FactionButton';
import { CraftingJobInstance, CraftingJobState, CraftingState } from '../../redux/craftingSlice';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import {
  AnyRequirementData,
  ItemRecipeDef,
  RecipeIngredient,
  RequirementDataStat,
  RequirementKind,
  RequirementTagsMode
} from '../../dataSources/manifest/itemRecipeManifest';
import { AccordionRowData, FactionAccordion } from '../FactionAccordion';
import { FactionNumberSelector } from '../FactionNumberSelector';
import { getFactionData } from '../../gameData/factionData';
import { requestAddImagesToCache } from '../../dataSources/imageCacheService';
import { SelectedIngredient } from '@csegames/library/dist/camelotunchained/clientFunctions/CraftingFunctions';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { hideModal, ModalModel, ModalParams, showModal, updateModalContent } from '../../redux/modalsSlice';
import { ReagentSelectionModal } from './ReagentSelectionModal';
import { ItemStatID } from '../items/itemData';
import { doesItemMatchIngredient, EquipRequirement, EquipmentRequirementOperator } from '../../helpers/itemHelpers';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { getServerTimeMS } from '../../redux/clockSlice';
import { formatDurationSeconds } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import ProgressBarURL from '../../../images/crafting/bar-crafting.png';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { EntityStat, TagState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { getStringFromTagAffixIDs } from '../../helpers/tagHelpers';
import { FactionSlidingPanel } from '../FactionSlidingPanel';
import { FactionSearchBar } from '../FactionSearchBar';
import { FactionCheckbox } from '../FactionCheckbox';
import TooltipSource from '../TooltipSource';
import { ItemCompareTooltip } from '../items/ItemCompareTooltip';

const JOB_CELL_SIZE_VMIN = 7;
const JOB_PADDING_VMIN = 3;

const CraftingFiltersModalID = 'CraftingFilters';

const Root = 'HUD-Crafting-Root';
const MainBorder = 'HUD-Crafting-MainBorder';
const JobsPanel = 'HUD-Crafting-JobsPanel';
const JobsAvailableLabel = 'HUD-Crafting-JobsAvailableLabel';
const JobsList = 'HUD-Crafting-JobsList';
const JobsListContent = 'HUD-Crafting-JobsListContent';
const JobContainer = 'HUD-Crafting-JobContainer';
const JobIconContainer = 'HUD-Crafting-JobIconContainer';
const JobIcon = 'HUD-Crafting-JobIcon';
const JobDetails = 'HUD-Crafting-JobDetails';
const JobBottomRow = 'HUD-Crafting-JobBottomRow';
const JobName = 'HUD-Crafting-JobName';
const JobProgressContainer = 'HUD-Crafting-JobProgressContainer';
const JobProgressBar = 'HUD-Crafting-JobProgressBar';
const JobProgressLabel = 'HUD-Crafting-JobProgressLabel';
const JobActionButton = 'HUD-Crafting-JobActionButton';
const RecipesTabContainer = 'HUD-Crafting-RecipesTabContainer';
const RecipesAccordionContainer = 'HUD-Crafting-RecipesAccordionContainer';
const RecipesAccordionHeader = 'HUD-Crafting-RecipesAccordionHeader';
const RecipesAccordionScroller = 'HUD-Crafting-RecipesAccordionScroller';
const RecipesAccordion = 'HUD-Crafting-RecipesAccordion';
const SearchAccordion = 'HUD-Crafting-SearchAccordion';
const RecipeDetailsContainer = 'HUD-Crafting-RecipeDetailsContainer';
const AccordionRowLabel = 'HUD-FactionAccordion-RowLabel';
const RecipeRowPointer = 'HUD-FactionAccordion-RowPointer';
const RecipeCraftableCountLabel = 'HUD-Crafting-RecipeCraftableCountLabel';
const CategoryCountContainer = 'HUD-Crafting-CategoryCountContainer';
const CategoryCountLabel = 'HUD-Crafting-CategoryCountLabel';
const DetailsRow = 'HUD-Crafting-RecipeDetails-DetailsRow';
const OutputIconContainer = 'HUD-Crafting-RecipeDetails-OutputIconContainer';
const OutputIcon = 'HUD-Crafting-RecipeDetails-OutputIcon';
const NameSkillColumn = 'HUD-Crafting-RecipeDetails-NameSkillColumn';
const RecipeNameLabel = 'HUD-Crafting-RecipeDetails-NameLabel';
const SkillRequirementRow = 'HUD-Crafting-RecipeDetails-SkillRequirementRow';
const SkillRequirementLabel = 'HUD-Crafting-RecipeDetails-SkillRequirementLabel';
const ActionRow = 'HUD-Crafting-RecipeDetails-ActionRow';
const ActionButton = 'HUD-Crafting-RecipeDetails-ActionButton';
const CraftCountContainer = 'HUD-Crafting-RecipeDetails-CraftCountContainer';
const CraftCount = 'HUD-Crafting-RecipeDetails-CraftCount';
const VerticalDivider = 'HUD-Crafting-VerticalDivider';
// Unused while qualities section is hidden — restore when re-enabling renderQualitiesRow:
// const OutputQualitiesRow = 'HUD-Crafting-OutputQualitiesRow';
// const OutputQualitiesColumn = 'HUD-Crafting-OutputQualities-Column';
// const OutputQualitiesCell = 'HUD-Crafting-OutputQualities-Cell';
// const OutputQualitiesLegendLabel = 'HUD-Crafting-OutputQualities-LegendLabel';
// const OutputQualitiesQualityLabel = 'HUD-Crafting-OutputQualities-QualityLabel';
// const OutputQualitiesChanceCell = 'HUD-Crafting-OutputQualities-ChanceCell';
const ReagentsHeaderContainer = 'HUD-Crafting-Reagents-HeaderContainer';
const ReagentsHeaderLabel = 'HUD-Crafting-Reagents-HeaderLabel';
const DividerTop = 'HUD-Crafting-Reagents-DividerTop';
const DividerBottom = 'HUD-Crafting-Reagents-DividerBottom';
const ReagentsColumns = 'HUD-Crafting-Reagents-Columns';
const ReagentsColumn = 'HUD-Crafting-Reagents-Column';
const ReagentContainer = 'HUD-Crafting-Reagents-ReagentContainer';
const ReagentButton = 'HUD-Crafting-Reagents-ReagentButton';
const IngredientPlusLabel = 'HUD-Crafting-Reagents-IngredientPlusLabel';
const SelectedIngredientIcon = 'HUD-Crafting-Reagents-SelectedIngredientIcon';
const RecipeIngredientDetails = 'HUD-Crafting-Reagents-RecipeIngredientDetails';
const RecipeIngredientName = 'HUD-Crafting-Reagents-RecipeIngredientName';
const RecipeIngredientQuality = 'HUD-Crafting-Reagents-RecipeIngredientQuality';
const RecipeIngredientQuantity = 'HUD-Crafting-Reagents-RecipeIngredientQuantity';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const FiltersButton = 'HUD-Crafting-FiltersButton';
const SearchRowText = 'HUD-Crafting-SearchRowText';
const FiltersBody = 'HUD-Crafting-FiltersBody';
const CommonFiltersSection = 'HUD-Crafting-CommonFiltersSection';
const CategoryFiltersSection = 'HUD-Crafting-CategoryFiltersSection';
const CategoryTitle = 'HUD-Crafting-CategoryTitle';
const CategoryColumn = 'HUD-Crafting-CategoryColumn';
const Filter = 'HUD-Crafting-Filter';

const StringIDCraftingCurrentJobs = 'CraftingCurrentJobs';
const StringIDCraftingJobsAvailable = 'CraftingJobsAvailable';
const StringIDPrefixCraftingJobName = 'CraftingJobName';
const StringIDCraftingRecipeSkillRequirement = 'CraftingRecipeSkillRequirement';
const StringIDCraftingActionCraft = 'CraftingActionCraft';
const StringIDCraftingQuality = 'CraftingQuality';
// Unused while qualities section is hidden:
// const StringIDCraftingQualities = 'CraftingQualities';
// const StringIDCraftingProbabilities = 'CraftingProbabilities';
const StringIDCraftingRequiredReagents = 'CraftingRequiredReagents';
// const StringIDCraftingBoostReagents = 'CraftingBoostReagents'; // unused while boost reagents label is hidden
const StringIDCraftingErrorNoJobSlotsAvailable = 'CraftingErrorNoJobSlotsAvailable';
const StringIDCraftingErrorInsufficientSkill = 'CraftingErrorInsufficientSkill';
const StringIDCraftingErrorIngredientsNotSelected = 'CraftingErrorIngredientsNotSelected';
const StringIDCraftingErrorNotEnoughIngredients = 'CraftingErrorNotEnoughIngredients';
const StringIDCraftingSearchRow = 'CraftingSearchRow';
const StringIDCraftingFiltersTitle = 'CraftingFiltersTitle';
const StringIDCraftingFiltersHasIngredients = 'CraftingFiltersHasIngredients';
const StringIDCraftingFiltersHasSkill = 'CraftingFiltersHasSkill';
const StringIDCraftingFiltersCanEquip = 'CraftingFiltersCanEquip';
const StringIDCraftingFiltersSearchIngredients = 'CraftingFiltersSearchIngredients';
const StringIDPrefixCraftingCategoryName = 'CraftingCategoryName_';

requestAddImagesToCache(Root, ['images/crafting/bar-crafting.png']);

// const NUM_ITEM_QUALITIES = 8; // unused while qualities section is hidden

interface CraftingFilters {
  hasIngredients: boolean;
  hasSkill: boolean;
  canEquip: boolean;
  searchIngredients: boolean;
  categoryIDsByJobID: Record<string, string[]>;
}

interface State {
  isJobsPanelOpen: boolean;
  selectedRecipe: ItemRecipeDef | null;
  // Maps slot to selection.
  selectedIngredients: Record<number, SelectedIngredient[]>;
  numToCraft: number;
  tick: boolean;
  searchValue: string;
  filters: CraftingFilters;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  craftingData: CraftingState;
  itemRecipeDefs: Record<string, ItemRecipeDef>;
  itemsByNumericID: Record<number, ItemDef>;
  itemsByStringID: Record<string, ItemDef>;
  stringTable: Record<string, StringTableEntryDef>;
  stationItemDef: ItemDef;
  uiFactionID: string;
  serverTimeDeltaMS: number;
  statDefs: Record<string, StatDef>;
  selfStats: Record<number, EntityStat>;
  selfTags: Record<number, TagState>;
  selfInventory: Item[];
  selfAccountBank: Item[];
  selfWallet: Item[];
  tagAffixByNumericID: Record<number, string>;
  selfRace: number;
  selfClassID: number;
  racesByNumericID: Record<number, RaceDef>;
  classesByNumericID: Record<number, ClassDef>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ACrafting extends React.Component<Props, State> {
  private updateTickInterval: number = 0;

  constructor(props: Props) {
    super(props);

    const hasJobs = this.getSortedJobs(props).length > 0;

    this.state = {
      isJobsPanelOpen: hasJobs,
      selectedRecipe: null,
      selectedIngredients: {},
      numToCraft: 1,
      tick: false,
      searchValue: '',
      filters: {
        hasIngredients: false,
        hasSkill: true,
        canEquip: false,
        searchIngredients: false,
        categoryIDsByJobID: {}
      }
    };
  }

  render(): React.ReactNode {
    if (Object.keys(this.props.stringTable).length === 0) {
      return null;
    }

    this.updateCraftingTimer();
    const jobsData = this.getSortedJobs(this.props);
    const preferredSizeVmin = this.getMaxJobCount() * JOB_CELL_SIZE_VMIN + JOB_PADDING_VMIN;

    return (
      <div className={Root}>
        {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_CRAFTING} onEscape={this.closeSelf.bind(this)} />}
        <FactionSlidingPanel
          className={JobsPanel}
          titleText={getStringTableValue(StringIDCraftingCurrentJobs, this.props.stringTable)}
          isOpen={this.state.isJobsPanelOpen}
          isBadged={jobsData.length > 0}
          onToggleClicked={() => {
            this.setState({ isJobsPanelOpen: !this.state.isJobsPanelOpen });
            clientAPI.playGameSound(SoundEvents.PLAY_UI_CRAFTING_JOBS_TAB);
          }}
        >
          <FactionScrollArea
            className={JobsList}
            contentClassName={JobsListContent}
            style={{ height: `${preferredSizeVmin}vmin` }}
            showEmptyTrack
          >
            {this.renderCurrentJobs(jobsData)}
          </FactionScrollArea>
        </FactionSlidingPanel>
        <FactionBorder
          className={MainBorder}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
          titleText={
            this.props.stationItemDef ? getStringTableValue(this.props.stationItemDef.name, this.props.stringTable) : ''
          }
        >
          {this.renderRecipesTab()}
        </FactionBorder>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_CRAFTING} />
      </div>
    );
  }

  private getSortedJobs(props: Props): CraftingJobInstance[] {
    const stationID = props.craftingData?.interactedCraftingStationData?.entityID; // This is now an ItemInstanceID.
    const jobs = Object.values(props.craftingData.jobsInProgress ?? {});
    const filtered = stationID ? jobs.filter((j) => j.craftingStationID === stationID) : jobs;
    return filtered.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
  }

  private updateCraftingTimer(): void {
    const nowMS = getServerTimeMS(this.props);
    const hasUnfinishedJobs = this.getSortedJobs(this.props).some(
      (instance: CraftingJobInstance) => nowMS < new Date(instance.endTime).getTime()
    );

    if (this.state.isJobsPanelOpen && hasUnfinishedJobs && this.updateTickInterval === 0) {
      // If we have unfinished jobs and no current crafting interval, start one up.
      this.updateTickInterval = window.setInterval(() => this.setState({ tick: !this.state.tick }), 1000);
    } else if ((!this.state.isJobsPanelOpen || !hasUnfinishedJobs) && this.updateTickInterval !== 0) {
      // If we have no unfinished jobs, but we DO have an interval, stop it.
      window.clearInterval(this.updateTickInterval);
      this.updateTickInterval = 0;
    }
  }

  componentDidMount(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CRAFTING_WINDOW_OPEN);
  }

  componentWillUnmount(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_CRAFTING_CLOSE_WINDOW);
    if (this.updateTickInterval) {
      window.clearInterval(this.updateTickInterval);
      this.updateTickInterval = 0;
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.craftingData !== prevProps.craftingData) {
      const oldJobCount = this.getSortedJobs(prevProps).length;
      const newJobCount = this.getSortedJobs(this.props).length;
      if (oldJobCount < newJobCount && !this.state.isJobsPanelOpen) {
        // When a new Job is started, open the Jobs panel to communicate that success.
        this.setState({ isJobsPanelOpen: true });
        clientAPI.playGameSound(SoundEvents.PLAY_UI_CRAFTING_JOBS_TAB);
      } else if (oldJobCount > 0 && newJobCount === 0 && this.state.isJobsPanelOpen) {
        // When the last Job is collected, close the Jobs panel since it's no longer relevant.
        this.setState({ isJobsPanelOpen: false });
        clientAPI.playGameSound(SoundEvents.PLAY_UI_CRAFTING_JOBS_TAB);
      }
    }

    // If any of the selected ingredients now has an item count of zero (because it got used up by a crafting job),
    // de-select that ingredient.
    let needsCull = false;
    let postCullSelections: Record<number, SelectedIngredient[]> = {};
    Object.keys(this.state.selectedIngredients).forEach((stringSlotIndex) => {
      const slotIndex = +stringSlotIndex;
      let selections = [...this.state.selectedIngredients[slotIndex]];
      // Running this backwards so we don't screw up unchecked indices by removing as we go.
      for (let i = selections.length - 1; i >= 0; --i) {
        const ingredient = selections[i];
        const itemCount = this.getItemCountForSelections([ingredient]);
        if (itemCount <= 0) {
          needsCull = true;
          selections.splice(i, 1);
        }
      }
      postCullSelections[slotIndex] = selections;
    });
    if (needsCull) {
      this.setState({ selectedIngredients: postCullSelections });
    }
  }

  private getMaxJobCount(): number {
    return this.props.stationItemDef?.defStats?.[ItemStatID.MaxCraftingJobs] ?? 0;
  }

  private getAvailableJobCount(): number {
    const jobCount = this.getSortedJobs(this.props).length;
    return Math.max(0, this.getMaxJobCount() - jobCount);
  }

  private renderCurrentJobs(jobsData: CraftingJobInstance[]): React.ReactNode[] {
    const jobs: React.ReactNode[] = [];

    const maxJobCount = this.getMaxJobCount();
    for (let i = 0; i < maxJobCount; ++i) {
      const lastStyle = i === maxJobCount - 1 ? { marginBottom: '0' } : undefined;

      if (i < jobsData.length) {
        const durationMS = new Date(jobsData[i].endTime).getTime() - new Date(jobsData[i].startTime).getTime();
        const nowMS = getServerTimeMS(this.props);
        const isFinished = jobsData[i].jobState === CraftingJobState.Finished;
        const elapsedMS = isFinished ? durationMS : Math.max(0, nowMS - new Date(jobsData[i].startTime).getTime());
        const remainingMS = Math.max(0, durationMS - elapsedMS);
        const jobProgress = Math.min(1, elapsedMS / durationMS);

        const recipeDef = this.props.itemRecipeDefs[jobsData[i].recipeDefID];

        jobs.push(
          <FactionBorder
            className={JobContainer}
            style={lastStyle}
            type={BorderType.Secondary}
            background={BorderBackground.PatternLarge}
          >
            <FactionBorder
              className={JobIconContainer}
              type={BorderType.Decorative}
              cornerSize={'4vmin'}
              borderSize={'4vmin'}
            >
              <img
                className={JobIcon}
                src={this.props.itemsByStringID[recipeDef?.outputItemDefID]?.iconUrl ?? '/images/MissingAsset.png'}
              />
            </FactionBorder>
            <div className={JobDetails}>
              <div className={JobName}>{recipeDef?.name}</div>
              <div className={JobBottomRow}>
                <FactionBorder
                  className={JobProgressContainer}
                  type={BorderType.Secondary}
                  background={BorderBackground.ProgressBar}
                >
                  <img className={JobProgressBar} style={{ width: `${jobProgress * 100}%` }} src={ProgressBarURL} />
                  <div className={JobProgressLabel}>
                    {remainingMS <= 0
                      ? getStringTableValue(StringIDGeneralComplete, this.props.stringTable)
                      : formatDurationSeconds(remainingMS / 1000)}
                  </div>
                </FactionBorder>
                <FactionButton
                  className={JobActionButton}
                  widthOverrideVmin={9.5}
                  onClick={isFinished ? this.onJobCollectClicked.bind(this, jobsData[i]) : undefined}
                  disabled={!isFinished}
                >
                  {getStringTableValue(StringIDGeneralCollect, this.props.stringTable)}
                </FactionButton>
                {/* Cancel button hidden until cancellation is implemented:
                <FactionButton
                  className={JobActionButton}
                  widthOverrideVmin={9.5}
                  onClick={this.onJobCancelClicked.bind(this, jobsData[i])}
                  disabled={true}
                  disabledTooltip={'NYI'}
                >
                  {getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
                </FactionButton> */}
              </div>
            </div>
          </FactionBorder>
        );
      } else {
        jobs.push(
          <FactionBorder
            className={JobContainer}
            style={lastStyle}
            type={BorderType.Secondary}
            background={BorderBackground.Darken}
          >
            {/** An invisible div to maintain the proper cell height. */}
            <div className={JobIconContainer} style={{ opacity: 0 }} />
          </FactionBorder>
        );
      }
    }

    return jobs;
  }

  private onJobCollectClicked(instance: CraftingJobInstance): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CRAFTING_COLLECTION);
    clientAPI.collectCraftingJob(
      instance.jobInstanceID,
      this.props.craftingData.interactedCraftingStationData.entityID
    );
  }

  // private onJobCancelClicked(instance: CraftingJobInstance): void {
  //   // TODO: Backend for cancel doesn't exist yet.
  // }

  private renderRecipesTab(): React.ReactNode {
    const { selectedRecipe } = this.state;
    const outputItem = this.props.itemsByStringID[selectedRecipe?.outputItemDefID ?? ''];

    const factionData = getFactionData(this.props.uiFactionID);
    const recipeRows = this.getRecipeRows();
    const searchRows = this.getSearchResultRows(recipeRows);

    return (
      <div className={RecipesTabContainer}>
        <div className={RecipesAccordionContainer}>
          <div className={RecipesAccordionHeader}>
            <FactionSearchBar
              heightOverrideVmin={2.8}
              value={this.state.searchValue}
              onValueChanged={(searchValue) => this.setState({ searchValue })}
            />
            <FactionButton
              className={FiltersButton}
              widthOverrideVmin={10.5}
              onClick={this.onShowFiltersClicked.bind(this)}
            >
              {getStringTableValue(StringIDGeneralFilters, this.props.stringTable)}
            </FactionButton>
          </div>
          <FactionScrollArea
            className={RecipesAccordionScroller}
            barOnLeft={true}
            soundEventScrolled={SoundEvents.PLAY_UI_CRAFTING_SCROLLBAR}
          >
            {searchRows.length > 0 && (
              <FactionAccordion
                key={`SearchAccordion`}
                className={SearchAccordion}
                data={searchRows}
                maxOpenedHeightVmin={999}
                barOnLeft={true}
                onRowSelected={(datum: AccordionRowData) => {
                  this.setState({ selectedRecipe: datum.extraData, numToCraft: 1, selectedIngredients: {} });
                }}
                soundEventFoldingToggled={SoundEvents.PLAY_UI_CRAFTING_DROPDOWN_ARROW}
                soundEventItemSelected={SoundEvents.PLAY_UI_CRAFTING_SELECT}
                soundEventScrolled={SoundEvents.PLAY_UI_CRAFTING_SCROLLBAR}
              />
            )}
            <FactionAccordion
              key={`RecipesAccordion`}
              className={RecipesAccordion}
              data={recipeRows}
              maxOpenedHeightVmin={999}
              barOnLeft={true}
              onRowSelected={(datum: AccordionRowData) => {
                this.setState({ selectedRecipe: datum.extraData, numToCraft: 1, selectedIngredients: {} });
              }}
              soundEventFoldingToggled={SoundEvents.PLAY_UI_CRAFTING_DROPDOWN_ARROW}
              soundEventItemSelected={SoundEvents.PLAY_UI_CRAFTING_SELECT}
              soundEventScrolled={SoundEvents.PLAY_UI_CRAFTING_SCROLLBAR}
            />
          </FactionScrollArea>
        </div>
        <div className={VerticalDivider} style={{ backgroundImage: `url(${factionData.edgeDecorativeLeftImage})` }} />
        <div className={RecipeDetailsContainer}>
          <div className={`${JobsAvailableLabel} details`}>
            {getTokenizedStringTableValue(StringIDCraftingJobsAvailable, this.props.stringTable, {
              AVAILABLE: `${this.getAvailableJobCount()}`,
              MAX: `${this.getMaxJobCount()}`
            })}
          </div>
          {selectedRecipe && outputItem && this.renderSelectedRecipe(selectedRecipe, outputItem)}
        </div>
      </div>
    );
  }

  private renderSelectedRecipe(selectedRecipe: ItemRecipeDef, outputItemDef: ItemDef): React.ReactNode {
    // See TagRequirement, StatRequirement, etc in RequirementDef.cs, and how they are converted to json in ItemRecipeDefManifest.cs
    // Faction restriction, if any, will be included as a tag. Only players with matching faction should be able to see these.
    // MinSkill, if any, will be included as a player Stat.
    const statRequirements = selectedRecipe.requirements.filter(
      (req: AnyRequirementData) => req.Kind === RequirementKind.Stat
    ) as RequirementDataStat[];
    let skillReqs =
      statRequirements.length === 0 ? (
        // If no stat requirements, say Any is acceptable.
        <span className={SkillRequirementLabel}>{getStringTableValue(StringIDGeneralAny, this.props.stringTable)}</span>
      ) : (
        // If there are stat requirements, list them all.
        statRequirements.map((req, index) => {
          const statDef = this.props.statDefs[req.Stat];
          const statValue = this.props.selfStats[statDef?.numericID]?.value ?? 0;
          const metStyle = statValue >= req.MinVal ? '' : ' unmet';

          return (
            <span className={`${SkillRequirementLabel}${metStyle}`}>{`${getStringTableValue(
              statDef.name,
              this.props.stringTable
            )} ${req.MinVal.toFixed(0)}${index < statRequirements.length - 1 ? ',\xa0' : ''}`}</span>
          );
        })
      );
    selectedRecipe.requirements.forEach((req: AnyRequirementData) => {});

    return (
      <>
        <div className={DetailsRow}>
          <FactionBorder
            className={OutputIconContainer}
            type={BorderType.Decorative}
            background={BorderBackground.PatternSmall}
          >
            <TooltipSource
              tooltipID='CraftingOutputItem'
              content={() => <ItemCompareTooltip itemDefID={outputItemDef.id} />}
              positionType='mouse'
              noOuterBorder
            >
              <img className={OutputIcon} src={outputItemDef.iconUrl} />
            </TooltipSource>
          </FactionBorder>
          <div className={NameSkillColumn}>
            <div className={RecipeNameLabel}>{selectedRecipe.name}</div>

            <div className={SkillRequirementRow}>
              <div className={SkillRequirementLabel}>
                {getStringTableValue(StringIDCraftingRecipeSkillRequirement, this.props.stringTable)}
              </div>
              &nbsp;
              {skillReqs}
            </div>
          </div>
        </div>
        <div className={ActionRow}>
          {outputItemDef.isStackableItem && (
            <FactionBorder
              className={CraftCountContainer}
              type={BorderType.Primary}
              background={BorderBackground.PatternSmall}
            >
              <FactionNumberSelector
                className={CraftCount}
                value={this.state.numToCraft}
                minValue={1}
                maxValue={99}
                onValueChanged={(numToCraft) => this.setState({ numToCraft })}
                soundEventArrowClicked={SoundEvents.PLAY_UI_CRAFT_ARROW}
              />
            </FactionBorder>
          )}
          <FactionButton
            className={ActionButton}
            disabled={!this.getIsReadyToCraft()}
            disabledTooltip={this.getCraftButtonDisabledTooltip()}
            onClick={this.onCraftClicked.bind(this)}
          >
            {getStringTableValue(StringIDCraftingActionCraft, this.props.stringTable)}
          </FactionButton>
        </div>
        {/* Qualities section hidden — re-enable when data is ready: this.renderQualitiesRow() */}
        {this.renderReagentsSection()}
      </>
    );
  }

  /* Hidden until quality data is ready.
  private renderQualitiesRow(): React.ReactNode {
    return (
      <FactionBorder
        className={OutputQualitiesRow}
        type={BorderType.Primary}
        background={BorderBackground.PatternLarge}
      >
        <div className={OutputQualitiesColumn}>
          <div className={OutputQualitiesCell}>
            <div className={OutputQualitiesLegendLabel}>
              {getStringTableValue(StringIDCraftingQualities, this.props.stringTable)}
            </div>
          </div>
          <div className={OutputQualitiesCell}>
            <div className={OutputQualitiesLegendLabel}>
              {getStringTableValue(StringIDCraftingProbabilities, this.props.stringTable)}
            </div>
          </div>
        </div>
        {this.renderQualitiesColumns()}
      </FactionBorder>
    );
  }
  */

  /* Unused while qualities section is hidden — restore when re-enabling renderQualitiesRow.
  private renderQualitiesColumns(): React.ReactNode[] {
    const factionData = getFactionData(this.props.uiFactionID);

    const columns: React.ReactNode[] = [];

    // TODO: Get real data for probabilities.
    for (let i = 0; i < NUM_ITEM_QUALITIES; ++i) {
      columns.push(
        <div className={OutputQualitiesColumn} key={`Quality${i}`}>
          <div className={OutputQualitiesCell}>
            <div className={OutputQualitiesQualityLabel}>{`${i + 1}`}</div>
          </div>
          <div className={OutputQualitiesChanceCell} style={{ borderColor: factionData.borderColor }}>
            <div className={OutputQualitiesQualityLabel}>{`${0} %`}</div>
          </div>
        </div>
      );
    }

    return columns;
  }
  */

  private renderReagentsSection(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const required = this.state.selectedRecipe?.ingredients.filter((r) => !r.isOptional) ?? [];
    const optional = this.state.selectedRecipe?.ingredients.filter((r) => r.isOptional) ?? [];

    return (
      <>
        <div className={ReagentsHeaderContainer}>
          <img className={DividerTop} src={factionData.dividerVerticalImage} />
          <div className={ReagentsHeaderLabel}>
            {getStringTableValue(StringIDCraftingRequiredReagents, this.props.stringTable)}
          </div>
          {/* Boost Reagents label hidden — re-enable when boost system is ready:
          <div className={ReagentsHeaderLabel}>
            {getStringTableValue(StringIDCraftingBoostReagents, this.props.stringTable)}
          </div> */}
          <img className={DividerBottom} src={factionData.dividerVerticalImage} />
        </div>
        <div className={ReagentsColumns}>
          {this.renderReagentColumn(required)}
          {this.renderReagentColumn(optional)}
        </div>
      </>
    );
  }

  private renderReagentColumn(ingredients: RecipeIngredient[]): React.ReactNode {
    return (
      <div className={ReagentsColumn}>
        {ingredients.map((ingredient, index) => {
          const selections = this.state.selectedIngredients[ingredient.slot];
          const itemCount = this.getItemCountForSelections(selections);
          // Could be any number of selections.  Just show the icon for the first one.
          const selectedItemDef = this.getItemDefForSelection(selections?.[0]);

          return (
            <div className={ReagentContainer} key={`Ingredient${index}`}>
              <FactionBorder
                className={ReagentButton}
                type={BorderType.Secondary}
                background={BorderBackground.PatternSmall}
                onClick={this.onIngredientClicked.bind(this, ingredient)}
              >
                {selections?.length > 0 ? (
                  <img
                    className={SelectedIngredientIcon}
                    src={selectedItemDef?.iconUrl ?? `./images/MissingAsset.png`}
                  />
                ) : (
                  <div className={IngredientPlusLabel}>
                    {getStringTableValue(StringIDGeneralPlus, this.props.stringTable)}
                  </div>
                )}
              </FactionBorder>
              <div className={RecipeIngredientDetails}>
                <div className={RecipeIngredientName}>{this.getRecipeIngredientName(ingredient)}</div>
                {ingredient.minQuality > 1 && (
                  <div className={RecipeIngredientQuality}>
                    {getTokenizedStringTableValue(StringIDCraftingQuality, this.props.stringTable, {
                      LEVEL: `${ingredient.minQuality}`
                    })}
                  </div>
                )}
                <div className={RecipeIngredientQuantity}>{`${itemCount} / ${
                  ingredient.quantity * this.state.numToCraft
                }`}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  private getRecipeIngredientName(ingredient: RecipeIngredient): string {
    if (ingredient.itemDefID?.length > 0) {
      const itemDef = this.props.itemsByStringID[ingredient.itemDefID];
      return itemDef?.name ?? getStringTableValue(StringIDGeneralError, this.props.stringTable);
    }
    return 'NYI: Tag-based RecipeIngredients';
  }

  private getItemCountForSelections(selections: SelectedIngredient[]): number {
    return (
      selections?.reduce<number>((soFar: number, s: SelectedIngredient) => {
        const item = this.getItemForSelection(s);
        const count = item?.unitCount ?? 0;
        // Because it is possible to select from multiple stacks and even multiple unique items, we can't just
        // display the total number in the selected stack(s).  Instead we're just showing if the user has enough
        // to build the number of runs that they requested.  Any stack that has enough will add the full amount.
        // Any stack that doesn't have enough add show less.
        return soFar + Math.min(count, s.quantity * this.state.numToCraft);
      }, 0) ?? 0
    );
  }

  private getItemForSelection(selection: SelectedIngredient): Item | null {
    if (!selection) {
      return null;
    }

    // Is the item in your inventory?
    let item = this.props.selfInventory.find((i) => i.instanceID === selection.itemInstanceID);
    if (item) {
      return item;
    }

    // Is the item in your personalBank?
    item = this.props.selfAccountBank.find((i) => i.instanceID === selection.itemInstanceID);
    if (item) {
      return item;
    }

    // TODO: Search other sources, like bank or guildBank.

    return null;
  }

  private getItemDefForSelection(selection: SelectedIngredient): ItemDef | null {
    const item = this.getItemForSelection(selection);
    if (!item) {
      return null;
    }

    return this.props.itemsByNumericID[item.defID];
  }

  private onIngredientClicked(ingredient: RecipeIngredient): void {
    const params: ModalParams = {
      id: `SelectIngredient`,
      content: (p: ModalParams) => (
        <ReagentSelectionModal
          ingredient={ingredient}
          selections={this.state.selectedIngredients[ingredient.slot] ?? []}
          onIngredientsSelected={(selections: SelectedIngredient[]) => {
            let newSelectedIngredients = { ...this.state.selectedIngredients };
            if (selections?.length > 0) {
              newSelectedIngredients[ingredient.slot] = selections;
            } else {
              delete newSelectedIngredients[ingredient.slot];
            }
            this.setState({ selectedIngredients: newSelectedIngredients });
          }}
        />
      ),
      escapable: true
    };
    this.props.dispatch(showModal(params));
    clientAPI.playGameSound(SoundEvents.PLAY_UI_CRAFTING_ADD_REGENT);
  }

  private getIsReadyToCraft(): boolean {
    // If no job slots available, then you can't craft!
    if (this.getAvailableJobCount() <= 0) {
      return false;
    }

    // If you don't have enough skill for this recipe, then you can't make it.
    if (!this.getHasRequiredSkillLevels()) {
      return false;
    }

    // Didn't select all the required items?
    if (!this.getAreAllIngredientsSpecified()) {
      return false;
    }

    // Didn't select ingredients with sufficient quantity?
    if (!this.getAreAllIngredientsSufficient()) {
      return false;
    }

    return true;
  }

  private getAreAllIngredientsSpecified(): boolean {
    return (this.state.selectedRecipe?.ingredients ?? []).every((recipeIngredient: RecipeIngredient) => {
      return (
        // If the ingredient is optional, then you're good whether or not you specified something.
        recipeIngredient.isOptional ||
        // Every required recipeIngredient must have a matching selectedIngredient.
        this.state.selectedIngredients[recipeIngredient.slot]?.length > 0
      );
    });
  }

  private getAreAllIngredientsSufficient(): boolean {
    return (this.state.selectedRecipe?.ingredients ?? []).every((recipeIngredient: RecipeIngredient) => {
      if (this.state.selectedIngredients[recipeIngredient.slot]?.length > 0) {
        // If the ingredient is specified, you must have enough for the requested batch count.
        return (
          this.getItemCountForSelections(this.state.selectedIngredients[recipeIngredient.slot]) >=
          recipeIngredient.quantity * this.state.numToCraft
        );
      } else if (!recipeIngredient.isOptional) {
        // Not optional and not specified, thus you don't have enough selected!
        return false;
      } else {
        // Is optional, but not specified, so this ingredient is fine.
        return true;
      }
    });
  }

  private getHasRequiredSkillLevels(): boolean {
    return this.state.selectedRecipe ? this.getHasRequiredSkillLevelsForRecipe(this.state.selectedRecipe) : true;
  }

  private getHasRequiredSkillLevelsForRecipe(recipeDef: ItemRecipeDef): boolean {
    const statRequirements = recipeDef.requirements.filter(
      (req: AnyRequirementData) => req.Kind === RequirementKind.Stat
    ) as RequirementDataStat[];

    // Is every required stat at or above the minimum?
    return statRequirements.every((req) => {
      const statDef = this.props.statDefs[req.Stat];
      const statValue = this.props.selfStats[statDef?.numericID]?.value ?? 0;

      return statValue >= req.MinVal;
    });
  }

  private onCraftClicked(): void {
    // Queue up the crafting job.
    clientAPI.startCraftingJob(
      this.state.selectedRecipe.id,
      this.props.craftingData.interactedCraftingStationData.entityID,
      [].concat(...Object.values(this.state.selectedIngredients)), // .flat() is not supported until Chrome 69
      this.state.numToCraft
    );

    // Play the Craft sound for this station.
    // Have to get a little dirty with the typing because Typescript transpiles enums oddly.
    const sfxKey = `PLAY_UI_CRAFT_${this.props.stationItemDef?.id.slice(3).toUpperCase()}`;
    const sfxID = (SoundEvents as unknown as Record<string, number>)[sfxKey];
    if (sfxID) {
      clientAPI.playGameSound(sfxID);
    } else {
      // If you hit this, then you probably need to add a new entry to the SoundEvents enum.
      // Check the client repo at `Wwise_IDs.h` to see if it already exists.  If so, you can
      // copy it into `SoundEvents.ts` and rebuild the UI library subproject to activate it.
      console.error(`No Crafting SFX found for ${sfxKey}`);
    }

    this.setState({ numToCraft: 1 });
  }

  private getSortedJobIDs(): string[] {
    const sourceJobIDs = this.props.stationItemDef?.craftingStationConfig?.allowableJobDefs ?? ['None'];
    // We have to do this silly spread because allowableJobDefs is read-only, so we can't sort it directly.
    let allowableJobIDs: string[] = [...sourceJobIDs];
    // Sort the job categories alphabetically.
    allowableJobIDs.sort((a, b) => {
      const aName = getStringTableValue(`${StringIDPrefixCraftingJobName}${a}`, this.props.stringTable);
      const bName = getStringTableValue(`${StringIDPrefixCraftingJobName}${b}`, this.props.stringTable);

      return aName.localeCompare(bName);
    });

    return allowableJobIDs;
  }

  private renderRecipeRowContent(recipeDef: ItemRecipeDef, isSelected: boolean): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const craftableCount = this.getMaxCraftableCount(recipeDef);

    return (
      <>
        <div className={`${AccordionRowLabel}${isSelected ? ' selected' : ''}`}>
          {recipeDef.name}
          {craftableCount !== null && craftableCount > 0 && (
            <span className={RecipeCraftableCountLabel}>{`(${craftableCount})`}</span>
          )}
        </div>
        <img className={RecipeRowPointer} src={factionData.arrowPointerImage} style={{ opacity: isSelected ? 1 : 0 }} />
      </>
    );
  }

  // Null means either the skill requirement isn't met, or the recipe has no required (non-optional) ingredients
  // (so reagents don't limit how many can be made).
  private getMaxCraftableCount(recipeDef: ItemRecipeDef): number | null {
    if (!this.getHasRequiredSkillLevelsForRecipe(recipeDef)) {
      return null;
    }

    const requiredIngredients = recipeDef.ingredients.filter((ingredient) => !ingredient.isOptional);
    if (requiredIngredients.length === 0) {
      return null;
    }

    return requiredIngredients.reduce<number>((maxCraftable, ingredient) => {
      const craftableFromIngredient = Math.floor(this.getOwnedCountForIngredient(ingredient) / ingredient.quantity);
      return Math.min(maxCraftable, craftableFromIngredient);
    }, Infinity);
  }

  private getOwnedCountForIngredient(ingredient: RecipeIngredient): number {
    const sumMatching = (items: Item[]): number =>
      items.reduce<number>((sum, item) => {
        return doesItemMatchIngredient(item, ingredient, this.props.itemsByStringID, this.props.statDefs)
          ? sum + item.unitCount
          : sum;
      }, 0);

    return (
      sumMatching(this.props.selfInventory) +
      sumMatching(this.props.selfAccountBank) +
      sumMatching(this.props.selfWallet)
    );
  }

  private getRecipeRows(): AccordionRowData[] {
    let byJob: Record<string, ItemRecipeDef[]> = {};

    const jobIDs = this.getSortedJobIDs();

    jobIDs.forEach((jobID) => {
      byJob[jobID] = [];
    });

    const selfTagStrings = Object.values(this.props.selfTags).map((tag: TagState) => {
      return getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.tagAffixByNumericID);
    });

    Object.values(this.props.itemRecipeDefs).forEach((recipeDef) => {
      // Only show recipes from an allowed job type.
      if (!byJob[recipeDef.jobID]) {
        return;
      }

      // Also check tag requirements!
      let meetsTagRequirements = true;
      recipeDef.requirements.forEach((req) => {
        if (meetsTagRequirements && req.Kind === RequirementKind.Tags) {
          switch (req.Mode) {
            case RequirementTagsMode.All: {
              meetsTagRequirements =
                meetsTagRequirements && req.Tags.every((requiredTag) => selfTagStrings.includes(requiredTag));
              break;
            }
            case RequirementTagsMode.Any: {
              meetsTagRequirements =
                meetsTagRequirements && req.Tags.some((requiredTag) => selfTagStrings.includes(requiredTag));
              break;
            }
            case RequirementTagsMode.None: {
              meetsTagRequirements =
                meetsTagRequirements && req.Tags.every((requiredTag) => !selfTagStrings.includes(requiredTag));
              break;
            }
          }
        }
      });
      if (!meetsTagRequirements) {
        return;
      }

      // Check filters.
      if (!this.getRecipeSatisfiesFilters(recipeDef)) {
        return;
      }

      byJob[recipeDef.jobID]?.push(recipeDef);
    });

    // Sort recipes alphabetically.
    // TODO: Do we need to localize these in the UI layer?  Should sort by localized string.
    jobIDs.forEach((jobID) => {
      byJob[jobID].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });

    let rows: AccordionRowData[] = [];

    jobIDs.forEach((jobID) => {
      const categoryRow: AccordionRowData = {
        content: this.renderCategoryRowContent.bind(this, jobID, byJob[jobID].length),
        children: byJob[jobID].map((recipeDef) => {
          const recipeRow: AccordionRowData = {
            content: this.renderRecipeRowContent.bind(this, recipeDef),
            extraData: recipeDef
          };
          return recipeRow;
        })
      };

      rows.push(categoryRow);
    });

    return rows;
  }

  private getRecipeSatisfiesFilters(recipeDef: ItemRecipeDef): boolean {
    // Check categories.
    const hasCategoryFilter = Object.values(this.state.filters.categoryIDsByJobID).some((catIDs) => catIDs.length > 0);
    if (hasCategoryFilter) {
      const category = recipeDef.tags.find((tag) => tag.startsWith('Crafting.Category.'));
      if (category) {
        const categoryID = category.slice(18);
        const matchesCategory = (this.state.filters.categoryIDsByJobID[recipeDef.jobID] ?? []).includes(categoryID);
        if (!matchesCategory) {
          return false;
        }
      } else {
        return false;
      }
    }

    // Check skill.
    if (this.state.filters.hasSkill && !this.getHasRequiredSkillLevelsForRecipe(recipeDef)) {
      return false;
    }

    // Check can equip (only applies to items that have gear slots).
    if (this.state.filters.canEquip) {
      const outputItemDef = this.props.itemsByStringID[recipeDef.outputItemDefID];
      if (outputItemDef && outputItemDef.gearSlotSets.length > 0) {
        let requirements: EquipRequirement[];
        try {
          requirements = JSON.parse(outputItemDef.equipRequirements) ?? [];
        } catch {
          requirements = [];
        }
        if (!Array.isArray(requirements)) return true;
        const tagStrings = Object.values(this.props.selfTags).map((tag) =>
          getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.tagAffixByNumericID)
        );
        const raceDef = this.props.racesByNumericID[this.props.selfRace];
        const classDef = this.props.classesByNumericID[this.props.selfClassID];
        if (!requirements.every((requirement) => {
          let characterValue: string | null = null;
          let itemValue: string = '';
          let fieldMatched = false;
          if (requirement.Faction) {
            fieldMatched = true;
            characterValue = this.props.uiFactionID;
            itemValue = requirement.Faction;
          } else if (requirement.Race) {
            fieldMatched = true;
            characterValue = raceDef?.id ?? null;
            itemValue = requirement.Race;
          } else if (requirement.Class) {
            fieldMatched = true;
            characterValue = classDef?.id ?? null;
            itemValue = requirement.Class;
          } else if (requirement.Tag) {
            fieldMatched = true;
            const requiredTag =
              typeof requirement.Tag === 'string'
                ? requirement.Tag
                : getStringFromTagAffixIDs(requirement.Tag.Affixes, this.props.tagAffixByNumericID);
            characterValue = tagStrings.includes(requiredTag) ? requiredTag : null;
            itemValue = requiredTag;
          }
          if (!fieldMatched) return true;
          switch (requirement.Operator) {
            case EquipmentRequirementOperator.Equals:
              return characterValue === itemValue;
            case EquipmentRequirementOperator.NotEquals:
              return characterValue !== itemValue;
            default:
              return true;
          }
        })) return false;
      }
    }

    // Check required ingredients.
    if (this.state.filters.hasIngredients) {
      for (const ingredient of recipeDef.ingredients) {
        if (ingredient.isOptional) continue;

        const matchFunc = (item: Item) => {
          return (
            doesItemMatchIngredient(item, ingredient, this.props.itemsByStringID, this.props.statDefs) &&
            item.unitCount >= ingredient.quantity
          );
        };

        if (
          !this.props.selfInventory.find(matchFunc) &&
          !this.props.selfAccountBank.find(matchFunc) &&
          !this.props.selfWallet.find(matchFunc)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  private getSearchResultRows(allRows: AccordionRowData[]): AccordionRowData[] {
    // If there is a search in progress, put its results at the front, even if no matches.
    const searchValue = this.state.searchValue.trim().toLowerCase();
    if (searchValue.length > 0) {
      const resultRows: AccordionRowData[] = [];

      allRows.forEach((data) => {
        data.children.forEach((d) => {
          // If this row matches, add it to resultRows.
          const recipeDef = d.extraData as ItemRecipeDef;
          // Search recipe name.
          let isSearched = recipeDef.name.toLowerCase().includes(searchValue);
          // Search output item name.
          if (!isSearched) {
            const outputItemDef = this.props.itemsByStringID[recipeDef.outputItemDefID];
            isSearched = (outputItemDef?.name ?? '').toLowerCase().includes(searchValue);
          }
          // Search ingredient names (if that option is selected).
          if (!isSearched && this.state.filters.searchIngredients) {
            isSearched = recipeDef.ingredients.some((ingredient) => {
              return this.getRecipeIngredientName(ingredient).toLowerCase().includes(searchValue);
            });
          }

          // If any of the conditions were met, add this row.
          if (isSearched) {
            resultRows.push(d);
          }
        });
      });

      // Sort result rows.
      resultRows.sort((a, b) => {
        const aDef = a.extraData as ItemRecipeDef;
        const bDef = b.extraData as ItemRecipeDef;
        // TODO: Probably need to localize these names some day.
        return aDef.name.localeCompare(bDef.name);
      });

      const searchRow: AccordionRowData = {
        content: this.renderSearchRowContent.bind(this, resultRows.length),
        children: resultRows
      };
      return [searchRow];
    } else {
      return [];
    }
  }

  private renderSearchRowContent(resultCount: number): React.ReactNode {
    const categoryName = getStringTableValue(StringIDCraftingSearchRow, this.props.stringTable);

    return (
      <>
        <FactionBorder type={BorderType.Secondary} className={CategoryCountContainer}>
          <div className={CategoryCountLabel}>{resultCount}</div>
        </FactionBorder>
        <div className={`${AccordionRowLabel} hasChildren`}>
          {categoryName}
          {'\xa0'}
          <span className={SearchRowText}>{this.state.searchValue.trim()}</span>
        </div>
      </>
    );
  }

  private renderCategoryRowContent(jobID: string, recipeCount: number): React.ReactNode {
    const categoryName = getStringTableValue(`${StringIDPrefixCraftingJobName}${jobID}`, this.props.stringTable);

    return (
      <>
        <FactionBorder type={BorderType.Secondary} className={CategoryCountContainer}>
          <div className={CategoryCountLabel}>{recipeCount}</div>
        </FactionBorder>
        <div className={`${AccordionRowLabel} hasChildren`}>{categoryName}</div>
      </>
    );
  }

  closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_CRAFTING));
  }

  private getCraftButtonDisabledTooltip(): string | null {
    // If no available job slots, show that error.
    if (this.getAvailableJobCount() <= 0) {
      return getStringTableValue(StringIDCraftingErrorNoJobSlotsAvailable, this.props.stringTable);
    }

    // If not skillful enough, show that error.
    if (!this.getHasRequiredSkillLevels()) {
      return getStringTableValue(StringIDCraftingErrorInsufficientSkill, this.props.stringTable);
    }

    // If not all ingredients selected, show that error.
    if (!this.getAreAllIngredientsSpecified()) {
      return getStringTableValue(StringIDCraftingErrorIngredientsNotSelected, this.props.stringTable);
    }

    // If not enough ingredients, show that error.
    if (!this.getAreAllIngredientsSufficient()) {
      return getStringTableValue(StringIDCraftingErrorNotEnoughIngredients, this.props.stringTable);
    }

    return null;
  }

  private onShowFiltersClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_RECIPE_FILTER_WINDOW_OPEN_CLOSE);
    this.props.dispatch(
      showModal({
        id: CraftingFiltersModalID,
        escapable: true,
        content: this.getCraftingFiltersModalContent(this.state.filters),
        onClose: () => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_RECIPE_FILTER_WINDOW_OPEN_CLOSE);
        }
      })
    );
  }

  private getCraftingFiltersModalContent(filters: CraftingFilters): ModalModel {
    const jobIDs = this.getSortedJobIDs();
    let categorySetsByJobID: Record<string, Set<string>> = {};
    jobIDs.forEach((jid) => (categorySetsByJobID[jid] = new Set<string>()));

    Object.values(this.props.itemRecipeDefs).forEach((recipeDef) => {
      if (jobIDs.includes(recipeDef.jobID)) {
        const category = recipeDef.tags.find((tag) => tag.startsWith('Crafting.Category.'));
        if (category) {
          categorySetsByJobID[recipeDef.jobID].add(category.slice(18));
        }
      }
    });
    let categoryIDsByJobID: Record<string, string[]> = {};
    jobIDs.forEach((jid) => {
      categoryIDsByJobID[jid] = Array.from(categorySetsByJobID[jid]);
      categoryIDsByJobID[jid].sort((a, b) => {
        const aName = getStringTableValue(StringIDPrefixCraftingCategoryName + a, this.props.stringTable);
        const bName = getStringTableValue(StringIDPrefixCraftingCategoryName + b, this.props.stringTable);
        return aName.localeCompare(bName);
      });
    });

    return {
      title: getStringTableValue(StringIDCraftingFiltersTitle, this.props.stringTable),
      body: (
        <div className={FiltersBody}>
          <FactionBorder
            className={CommonFiltersSection}
            type={BorderType.Secondary}
            background={BorderBackground.Darken}
          >
            <div className={CategoryColumn}>
              <FactionCheckbox
                className={Filter}
                isChecked={filters.hasIngredients}
                onCheckedChanged={(isChecked) => {
                  const filters: CraftingFilters = {
                    ...this.state.filters,
                    hasIngredients: isChecked
                  };
                  this.setState({ filters });
                  this.props.dispatch(
                    updateModalContent([CraftingFiltersModalID, this.getCraftingFiltersModalContent(filters)])
                  );
                }}
                labelText={getStringTableValue(StringIDCraftingFiltersHasIngredients, this.props.stringTable)}
                soundEventClicked={SoundEvents.PLAY_UI_RECIPE_FILTER_SELECT}
              />
              <FactionCheckbox
                className={Filter}
                isChecked={filters.hasSkill}
                onCheckedChanged={(isChecked) => {
                  const filters: CraftingFilters = {
                    ...this.state.filters,
                    hasSkill: isChecked
                  };
                  this.setState({ filters });
                  this.props.dispatch(
                    updateModalContent([CraftingFiltersModalID, this.getCraftingFiltersModalContent(filters)])
                  );
                }}
                labelText={getStringTableValue(StringIDCraftingFiltersHasSkill, this.props.stringTable)}
                soundEventClicked={SoundEvents.PLAY_UI_RECIPE_FILTER_SELECT}
              />
            </div>
            <div className={CategoryColumn}>
              <FactionCheckbox
                className={Filter}
                isChecked={filters.searchIngredients}
                onCheckedChanged={(isChecked) => {
                  const filters: CraftingFilters = {
                    ...this.state.filters,
                    searchIngredients: isChecked
                  };
                  this.setState({ filters });
                  this.props.dispatch(
                    updateModalContent([CraftingFiltersModalID, this.getCraftingFiltersModalContent(filters)])
                  );
                }}
                labelText={getStringTableValue(StringIDCraftingFiltersSearchIngredients, this.props.stringTable)}
                soundEventClicked={SoundEvents.PLAY_UI_RECIPE_FILTER_SELECT}
              />
              <FactionCheckbox
                className={Filter}
                isChecked={filters.canEquip}
                onCheckedChanged={(isChecked) => {
                  const filters: CraftingFilters = {
                    ...this.state.filters,
                    canEquip: isChecked
                  };
                  this.setState({ filters });
                  this.props.dispatch(
                    updateModalContent([CraftingFiltersModalID, this.getCraftingFiltersModalContent(filters)])
                  );
                }}
                labelText={getStringTableValue(StringIDCraftingFiltersCanEquip, this.props.stringTable)}
                soundEventClicked={SoundEvents.PLAY_UI_RECIPE_FILTER_SELECT}
              />
            </div>
          </FactionBorder>
          {Object.entries(categoryIDsByJobID).map(([jobID, categoryIDs]) => {
            const center = Math.ceil(categoryIDs.length / 2);
            const leftCats = categoryIDs.slice(0, center);
            const rightCats = categoryIDs.slice(center);
            const catColumns = [leftCats, rightCats];

            return (
              <React.Fragment key={`CategoriesFor${jobID}`}>
                <div className={CategoryTitle}>
                  {getStringTableValue(StringIDPrefixCraftingJobName + jobID, this.props.stringTable)}
                </div>
                <FactionBorder
                  className={CategoryFiltersSection}
                  type={BorderType.Secondary}
                  background={BorderBackground.Darken}
                >
                  {catColumns.map((columnCategoryIDs: string[], columnIndex: number) => {
                    return (
                      <div className={CategoryColumn} key={`CategoryColumn${columnIndex}`}>
                        {columnCategoryIDs.map((scid) => {
                          return (
                            <FactionCheckbox
                              key={`Category${scid}`}
                              className={Filter}
                              isChecked={filters.categoryIDsByJobID[jobID]?.includes(scid)}
                              onCheckedChanged={(isChecked) => {
                                const filters: CraftingFilters = {
                                  ...this.state.filters,
                                  categoryIDsByJobID: {
                                    ...this.state.filters.categoryIDsByJobID,
                                    [jobID]: isChecked
                                      ? [...(this.state.filters.categoryIDsByJobID[jobID] ?? []), scid]
                                      : this.state.filters.categoryIDsByJobID[jobID].filter(
                                          (oldSCID) => oldSCID !== scid
                                        )
                                  }
                                };
                                this.setState({ filters });
                                this.props.dispatch(
                                  updateModalContent([
                                    CraftingFiltersModalID,
                                    this.getCraftingFiltersModalContent(filters)
                                  ])
                                );
                              }}
                              labelText={getStringTableValue(
                                StringIDPrefixCraftingCategoryName + scid,
                                this.props.stringTable
                              )}
                              soundEventClicked={SoundEvents.PLAY_UI_RECIPE_FILTER_SELECT}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </FactionBorder>
              </React.Fragment>
            );
          })}
        </div>
      ),
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralClose, this.props.stringTable),
          onClick: () => {
            this.props.dispatch(hideModal());
          }
        }
      ]
    };
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { primary: selfInventory, accountBank: selfAccountBank, wallet: selfWallet } = state.inventory;
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    craftingData: state.crafting,
    itemRecipeDefs: state.gameDefs.itemRecipes,
    stationItemDef: state.gameDefs.itemsByNumericID[state.crafting.interactedCraftingStationData?.numericItemDefID],
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    itemsByStringID: state.gameDefs.itemsByStringID,
    uiFactionID: state.hud.uiFactionID,
    serverTimeDeltaMS: state.clock.serverTimeDeltaMS,
    statDefs: state.gameDefs.stats,
    selfStats: state.entities.self.stats,
    selfTags: state.entities.self.tags,
    selfInventory,
    selfAccountBank,
    selfWallet,
    tagAffixByNumericID: state.gameDefs.tagAffixByNumericID,
    selfRace: state.entities.self.race,
    selfClassID: state.entities.self.classID,
    racesByNumericID: state.gameDefs.racesByNumericID,
    classesByNumericID: state.gameDefs.classesByNumericID
  };
};

const Crafting = connect(mapStateToProps)(ACrafting);

export const WIDGET_ID_CRAFTING = 'Crafting';
export const craftingRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_CRAFTING,
  nameStringID: 'HUDEditorWidgetNameCrafting',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: -9
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.Menus,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Crafting isDragCopy={isDragCopy} />;
  }
};
