/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import HealthBarFillURL from '../../../images/unit-frames/unit-frame-health.png';
import CheckURL from '../../../images/quests/Factionless-check-Icon.png';

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralDaysRemaining,
  StringIDGeneralHoursRemaining,
  StringIDGeneralMinutesRemaining
} from '../../helpers/stringTableHelpers';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { getFactionData } from '../../gameData/factionData';
import { FactionScrollArea } from '../FactionScrollArea';
import { getQuestsForDisplayCategory, isGenericQuestDisplay } from '../../helpers/questHelpers';
import {
  addTrackedQuestID,
  QuestDisplayCategory,
  QuestStateEx,
  removeLoggedQuestID,
  removeTrackedQuestID
} from '../../redux/questSlice';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { CollapsingDrawer } from '../CollapsingDrawer';
import { QuestDef } from '../../dataSources/manifest/questDefManifest';
import { FactionCheckbox } from '../FactionCheckbox';
import TooltipSource from '../TooltipSource';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem } from '../../redux/contextMenuSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { getItemCount } from '../../helpers/inventoryHelpers';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { MoneyDisplay } from '../../../shared/components/MoneyDisplay';
import { CurrencyID, getItemCountForIngredient } from '../../helpers/itemHelpers';

export const MAX_LOGGED_QUESTS = 20;

// CSS classes
const Root = 'HUD-QuestLog-Root';
const RootContent = 'HUD-QuestLog-RootContent';
const HeaderSection = 'HUD-QuestLog-HeaderSection';
const BountyTimer = 'HUD-QuestLog-BountyTimer';
const QuestCounter = 'HUD-QuestLog-QuestCounter';
const Scroller = 'HUD-QuestLog-Scroller';
const ScrollerContent = 'HUD-QuestLog-ScrollerContent';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const PrimarySection = 'HUD-QuestLog-PrimarySection';
const PrimarySectionHeader = 'HUD-QuestLog-PrimarySectionHeader';
const PrimaryArrow = 'HUD-QuestLog-PrimaryArrow';
const PrimarySectionTitle = 'HUD-QuestLog-PrimarySectionTitle';
const PrimarySectionTable = 'HUD-QuestLog-PrimarySectionTable';
const PrimarySectionLegend = 'HUD-QuestLog-PrimarySectionLegend';
const TrackColumn = 'HUD-QuestLog-TrackColumn';
const ArrowColumn = 'HUD-QuestLog-ArrowColumn';
const IconColumn = 'HUD-QuestLog-IconColumn';
const NameColumn = 'HUD-QuestLog-NameColumn';
const ProgressColumn = 'HUD-QuestLog-ProgressColumn';
const RewardColumn = 'HUD-QuestLog-RewardColumn';
const QuestCell = 'HUD-QuestLog-QuestCell';
const QuestRow = 'HUD-QuestLog-QuestRow';
const QuestDrawer = 'HUD-QuestLog-QuestDrawer';
const QuestArrow = 'HUD-QuestLog-QuestArrow';
const QuestIconContainer = 'HUD-QuestLog-QuestIconContainer';
const QuestIcon = 'HUD-QuestLog-QuestIcon';
const QuestNameLabel = 'HUD-QuestLog-QuestNameLabel';
const QuestCheck = 'HUD-QuestLog-QuestCheck';
const QuestObjectiveCheck = 'HUD-QuestLog-QuestObjectiveCheck';
const IngredientCheck = 'HUD-QuestLog-IngredientCheck';
const QuestProgressLabel = 'HUD-QuestLog-QuestProgressLabel';
const QuestRewardDisplayGold = 'HUD-QuestLog-QuestRewardDisplayGold';
const KingsQuestRewardIcon = 'HUD-QuestLog-KingsQuestRewardIcon';
const QuestProgressBarContainer = 'HUD-QuestLog-QuestProgressBar-Container';
const QuestProgressBarClipper = 'HUD-QuestLog-QuestProgressBar-Clipper';
const QuestProgressBarContent = 'HUD-QuestLog-QuestProgressBar-Content';
const QuestProgressBarFill = 'HUD-QuestLog-QuestProgressBar-Fill';
const QuestProgressBarEnd = 'HUD-QuestLog-QuestProgressBar-End';
const QuestProgressBarLabel = 'HUD-QuestLog-QuestProgressBar-Label';
const QuestDescriptionLabel = 'HUD-QuestLog-QuestDescriptionLabel';
const QuestObjectiveRow = 'HUD-QuestLog-QuestObjectiveRow';
const QuestObjectiveDash = 'HUD-QuestLog-QuestObjectiveDash';
const QuestObjectiveLabel = 'HUD-QuestLog-QuestObjectiveLabel';
const QuestObjectiveText = 'HUD-QuestLog-QuestObjectiveText';
const QuestDescriptionText = 'HUD-QuestLog-QuestDescriptionText';
const IngredientList = 'HUD-QuestLog-IngredientList';
const RequiredIngredientsLabel = 'HUD-QuestLog-RequiredIngredientsLabel';
const IngredientRow = 'HUD-QuestLog-IngredientRow';
const IngredientIconContainer = 'HUD-QuestLog-IngredientIconContainer';
const IngredientIcon = 'HUD-QuestLog-IngredientIcon';
const IngredientNameLabel = 'HUD-QuestLog-IngredientNameLabel';

