/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralCollect,
  StringIDGeneralDaysRemaining,
  StringIDGeneralDone,
  StringIDGeneralHoursRemaining,
  StringIDGeneralMinutesRemaining
} from '../../helpers/stringTableHelpers';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { FactionDivider } from '../FactionDivider';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import TooltipSource from '../TooltipSource';
import { FactionData, getFactionData } from '../../gameData/factionData';
import { FactionProgressBarCircle } from '../FactionProgressBarCircle';
import { FactionButton } from '../FactionButton';
import { MoneyDisplay } from '../../../shared/components/MoneyDisplay';
import { getQuestsForDisplayCategory } from '../../helpers/questHelpers';
import {
  addLoggedQuestID,
  QuestDisplayCategory,
  QuestStateEx,
  removeLoggedQuestID,
  removeTrackedQuestID
} from '../../redux/questSlice';
import { QuestDef } from '../../dataSources/manifest/questDefManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { FactionPageSwitcher } from '../FactionPageSwitcher';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { getItemCount } from '../../helpers/inventoryHelpers';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { requestAddImagesToCache, requestRemoveImagesFromCache } from '../../dataSources/imageCacheService';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { MAX_LOGGED_QUESTS } from '../quests/QuestLog';
import { CurrencyID } from '../../helpers/itemHelpers';

// CSS classes
const Root = 'HUD-Vendor-Root';
const RootBorder = 'HUD-Vendor-RootBorder';
const Tabs = 'HUD-Vendor-Tabs';
const TabButton = 'HUD-Vendor-TabButton';
const TabIcon = 'HUD-Vendor-TabIcon';
const HeaderContainer = 'HUD-Vendor-Header-Container';
const TabContent = 'HUD-Vendor-TabContent';
const FooterContainer = 'HUD-Vendor-Footer-Container';
const HeaderDivider = 'HUD-Vendor-Header-Divider';
const HeaderTabDescription = 'HUD-Vendor-Header-TabDescription';
const KingsTaskDetailsContainer = 'HUD-Vendor-KingsTask-DetailsContainer';
const KingsTaskProgressBar = 'HUD-Vendor-KingsTask-ProgressBar';
const KingsTaskCenterPanel = 'HUD-Vendor-KingsTask-CenterPanel';
const KingsTaskCountdownLabel = 'HUD-Vendor-KingsTask-CountdownLabel';
const KingsTaskRewardRow = 'HUD-Vendor-KingsTask-RewardRow';
const KingsTaskRewardLabel = 'HUD-Vendor-KingsTask-RewardLabel';
const KingsTaskCollectButton = 'HUD-Vendor-KingsTask-CollectButton';
const KingsTaskNoQuestLabel = 'HUD-Vendor-KingsTask-NoQuestLabel';
const SellItemsQuestsContainer = 'HUD-Vendor-SellItemsQuests-Container';
const SellItemsQuestsDivider = 'HUD-Vendor-SellItemsQuests-Divider';
const SellCell = 'HUD-Vendor-SellItemsQuests-SellCell';
const SellCellContents = 'HUD-Vendor-SellItemsQuests-SellCellContents';
const CellDivider = 'HUD-Vendor-CellDivider';
const QuestIconContainer = 'HUD-Vendor-QuestIconContainer';
const QuestIcon = 'HUD-Vendor-QuestIcon';
const WideColumn = 'HUD-Vendor-WideColumn';
const ThinRow = 'HUD-Vendor-ThinRow';
const QuestNameLabel = 'HUD-Vendor-QuestNameLabel';
const QuestProgressLabel = 'HUD-Vendor-QuestProgressLabel';
const QuestRewardDisplay = 'HUD-Vendor-QuestRewardDisplay';
const QuestButtonColumn = 'HUD-Vendor-QuestButtonColumn';
const QuestTurnInButton = 'HUD-Vendor-QuestTurnInButton';
const QuestTurnInButtonBackground = 'HUD-Vendor-QuestTurnInButton-Background';
const QuestTurnInButtonLabel = 'HUD-Vendor-QuestTurnInButton-Label';
const QuestCover = 'HUD-Vendor-QuestCover';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const TrackButton = 'HUD-Vendor-TrackButton';
const TrackButtonBackground = 'HUD-Vendor-TrackButton-Background';
const TrackButtonLabel = 'HUD-Vendor-TrackButton-Label';
const TrackButtonSpacer = 'HUD-Vendor-TrackButton-Spacer';
const DoneLabel = 'HUD-Vendor-DoneLabel';

