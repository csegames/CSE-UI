/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from 'redux';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  ChampionInfo,
  PerkDefGQL,
  PerkGQL,
  PerkType,
  QuestDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { hideOverlay, Overlay, showError } from '../../redux/navigationSlice';
import {
  StringIDGeneralBP,
  StringIDGeneralCancel,
  StringIDGeneralXP,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import { QuestStatus, QuestType } from '@csegames/library/dist/hordetest/graphql/schema';
import { Button } from '../shared/Button';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { startProfileRefresh } from '../../redux/profileSlice';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { getWornCostumeForChampion } from '../../helpers/characterHelpers';
import { ResourceBar } from '../shared/ResourceBar';
import { webConf } from '../../dataSources/networkConfiguration';

const Title = 'SpendQuestXPPotionsModal-Title';
const Description = 'SpendQuestXPPotionsModal-Description';
const ButtonContainer = 'SpendQuestXPPotionsModal-ButtonContainer';
const UseButton = 'SpendQuestXPPotionsModal-UseButton';
const NextLevelTextContainer = 'SpendQuestXPPotionsModal-NextLevelTextContainer';
const NextLevelText = 'SpendQuestXPPotionsModal-NextLevelText';
const XPToNextLevelText = 'SpendQuestXPPotionsModal-XPToNextLevelText';
const XPTypeText = 'SpendQuestXPPotionsModal-XPTypeText';
const ChampionPortrait = 'SpendQuestXPPotionsModal-ChampionPortrait';
const AvailablePotionsContainer = 'SpendQuestXPPotionsModal-AvailablePotionsContainer';
const AvailablePotionsTitle = 'SpendQuestXPPotionsModal-AvailablePotionsTitle';
const AvailablePotionsIcon = 'SpendQuestXPPotionsModal-AvailablePotionsIcon';
const AvailablePotionsAmount = 'SpendQuestXPPotionsModal-AvailablePotionsAmount';
const AmountToSpendContainer = 'SpendQuestXPPotionsModal-AmountToSpendContainer';
const AmountToSpendTitle = 'SpendQuestXPPotionsModal-AmountToSpendTitle';
const Amount = 'SpendQuestXPPotionsModal-Amount';
const Arrow = 'SpendQuestXPPotionsModal-Arrow';
const AvailablePotionsAmountContainer = 'SpendQuestXPPotionsModal-AvailablePotionsAmountContainer';
const AmountContainer = 'SpendQuestXPPotionsModal-AmountContainer';
const Bar = 'SpendQuestXPPotionsModal-Bar';
const BarText = 'SpendQuestXPPotionsModal-BarText';
const Backfill = 'SpendQuestXPPotionsModal-Backfill';
const TotalXPAmountContainer = 'SpendQuestXPPotionsModal-TotalXPAmountContainer';
const TotalXPAmountTitle = 'SpendQuestXPPotionsModal-TotalXPAmountTitle';
const TotalXPAmountAmount = 'SpendQuestXPPotionsModal-TotalXPAmountAmount';
const TotalXPAmountType = 'SpendQuestXPPotionsModal-TotalXPAmountType';
const ChampionProgressionLevel = 'SpendQuestXPPotionsModal-ChampionProgressionLevel';
const ChampionPortraitContainer = 'SpendQuestXPPotionsModal-ChampionPortraitContainer';
const SeasonTierContainer = 'SpendQuestXPPotionsModal-SeasonTierContainer';
const SeasonCurrentTier = 'SpendQuestXPPotionsModal-SeasonCurrentTier';
const SeasonTierTitle = 'SpendQuestXPPotionsModal-SeasonTierTitle';

const StringIDSpendQuestXPPotionsModalTitleChampion = 'SpendQuestXPPotionsModalTitleChampion';
const StringIDSpendQuestXPPotionsModalTitleBattlePass = 'SpendQuestXPPotionsModalTitleBattlePass';
const StringIDSpendQuestXPPotionsModalDescriptionChampion = 'SpendQuestXPPotionsModalDescriptionChampion';
const StringIDSpendQuestXPPotionsModalDescriptionBattlePass = 'SpendQuestXPPotionsModalDescriptionBattlePass';
const StringIDSpendQuestXPPotionsModalUsePotions = 'SpendQuestXPPotionsModalUsePotions';
const StringIDSpendQuestXPPotionsModalUntilNextLevel = 'SpendQuestXPPotionsModalUntilNextLevel';
const StringIDSpendQuestXPPotionsModalAvailable = 'SpendQuestXPPotionsModalAvailable';
const StringIDSpendQuestXPPotionsModalAmount = 'SpendQuestXPPotionsModalAmount';
const StringIDSpendQuestXPPotionsTotal = 'SpendQuestXPPotionsTotal';
const StringIDSpendQuestXPPotionTier = 'SpendQuestXPPotionTier';

const ModifyQuestXPDelayTime = 500;
const ModifyQuestXPRepeatTime = 100;
const ModifyFastCount = 10;
const ModifyFastMultiplier = 10;

interface ReactProps {}

interface InjectedProps {
  quests: QuestGQL[];
  currentBattlePass: QuestDefGQL;
  stringTable: Dictionary<StringTableEntryDef>;
  quest: QuestDefGQL;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionGQL[];
  championInfos: ChampionInfo[];
  perksByID: Dictionary<PerkDefGQL>;
  perks: PerkGQL[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  count: number;
  isSpending: boolean;
}

class ASpendQuestXPPotionsModal extends React.Component<Props, State> {
  private mouseDownTimeout: any;
  private mouseDownInterval: any;
  private arrowTriggerCount: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      count: 0,
      isSpending: false
    };
  }

  public render() {
    const champion = this.props.championInfos.find((champ) => champ.questID == this.props.quest.id);
    const perk = this.getPerk();
    const ownedAmount = this.getOwnedAmount();

    let level: number = 0;
    let currentXP: number = 0;
    let maxXP: number = 0;
    let fillXP: number = 0;
    const questProgress = this.props.quests.find((q) => q.id == this.props.quest.id);

    if (perk && questProgress && questProgress.questStatus == QuestStatus.Running) {
      const xpPerPerk = perk.xPAmount ?? 1;
      let amountRemaining: number = this.state.count * xpPerPerk;

      for (let i = questProgress.currentQuestIndex; i < this.props.quest.links.length; ++i) {
        level = Math.min(this.props.quest.links.length, i + 1);
        currentXP = i == questProgress.currentQuestIndex ? questProgress.currentQuestProgress : 0;
        maxXP = this.props.quest.links[i].progress;

        const useForLevel = Math.min(amountRemaining, maxXP - currentXP);
        fillXP = currentXP + useForLevel;
        amountRemaining -= useForLevel;

        if (amountRemaining <= 0) {
          if (fillXP == maxXP) {
            level++;
          }

          break;
        }
      }
    }

    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <div className={Title}>{this.getTitleText()}</div>
        {this.getQuestIcon(champion, questProgress)}
        <div className={Description}>{this.getDescriptionText(champion)}</div>
        {this.getProgressBar(level, currentXP, maxXP, fillXP)}
        {this.getNextLevelText(maxXP - fillXP)}
        {this.getAvailablePotions(perk, ownedAmount)}
        {this.getPotionsToUse(ownedAmount)}
        {this.getTotalXPAmount()}
        <div className={ButtonContainer}>
          <Button
            type='blue'
            text={getStringTableValue(StringIDSpendQuestXPPotionsModalUsePotions, this.props.stringTable)}
            onClick={this.onUsePotionClick.bind(this, perk)}
            styles={UseButton}
            disabled={this.state.count <= 0}
          />
          <Button
            type='blue-outline'
            text={getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
            onClick={this.onClose.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If we are showing the BattlePass XP potion and the battle pass expires, shut the modal so
    // the user can't try (and fail) to spend potions on it.
    if (prevProps.currentBattlePass && prevProps.quest) {
      const wasForBattlePass = prevProps.currentBattlePass.id === prevProps.quest.id;
      if (wasForBattlePass && !this.props.currentBattlePass) {
        this.onClose();
      }
    }
  }

  private getOwnedAmount(): number {
    const perk = this.getPerk();
    return this.props.perks.find((p) => p.id == perk?.id)?.qty ?? 0;
  }

  private getRemainingXP(): number {
    const perk = this.getPerk();
    const questProgress = this.props.quests.find((q) => q.id == this.props.quest.id);
    if (
      !perk ||
      !questProgress ||
      questProgress.questStatus != QuestStatus.Running ||
      questProgress.currentQuestIndex >= this.props.quest.links.length // this situation could only happen if we have corrupted quest data
    ) {
      return 0;
    }

    let remainingXP =
      this.props.quest.links[questProgress.currentQuestIndex].progress - questProgress.currentQuestProgress;
    for (let i = questProgress.currentQuestIndex + 1; i < this.props.quest.links.length; ++i) {
      remainingXP += this.props.quest.links[i].progress;
    }

    return remainingXP;
  }

  private getMaxSpendAmount(): number {
    const remainingXP = this.getRemainingXP();
    return Math.ceil(remainingXP / this.getPerk().xPAmount);
  }

  private getTitleText(): string {
    return this.props.quest.questType == QuestType.BattlePass
      ? getStringTableValue(StringIDSpendQuestXPPotionsModalTitleBattlePass, this.props.stringTable)
      : getStringTableValue(StringIDSpendQuestXPPotionsModalTitleChampion, this.props.stringTable);
  }

  private getDescriptionText(champion: ChampionInfo): string {
    const questProgress = this.props.quests.find((q) => q.id == this.props.quest.id);
    const currentLevel = (questProgress?.currentQuestIndex ?? 0) + 1;

    if (this.props.quest.questType == QuestType.BattlePass) {
      return getTokenizedStringTableValue(
        StringIDSpendQuestXPPotionsModalDescriptionBattlePass,
        this.props.stringTable,
        { LEVEL: currentLevel.toString() }
      );
    }

    const tokens = { NAME: champion?.name, LEVEL: currentLevel.toString() };
    return getTokenizedStringTableValue(
      StringIDSpendQuestXPPotionsModalDescriptionChampion,
      this.props.stringTable,
      tokens
    );
  }

  private getQuestIcon(champion: ChampionInfo, quest: QuestGQL): JSX.Element {
    const level = quest ? quest.currentQuestIndex + 1 : 1;

    if (this.props.quest.questType == QuestType.BattlePass) {
      return (
        <div className={SeasonTierContainer}>
          <div className={SeasonCurrentTier}>{level}</div>
          <div className={SeasonTierTitle}>
            {getStringTableValue(StringIDSpendQuestXPPotionTier, this.props.stringTable)}
          </div>
        </div>
      );
    }

    if (champion) {
      let portraitURL = getWornCostumeForChampion(
        this.props.championCostumes,
        this.props.champions,
        this.props.perksByID,
        champion.id
      )?.thumbnailURL;

      return (
        <div className={ChampionPortraitContainer}>
          <span className={`${ChampionProgressionLevel}`}>{level}</span>
          <img className={ChampionPortrait} src={portraitURL} />
        </div>
      );
    }

    return null;
  }

  private getNextLevelText(amountToNextLevel: number): JSX.Element {
    return (
      <div className={NextLevelTextContainer}>
        <div className={NextLevelText}>
          {getStringTableValue(StringIDSpendQuestXPPotionsModalUntilNextLevel, this.props.stringTable)}
        </div>
        <div className={XPToNextLevelText}>{addCommasToNumber(amountToNextLevel)}</div>
        <div className={`${XPTypeText} ${this.props.quest.questType.toString()}`}>{this.getXPTypeText()}</div>
      </div>
    );
  }

  private getXPTypeText(): string {
    return getStringTableValue(
      this.props.quest.questType == QuestType.BattlePass ? StringIDGeneralBP : StringIDGeneralXP,
      this.props.stringTable
    );
  }

  private getProgressBar(level: number, currentXP: number, maxXP: number, fillXP: number): JSX.Element {
    const type = this.props.quest.questType == QuestType.BattlePass ? 'orange' : 'blue';

    return (
      <ResourceBar
        isSquare
        type={type}
        current={currentXP}
        fixedBackfillAmount={fillXP}
        fixedBackfillStyle={`${Backfill} ${this.props.quest.questType.toString()}`}
        max={maxXP}
        hideText={false}
        text={level.toString()}
        containerClasses={Bar}
        textStyles={BarText}
      />
    );
  }

  private getAvailablePotions(perk: PerkDefGQL, ownedAmount: number): JSX.Element {
    return (
      <div className={AvailablePotionsContainer}>
        <div className={AvailablePotionsTitle}>
          {getStringTableValue(StringIDSpendQuestXPPotionsModalAvailable, this.props.stringTable)}
        </div>
        <div className={AvailablePotionsAmountContainer}>
          <img className={AvailablePotionsIcon} src={perk?.iconURL} />
          <div className={AvailablePotionsAmount}>{addCommasToNumber(ownedAmount)}</div>
        </div>
      </div>
    );
  }

  private getPotionsToUse(ownedAmount: number): JSX.Element {
    const maxToSpend: number = Math.min(this.getMaxSpendAmount(), ownedAmount);

    const leftArrowDisabled = this.state.count < 1 ? 'Disabled' : '';
    const rightArrowDisabled = this.state.count >= maxToSpend ? 'Disabled' : '';

    return (
      <div className={AmountToSpendContainer}>
        <div className={AmountToSpendTitle}>
          {getStringTableValue(StringIDSpendQuestXPPotionsModalAmount, this.props.stringTable)}
        </div>
        <div className={AmountContainer}>
          <button
            className={`${Arrow} ${leftArrowDisabled}`}
            onMouseDown={this.onRemovePotion.bind(this, 1)}
            onMouseUp={this.clearMouseDownInterval.bind(this)}
          >
            <span className={`fs-icon-misc-chevron-left`} />
          </button>
          <input
            className={Amount}
            name={'perkAmount'}
            type={'text'}
            value={this.state.count}
            onChange={this.handleTextChange.bind(this)}
          />
          <button
            className={`${Arrow} ${rightArrowDisabled}`}
            onMouseDown={this.onAddPotion.bind(this, 1)}
            onMouseUp={this.clearMouseDownInterval.bind(this)}
          >
            <span className={`fs-icon-misc-chevron-right`} />
          </button>
        </div>
      </div>
    );
  }

  private getTotalXPAmount(): JSX.Element {
    const perk = this.getPerk();
    const remainingXP = this.getRemainingXP();
    const amount = Math.min(this.state.count * perk.xPAmount, remainingXP);

    return (
      <div className={TotalXPAmountContainer}>
        <div className={TotalXPAmountTitle}>
          {getStringTableValue(StringIDSpendQuestXPPotionsTotal, this.props.stringTable)}
        </div>
        <div className={TotalXPAmountAmount}>{addCommasToNumber(amount)}</div>
        <div className={`${TotalXPAmountType} ${this.props.quest.questType.toString()}`}>{this.getXPTypeText()}</div>
      </div>
    );
  }

  public componentWillUnmount(): void {
    this.clearMouseDownInterval();
  }

  private clearMouseDownInterval(): void {
    clearTimeout(this.mouseDownTimeout);
    clearInterval(this.mouseDownInterval);
    this.mouseDownTimeout = null;
    this.mouseDownInterval = null;
    this.arrowTriggerCount = 0;
  }

  private onRemovePotion(count: number): void {
    if (this.state.count > 0) {
      this.setState({ count: Math.max(this.state.count - count, 0) });
      this.arrowTriggerCount++;
    }

    if (!this.mouseDownTimeout) {
      this.mouseDownTimeout = window.setTimeout(() => {
        this.mouseDownInterval = window.setInterval(() => {
          this.onRemovePotion(this.arrowTriggerCount < ModifyFastCount ? 1 : ModifyFastMultiplier);
        }, ModifyQuestXPRepeatTime);
      }, ModifyQuestXPDelayTime);
    }
  }

  private onAddPotion(count: number): void {
    const max = Math.min(this.getOwnedAmount(), this.getMaxSpendAmount());
    if (this.state.count < max) {
      this.setState({ count: Math.min(this.state.count + count, max) });
      this.arrowTriggerCount++;
    }

    if (!this.mouseDownTimeout) {
      this.mouseDownTimeout = window.setTimeout(() => {
        this.mouseDownInterval = window.setInterval(() => {
          this.onAddPotion(this.arrowTriggerCount < ModifyFastCount ? 1 : ModifyFastMultiplier);
        }, ModifyQuestXPRepeatTime);
      }, ModifyQuestXPDelayTime);
    }
  }

  private handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const maxToSpend: number = Math.min(this.getMaxSpendAmount(), this.getOwnedAmount());
    const count: number = Math.max(0, Math.min(Number(e.target.value), maxToSpend));
    this.setState({ count: Number.isNaN(count) ? 0 : count });
  }

  private onClose() {
    this.props.dispatch(hideOverlay(Overlay.SpendQuestXPPotions));
  }

  private async onUsePotionClick(perk: PerkDefGQL) {
    if (this.state.count <= 0) {
      return;
    }

    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);

    this.setState({ isSpending: true });
    const res = await ProfileAPI.RedeemQuestXPPerk(webConf, perk?.id, this.props.quest.id, this.state.count);
    if (!res.ok) {
      this.props.dispatch(showError(res));
    } else {
      this.props.dispatch(startProfileRefresh());
      this.props.dispatch(hideOverlay(Overlay.SpendQuestXPPotions));
    }
    this.setState({ isSpending: false });
  }

  private getPerk(): PerkDefGQL {
    return Object.values(this.props.perksByID).find((perkDef) => {
      return perkDef.perkType == PerkType.QuestXP && perkDef.questType == this.props.quest.questType;
    });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { quests, champions, perks } = state.profile;
  const championInfos = state.championInfo.champions;
  const quest = state.store.spendXPPotionQuest;
  const { perksByID } = state.store;
  const { championCostumes } = state.championInfo;
  const { currentBattlePass } = state.quests;

  return {
    ...ownProps,
    quests,
    currentBattlePass,
    stringTable,
    quest,
    champions,
    championInfos,
    championCostumes,
    perksByID,
    perks
  };
}

export const SpendQuestXPPotionsModal = connect(mapStateToProps)(ASpendQuestXPPotionsModal);