// String IDs
const StringIDVendorTrackRemoveTooltip = 'VendorTrackRemoveTooltip';
const StringIDQuestLogKingsBountyRewardTooltip = 'QuestLogKingsBountyRewardTooltip';
const StringIDQuestLogTitle = 'QuestLogTitle';
const StringIDQuestLogTrackedQuestCount = 'QuestLogTrackedQuestCount';
const StringIDQuestLogKingsBountyTimer = 'QuestLogKingsBountyTimer';
const StringIDQuestLogSectionTitleTutorial = 'QuestLogSectionTitleTutorial';
const StringIDQuestLogSectionTitleKingsBounty = 'QuestLogSectionTitleKingsBounty';
const StringIDQuestLogSectionTitleMilitaryService = 'QuestLogSectionTitleMilitaryService';
const StringIDQuestLogSectionTitleWorkOrders = 'QuestLogSectionTitleWorkOrders';
const StringIDQuestLogLegendTrack = 'QuestLogLegendTrack';
const StringIDQuestLogLegendQuest = 'QuestLogLegendQuest';
const StringIDQuestLogLegendProgress = 'QuestLogLegendProgress';
const StringIDQuestLogLegendReward = 'QuestLogLegendReward';
const StringIDQuestLogQuestNameKingsBountyPrevious = 'QuestLogQuestNameKingsBountyPrevious';
const StringIDQuestLogQuestNameKingsBountyCurrent = 'QuestLogQuestNameKingsBountyCurrent';
const StringIDQuestLogKingsBountyDescriptionComplete = 'QuestLogKingsBountyDescriptionComplete';
const StringIDQuestLogKingsBountyDescriptionCurrent = 'QuestLogKingsBountyDescriptionCurrent';
const StringIDCraftingRequiredReagents = 'CraftingRequiredReagents';

interface State {
  // Everything defaults to open, so we track the other direction.
  closedSections: string[];
  closedQuests: string[];
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  loggedQuestIDs: string[];
  trackedQuestIDs: string[];
  rolloverTime: string;
  quests: Record<string, QuestStateEx>;
  defs: GameDefsState;
  inventory: Item[];
}

type Props = ReactProps & InjectedProps;