// String IDs
const StringIDVendorTitle = 'VendorTitle';
const StringIDVendorTabTitlePrefix = 'VendorTabTitle_';
const StringIDVendorTabDescriptionPrefix = 'VendorTabDescription_';
const StringIDVendorKingsTaskCountdownComplete = 'VendorKingsTaskCountdownComplete';
const StringIDVendorKingsTaskRewardInProgress = 'VendorKingsTaskRewardInProgress';
const StringIDVendorKingsTaskRewardComplete = 'VendorKingsTaskRewardComplete';
const StringIDVendorKingsTaskAlreadyClaimed = 'VendorKingsTaskAlreadyClaimed';
const StringIDVendorNoKingsTask = 'VendorNoKingsTask';
const StringIDVendorTrackAddTooltip = 'VendorTrackAddTooltip';
const StringIDVendorTrackRemoveTooltip = 'VendorTrackRemoveTooltip';

enum VendorTab {
  KingsTask = 'KingsTask',
  Quests = 'Quests',
  SellWeapons = 'SellWeapons',
  SellArmor = 'SellArmor',
  SellMisc = 'SellMisc'
}

const tabIconKeys: Record<VendorTab, string> = {
  [VendorTab.KingsTask]: 'iconCrownLargeImage',
  [VendorTab.Quests]: 'iconCastleLargeImage',
  [VendorTab.SellWeapons]: 'iconWeaponSaleLargeImage',
  [VendorTab.SellArmor]: 'iconArmorSaleLargeImage',
  [VendorTab.SellMisc]: 'iconMiscSaleLargeImage'
};

interface State {
  currentTab: VendorTab;
  tick: boolean;
  pageIndex: number;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  quests: Record<string, QuestStateEx>;
  questDefs: Record<string, QuestDef>;
  rolloverTime: string;
  itemsByStringID: Record<string, ItemDef>;
  inventory: Item[];
  statsByStringID: Record<string, StatDef>;
  loggedQuestIDs: string[];
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AVendor extends React.Component<Props, State> {
  private tickerInterval: number = 0;
  private cachedIconURLs: string[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      currentTab: VendorTab.KingsTask,
      tick: true,
      pageIndex: 0
    };
  }

