/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import dateFormat from 'dateformat';
import { Button } from '../../../shared/Button';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { QuestsByType } from '../../../../redux/questSlice';
import {
  ChampionInfo,
  PerkGQL,
  PerkRewardDefGQL,
  PerkDefGQL,
  PerkType,
  PurchaseDefGQL,
  QuestGQL,
  QuestLinkDefGQL,
  StringTableEntryDef,
  QuestDefGQL,
  QuestType
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from '@reduxjs/toolkit';
import { CSETransition } from '../../../../../shared/components/CSETransition';
import {
  LobbyView,
  Overlay,
  OverlayFieldType,
  navigateTo,
  showError,
  showOverlay,
  showRightPanel
} from '../../../../redux/navigationSlice';
import { updateSelectedChampion } from '../../../../redux/championInfoSlice';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../../../dataSources/networkConfiguration';
import { startProfileRefresh } from '../../../../redux/profileSlice';
import { game } from '@csegames/library/dist/_baseGame';
import {
  getCurrentBattlePassPremiumPurchaseDef,
  getRewardTypeText,
  hasPremiumForBattlePass,
  hasUncollectedDailyQuest,
  shouldShowBattlePassSplashScreen,
  shouldShowClaimBattlePassModal,
  shouldShowEndedBattlePassModal
} from './BattlePassUtils';
import { DailyQuestPanel } from './DailyQuestPanel';
import { FittingView } from '../../../../../shared/components/FittingView';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { GenericToaster } from '../../../GenericToaster';
import {
  StringIDGeneralError,
  StringIDGeneralQty,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../../helpers/stringTableHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { battlePassLocalStore } from '../../../../localStorage/battlePassLocalStorage';
import { QuestXPButton } from '../QuestXPButton';
import { ConfirmPurchase } from '../../../rightPanel/ConfirmPurchase';
import TooltipSource from '../../../../../shared/components/TooltipSource';
import { createAlertsForCollectedQuestProgress } from '../../../../helpers/perkUtils';

const BattlePassBGImage = 'StartScreen-BattlePassBGImage';
const Container = 'BattlePass-Container';
const ContentContainer = 'BattlePass-ContentContainer';
const LeftContentContainer = 'BattlePass-LeftContentContainer';
const RightContentContainer = 'BattlePass-RightContentContainer';
const RightContent = 'BattlePass-RightContent';
const HeaderContainer = 'BattlePass-HeaderContainer';
const HeaderBattlePassTier = 'BattlePass-Header-Tier';
const HeaderBattlePassTierValue = 'BattlePass-Header-TierValue';
const HeaderBattlePassTierLabel = 'BattlePass-Header-TierLabel';
const HeaderNameContainer = 'BattlePass-Header-NameContainer';
const HeaderNameContentContainer = 'BattlePass-Header-NameContentContainer';
const HeaderBattlePassShortName = 'BattlePass-Header-BattlePassShortName';
const HeaderBattlePassIcon = 'BattlePass-Header-BattlePassIcon';
const HeaderBattlePassName = 'BattlePass-Header-BattlePassName';
const HeaderBattlePassExpiry = 'BattlePass-Header-BattlePassExpiry';
const HeaderButtonsContainer = 'BattlePass-Header-ButtonsContainer';
const BuyButton = 'BattlePass-BuyButton';
const QuestsButton = 'BattlePass-QuestsButton';
const TiersContainer = 'BattlePass-TiersContainer';
const TiersContentContainerWrapper = 'BattlePass-TiersContentContainerWrapper';
const TiersContentContainer = 'BattlePass-TiersContentContainer';
const TierContainer = 'BattlePass-TierContainer';
const TierNumberText = 'BattlePass-Tier-NumberText';
const TierNumberTextBar = 'BattlePass-Tier-NumberTextBar';
const TierNumberTextValue = 'BattlePass-Tier-NumberTextValue';
const FreeRewardContainer = 'BattlePass-Tier-FreeRewardContainer';
const PremiumRewardContainer = 'BattlePass-Tier-PremiumRewardContainer';
const RewardIcon = 'BattlePass-Tier-RewardIcon';
const RewardIconBorder = 'BattlePass-Tier-RewardIconBorder';
const TierLockIcon = 'BattlePass-Tier-LockIcon';
const TierCheckIcon = 'BattlePass-Tier-CheckIcon';
const TierClockIcon = 'BattlePass-Tier-ClockIcon';
const TierTooltipRoot = 'BattlePass-Tier-TooltipRoot';
const TierTooltipTitle = 'BattlePass-Tier-TooltipTitle';
const TierTooltipText = 'BattlePass-Tier-TooltipText';
const PageControls = 'BattlePass-PageControls';
const PageControl = 'BattlePass-PageControl';
const PageArrow = 'BattlePass-PageArrow';
const PreviewImage = 'BattlePass-Selection-PreviewImage';
const PreviewOverlay = 'BattlePass-Selection-PreviewOverlay';
const PreviewText = 'BattlePass-Selection-PreviewText';
const PreviewInfo = 'BattlePass-Selection-PreviewInfo';
const PreviewName = 'BattlePass-Selection-PreviewName';
const PreviewTierContainer = 'BattlePass-Selection-PreviewTier-Container';
const PreviewCrownIcon = 'BattlePass-Selection-PreviewTier-CrownIcon';
const PreviewNormalText = 'BattlePass-Selection-PreviewTier-NormalText';
const PreviewPremiumText = 'BattlePass-Selection-PreviewTier-PremiumText';
const PreviewTypeText = 'BattlePass-Selection-PreviewTier-TypeText';
const PreviewRequirements = 'BattlePass-Selection-PreviewRequirements';
const PreviewRequirementsLabel = 'BattlePass-Selection-PreviewRequirementsLabel';
const PreviewRequirementsXP = 'BattlePass-Selection-PreviewRequirementsXP';
const PreviewRequirementsBP = 'BattlePass-Selection-PreviewRequirementsBP';
const PreviewLockIcon = 'BattlePass-Selection-PreviewLockIcon';
const ActionButtonContainer = 'BattlePass-ActionButtonContainer';
const ActionButton = 'BattlePass-ActionButton';
const PremiumLabel = 'BattlePass-PremiumLabel';
const PrizeBadge = 'BattlePass-Tier-PrizeBadge';
const BattlePassQuestXPButton = 'BattlePass-BattlePassQuestXPButton';
const ComingSoonLabel = 'BattlePass-ComingSoonLabel';
const ComingSoonSeasonTitle = 'BattlePass-ComingSoonSeasonTitle';

// Localization Tokens
const StringIDEndsOn = 'BattlePassEndsOn';
const StringIDEnded = 'BattlePassEnded';
const StringIDTierLabel = 'BattlePassTierLabel';
const StringIDBuyButton = 'BattlePassBuyButton';
const StringIDDailyQuestsButton = 'BattlePassDailyQuestsButton';
const StringIDNormalPreviewLabel = 'BattlePassNormalPreviewLabel';
const StringIDPremiumPreviewLabel = 'BattlePassPremiumPreviewLabel';
const StringIDClaimingButton = 'BattlePassClaimingButton';
const StringIDClaimRewardsButton = 'BattlePassClaimRewardsButton';
const StringIDPurchasePremiumButton = 'BattlePassPurchasePremiumButton';
const StringIDViewInventoryButton = 'BattlePassViewInventoryButton';
const StringIDNeedMoreXPButton = 'BattlePassNeedMoreXPButton';
const StringIDCantFindKeyError = 'BattlePassCantFindKeyError';
const StringIDRewardsClaimedTitle = 'BattlePassRewardsClaimedTitle';
const StringIDRewardsClaimedDescription = 'BattlePassRewardsClaimedDescription';
const StringIDUnavailable = 'BattlePassUnavailable';
const StringIDComingSoon = 'BattlePassComingSoon';
const StringIDPremiumLabel = 'BattlePassPremiumLabel';
const StringIDPreviewRequirements = 'BattlePassPreviewRequirements';
const StringIDPreviewPremiumRequirement = 'BattlePassPreviewPremiumRequirement';
const StringIDPreviewXPRequirement = 'BattlePassPreviewXPRequirement';
const StringIDExpiryTooltipTitle = 'BattlePassExpiryTooltipTitle';
const StringIDExpiryTooltipText = 'BattlePassExpiryTooltipText';

/** How wide the gap between tiers should be. */
const tierGapVmin = 0.5;
const maxVisibleTiers = 5;

interface ReactProps {}

interface InjectedProps {
  needGamepadIcons: boolean;
  questDefs: QuestsByType;
  questsById: Dictionary<QuestDefGQL>;
  quests: QuestGQL[];
  questsProgress: QuestGQL[];
  perks: PerkGQL[];
  vminPx: number;
  champions: ChampionInfo[];
  purchases: PurchaseDefGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  currentBattlePass: QuestDefGQL;
  nextBattlePass: QuestDefGQL;
  previousBattlePass: QuestDefGQL;
  minuteTicker: number;
  overlay: OverlayFieldType;
  initializationTopics: Dictionary<boolean>;
  battlePassQuests: QuestDefGQL[];
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  displayedBattlePass: QuestDefGQL;
  displayedProgress: QuestGQL;
  currentPage: number;
  questsToClaim: string[];
  hasPremiumForDisplayedBattlePass: boolean;
  selectedLink: QuestLinkDefGQL;
  selectedIndex: number;
  isSelectionPremium: boolean;
  isClaimingRewards: boolean;
  isReview: boolean;
}

class ABattlePass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      displayedBattlePass: null,
      displayedProgress: null,
      currentPage: 0,
      questsToClaim: [],
      hasPremiumForDisplayedBattlePass: false,
      selectedLink: null,
      selectedIndex: 0,
      isSelectionPremium: false,
      isClaimingRewards: false,
      isReview: false
    };

    requestAnimationFrame(() => {
      this.updateBattlePassState();
    });
  }

  render() {
    // See if we need to show a prestitial before letting the player advance to the BP screen.
    this.checkForPrestitial();

    // Until we have calculated our initial state, don't render.
    if (!this.state.displayedBattlePass) {
      return null;
    }

    // If there is no current or previous BP to view, show the upcoming one.  A future BP is
    // guaranteed to exist, because otherwise the NavMenu doesn't allow the BP tab to be clicked.
    if (!this.props.currentBattlePass && !this.props.previousBattlePass) {
      return this.renderComingSoon();
    }

    const pageLeftPx = 2 - (this.getTierWidthPx() + this.getTierGapPx()) * maxVisibleTiers * this.state.currentPage;
    const leftContainerWidthPx =
      this.getTierWidthPx() * maxVisibleTiers + this.getTierGapPx() * (maxVisibleTiers - 1) + 4 + 8 * this.props.vminPx;

    const battlePassIconClass = this.state.hasPremiumForDisplayedBattlePass
      ? 'fs-icon-misc-season-premium'
      : 'fs-icon-misc-season';
    return (
      <>
        <div className={BattlePassBGImage} style={{ backgroundImage: `url(${this.getBackgroundImage()})` }} />
        <div className={Container}>
          <div className={ContentContainer}>
            <div className={LeftContentContainer} style={{ width: `${leftContainerWidthPx}px` }}>
              <div className={HeaderContainer}>
                <div className={HeaderBattlePassTier}>
                  <div className={HeaderBattlePassTierValue}>
                    {(this.state.displayedProgress?.currentQuestIndex ?? 0) + 1}
                  </div>
                  <div className={HeaderBattlePassTierLabel}>
                    {getStringTableValue(StringIDTierLabel, this.props.stringTable)}
                  </div>
                </div>
                <FittingView
                  horizontalAlignment='left'
                  verticalAlignment='top'
                  className={HeaderNameContainer}
                  contentClassName={HeaderNameContentContainer}
                >
                  <div className={HeaderBattlePassShortName}>
                    <span className={`${HeaderBattlePassIcon} ${battlePassIconClass}`} />
                    {this.state.displayedBattlePass.shortName}
                  </div>
                  <div className={HeaderBattlePassName}>{this.state.displayedBattlePass.name}</div>
                  <div className={HeaderBattlePassExpiry}>
                    {this.state.isReview
                      ? getStringTableValue(StringIDEnded, this.props.stringTable)
                      : `${getStringTableValue(StringIDEndsOn, this.props.stringTable)} ${this.getExpiryText(
                          this.state.displayedBattlePass
                        )}`}
                  </div>
                </FittingView>
                {!this.state.isReview ? (
                  <div className={HeaderButtonsContainer}>
                    {!this.state.hasPremiumForDisplayedBattlePass && (
                      <Button
                        styles={BuyButton}
                        type='primary'
                        text={getStringTableValue(StringIDBuyButton, this.props.stringTable)}
                        onClick={this.onPurchasePremiumClicked.bind(this)}
                      />
                    )}
                    <Button
                      styles={QuestsButton}
                      type='blue'
                      text={getStringTableValue(StringIDDailyQuestsButton, this.props.stringTable)}
                      onClick={this.onQuestsClicked.bind(this)}
                      alertStar={hasUncollectedDailyQuest(this.props.questDefs, this.props.questsProgress)}
                    />
                  </div>
                ) : null}
              </div>
              <div className={TiersContainer}>
                <QuestXPButton questType={QuestType.BattlePass} styles={BattlePassQuestXPButton} />
                <div className={TiersContentContainerWrapper}>
                  <div className={TiersContentContainer} style={{ left: `${pageLeftPx}px` }}>
                    {this.state.displayedBattlePass.links.map(
                      this.renderBattlePassLink.bind(this, this.state.displayedProgress?.currentQuestIndex ?? 0)
                    )}
                  </div>
                </div>
                {this.renderPageControls(this.state.displayedBattlePass)}
              </div>
            </div>
            <div className={RightContentContainer}>{this.renderSelectionPreview()}</div>
          </div>
        </div>
      </>
    );
  }

  private getBackgroundImage(): string {
    if (this.state.displayedBattlePass) {
      if (this.state.displayedBattlePass.id == this.props.currentBattlePass?.id) {
        return this.state.displayedBattlePass.currentBackgroundImage;
      } else if (this.state.displayedBattlePass.id == this.props.nextBattlePass?.id) {
        return this.state.displayedBattlePass.comingSoonImage;
      } else if (this.state.displayedBattlePass.id == this.props.previousBattlePass?.id) {
        return this.state.displayedBattlePass.expiredImage;
      }
    }

    return 'images/fullscreen/fullscreen-runes_bg.jpg';
  }

  private renderComingSoon(): React.ReactNode {
    return (
      <>
        <div className={BattlePassBGImage} style={{ backgroundImage: `url(${this.getBackgroundImage()})` }} />
        <div className={Container}>
          <div className={ComingSoonSeasonTitle}>{this.state.displayedBattlePass?.name}</div>
          <div className={ComingSoonLabel}>{getStringTableValue(StringIDComingSoon, this.props.stringTable)}</div>
        </div>
      </>
    );
  }

  componentDidMount(): void {
    // If we're viewing a battlepass for the first time, mark it as seen.
    if (this.props.currentBattlePass) {
      const lastSeenBattlePassID = battlePassLocalStore.getLastSeenBattlePassID();
      if (lastSeenBattlePassID !== this.props.currentBattlePass.id) {
        battlePassLocalStore.setLastSeenBattlePassID(this.props.currentBattlePass.id);
      }
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.quests !== prevProps.quests || this.props.currentBattlePass !== prevProps.currentBattlePass) {
      this.updateBattlePassState();
    }
  }

  private onQuestsClicked(): void {
    this.props.dispatch?.(showRightPanel(<DailyQuestPanel />));
  }

  private updateBattlePassState(): void {
    const { currentBattlePass, nextBattlePass, previousBattlePass, perks } = this.props;

    // First choice is to show a current battlepass.
    let displayedBattlePass: QuestDefGQL = currentBattlePass;
    let isReview: boolean = false;
    if (!displayedBattlePass) {
      // Second choice is to show the most recently completed battlepass (in review mode).
      displayedBattlePass = previousBattlePass;

      // Third choice is the Coming Soon state (requires a future battlepass in Preview).
      if (!displayedBattlePass) {
        // A 'future' battlepass is guaranteed to exist here because the NavMenu disables the
        // battlepass tab if there isn't one.
        displayedBattlePass = nextBattlePass;
      } else {
        isReview = true;
      }
    }

    const displayedProgress = this.props.quests.find((quest) => {
      return quest.id === displayedBattlePass?.id;
    });

    let questsToClaim: string[] = [];
    let hasPremiumForDisplayedBattlePass: boolean = false;
    this.props.quests.forEach((quest) => {
      const matchingBattlePass = this.props.questDefs.BattlePass.find((bpq) => {
        return bpq.id === quest.id;
      });
      // Note that this return just moves on to the next quest in the ForEach loop.
      if (!matchingBattlePass) return;

      const ownsPremiumKey = hasPremiumForBattlePass(matchingBattlePass, perks);
      if (ownsPremiumKey && currentBattlePass?.id === quest.id) {
        hasPremiumForDisplayedBattlePass = true;
      }
      if (
        quest &&
        (quest.currentQuestIndex > quest.nextCollection ||
          (ownsPremiumKey && quest.currentQuestIndex > quest.nextCollectionPremium))
      ) {
        questsToClaim.push(quest.id);
      }
    });

    let currentPage = this.state.currentPage;
    if (displayedBattlePass && displayedBattlePass !== this.state.displayedBattlePass) {
      // When the battlepass changes (first visit or rollover), start on the most meaningful page.
      // If the character has rewards pending, make sure they can see something badged so they can collect it.
      // If no pending rewards, then both 'nextCollection' values will be the same as the tier currently in progress.
      const nextCollection: number = displayedProgress?.nextCollection ?? 0;
      const nextCollectionPremium: number = displayedProgress?.nextCollectionPremium ?? 0;
      const mostImportantTier = Math.min(
        hasPremiumForDisplayedBattlePass ? Math.min(nextCollection, nextCollectionPremium) : nextCollection,
        // If all tiers are unlocked, we just go with the last reward.
        displayedBattlePass.links.length - 1
      );
      currentPage = Math.floor(mostImportantTier / maxVisibleTiers);

      // Start with the most important item selected so we never have an empty preview.
      // Since rewards can't be claimed individually, the mostImportantTier of the player's state (normal/premium) will
      // always be the correct one.
      this.setState({
        selectedLink: displayedBattlePass.links[mostImportantTier],
        selectedIndex: mostImportantTier,
        isSelectionPremium: hasPremiumForDisplayedBattlePass
      });
    }

    this.setState({
      displayedBattlePass,
      displayedProgress,
      currentPage,
      questsToClaim,
      hasPremiumForDisplayedBattlePass,
      isReview
    });
  }

  private checkForPrestitial(): void {
    // If an overlay is already open, wait to replace it until the user is finished interacting with it.
    if (this.props.overlay) {
      return;
    }

    if (
      this.props.previousBattlePass &&
      shouldShowEndedBattlePassModal(this.props.previousBattlePass.id, this.props.questsProgress)
    ) {
      battlePassLocalStore.setLastEndedBattlePassID(this.props.previousBattlePass.id);
      this.props.dispatch(showOverlay(Overlay.EndedBattlePassModal));
      return;
    }

    if (
      shouldShowClaimBattlePassModal(
        this.props.previousBattlePass,
        this.props.currentBattlePass,
        this.props.nextBattlePass,
        this.props.initializationTopics,
        this.props.battlePassQuests,
        this.props.perks,
        this.props.quests,
        this.props.serverTimeDeltaMS
      )
    ) {
      this.props.dispatch(showOverlay(Overlay.ClaimBattlePassModal));
      return;
    }

    // Two possible prestitials: SplashScreen for a new season, and "You get Premium for Free" for
    // backers of the appropriate tier.  In theory we might show them one after the other.

    // If a new season has started, but we haven't splashed the user yet, splash them!
    // This is tracked separately from the Premium for Free prestitial because we might splash you
    // from the Lobby/Play tab.
    if (this.props.currentBattlePass && shouldShowBattlePassSplashScreen(this.props.currentBattlePass.id)) {
      // Make sure we don't double-splash.
      battlePassLocalStore.setLastSplashedBattlePassID(this.props.currentBattlePass.id);
      // Show the splash.
      this.props.dispatch(showOverlay(Overlay.NewBattlePassModal));
      return;
    }

    // Maybe show the "you get BP for free" popup.
    if (this.props.currentBattlePass && !hasPremiumForBattlePass(this.props.currentBattlePass, this.props.perks)) {
      // If the user SHOULD get BP for free, and we haven't shown the dialog yet for this BP...
      const premiumPurchase = getCurrentBattlePassPremiumPurchaseDef(
        this.props.questDefs.BattlePass,
        this.props.purchases,
        this.props.serverTimeDeltaMS
      );
      const cost = premiumPurchase?.costs?.[0]?.qty ?? 0;
      const isFree = cost === 0;
      const lastSeenFreeBattlePassID = battlePassLocalStore.getLastSeenFreeBattlePassID();
      if (isFree && lastSeenFreeBattlePassID !== this.props.currentBattlePass.id && !!premiumPurchase) {
        // ... show the "you get BP for free" popup.
        this.props.dispatch(showOverlay(Overlay.FreeBattlePassModal));

        // And update the "last seen" ID.
        battlePassLocalStore.setLastSeenFreeBattlePassID(this.props.currentBattlePass.id);
      }
    }
  }

  private getSelectedPreviewItem(): PerkRewardDefGQL {
    if (!this.state.selectedLink) {
      return null;
    }

    if (this.state.isSelectionPremium) {
      return this.state.selectedLink.premiumRewards[0];
    } else {
      return this.state.selectedLink.rewards[0];
    }
  }

  private getSelectionPreviewName(): string {
    if (!this.state.selectedLink) {
      return '';
    }

    if (this.state.isSelectionPremium && this.state.selectedLink.premiumRewardNameOverride?.length > 0) {
      return this.state.selectedLink.premiumRewardNameOverride;
    } else if (!this.state.isSelectionPremium && this.state.selectedLink.rewardNameOverride?.length > 0) {
      return this.state.selectedLink.rewardNameOverride;
    }

    const previewReward = this.getSelectedPreviewItem();
    const perk = this.props.perksByID[previewReward?.perkID];
    return `${perk?.name}${
      !perk?.isUnique
        ? ` ${getTokenizedStringTableValue(StringIDGeneralQty, this.props.stringTable, {
            QTY: String(previewReward?.qty)
          })}`
        : ''
    }`;
  }

  private renderSelectionPreview(): React.ReactNode {
    const previewReward = this.getSelectedPreviewItem();
    const rewardName: string = this.getSelectionPreviewName();
    let previewIcon = '';
    const perk = this.props.perksByID[previewReward?.perkID];
    if (this.state.isSelectionPremium) {
      previewIcon =
        this.state.selectedLink?.premiumRewardImageOverride?.length > 0
          ? this.state.selectedLink?.premiumRewardImageOverride
          : perk?.iconURL;
    } else {
      previewIcon =
        this.state.selectedLink?.rewardImageOverride?.length > 0
          ? this.state.selectedLink?.rewardImageOverride
          : perk?.iconURL;
    }

    const tierTextKey = this.state.isSelectionPremium ? StringIDPremiumPreviewLabel : StringIDNormalPreviewLabel;
    const tierText = getTokenizedStringTableValue(tierTextKey, this.props.stringTable, {
      TIER: `${this.state.selectedIndex + 1}`
    });

    return (
      <CSETransition show={!!this.state.selectedLink && !!previewReward} className={RightContent}>
        <img className={`${PreviewImage} PerkType${perk?.perkType}`} src={previewIcon} />
        <div className={PreviewOverlay}>
          <div className={PreviewText}>
            <div className={PreviewInfo}>
              <div className={PreviewName}>{rewardName}</div>
              <div className={PreviewTierContainer}>
                <div className={PreviewTypeText}>{this.getRewardDescription()}</div>
              </div>
              <div className={PreviewTierContainer}>
                {this.state.isSelectionPremium && <div className={PreviewCrownIcon} />}
                <div className={this.state.isSelectionPremium ? PreviewPremiumText : PreviewNormalText}>{tierText}</div>
              </div>
            </div>
            {this.renderPreviewRequirements()}
          </div>
          <div className={ActionButtonContainer}>{this.renderActionButton()}</div>
        </div>
      </CSETransition>
    );
  }

  private getRewardDescription(): string {
    if (!this.state.selectedLink) {
      return '';
    }

    if (this.state.isSelectionPremium && this.state.selectedLink.premiumRewardDescriptionOverride?.length > 0) {
      return this.state.selectedLink.premiumRewardDescriptionOverride;
    } else if (!this.state.isSelectionPremium && this.state.selectedLink.rewardDescriptionOverride?.length > 0) {
      return this.state.selectedLink.rewardDescriptionOverride;
    }

    return getRewardTypeText(this.getSelectedPreviewItem(), this.props.stringTable, this.props.perksByID);
  }

  private isShowingUnearnedPrize(): boolean {
    const hasSelection = !!this.state.selectedLink;
    const previewReward = this.getSelectedPreviewItem();
    const currentProgress: number = this.state.displayedProgress?.currentQuestIndex ?? 0;

    return hasSelection && !!previewReward && currentProgress <= this.state.selectedIndex;
  }

  private isShowingClaimedReward(): boolean {
    const hasSelection = !!this.state.selectedLink;
    const nextCollection = this.state.displayedProgress?.nextCollection ?? 0;
    const nextCollectionPremium = this.state.displayedProgress?.nextCollectionPremium ?? 0;

    return (
      hasSelection &&
      !!this.getSelectedPreviewItem() &&
      !this.isShowingUnearnedPrize() &&
      ((this.state.hasPremiumForDisplayedBattlePass &&
        this.state.isSelectionPremium &&
        nextCollectionPremium > this.state.selectedIndex) ||
        (!this.state.isSelectionPremium && nextCollection > this.state.selectedIndex))
    );
  }

  private isShowingUnclaimedReward(): boolean {
    const hasSelection = !!this.state.selectedLink;
    const nextCollection = this.state.displayedProgress?.nextCollection ?? 0;
    const nextCollectionPremium = this.state.displayedProgress?.nextCollectionPremium ?? 0;

    return (
      hasSelection &&
      !!this.getSelectedPreviewItem() &&
      !this.isShowingUnearnedPrize() &&
      ((this.state.hasPremiumForDisplayedBattlePass &&
        this.state.isSelectionPremium &&
        nextCollectionPremium <= this.state.selectedIndex) ||
        (!this.state.isSelectionPremium && nextCollection <= this.state.selectedIndex))
    );
  }

  private isPreviewRewardLockedBehindPremium(): boolean {
    return !!this.state.selectedLink && this.state.isSelectionPremium && !this.state.hasPremiumForDisplayedBattlePass;
  }

  private renderPreviewRequirements(): React.ReactNode {
    const isShowingUnearnedPrize = this.isShowingUnearnedPrize();
    const isPreviewRewardLockedBehindPremium = this.isPreviewRewardLockedBehindPremium();
    if (!isShowingUnearnedPrize && !isPreviewRewardLockedBehindPremium) {
      return null;
    }
    const currentLinkIndex = this.state.displayedProgress?.currentQuestIndex ?? 0;
    let currentXP = this.state.displayedProgress?.currentQuestProgress ?? 0;
    let maxXP = 0;
    this.state.displayedBattlePass.links.forEach((link, linkIndex) => {
      if (linkIndex <= this.state.selectedIndex) {
        maxXP += link.progress;
      }
      if (linkIndex < currentLinkIndex) {
        currentXP += link.progress;
      }
    });
    return (
      <div className={PreviewRequirements}>
        <div className={PreviewTierContainer}>
          <div className={PreviewRequirementsLabel}>
            {getStringTableValue(StringIDPreviewRequirements, this.props.stringTable)}
          </div>
        </div>
        {isShowingUnearnedPrize && (
          <div className={PreviewTierContainer}>
            <div className={PreviewRequirementsXP}>
              {getTokenizedStringTableValue(StringIDPreviewXPRequirement, this.props.stringTable, {
                CURRENT_XP: String(currentXP),
                MAX_XP: String(maxXP)
              })}
            </div>
          </div>
        )}
        {isPreviewRewardLockedBehindPremium && (
          <div className={PreviewTierContainer}>
            <div className={PreviewRequirementsBP}>
              {getStringTableValue(StringIDPreviewPremiumRequirement, this.props.stringTable)}
            </div>
            <div className={`${PreviewLockIcon} fs-icon-misc-lock`} />
          </div>
        )}
      </div>
    );
  }

  private renderActionButton(): React.ReactNode {
    const previewReward = this.getSelectedPreviewItem();
    const isShowingUnearnedPrize = this.isShowingUnearnedPrize();
    const isShowingClaimedReward = this.isShowingClaimedReward();
    const isShowingUnclaimedReward = this.isShowingUnclaimedReward();
    const perk = this.props.perksByID[previewReward?.perkID];

    if (isShowingUnclaimedReward) {
      // If we are looking at an earned, unclaimed award, show a claim button.
      return (
        <Button
          type='blue'
          text={getStringTableValue(
            this.state.isClaimingRewards ? StringIDClaimingButton : StringIDClaimRewardsButton,
            this.props.stringTable
          )}
          disabled={this.state.isClaimingRewards}
          styles={ActionButton}
          onClick={this.onClaimRewardsClicked.bind(this)}
        />
      );
    } else if (
      // If we are looking at a premium reward, but we don't own premium, show an upgrade button.
      this.isPreviewRewardLockedBehindPremium() &&
      !this.state.isReview
    ) {
      if (
        !!getCurrentBattlePassPremiumPurchaseDef(
          this.props.questDefs.BattlePass,
          this.props.purchases,
          this.props.serverTimeDeltaMS
        )
      ) {
        return (
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDPurchasePremiumButton, this.props.stringTable)}
            styles={ActionButton}
            onClick={this.onPurchasePremiumClicked.bind(this)}
          />
        );
      } else {
        // But if the BP Key is not currently available for sale, just show an Unavailable button.
        return (
          <Button
            type='blue'
            disabled={true}
            text={getStringTableValue(StringIDUnavailable, this.props.stringTable)}
            styles={ActionButton}
          />
        );
      }
    } else if (isShowingClaimedReward && perk?.perkType !== PerkType.Currency) {
      // If this is a claimed prize, non-currency, show a "go see it" button?
      return (
        <Button
          type='double-border'
          text={getStringTableValue(StringIDViewInventoryButton, this.props.stringTable)}
          styles={ActionButton}
          onClick={this.onViewInventoryClicked.bind(this, previewReward)}
        />
      );
    } else if (isShowingUnearnedPrize && !this.state.isReview) {
      // If this is an unearned prize, and nothing else applies, show a "not earned" gray button.
      return (
        <Button
          type='blue'
          disabled={true}
          text={getStringTableValue(StringIDNeedMoreXPButton, this.props.stringTable)}
          styles={ActionButton}
        />
      );
    }

    return null;
  }

  private onPurchasePremiumClicked(): void {
    // Summon the purchase slider!
    const premiumPurchase = getCurrentBattlePassPremiumPurchaseDef(
      this.props.questDefs.BattlePass,
      this.props.purchases,
      this.props.serverTimeDeltaMS
    );
    if (premiumPurchase) {
      this.props.dispatch(
        showRightPanel(
          <ConfirmPurchase
            purchase={premiumPurchase}
            currentQuestTier={this.state.displayedProgress?.currentQuestIndex ?? 0}
            confirmPurchaseForHighCost={true}
          />
        )
      );
    } else {
      this.props.dispatch(
        showError({
          severity: 'standard',
          title: getStringTableValue(StringIDGeneralError, this.props.stringTable),
          message: getStringTableValue(StringIDCantFindKeyError, this.props.stringTable),
          code: '404'
        })
      );
    }
  }

  private async onClaimRewardsClicked(): Promise<void> {
    this.setState({ isClaimingRewards: true });
    this.state.questsToClaim.forEach(async (questId) => {
      const res = await ProfileAPI.CollectQuestReward(webConf, questId);
      if (res.ok) {
        const quest: QuestDefGQL = this.props.questsById[questId];
        const questProgress: QuestGQL = this.props.quests.find((q) => q.id == questId);
        createAlertsForCollectedQuestProgress(quest, questProgress, this.props.perksByID, this.props.dispatch);

        // A summation toaster, rather than one for each item.
        game.trigger(
          'show-bottom-toaster',
          <GenericToaster
            title={getStringTableValue(StringIDRewardsClaimedTitle, this.props.stringTable)}
            description={getStringTableValue(StringIDRewardsClaimedDescription, this.props.stringTable)}
          />
        );

        // Get the new data.
        this.props.dispatch(startProfileRefresh());
      } else {
        this.props.dispatch(showError(res));
      }
    });
    this.setState({ isClaimingRewards: false });
  }

  private onViewInventoryClicked(reward: PerkRewardDefGQL): void {
    const perk = this.props.perksByID[reward.perkID];
    // If available, directly select the champion this reward is associated with.
    if (!!perk.champion) {
      const championInfo = this.props.champions.find((ci) => {
        return ci.id === perk.champion.id;
      });
      if (championInfo) {
        this.props.dispatch(updateSelectedChampion(championInfo));
      }
    }
    switch (perk.perkType) {
      case PerkType.Costume: {
        this.props.dispatch(navigateTo(LobbyView.SelectSkin));
        break;
      }
      case PerkType.Emote: {
        this.props.dispatch(navigateTo(LobbyView.SelectEmote));
        break;
      }
      case PerkType.Weapon: {
        this.props.dispatch(navigateTo(LobbyView.SelectWeapon));
        break;
      }
      case PerkType.RuneMod: {
        this.props.dispatch(showOverlay(Overlay.RuneMods));
        break;
      }
      case PerkType.Portrait:
      case PerkType.SprintFX: {
        this.props.dispatch(navigateTo(LobbyView.SelectAppearance));
        break;
      }
      default: {
        this.props.dispatch(navigateTo(LobbyView.Champions));
        break;
      }
    }
  }

  private getTierGapPx(): number {
    return Math.floor(tierGapVmin * this.props.vminPx);
  }

  private getTierWidthPx(): number {
    // Width is calculated based on the size of style BattlePass-LeftContentContainer.
    const totalWidthVmin = 83;
    const totalWidthPx = Math.floor(totalWidthVmin * this.props.vminPx);

    // Take out space for gaps between the visible tiers.
    const availableWidth = totalWidthPx - (maxVisibleTiers - 1) * this.getTierGapPx();

    return Math.floor(availableWidth / maxVisibleTiers);
  }

  private renderBattlePassLink(currentLinkIndex: number, link: QuestLinkDefGQL, index: number): React.ReactNode {
    const perk = this.props.perksByID[link?.rewards?.[0]?.perkID];
    const premiumPerk = this.props.perksByID[link?.premiumRewards?.[0]?.perkID];

    const tierWidthPx = this.getTierWidthPx();
    const tierGapPx = this.getTierGapPx();
    const freeRewardURL =
      link?.rewardImageOverride?.length > 0 ? link.rewardImageOverride : perk?.iconURL.length > 0 ? perk?.iconURL : '';
    const premiumRewardURL =
      link?.premiumRewardImageOverride?.length > 0
        ? link?.premiumRewardImageOverride
        : premiumPerk?.iconURL?.length > 0
        ? premiumPerk?.iconURL
        : '';
    const hasPremiumReward = premiumRewardURL !== '';
    const currentQuestIndex: number = this.state.displayedProgress?.currentQuestIndex ?? 0;
    const nextCollection: number = this.state.displayedProgress?.nextCollection ?? 0;
    const nextCollectionPremium: number = this.state.displayedProgress?.nextCollectionPremium ?? 0;
    const isNormalUnclaimed = !!link.rewards[0] && currentQuestIndex > index && index >= nextCollection;
    const isPremiumUnclaimed =
      this.state.hasPremiumForDisplayedBattlePass &&
      !!link.premiumRewards[0] &&
      currentQuestIndex > index &&
      index >= nextCollectionPremium;
    const barWidth =
      index === currentLinkIndex
        ? `${((this.state.displayedProgress?.currentQuestProgress ?? 0) / (link?.progress ?? 1)) * 100}%`
        : index > currentLinkIndex
        ? '0'
        : '100%';
    return (
      <div
        className={TierContainer}
        key={`Tier${index + 1}`}
        style={{
          width: `${tierWidthPx}px`,
          marginRight: `${tierGapPx}px`
        }}
      >
        <div className={TierNumberText}>
          <div
            className={`${TierNumberTextBar} ${index === currentLinkIndex ? 'current' : ''}`}
            style={{ width: barWidth }}
          />
          <div className={TierNumberTextValue}>{index + 1}</div>
        </div>
        <div
          className={`${FreeRewardContainer} ${isNormalUnclaimed ? 'unclaimed' : ''} ${
            this.state.selectedIndex === index && !this.state.isSelectionPremium ? 'clicked' : ''
          }`}
          style={{ height: `${tierWidthPx}px`, marginTop: `${tierGapPx}px`, marginBottom: `${tierGapPx}px` }}
          onClick={this.onLinkClicked.bind(this, link, index, false)}
        >
          <div className={`${RewardIconBorder} PerkType${perk?.perkType}`} />
          <img
            className={`${RewardIcon} ${nextCollection > index ? 'claimed' : ''} PerkType${perk?.perkType}`}
            src={freeRewardURL}
          />
          {nextCollection > index && <div className={`${TierCheckIcon} fs-icon-misc-check`} />}
          {isNormalUnclaimed && <StarBadge className={PrizeBadge} />}
          {this.state.isReview && index >= currentQuestIndex && (
            <TooltipSource tooltipParams={{ id: `premium${index}`, content: this.renderExpiredTooltip.bind(this) }}>
              <div className={`${TierClockIcon} fs-icon-effects-player-lockdown`} />
            </TooltipSource>
          )}
        </div>
        <div
          className={`${PremiumRewardContainer} ${isPremiumUnclaimed ? 'unclaimed' : ''} ${
            hasPremiumReward ? '' : 'empty'
          } ${this.state.selectedIndex === index && this.state.isSelectionPremium ? 'clicked' : ''}`}
          style={{ height: `${tierWidthPx}px` }}
          onClick={hasPremiumReward ? this.onLinkClicked.bind(this, link, index, true) : null}
        >
          <div className={`${RewardIconBorder} PerkType${premiumPerk?.perkType}`} />
          <img
            className={`${RewardIcon} ${nextCollectionPremium > index ? 'claimed' : ''} PerkType${
              premiumPerk?.perkType
            }`}
            src={premiumRewardURL}
          />
          {!this.state.isReview && !this.state.hasPremiumForDisplayedBattlePass && hasPremiumReward && (
            <div className={`${TierLockIcon} fs-icon-misc-lock`} />
          )}
          {hasPremiumReward && nextCollectionPremium > index && (
            <div className={`${TierCheckIcon} fs-icon-misc-check`} />
          )}
          {hasPremiumReward && this.state.isReview && index >= currentQuestIndex && (
            <TooltipSource tooltipParams={{ id: `premium${index}`, content: this.renderExpiredTooltip.bind(this) }}>
              <div className={`${TierClockIcon} fs-icon-effects-player-lockdown`} />
            </TooltipSource>
          )}
          {hasPremiumReward && (
            <div className={PremiumLabel}>{getStringTableValue(StringIDPremiumLabel, this.props.stringTable)}</div>
          )}
          {this.state.hasPremiumForDisplayedBattlePass && isPremiumUnclaimed && <StarBadge className={PrizeBadge} />}
        </div>
      </div>
    );
  }

  private renderExpiredTooltip(): React.ReactNode {
    return (
      <div className={TierTooltipRoot}>
        <div className={TierTooltipTitle}>
          {getStringTableValue(StringIDExpiryTooltipTitle, this.props.stringTable)}
        </div>
        <div className={TierTooltipText}>{getStringTableValue(StringIDExpiryTooltipText, this.props.stringTable)}</div>
      </div>
    );
  }

  private renderPageControls(battlePass: QuestDefGQL): React.ReactNode {
    const tierWidthPx = this.getTierWidthPx();
    const tierGapPx = this.getTierGapPx();
    const numPages = Math.ceil(battlePass.links.length / maxVisibleTiers);
    const pageIsSelected: boolean[] = [];
    const firstPage: string = this.state.currentPage == 0 ? 'endPage' : '';
    const lastPage: string = this.state.currentPage >= numPages - 1 ? 'endPage' : '';

    for (let i = 0; i < numPages; ++i) {
      pageIsSelected[i] = i === this.state.currentPage;
    }
    return (
      <div
        className={PageControls}
        style={{ marginTop: `${tierWidthPx * 2 + tierGapPx * 2 + 6 * this.props.vminPx}px` }}
      >
        <div
          className={`${PageArrow} ${firstPage} fs-icon-misc-chevron-left`}
          onClick={this.onPageLeftArrowClick.bind(this, numPages)}
        />
        {pageIsSelected.map((isSelected, page) => {
          return (
            <div
              className={`${PageControl} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                this.moveToPage(page);
              }}
              key={page}
            />
          );
        })}
        <div
          className={`${PageArrow} ${lastPage} fs-icon-misc-chevron-right`}
          onClick={this.onPageRightArrowClick.bind(this, numPages)}
        />
      </div>
    );
  }

  private moveToPage(page: number): void {
    const firstTierOfPage = page * maxVisibleTiers;
    const selectedLink = this.state.displayedBattlePass.links[firstTierOfPage];
    const isSelectionPremium = this.state.hasPremiumForDisplayedBattlePass;
    this.setState({ currentPage: page, selectedLink, selectedIndex: firstTierOfPage, isSelectionPremium });
  }

  private onPageLeftArrowClick(numPages: number): void {
    if (this.state.currentPage > 0) {
      const newPage = this.state.currentPage - 1;
      this.moveToPage(newPage);
    }
  }

  private onPageRightArrowClick(numPages: number): void {
    if (this.state.currentPage + 1 < numPages) {
      const newPage = this.state.currentPage + 1;
      this.moveToPage(newPage);
    }
  }

  private onLinkClicked(link: QuestLinkDefGQL, index: number, isPremium: boolean): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CHARACTER_SELECT_LOCK_IN);
    this.setState({ selectedLink: link, selectedIndex: index, isSelectionPremium: isPremium });
  }

  private getExpiryText(battlePass: QuestDefGQL): string {
    const expiryDate = new Date(
      battlePass.questLock?.find((lock) => {
        return !!lock.endTime;
      })?.endTime
    );

    // Apparently we don't currently have access to "Intl.DateTimeFormat",
    // so we are using the `dateformat` library, which does not localize
    // automatically. :(
    return dateFormat(expiryDate, 'hTT mmmm d, yyyy');
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const questDefs = state.quests.quests;
  const { currentBattlePass, nextBattlePass, previousBattlePass, questsById } = state.quests;
  const { perks, quests } = state.profile;
  const questsProgress = state.profile.quests;
  const { vminPx } = state.hud;
  const { champions } = state.championInfo;
  const { purchases, perksByID } = state.store;
  const { stringTable } = state.stringTable;
  const { minuteTicker, serverTimeDeltaMS } = state.clock;
  const { overlay } = state.navigation;
  const initializationTopics = state.initialization.componentStatus;
  const battlePassQuests = state.quests.quests?.BattlePass;

  return {
    ...ownProps,
    needGamepadIcons: usingGamepad && usingGamepadInMainMenu,
    questDefs,
    questsById,
    quests,
    questsProgress,
    perks,
    vminPx,
    champions,
    purchases,
    perksByID,
    stringTable,
    currentBattlePass,
    nextBattlePass,
    previousBattlePass,
    minuteTicker,
    overlay,
    initializationTopics,
    battlePassQuests,
    serverTimeDeltaMS
  };
}

export const BattlePass = connect(mapStateToProps)(ABattlePass);