class AQuestLog extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);

    this.state = {
      closedSections: [],
      closedQuests: []
    };
  }

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root}>
        {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_QUESTLOG} onEscape={this.closeSelf.bind(this)} />}
        <FactionBorder
          className={RootContent}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          titleText={getStringTableValue(StringIDQuestLogTitle, this.props.stringTable)}
          cornerButtons={[
            <FactionCornerButton
              type={CornerButtonType.Close}
              onClick={() => {
                this.closeSelf();
              }}
            />
          ]}
        >
          <div className={HeaderSection}>
            <div className={BountyTimer} style={{ color: factionData.mailSenderColor }}>
              {getTokenizedStringTableValue(StringIDQuestLogKingsBountyTimer, this.props.stringTable, {
                TIME: this.getTimeRemainingText()
              })}
            </div>
            <div className={QuestCounter}>
              {getTokenizedStringTableValue(StringIDQuestLogTrackedQuestCount, this.props.stringTable, {
                CURRENT: this.props.loggedQuestIDs.length.toFixed(0),
                MAX: MAX_LOGGED_QUESTS.toFixed(0)
              })}
            </div>
          </div>
          <FactionScrollArea className={Scroller}>
            <div className={ScrollerContent}>
              {this.renderTutorialSection()}
              {this.renderKingsTaskSection()}
              {this.renderMilitaryServiceSection()}
              {this.renderWorkOrdersSection()}
            </div>
          </FactionScrollArea>
        </FactionBorder>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_QUESTLOG} />
      </div>
    );
  }

  private renderTutorialSection(): React.ReactNode {
    const sectionID = QuestDisplayCategory.Tutorial;

    // Tutorial quests are always shown in the quest log, not gated on loggedQuestIDs (similar to King's Bounty)
    const quests = getQuestsForDisplayCategory(
      QuestDisplayCategory.Tutorial,
      this.props.quests,
      this.props.defs.questDefs,
      this.props.defs.itemsByStringID,
      this.props.uiFactionID
    ).filter((q) => !q.isRewarded);

    if (quests.length === 0) {
      return null;
    }

    return (
      <div className={PrimarySection}>
        {this.renderSectionHeader(sectionID, StringIDQuestLogSectionTitleTutorial)}
        <CollapsingDrawer isOpen={!this.state.closedSections.includes(sectionID)}>
          <FactionBorder
            className={PrimarySectionTable}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            {this.renderSectionLegend()}
            {quests.map(this.renderQuestCell.bind(this))}
          </FactionBorder>
        </CollapsingDrawer>
      </div>
    );
  }

  private renderKingsTaskSection(): React.ReactNode {
    const sectionID = QuestDisplayCategory.KingsTask;

    const quests = getQuestsForDisplayCategory(
      QuestDisplayCategory.KingsTask,
      this.props.quests,
      this.props.defs.questDefs,
      this.props.defs.itemsByStringID,
      this.props.uiFactionID
    );

    const currentQuest = quests.find((q) => !q.isCollectible && !q.isRewarded);
    // The previous King's Task, assuming you haven't already collected the reward from it.
    const collectibleQuest = quests.find((q) => q.isCollectible && !q.isRewarded);

    // No quests, no quest section.
    if (!collectibleQuest && !currentQuest) {
      return null;
    }

    return (
      <div className={PrimarySection}>
        {this.renderSectionHeader(sectionID, StringIDQuestLogSectionTitleKingsBounty)}
        <CollapsingDrawer isOpen={!this.state.closedSections.includes(sectionID)}>
          <FactionBorder
            className={PrimarySectionTable}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            {this.renderSectionLegend()}
            {!!currentQuest && this.renderQuestCell(currentQuest, 0)}
            {!!collectibleQuest && this.renderQuestCell(collectibleQuest, 1)}
          </FactionBorder>
        </CollapsingDrawer>
      </div>
    );
  }

  private renderMilitaryServiceSection(): React.ReactNode {
    const sectionID = QuestDisplayCategory.MilitaryService;

    const quests = getQuestsForDisplayCategory(
      QuestDisplayCategory.MilitaryService,
      this.props.quests,
      this.props.defs.questDefs,
      this.props.defs.itemsByStringID,
      this.props.uiFactionID
    ).filter((q) => this.props.loggedQuestIDs.includes(q.instanceID));

    if (quests.length === 0) {
      return null;
    }

    return (
      <div className={PrimarySection}>
        {this.renderSectionHeader(sectionID, StringIDQuestLogSectionTitleMilitaryService)}
        <CollapsingDrawer isOpen={!this.state.closedSections.includes(sectionID)}>
          <FactionBorder
            className={PrimarySectionTable}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            {this.renderSectionLegend()}
            {quests.map(this.renderQuestCell.bind(this))}
          </FactionBorder>
        </CollapsingDrawer>
      </div>
    );
  }

  private renderWorkOrdersSection(): React.ReactNode {
    const sectionID = QuestDisplayCategory.TurnInMisc;

    let quests = [
      ...getQuestsForDisplayCategory(
        QuestDisplayCategory.TurnInArmor,
        this.props.quests,
        this.props.defs.questDefs,
        this.props.defs.itemsByStringID,
        this.props.uiFactionID
      ),
      ...getQuestsForDisplayCategory(
        QuestDisplayCategory.TurnInWeapons,
        this.props.quests,
        this.props.defs.questDefs,
        this.props.defs.itemsByStringID,
        this.props.uiFactionID
      ),
      ...getQuestsForDisplayCategory(
        QuestDisplayCategory.TurnInMisc,
        this.props.quests,
        this.props.defs.questDefs,
        this.props.defs.itemsByStringID,
        this.props.uiFactionID
      )
    ].filter((q) => this.props.loggedQuestIDs.includes(q.instanceID));

    if (quests.length === 0) {
      return null;
    }

    return (
      <div className={PrimarySection}>
        {this.renderSectionHeader(sectionID, StringIDQuestLogSectionTitleWorkOrders)}
        <CollapsingDrawer isOpen={!this.state.closedSections.includes(sectionID)}>
          <FactionBorder
            className={PrimarySectionTable}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            {this.renderSectionLegend()}
            {quests.map(this.renderQuestCell.bind(this))}
          </FactionBorder>
        </CollapsingDrawer>
      </div>
    );
  }

  private renderSectionHeader(sectionID: string, title: string): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={PrimarySectionHeader} onMouseDown={this.toggleSection.bind(this, sectionID)}>
        <img
          className={`${PrimaryArrow}${this.state.closedSections.includes(sectionID) ? ' closed' : ''}`}
          src={factionData.arrowPointerImage}
        />
        <div className={PrimarySectionTitle}>{getStringTableValue(title, this.props.stringTable)}</div>
      </div>
    );
  }

  private renderSectionLegend(): React.ReactNode {
    return (
      <FactionBorder
        className={PrimarySectionLegend}
        type={BorderType.Primary}
        background={BorderBackground.Darken}
        includeLeft={false}
        includeRight={false}
        includeTop={false}
      >
        <div className={TrackColumn}>{getStringTableValue(StringIDQuestLogLegendTrack, this.props.stringTable)}</div>
        <div className={ArrowColumn} />
        <div className={IconColumn}>{getStringTableValue(StringIDQuestLogLegendQuest, this.props.stringTable)}</div>
        <div className={NameColumn} />
        <div className={ProgressColumn}>
          {getStringTableValue(StringIDQuestLogLegendProgress, this.props.stringTable)}
        </div>
        <div className={RewardColumn}>{getStringTableValue(StringIDQuestLogLegendReward, this.props.stringTable)}</div>
      </FactionBorder>
    );
  }

  private renderQuestCell(quest: QuestStateEx, index: number): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const questDef = this.props.defs.questDefs[quest.questDataID];
    const questDrawerContent = !!questDef ? this.renderQuestDrawerContent(quest, questDef) : null;
    // King's Bounty quests can't be re-added once removed, and Tutorial quests are always shown
    // regardless of loggedQuestIDs, so neither gets the remove context menu.
    const allowRemoveFromLog =
      !!questDef &&
      !questDef.tags.includes(QuestDisplayCategory.KingsTask) &&
      !questDef.tags.includes(QuestDisplayCategory.Tutorial);
    // Generic quests tighten the gap between the name row and their description/objective drawer.
    const rowClassName = `${QuestRow}${!!questDef && isGenericQuestDisplay(questDef) ? ' generic' : ''}`;

    const rowColumns = (
      <>
        <div className={TrackColumn}>{this.renderTrackContent(quest, questDef)}</div>
        <div className={ArrowColumn}>
          {!!questDrawerContent && (
            <img
              className={`${QuestArrow}${!this.isQuestExpanded(quest, questDef) ? ' closed' : ''}`}
              src={factionData.arrowPointerImage}
              onClick={this.toggleQuestDetails.bind(this, quest.instanceID)}
            />
          )}
        </div>
        {this.questHasIcon(questDef) && <div className={IconColumn}>{this.renderIconContent(quest, questDef)}</div>}
        <div className={NameColumn}>
          {this.renderNameContent(quest, questDef)}
          {this.isQuestComplete(quest, questDef) && <img className={QuestCheck} src={CheckURL} />}
        </div>
        <div className={ProgressColumn}>{this.renderProgressContent(quest, questDef)}</div>
        <div className={RewardColumn}>{this.renderRewardContent(quest, questDef)}</div>
      </>
    );

    return (
      <div key={quest.instanceID} className={`${QuestCell}${index % 2 ? ' odd' : ''}`}>
        {allowRemoveFromLog ? (
          <ContextMenuSource
            className={rowClassName}
            menuParams={{
              id: `${WIDGET_ID_QUESTLOG}_row_${quest.instanceID}`,
              content: this.getQuestContextMenu(quest)
            }}
          >
            {rowColumns}
          </ContextMenuSource>
        ) : (
          <div className={rowClassName}>{rowColumns}</div>
        )}
        {questDrawerContent && (
          <CollapsingDrawer className={QuestDrawer} isOpen={this.isQuestExpanded(quest, questDef)}>
            {questDrawerContent}
          </CollapsingDrawer>
        )}
      </div>
    );
  }

  private getQuestContextMenu(quest: QuestStateEx): ContextMenuItem[] {
    return [
      {
        title: getStringTableValue(StringIDVendorTrackRemoveTooltip, this.props.stringTable),
        onClick: (dispatch) => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_TRACK_SELECT);
          clientAPI.removeLoggedQuestID(quest.instanceID);
          clientAPI.removeTrackedQuestID(quest.instanceID);
          dispatch(removeLoggedQuestID(quest.instanceID));
          dispatch(removeTrackedQuestID(quest.instanceID));
        }
      }
    ];
  }

  private renderTrackContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    // Exclude checkbox for any completed, unclaimed King's Bounty quest.
    if (def.tags.includes(QuestDisplayCategory.KingsTask) && quest.isCollectible && !quest.isRewarded) {
      return null;
    }

    return (
      <FactionCheckbox
        isChecked={this.props.trackedQuestIDs.includes(quest.instanceID)}
        onCheckedChanged={(newIsChecked: boolean) => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_TRACK_SELECT);
          if (newIsChecked) {
            clientAPI.addTrackedQuestID(quest.instanceID);
            this.props.dispatch(addTrackedQuestID(quest.instanceID));
          } else {
            clientAPI.removeTrackedQuestID(quest.instanceID);
            this.props.dispatch(removeTrackedQuestID(quest.instanceID));
          }
        }}
      />
    );
  }

  // Whether a quest shows an icon: Sell/TurnIn quests use their turn-in item's icon, King's Task
  // uses the crown, Tutorial uses the training icon, and other generic-display quests
  // (Military Service, ...) have none.
  private questHasIcon(def: QuestDef): boolean {
    if (!isGenericQuestDisplay(def) || def.tags.includes(QuestDisplayCategory.Tutorial)) {
      return true;
    }
    const target = def.targets.find(({ id }) => id.startsWith('Sell.'));
    const itemID = target?.id?.slice(5) ?? '';
    return !!this.props.defs.itemsByStringID[itemID];
  }

  // Empty stand-ins for the leading columns so drawer content lines up under the name column.
  // Mirrors the row exactly, including the collapsed icon column, so alignment is automatic.
  private renderLeadingColumns(def: QuestDef): React.ReactNode {
    return (
      <>
        <div className={TrackColumn} />
        <div className={ArrowColumn} />
        {this.questHasIcon(def) && <div className={IconColumn} />}
      </>
    );
  }

  private renderIconContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    // If the quest has item turnins, use the first item's icon. Tutorial quests use the training
    // icon. Otherwise use the generic quest icon (the King's Task crown).
    const target = def.targets.find(({ id }) => id.startsWith('Sell.'));
    const itemID = target?.id?.slice(5) ?? '';
    const itemDef = this.props.defs.itemsByStringID[itemID];
    const fallbackUrl = def.tags.includes(QuestDisplayCategory.Tutorial)
      ? factionData.iconTutorialImage
      : factionData.iconCrownImage;
    const url = itemDef?.iconUrl ?? fallbackUrl;

    return (
      <FactionBorder
        className={QuestIconContainer}
        type={BorderType.Secondary}
        background={BorderBackground.PatternSmall}
      >
        <img className={QuestIcon} src={url} />
      </FactionBorder>
    );
  }

  private renderNameContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    // Default behavior is to use the name assigned in the quest def.
    let name: string = getStringTableValue(def.name, this.props.stringTable);

    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      if (!quest.isRewarded) {
        if (quest.isCollectible) {
          // Previous bounty, waiting to be collected.
          name = getStringTableValue(StringIDQuestLogQuestNameKingsBountyPrevious, this.props.stringTable);
        } else {
          // Current bounty, in progress.
          name = getStringTableValue(StringIDQuestLogQuestNameKingsBountyCurrent, this.props.stringTable);
        }
      }
    } else if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      // Work Order quests use the name of the first item to be turned in.
      const target = def.targets.find(({ id }) => id.startsWith('Sell.'));
      const itemID = target?.id?.slice(5) ?? '';
      const itemDef = this.props.defs.itemsByStringID[itemID];
      if (itemDef) {
        name = itemDef.name;
      }
    }

    return <div className={QuestNameLabel}>{name}</div>;
  }

  private renderProgressContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      return this.renderQuestProgressBar(quest, def);
    } else if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
      if ((target?.amount ?? 0) > 0) {
        const itemID = target?.id?.slice(5) ?? '';
        const item = this.props.defs.itemsByStringID[itemID];
        if (item) {
          const count = getItemCount(item.numericID, this.props.inventory);
          return <div className={QuestProgressLabel}>{`${count} / ${target!.amount}`}</div>;
        }
      }
    }

    // Generic-display quests show progress per objective in the drawer, not on the top line, so
    // nothing is rendered in the progress column here.
    return null;
  }

  // Tutorial and bespoke (King's Task, Sell/TurnIn) quests start expanded; other generic quests start collapsed.
  private isQuestExpanded(quest: QuestStateEx, def: QuestDef): boolean {
    const defaultExpanded = def.tags.includes(QuestDisplayCategory.Tutorial) || !isGenericQuestDisplay(def);
    const toggled = this.state.closedQuests.includes(quest.instanceID);
    return defaultExpanded ? !toggled : toggled;
  }

  private renderObjectiveProgress(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (!def.targets || def.targets.length === 0) {
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <>
        {def.targets.map((target, index) => {
          const label = getStringTableValue(target.id, this.props.stringTable);
          const progress = quest.progress[target.id] ?? 0;
          const isObjectiveComplete = progress >= target.amount;
          return (
            <div className={QuestObjectiveRow} key={target.id ?? index}>
              {this.renderLeadingColumns(def)}
              <div className={NameColumn}>
                <div className={QuestObjectiveDash} style={{ color: factionData.mailSenderColor }}>
                  -
                </div>
                <div className={QuestObjectiveLabel}>{label}</div>
                {isObjectiveComplete && <img className={QuestObjectiveCheck} src={CheckURL} />}
              </div>
              <div className={ProgressColumn}>
                <div className={QuestObjectiveText}>{`${progress}/${target.amount}`}</div>
              </div>
              <div className={RewardColumn} />
            </div>
          );
        })}
      </>
    );
  }

  private isQuestComplete(quest: QuestStateEx, def: QuestDef): boolean {
    if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
      const targetAmount = target?.amount ?? 0;
      if (targetAmount > 0) {
        const itemID = target?.id?.slice(5) ?? '';
        const item = this.props.defs.itemsByStringID[itemID];
        if (item) {
          return getItemCount(item.numericID, this.props.inventory) >= targetAmount;
        }
      }
    } else if (isGenericQuestDisplay(def)) {
      // Generic-display quests use the game's authoritative completion flag.
      return quest.isCompleted;
    }

    return false;
  }

  private renderRewardContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      if (!quest.isRewarded) {
        if (quest.isCollectible) {
          // Last week's quest.  Show how much money they (probably) earned.
          const targetValue = def.targets[0].amount;
          const curValue = quest.progress[def.targets[0].id] ?? 0;
          const progressPercent = curValue / targetValue;
          const rewardAmount = Math.floor(def.rewards[0].amount * progressPercent);
          return <MoneyDisplay className={QuestRewardDisplayGold} amount={rewardAmount} />;
        } else {
          // This week's quest.  Show the treasure chest icon, since there is no fixed amount.
          return (
            <TooltipSource
              tooltipID={`${WIDGET_ID_QUESTLOG}_kingsbounty_${quest.instanceID}`}
              content={() => getStringTableValue(StringIDQuestLogKingsBountyRewardTooltip, this.props.stringTable)}
              positionType='mouse'
            >
              <img className={KingsQuestRewardIcon} src={getFactionData(this.props.uiFactionID).iconMiscSaleImage} />
            </TooltipSource>
          );
        }
      }
    }

    // If the quest grants gold, show the gold!
    const rewardAmount =
      def?.rewards?.find((entry) => {
        return entry.id === `Item.${CurrencyID.Gold}`;
      })?.amount ?? 0;
    if (rewardAmount > 0) {
      return <MoneyDisplay className={QuestRewardDisplayGold} amount={rewardAmount} />;
    }

    return null;
  }

  private renderQuestProgressBar(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    const targetValue = def.targets[0].amount;
    const curValue = quest.progress[def.targets[0].id] ?? 0;
    const progressPercent = curValue / targetValue;

    return (
      <FactionBorder
        className={QuestProgressBarContainer}
        type={BorderType.Secondary}
        background={BorderBackground.ProgressBar}
      >
        <div className={QuestProgressBarClipper}>
          <div className={QuestProgressBarContent}>
            <img
              className={QuestProgressBarFill}
              src={HealthBarFillURL}
              style={{ width: `${Math.min(1, progressPercent) * 100}%` }}
            />
            <div className={QuestProgressBarEnd} />
          </div>
        </div>
        <div className={QuestProgressBarLabel}>{`${curValue.toFixed(0)}/${targetValue.toFixed(0)}`}</div>
      </FactionBorder>
    );
  }

  private renderQuestDrawerContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      if (!quest.isRewarded) {
        return (
          <div className={QuestDescriptionLabel}>
            {getStringTableValue(
              quest.isCollectible
                ? StringIDQuestLogKingsBountyDescriptionComplete
                : StringIDQuestLogKingsBountyDescriptionCurrent,
              this.props.stringTable
            )}
          </div>
        );
      }
    } else if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      // If the item can be crafted, show the reagent list for a recipe that produces it.
      const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
      const itemID = target?.id?.slice(5) ?? '';
      // There might be more than one recipe.  For now, we just use the first one we find.
      const recipe = Object.values(this.props.defs.itemRecipes).find((r) => r.outputItemDefID === itemID);
      if (recipe) {
        return (
          <div className={IngredientList}>
            <div className={RequiredIngredientsLabel}>
              {getStringTableValue(StringIDCraftingRequiredReagents, this.props.stringTable)}
            </div>
            {recipe.ingredients.map((ingredient) => {
              const ingredientDef = this.props.defs.itemsByStringID[ingredient.itemDefID];
              const numOwned = getItemCountForIngredient(ingredient, this.props.inventory, this.props.defs);
              const hasEnough = numOwned >= ingredient.quantity;

              if (ingredientDef) {
                return (
                  <div className={IngredientRow} key={ingredientDef.id}>
                    <FactionBorder
                      className={IngredientIconContainer}
                      type={BorderType.Secondary}
                      background={BorderBackground.PatternSmall}
                    >
                      <img className={IngredientIcon} src={ingredientDef.iconUrl} />
                    </FactionBorder>
                    <div
                      className={IngredientNameLabel}
                    >{`${numOwned}/${ingredient.quantity} ${ingredientDef.name}`}</div>
                    {hasEnough && <img className={IngredientCheck} src={CheckURL} />}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        );
      }
    } else if (isGenericQuestDisplay(def)) {
      const description = getStringTableValue(def.description, this.props.stringTable);
      return (
        <>
          {!!description && (
            <div className={`${QuestDescriptionText}${this.questHasIcon(def) ? ' hasIcon' : ''}`}>{description}</div>
          )}
          {this.renderObjectiveProgress(quest, def)}
        </>
      );
    }

    return null;
  }

  private toggleSection(id: string): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUEST_DROPDOWN_ARROW);
    if (this.state.closedSections.includes(id)) {
      this.setState({ closedSections: this.state.closedSections.filter((sid) => sid !== id) });
    } else {
      this.setState({ closedSections: [...this.state.closedSections, id] });
    }
  }

  private toggleQuestDetails(id: string): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUEST_DROPDOWN_ARROW);
    if (this.state.closedQuests.includes(id)) {
      this.setState({ closedQuests: this.state.closedQuests.filter((sid) => sid !== id) });
    } else {
      this.setState({ closedQuests: [...this.state.closedQuests, id] });
    }
  }

  private getTimeRemainingText(): string {
    const millis = Math.max(0, new Date(this.props.rolloverTime).getTime() - new Date().getTime());

    const days = Math.floor(millis / 86400000);
    if (days > 0) {
      return getTokenizedStringTableValue(StringIDGeneralDaysRemaining, this.props.stringTable, {
        DAYS: days.toFixed(0)
      });
    }

    const hours = Math.floor(millis / 3600000);
    if (hours > 0) {
      return getTokenizedStringTableValue(StringIDGeneralHoursRemaining, this.props.stringTable, {
        HOURS: hours.toFixed(0)
      });
    }

    const minutes = Math.floor(millis / 60000);
    return getTokenizedStringTableValue(StringIDGeneralMinutesRemaining, this.props.stringTable, {
      MINUTES: minutes.toFixed(0)
    });
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_QUESTLOG));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    loggedQuestIDs: state.quests.loggedQuestIDs,
    trackedQuestIDs: state.quests.trackedQuestIDs,
    rolloverTime: state.quests.rolloverTime,
    quests: state.quests.quests,
    defs: state.gameDefs,
    inventory: state.inventory.primary
  };
};

const QuestLog = connect(mapStateToProps)(AQuestLog);

export const WIDGET_ID_QUESTLOG = 'Quest Log';
export const questLogRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_QUESTLOG,
  nameStringID: 'HUDEditorWidgetNameQuestLog',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: -7
  },
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <QuestLog isDragCopy={isDragCopy} />;
  }
};