  render(): React.ReactNode {
    if (Object.keys(this.props.stringTable).length <= 0) {
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root}>
        <div className={Tabs}>{Object.values(VendorTab).map(this.renderTabButton.bind(this))}</div>
        <FactionBorder
          className={RootBorder}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          titleText={getStringTableValue(StringIDVendorTitle, this.props.stringTable)}
          cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
        >
          {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_VENDOR} onEscape={this.closeSelf.bind(this)} />}
          <div className={HeaderContainer} style={{ borderBottomColor: factionData.borderColor }}>
            <FactionDivider className={HeaderDivider} />
            <div className={HeaderTabDescription}>
              {getStringTableValue(StringIDVendorTabDescriptionPrefix + this.state.currentTab, this.props.stringTable)}
            </div>
            <FactionDivider className={HeaderDivider} />
          </div>
          <div className={TabContent}>{this.renderTabContent()}</div>
          <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_VENDOR} />
        </FactionBorder>
      </div>
    );
  }

  private getIconURLsToCache(): string[] {
    let urls: string[] = [];

    Object.values(this.props.quests).forEach((q) => {
      const def = this.props.questDefs[q.questDataID];
      if (def) {
        const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
        const itemID = target?.id?.slice(5) ?? '';
        const itemDef = this.props.itemsByStringID[itemID];

        // We want to cache the item icons for any Sell quests.
        if (itemDef) {
          urls.push(itemDef.iconUrl);
        }
      }
    });

    return urls;
  }

  componentDidMount(): void {
    // Update the rollover timer once per minute.
    this.tickerInterval = window.setInterval(() => this.setState({ tick: !this.state.tick }), 60000);

    this.cachedIconURLs = this.getIconURLsToCache();
    requestAddImagesToCache(Root, this.cachedIconURLs);

    clientAPI.playGameSound(SoundEvents.PLAY_UI_ROYAL_VENDOR_WINDOW_OPEN);
  }

  componentWillUnmount(): void {
    if (this.tickerInterval) {
      window.clearInterval(this.tickerInterval);
      this.tickerInterval = 0;
    }

    requestRemoveImagesFromCache(Root, this.cachedIconURLs);
    this.cachedIconURLs = [];

    clientAPI.playGameSound(SoundEvents.PLAY_UI_ROYAL_VENDOR_WINDOW_CLOSE);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.quests !== prevProps.quests) {
      const newURLs = this.getIconURLsToCache();
      const toRemove = this.cachedIconURLs.filter((url) => !newURLs.includes(url));
      const toAdd = newURLs.filter((url) => !this.cachedIconURLs.includes(url));
      if (toRemove.length > 0) {
        requestRemoveImagesFromCache(Root, toRemove);
      }
      if (toAdd.length > 0) {
        requestAddImagesToCache(Root, toAdd);
      }
    }
  }

  private renderTabButton(tab: VendorTab): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <FactionBorderSelectable
        key={tab}
        className={TabButton}
        isSelected={tab === this.state.currentTab}
        onSelected={() => {
          this.setState({ currentTab: tab, pageIndex: 0 });
          clientAPI.playGameSound(SoundEvents.PLAY_UI_ROYAL_VENDOR_TAB_SELECT);
        }}
        includeLeft={false}
        background={BorderBackground.Leather}
      >
        <img className={TabIcon} src={factionData[tabIconKeys[tab] as keyof FactionData] as string} />
        <TooltipSource
          className={TabIcon}
          tooltipID={tab}
          content={() => getStringTableValue(StringIDVendorTabTitlePrefix + tab, this.props.stringTable)}
          positionType='mouse'
        />
      </FactionBorderSelectable>
    );
  }

  private renderTabContent(): React.ReactNode {
    switch (this.state.currentTab) {
      case VendorTab.KingsTask:
        return this.renderTabKingsTask();
      case VendorTab.Quests:
        return this.renderTabQuests();
      case VendorTab.SellWeapons:
        return this.renderTabSellItems(QuestDisplayCategory.TurnInWeapons);
      case VendorTab.SellArmor:
        return this.renderTabSellItems(QuestDisplayCategory.TurnInArmor);
      case VendorTab.SellMisc:
        return this.renderTabSellItems(QuestDisplayCategory.TurnInMisc);
    }
  }

  private renderTabKingsTask(): React.ReactNode {
    const quests = getQuestsForDisplayCategory(
      QuestDisplayCategory.KingsTask,
      this.props.quests,
      this.props.questDefs,
      this.props.itemsByStringID,
      this.props.uiFactionID
    );
    const collectibleQuest = quests.find((q) => q.isCollectible && !q.isRewarded);
    const currentQuest = quests.find((q) => !q.isCollectible && !q.isRewarded);

    // If there is a collectible quest, we show that one's state so the user can collect it.
    const questToDisplay = collectibleQuest ?? currentQuest;

    const def = this.props.questDefs[questToDisplay?.questDataID ?? ''];
    if (!def) {
      return (
        <div className={KingsTaskNoQuestLabel}>
          {getStringTableValue(StringIDVendorNoKingsTask, this.props.stringTable)}
        </div>
      );
    }
    const targetValue = def.targets[0].amount;
    const curValue = questToDisplay!.progress[def.targets[0].id] ?? 0;
    const progressPercent = curValue / targetValue;
    const rewardAmount = Math.floor(def.rewards[0].amount * progressPercent);
    const canCollect = !!collectibleQuest;

    return (
      <div className={KingsTaskDetailsContainer}>
        <FactionProgressBarCircle
          className={KingsTaskProgressBar}
          sizeOverrideVmin={60}
          progressPercent={progressPercent}
        />
        <div className={KingsTaskCenterPanel}>
          <div className={KingsTaskCountdownLabel}>
            {canCollect
              ? getStringTableValue(StringIDVendorKingsTaskCountdownComplete, this.props.stringTable)
              : this.getTimeRemainingText()}
          </div>
          <FactionDivider />
          <div className={KingsTaskRewardRow}>
            <div className={KingsTaskRewardLabel}>
              {getStringTableValue(
                canCollect ? StringIDVendorKingsTaskRewardComplete : StringIDVendorKingsTaskRewardInProgress,
                this.props.stringTable
              )}
            </div>
            <MoneyDisplay amount={rewardAmount} />
          </div>
          <FactionDivider />
          <FactionButton
            className={KingsTaskCollectButton}
            onClick={
              !!collectibleQuest ? this.onKingsTaskCollectClicked.bind(this, collectibleQuest.instanceID) : undefined
            }
            disabled={!canCollect}
            disabledTooltip={getStringTableValue(StringIDVendorKingsTaskAlreadyClaimed, this.props.stringTable)}
          >
            {getStringTableValue(StringIDGeneralCollect, this.props.stringTable)}
          </FactionButton>
        </div>
      </div>
    );
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

  private onKingsTaskCollectClicked(questInstanceID: string): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ROYAL_TREASURY_SELECT);
    clientAPI.turnInQuest(questInstanceID);
  }

  private renderTabQuests(): React.ReactNode {
    const quests = getQuestsForDisplayCategory(
      QuestDisplayCategory.MilitaryService,
      this.props.quests,
      this.props.questDefs,
      this.props.itemsByStringID,
      this.props.uiFactionID
    );

    if (quests.length <= 0) {
      return this.renderComingSoon();
    }

    const factionData = getFactionData(this.props.uiFactionID);
    // TODO: Real quest cells once this quest category exists.
    return (
      <>
        {this.renderComingSoon()}
        <div className={FooterContainer} style={{ borderTopColor: factionData.borderColor }}></div>
      </>
    );
  }

  private renderTabSellItems(category: QuestDisplayCategory): React.ReactNode {
    const quests = getQuestsForDisplayCategory(
      category,
      this.props.quests,
      this.props.questDefs,
      this.props.itemsByStringID,
      this.props.uiFactionID
    ).sort(this.sortItemQuests.bind(this));

    if (quests.length <= 0) {
      return this.renderComingSoon();
    }

    const SELL_QUESTS_PER_PAGE = 14;
    const pageCount = Math.ceil(quests.length / SELL_QUESTS_PER_PAGE);

    let questsToDisplay: QuestStateEx[] = [];
    for (let i = 0; i < SELL_QUESTS_PER_PAGE; ++i) {
      // This will push `undefined` if we go past the end of the array, and that's fine.  We want to show empty cells too.
      questsToDisplay.push(quests[this.state.pageIndex * SELL_QUESTS_PER_PAGE + i]);
    }

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <>
        <div className={SellItemsQuestsContainer}>
          {questsToDisplay.map(this.renderSellCell.bind(this, questsToDisplay.length))}
          <div
            className={SellItemsQuestsDivider}
            style={{ backgroundImage: `url(${factionData.edgeDecorativeLeftImage})` }}
          />
        </div>
        <div className={FooterContainer} style={{ borderTopColor: factionData.borderColor }}>
          <FactionPageSwitcher
            currentPage={this.state.pageIndex}
            pageCount={pageCount}
            onPageChanged={(newPage) => {
              this.setState({ pageIndex: newPage });
              clientAPI.playGameSound(SoundEvents.PLAY_UI_ARROW_SELECT);
            }}
          />
        </div>
      </>
    );
  }

  private sortItemQuests(a: QuestStateEx, b: QuestStateEx): number {
    // Empty cells are always last.
    if (!a) return 1;
    if (!b) return -1;

    // Unclaimed quests before claimed quests.
    if (a.isRewarded !== b.isRewarded) {
      return a.isRewarded ? 1 : -1;
    }

    const aDef = this.props.questDefs[a.questDataID];
    const aTarget = aDef?.targets?.find(({ id }) => id.startsWith('Sell.'));
    const aItemID = aTarget?.id?.slice(5) ?? '';
    const aItemCount = aTarget?.amount ?? 0;
    const aItemDef = this.props.itemsByStringID[aItemID];
    const aOwnedCount = aItemDef ? getItemCount(aItemDef.numericID, this.props.inventory) : 0;

    const bDef = this.props.questDefs[b.questDataID];
    const bTarget = bDef?.targets?.find(({ id }) => id.startsWith('Sell.'));
    const bItemID = bTarget?.id?.slice(5) ?? '';
    const bItemCount = bTarget?.amount ?? 0;
    const bItemDef = this.props.itemsByStringID[bItemID];
    const bOwnedCount = bItemDef ? getItemCount(bItemDef.numericID, this.props.inventory) : 0;

    // Collectible quests before non-collectible.
    // Note that we can't use the `isCollectible` field because progress is based on your inventory.
    const aIsCollectible = aOwnedCount >= aItemCount;
    const bIsCollectible = bOwnedCount >= bItemCount;
    if (aIsCollectible !== bIsCollectible) {
      return aIsCollectible ? -1 : 1;
    }

    return (aItemDef?.name ?? '').localeCompare(bItemDef?.name ?? '');
  }

  private renderSellCell(numCells: number, quest: QuestStateEx, index: number): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    // Last two cells are the last row.
    const isLastRow = index >= numCells - 2;

    const questDef = this.props.questDefs[quest?.questDataID];
    const target = questDef?.targets?.find(({ id }) => id.startsWith('Sell.'));
    const itemID = target?.id?.slice(5) ?? '';
    const itemCount = target?.amount ?? 0;
    const itemDef = this.props.itemsByStringID[itemID];
    const ownedCount = itemDef ? getItemCount(itemDef.numericID, this.props.inventory) : 0;
    const rewardAmount = questDef?.rewards?.find((r) => r.id === `Item.${CurrencyID.Gold}`)?.amount ?? 0;

    const isRowDisabled = !quest || quest.isRewarded;
    const canTurnIn = ownedCount >= itemCount;
    const isLogged = this.props.loggedQuestIDs.includes(quest?.instanceID);
    const canTrackMoreQuests = this.props.loggedQuestIDs.length < MAX_LOGGED_QUESTS;

    return (
      <div className={SellCell} key={quest?.questDataID ?? index}>
        <div className={SellCellContents}>
          {!isRowDisabled && quest ? (
            <TooltipSource
              className={`${TrackButton}${!canTrackMoreQuests && !isLogged ? ' disabled' : ''}`}
              tooltipID={`${WIDGET_ID_VENDOR}_track_${quest.instanceID}`}
              content={() =>
                getStringTableValue(
                  isLogged ? StringIDVendorTrackRemoveTooltip : StringIDVendorTrackAddTooltip,
                  this.props.stringTable
                )
              }
              positionType='mouse'
              onClick={() => {
                if (isLogged) {
                  // Stop logging (and tracking).
                  clientAPI.playGameSound(SoundEvents.PLAY_UI_MENU_CHOOSE_MINUS);
                  clientAPI.removeLoggedQuestID(quest.instanceID);
                  clientAPI.removeTrackedQuestID(quest.instanceID);
                  this.props.dispatch!(removeLoggedQuestID(quest.instanceID));
                  this.props.dispatch!(removeTrackedQuestID(quest.instanceID));
                } else if (canTrackMoreQuests) {
                  // Start logging (but not necessarily tracking).
                  clientAPI.playGameSound(SoundEvents.PLAY_UI_MENU_CHOOSE_PLUS);
                  clientAPI.addLoggedQuestID(quest.instanceID);
                  this.props.dispatch!(addLoggedQuestID(quest.instanceID));
                }
              }}
            >
              <img className={TrackButtonBackground} src={factionData.buttonSquareBackgroundImage} />
              <div className={TrackButtonLabel}>{isLogged ? '-' : '+'}</div>
            </TooltipSource>
          ) : (
            <div className={TrackButtonSpacer} />
          )}
          <FactionBorder
            className={QuestIconContainer}
            type={BorderType.Decorative}
            background={BorderBackground.PatternSmall}
            cornerSize={'3.5vmin'}
            borderSize={'3.5vmin'}
          >
            <img className={QuestIcon} src={itemDef?.iconUrl} />
          </FactionBorder>
          <div className={WideColumn}>
            <div className={QuestNameLabel}>{itemDef?.name}</div>
            <div className={ThinRow}>
              <div className={QuestProgressLabel}>{itemCount > 0 ? `${ownedCount}/${itemCount}` : ''}</div>
              {!isRowDisabled && rewardAmount > 0 && (
                <MoneyDisplay className={QuestRewardDisplay} amount={rewardAmount} />
              )}
            </div>
          </div>

          <div className={QuestButtonColumn}>
            {!isRowDisabled && rewardAmount > 0 && (
              <div
                className={`${QuestTurnInButton}${canTurnIn ? '' : ' disabled'}`}
                onClick={
                  canTurnIn
                    ? () => {
                        clientAPI.playGameSound(SoundEvents.PLAY_UI_ROYAL_TREASURY_SELECT);
                        clientAPI.turnInQuest(quest.instanceID);
                      }
                    : undefined
                }
              >
                <img className={QuestTurnInButtonBackground} src={factionData.buttonBackgroundMediumImage} />
                <div className={QuestTurnInButtonLabel}>
                  {getStringTableValue(StringIDGeneralCollect, this.props.stringTable)}
                </div>
              </div>
            )}
            {isRowDisabled && quest && (
              <div className={DoneLabel}>{getStringTableValue(StringIDGeneralDone, this.props.stringTable)}</div>
            )}
          </div>

          {isRowDisabled && <div className={QuestCover} />}
        </div>
        {!isLastRow && this.renderCellDivider()}
      </div>
    );
  }

  private renderCellDivider(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div
        className={CellDivider}
        style={{ borderTopColor: factionData.borderColor, borderBottomColor: factionData.borderColor }}
      />
    );
  }

  private renderComingSoon(): React.ReactNode {
    return (
      <div className={KingsTaskNoQuestLabel}>
        {getStringTableValue(StringIDVendorNoKingsTask, this.props.stringTable)}
      </div>
    );
  }

  private closeSelf(): void {
    this.props.dispatch!(addConditionalWidgetExiting(WIDGET_ID_VENDOR));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { questDefs, itemsByStringID, stats: statsByStringID } = state.gameDefs;
  const { quests, rolloverTime } = state.quests;
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    quests,
    questDefs,
    rolloverTime,
    itemsByStringID,
    inventory: state.inventory.primary,
    statsByStringID,
    loggedQuestIDs: state.quests.loggedQuestIDs
  };
};

const Vendor = connect(mapStateToProps)(AVendor);

export const WIDGET_ID_VENDOR = 'Vendor';
export const vendorRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_VENDOR,
  nameStringID: 'HUDEditorWidgetNameVendor',
  nativeWidgetID: 'vendor',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: -6
  },
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Vendor isDragCopy={isDragCopy} />;
  }
};
