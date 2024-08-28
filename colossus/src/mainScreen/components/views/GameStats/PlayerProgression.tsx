/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Dispatch } from 'redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  OvermindCharacter,
  OvermindSummaryGQL,
  PerkDefGQL,
  PerkType,
  QuestDefGQL,
  QuestGQL,
  QuestProgress,
  QuestStatus,
  QuestType
} from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../redux/questSlice';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { showError } from '../../../redux/navigationSlice';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { findChampionQuestProgress, findChampionQuest } from '../../../helpers/characterHelpers';
import {
  StringIDGeneralBP,
  StringIDGeneralNew,
  StringIDGeneralQty,
  StringIDGeneralXP,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { addQuestAsClaimed } from '../../../redux/gameStatsSlice';
import { createAlertsForCollectedQuestProgress } from '../../../helpers/perkUtils';
import { AnimatedQuestBar } from './AnimatedQuestBar';
import TooltipSource from '../../../../shared/components/TooltipSource';
import { webConf } from '../../../dataSources/networkConfiguration';

const Tab = 'GameStats-PlayerProgression-Tab';
const Container = 'GameStats-PlayerProgression-Container';
const AllExperienceContainer = 'GameStats-PlayerProgression-AllExperienceContainer';
const ExperienceLineContainer = 'GameStats-PlayerProgression-ExperienceLineContainer';
const ExperienceLineContainerHeader = 'GameStats-PlayerProgression-ExperienceLineContainerHeader';
const ExperienceGainedTitle = 'GameStats-PlayerProgression-ExperienceGainedTitle';
const ExperienceGainedTitleHeader = 'GameStats-PlayerProgression-ExperienceGainedTitleHeader';
const ExperienceGainedAmountXP = 'GameStats-PlayerProgression-ExperienceGainedAmountXP';
const ExperienceGainedAmount = 'GameStats-PlayerProgression-ExperienceGainedAmount';
const ExperienceGainedAmountHeader = 'GameStats-PlayerProgression-ExperienceGainedAmountHeader';
const ChampionContainer = 'GameStats-PlayerProgression-ChampionContainer';
const ChampionImage = 'GameStats-PlayerProgression-ChampionImage';
const ChampionPlaque = 'GameStats-PlayerProgression-ChampionPlaque';
const ChampionIcon = 'GameStats-PlayerProgression-ChampionIcon';
const PlayerNameContainer = 'GameStats-PlayerProgression-PlayerNameContainer';
const PlayerName = 'GameStats-PlayerProgression-PlayerName';
const ChampionName = 'GameStats-PlayerProgression-ChampionName';
const RewardsContainer = 'GameStats-PlayerProgression-RewardsContainer';
const RewardsNewTitle = 'GameStats-PlayerProgression-RewardsNewTitle';
const Reward = 'GameStats-PlayerProgression-Reward';
const RewardBackground = 'GameStats-PlayerProgression-RewardBackground';
const RewardIcon = 'GameStats-PlayerProgression-RewardIcon';
const RewardCount = 'GameStats-PlayerProgression-RewardCount';

const RewardTooltipSource = 'GameStats-PlayerProgression-RewardTooltipSource';
const ToolTipContainer = 'GameStats-PlayerProgression-ToolTipContainer';
const ToolTipName = 'GameStats-PlayerProgression-ToolTipName';
const TooltipDescription = 'GameStats-PlayerProgression-TooltipDescription';

const StringIDPlayerProgressionExperienceTitle = 'PlayerProgressionExperienceTitle';
const StringIDPlayerProgressionProgressAmount = 'PlayerProgressionProgressAmount';
const StringIDPlayerProgressionBattlePassProgressAmount = 'PlayerProgressionBattlePassProgressAmount';
const StringIDBattlePassMatchPoints = 'PlayerProgressionBattlePassMatchPoints';
const StringIDBattlePassQuestTitle = 'PlayerProgressionBattlePassQuestTitle';

interface ReactProps {
  shouldAnimateExperienceBars: boolean;
}

interface InjectedProps {
  overmindSummary: OvermindSummaryGQL;
  pendingQuestClaims: Dictionary<boolean>;
  playerName: string;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  questsProgress: QuestGQL[];
  questsByID: Dictionary<QuestDefGQL>;
  perksByID: Dictionary<PerkDefGQL>;
  championIDToChampion: { [championID: string]: ChampionInfo };
  stringTable: Dictionary<StringTableEntryDef>;
  accountID: string;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APlayerProgression extends React.Component<Props> {
  public render() {
    const characterSummary = this.props.overmindSummary.characterSummaries.find(
      (c) => c.userName == this.props.playerName
    );

    const champion = this.props.championIDToChampion[characterSummary?.classID];
    const quest = findChampionQuest(champion, this.props.quests.Champion);
    const questProg = characterSummary?.questProgress?.find((q) => q.id == quest?.id);
    const questGQL = findChampionQuestProgress(champion, this.props.questsGQL);

    return (
      <div className={Tab}>
        {this.getChampion(characterSummary, champion)}
        <div className={Container}>
          <div className={AllExperienceContainer}>
            {this.getChampionProgressionBar(quest, questProg, questGQL)}
            {this.getChampionExperienceList(quest, questProg)}
            {this.getBPInfo(characterSummary)}
          </div>
          {this.getRewards(quest, questProg, questGQL)}
        </div>
      </div>
    );
  }

  private getChampion(characterSummary: OvermindCharacter, champion: ChampionInfo): JSX.Element {
    if (characterSummary == null || champion == null) {
      return null;
    }

    const costume = this.props.championCostumes.find((c) => c.id == characterSummary.raceID);
    if (costume == null) {
      return null;
    }

    const portrait =
      this.props.perksByID[characterSummary.portraitPerkID]?.portraitThumbnailURL ?? costume.thumbnailURL;

    return (
      <div className={ChampionContainer}>
        <img className={ChampionImage} src={costume.standingImageURL} />
        <div className={ChampionPlaque}>
          <div className={ChampionIcon} style={{ backgroundImage: `url(${portrait})` }} />
          <div className={PlayerNameContainer}>
            <div className={PlayerName}>{characterSummary.userName}</div>
            <div className={ChampionName}>{champion.name}</div>
          </div>
        </div>
      </div>
    );
  }

  private getChampionProgressionBar(quest: QuestDefGQL, questProg: QuestProgress, questGQL: QuestGQL): JSX.Element {
    if (!quest || !questGQL) {
      return null;
    }

    // we know about a champion quest, but no progress was made.  To simplify the rest of the code
    // make a dummy questProg here that says we made no progress
    if (!questProg) {
      questProg = {
        id: quest.id,
        previousIndex: questGQL.currentQuestIndex,
        previousProgress: questGQL.currentQuestProgress,
        progressAdded: 0,
        progressDetails: null
      };
    }

    return (
      <AnimatedQuestBar
        questDef={quest}
        initialLevel={
          this.props.shouldAnimateExperienceBars ? questProg.previousIndex + 1 : questGQL.currentQuestIndex + 1
        }
        endingLevel={questGQL.currentQuestIndex + 1}
        initialXP={this.props.shouldAnimateExperienceBars ? questProg.previousProgress : questGQL.currentQuestProgress}
        endingXP={questGQL.currentQuestProgress}
      />
    );
  }

  private getChampionExperienceList(quest: QuestDefGQL, questProg: QuestProgress): JSX.Element {
    const progresses: JSX.Element[] = [];
    if (questProg) {
      let index = 0;
      const sortedDetails = [...questProg.progressDetails].sort((a, b) => a.name.localeCompare(b.name));
      for (const questDetails of sortedDetails) {
        const shadeStyle = index % 2 == 0 ? 'ShadeEntry' : '';
        index++;

        const tokens: Dictionary<string> = {
          XP_AMOUNT: `${addCommasToNumber(questDetails.amount)}`
        };
        progresses.push(
          <div className={`${ExperienceLineContainer} ${shadeStyle}`}>
            <span className={ExperienceGainedTitle}>{questDetails.name}</span>
            <span className={ExperienceGainedAmount}>
              {getTokenizedStringTableValue(StringIDPlayerProgressionProgressAmount, this.props.stringTable, tokens)}
            </span>
          </div>
        );
      }
    }

    if (progresses.length == 0) {
      return null;
    }

    return (
      <>
        {this.getExperienceLinesHeader(QuestType.Champion, questProg.progressAdded)}
        {progresses}
      </>
    );
  }

  private getExperienceLinesHeader(questType: QuestType, questProg: number): JSX.Element {
    const xpDescriptionID = questType == QuestType.BattlePass ? StringIDGeneralBP : StringIDGeneralXP;

    return (
      <div className={ExperienceLineContainerHeader}>
        <span className={ExperienceGainedTitleHeader}>
          {getStringTableValue(StringIDPlayerProgressionExperienceTitle, this.props.stringTable)}
        </span>
        <span className={ExperienceGainedAmountHeader}>
          +{addCommasToNumber(questProg)}
          <span className={`${ExperienceGainedAmountXP} ${questType}`}>
            {getStringTableValue(xpDescriptionID, this.props.stringTable)}
          </span>
        </span>
      </div>
    );
  }

  private getBPInfo(characterSummary: OvermindCharacter): JSX.Element {
    const bpMatchProg = characterSummary?.questProgress.find(
      (questprog) => this.props.questsByID[questprog.id].questType === QuestType.BattlePass
    );
    const bp = this.props.questsByID[bpMatchProg?.id] ?? null;
    if (!bp) {
      return null;
    }

    const endingLevelAndXP = this.getBPLevelAndXP(bp, bpMatchProg, characterSummary);

    return (
      <>
        <AnimatedQuestBar
          questDef={bp}
          initialLevel={this.props.shouldAnimateExperienceBars ? bpMatchProg.previousIndex + 1 : endingLevelAndXP[0]}
          endingLevel={endingLevelAndXP[0]}
          initialXP={this.props.shouldAnimateExperienceBars ? bpMatchProg.previousProgress : endingLevelAndXP[1]}
          endingXP={endingLevelAndXP[1]}
        />
        {this.getCompletedQuestsLines(bpMatchProg)}
      </>
    );
  }

  private getCompletedQuestsLines(bpMatchProg: QuestProgress): JSX.Element {
    const quests: JSX.Element[] = [];
    let totalXP: number = 0;
    let index: number = 0;

    if (bpMatchProg && bpMatchProg.progressAdded) {
      // Currently we only have this one chunk for match BP experience, if we later want to split it up like we do
      // for champion experience, we will need to sort through the progressDetails on bpMatchProg and remove this section
      // so we don't double count/display their EXP again.
      const tokens: Dictionary<string> = {
        XP_AMOUNT: `${addCommasToNumber(bpMatchProg.progressAdded)}`
      };

      const shadeStyle = index++ % 2 == 0 ? 'ShadeEntry' : '';
      totalXP += bpMatchProg.progressAdded;
      quests.push(
        <div className={`${ExperienceLineContainer} ${shadeStyle}`}>
          <span className={ExperienceGainedTitle}>
            {getStringTableValue(StringIDBattlePassMatchPoints, this.props.stringTable)}
          </span>
          <span className={`${ExperienceGainedAmount} BattlePass`}>
            {getTokenizedStringTableValue(
              StringIDPlayerProgressionBattlePassProgressAmount,
              this.props.stringTable,
              tokens
            )}
          </span>
        </div>
      );
    }

    this.props.questsProgress.forEach((questprog) => {
      // If it is a daily quest, completed, and has rewards to claim.
      if (
        (this.props.questsByID[questprog.id].questType == QuestType.DailyNormal ||
          this.props.questsByID[questprog.id].questType == QuestType.DailyHard) &&
        questprog.questStatus === QuestStatus.Completed &&
        questprog.nextCollection < this.props.questsByID[questprog.id].links.length
      ) {
        const shadeStyle = index++ % 2 == 0 ? 'ShadeEntry' : '';
        totalXP += this.getXPRewardForBattlePassQuest(this.props.questsByID[questprog.id]);
        quests.push(this.getBPQuestLine(questprog, this.props.questsByID[questprog.id], shadeStyle));
        return;
      }
    });

    return (
      <>
        {this.getExperienceLinesHeader(QuestType.BattlePass, totalXP)}
        {quests}
      </>
    );
  }

  private getXPRewardForBattlePassQuest(quest: QuestDefGQL): number {
    const link = quest.links[0];
    return (
      link?.rewards.filter((reward) => this.props.perksByID[reward.perkID].perkType === PerkType.CurrentBattlePassXP)[0]
        ?.qty ?? 0
    );
  }

  private getBPQuestLine(questprog: QuestGQL, quest: QuestDefGQL, shadeStyle: string) {
    const xp = this.getXPRewardForBattlePassQuest(quest);
    const tokens: Dictionary<string> = {
      XP_AMOUNT: `${addCommasToNumber(xp)}`,
      QUEST_NAME: quest.name
    };

    if (questprog.currentQuestIndex > questprog.nextCollection && !this.props.pendingQuestClaims[questprog.id]) {
      this.props.dispatch(addQuestAsClaimed(questprog.id));
      this.claimReward(quest, questprog);
    }
    return (
      <div className={`${ExperienceLineContainer} ${shadeStyle}`}>
        <span className={ExperienceGainedTitle}>
          {getTokenizedStringTableValue(StringIDBattlePassQuestTitle, this.props.stringTable, tokens)}
        </span>
        <span className={`${ExperienceGainedAmount} BattlePass`}>
          {getTokenizedStringTableValue(
            StringIDPlayerProgressionBattlePassProgressAmount,
            this.props.stringTable,
            tokens
          )}
        </span>
      </div>
    );
  }

  private getCompletedQuestPointTotal(bpMatchProg: QuestProgress, characterSummary: OvermindCharacter): number {
    // add in the BP progress from the match itself
    let total: number = bpMatchProg?.progressAdded ?? 0;

    // add in the BP progress from quest completions
    characterSummary?.questProgress.forEach((csqp) => {
      const questprog = this.props.questsProgress.find((qp) => qp.id === csqp.id);
      if (questprog?.questStatus === QuestStatus.Completed) {
        const quest = this.props.questsByID[questprog.id];
        if (quest && questprog.nextCollection < quest.links.length) {
          const link = quest.links[questprog.nextCollection];
          const xp =
            link?.rewards.filter(
              (reward) => this.props.perksByID[reward.perkID].perkType === PerkType.CurrentBattlePassXP
            )[0]?.qty ?? 0;
          total += xp;
        }
      }
      return;
    });

    return total;
  }

  private async claimReward(quest: QuestDefGQL, questProgress: QuestGQL) {
    const res = await ProfileAPI.CollectQuestReward(webConf, quest.id);
    if (!res.ok) {
      console.error('failed to claim all progression rewards');
      this.props.dispatch(showError(res));
    } else {
      createAlertsForCollectedQuestProgress(
        quest,
        questProgress,
        this.props.perksByID,
        this.props.champions,
        this.props.dispatch
      );
    }
  }

  private getBPLevelAndXP(
    bp: QuestDefGQL,
    bpMatchProg: QuestProgress,
    characterSummary: OvermindCharacter
  ): [number, number] {
    let i = bpMatchProg.previousIndex;
    let curEXP = this.getCompletedQuestPointTotal(bpMatchProg, characterSummary) + bpMatchProg.previousProgress;
    for (curEXP; i < bp.links.length && curEXP >= bp.links[i].progress; ) {
      curEXP -= bp.links[i].progress;
      i++;
    }
    return [Math.min(bp.links.length, i + 1), curEXP];
  }

  private getRewards(quest: QuestDefGQL, questProg: QuestProgress, questGQL: QuestGQL): JSX.Element {
    if (!questProg || !questGQL || !quest) {
      return null;
    }
    // If this quest has leveled up:
    if (questGQL.currentQuestIndex > questProg.previousIndex) {
      const rewards: JSX.Element[] = [];
      for (let i = questProg.previousIndex; i < questGQL.currentQuestIndex; ++i) {
        quest.links[i].rewards.forEach((r) => {
          const perk = this.props.perksByID[r.perkID];
          // Rune Tier Keys are not displayed as reward items.
          if (perk && perk.perkType !== PerkType.RuneModTierKey) {
            const perkIcon = perk.perkType == PerkType.Portrait ? perk.portraitThumbnailURL : perk.iconURL;
            rewards.push(
              <TooltipSource
                className={RewardTooltipSource}
                key={perk.id}
                tooltipParams={{
                  id: `${perk.id}`,
                  content: this.renderPerkTooltip.bind(this, perk)
                }}
              >
                <div className={Reward}>
                  {(perk.backgroundURL?.length ?? 0) > 0 && (
                    <img className={RewardBackground} src={perk.backgroundURL} />
                  )}
                  <div className={`${RewardIcon} ${perk.perkType}`} style={{ backgroundImage: `url(${perkIcon})` }}>
                    {r.qty > 1 && (
                      <span className={RewardCount}>
                        {getTokenizedStringTableValue(StringIDGeneralQty, this.props.stringTable, {
                          QTY: r.qty.toString()
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </TooltipSource>
            );
          }
        });
      }

      if (this.props.shouldAnimateExperienceBars) {
        this.claimReward(quest, questGQL);
      }

      if (rewards.length > 0) {
        return (
          <div className={RewardsContainer}>
            <span className={RewardsNewTitle}>{getStringTableValue(StringIDGeneralNew, this.props.stringTable)}</span>
            {rewards}
          </div>
        );
      }
    }

    return null;
  }

  private renderPerkTooltip(perk: PerkDefGQL): JSX.Element {
    return (
      <div className={ToolTipContainer}>
        <span className={ToolTipName}>{perk.name}</span>
        <span className={TooltipDescription}>{perk.description}</span>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { overmindSummary, pendingQuestClaims } = state.gameStats;
  const { quests } = state.profile;
  const questsProgress = state.profile.quests;
  const questsByType = state.quests.quests;
  const { questsById } = state.quests;
  const { perksByID } = state.store;
  const playerName = state.player.name;
  const { championIDToChampion } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { accountID } = state.player;
  const { championCostumes, champions } = state.championInfo;

  return {
    ...ownProps,
    overmindSummary,
    pendingQuestClaims,
    playerName,
    questsGQL: quests,
    quests: questsByType,
    questsProgress,
    questsByID: questsById,
    perksByID,
    championIDToChampion,
    stringTable,
    accountID,
    championCostumes,
    champions
  };
}

export const PlayerProgression = connect(mapStateToProps)(APlayerProgression);
