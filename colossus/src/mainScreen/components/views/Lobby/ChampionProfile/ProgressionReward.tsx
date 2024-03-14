/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Dispatch } from 'redux';
import {
  ChampionInfo,
  OvermindSummaryGQL,
  PerkDefGQL,
  PerkType,
  QuestGQL,
  QuestLinkDefGQL,
  PerkRewardDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../../redux/questSlice';
import { findChampionQuestProgress, findChampionQuest } from '../../../../helpers/characterHelpers';
import { getRewardTypeText } from '../BattlePass/BattlePassUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';

const Container = 'ChampionProfile-ProgressionReward-Container';
const Title = 'ChampionProfile-ProgressionReward-RewardTitle';
const RewardContainer = 'ChampionProfile-ProgressionReward-RewardContainer';
const RewardTextContainer = 'ChampionProfile-ProgressionReward-RewardTextContainer';
const RewardIcon = 'ChampionProfile-ProgressionReward-RewardIcon';
const RewardName = 'ChampionProfile-ProgressionReward-RewardTitle';
const RewardLevel = 'ChampionProfile-ProgressionReward-RewardLevel';
const RewardDescription = 'ChampionProfile-ProgressionReward-RewardDescription';
const PageControls = 'ChampionProfile-ProgressionReward-PageControls';
const PageControl = 'ChampionProfile-ProgressionReward-PageControl';
const PageArrow = 'ChampionProfile-ProgressionReward-Arrow';

const StringIDRewardCollectionChampionMaxLevel = 'RewardCollectionChampionMaxLevel';
const StringIDRewardCollectionNextLevelReward = 'RewardCollectionNextLevelReward';
const StringIDRewardCollectionRewardUnlocked = 'RewardCollectionRewardUnlocked';
const StringIDRewardCollectionChampionLevelReward = 'RewardCollectionChampionLevelReward';

interface RewardAndLevel {
  reward: PerkRewardDefGQL;
  level: number;
  questLink: QuestLinkDefGQL;
}

interface ReactProps {
  nextReward?: boolean;
}

interface InjectedProps {
  overmindSummary: OvermindSummaryGQL;
  selectedChampion: ChampionInfo;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  playerName: string;
  championIDToChampion: { [championID: string]: ChampionInfo };
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  reward: RewardAndLevel;
  sortedRewards: RewardAndLevel[];
  currentRewardIndex: number;
  maxLevel: number;
}

export class AProgressionReward extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      reward: null,
      sortedRewards: [],
      currentRewardIndex: 0,
      maxLevel: 0
    };
  }

  public componentDidMount(): void {
    let champion: ChampionInfo = null;
    if (this.props.selectedChampion) {
      champion = this.props.selectedChampion;
    } else if (this.props.overmindSummary) {
      const characterSummary = this.props.overmindSummary.characterSummaries.find(
        (c) => c.userName == this.props.playerName
      );

      champion = this.props.championIDToChampion[characterSummary?.classID];
    }

    const questGQL = findChampionQuestProgress(champion, this.props.questsGQL);
    const quest = findChampionQuest(champion, this.props.quests.Champion);

    const rewards = this.getSortedRewards(quest?.links, questGQL);
    this.setState({
      sortedRewards: rewards,
      reward: rewards ? rewards[0] : null,
      maxLevel: (quest?.links?.length ?? 0) - 1
    });
  }

  public render() {
    if (!this.state.reward) {
      return null;
    }
    const level =
      this.state.reward?.level == this.state.maxLevel
        ? getStringTableValue(StringIDRewardCollectionChampionMaxLevel, this.props.stringTable)
        : this.state.reward?.level + 2;
    const title = this.props.nextReward
      ? getStringTableValue(StringIDRewardCollectionNextLevelReward, this.props.stringTable)
      : getStringTableValue(StringIDRewardCollectionRewardUnlocked, this.props.stringTable);
    const endStatTitle = this.props.nextReward ? '' : 'EndStatTitle';
    const nextReward = this.props.nextReward ? 'NextReward' : '';
    const rewardType = getRewardTypeText(this.state.reward.reward, this.props.stringTable, this.props.perksByID);

    return (
      <div className={`${Container} ${nextReward}`}>
        <span className={`${Title} TopTitle ${endStatTitle}`}>{title}</span>
        <div className={RewardContainer}>
          {this.getPerkIcon()}
          <div className={RewardTextContainer}>
            <span className={RewardName}>{this.getRewardName()}</span>
            <span className={RewardLevel}>
              {getTokenizedStringTableValue(StringIDRewardCollectionChampionLevelReward, this.props.stringTable, {
                CHAMPION_LEVEL: level.toString()
              })}
            </span>
            <span className={RewardLevel}>{rewardType}</span>
            <span className={RewardDescription}>{this.getRewardDescription()}</span>
          </div>
        </div>
        {this.renderPageControls()}
      </div>
    );
  }

  private getRewardName(): string {
    const { reward } = this.state;

    if (reward.questLink.rewardNameOverride?.length > 0) {
      return reward.questLink.rewardNameOverride;
    }

    const perk = this.props.perksByID[this.state.reward?.reward?.perkID];
    return `${perk?.name}${perk?.perkType === PerkType.Currency ? ` × ${this.state.reward?.reward?.qty}` : ''}`;
  }

  private getRewardDescription(): string {
    const { reward } = this.state;

    if (reward.questLink.rewardDescriptionOverride?.length > 0) {
      return reward.questLink.rewardDescriptionOverride;
    }

    const perk = this.props.perksByID[this.state.reward?.reward?.perkID];
    return perk?.description;
  }

  private getPerkIcon(): JSX.Element {
    const { reward } = this.state;
    const perk = this.props.perksByID[reward.reward?.perkID];

    const iconURL =
      reward.questLink.rewardImageOverride?.length > 0
        ? reward.questLink.rewardImageOverride
        : perk?.perkType === PerkType.Portrait
        ? perk?.portraitThumbnailURL
        : perk?.iconURL;
    if (iconURL) {
      return <img className={RewardIcon} src={iconURL} />;
    }
    return null;
  }

  private getSortedRewards(links: QuestLinkDefGQL[], questGQL: QuestGQL): RewardAndLevel[] {
    if (this.state.sortedRewards.length <= 0 && links) {
      const currentQuestIndex = questGQL?.currentQuestIndex ?? 0;
      const nextCollection = questGQL?.nextCollection ?? 0;

      // We want to show the next link's reward(s)
      if (this.props.nextReward) {
        let linkIndex: number = currentQuestIndex;
        const rewards: RewardAndLevel[] = [];
        links[linkIndex].rewards.forEach((r) =>
          rewards.push({
            reward: r,
            level: linkIndex,
            questLink: links[linkIndex]
          })
        );
        if (rewards.length > 0) {
          rewards.sort((a, b) => this.compareRewardAndLevel(a, b));
          return rewards;
        }
      }
      // We want to show the next collection rewards
      else {
        let linkIndex: number = nextCollection;
        const rewards: RewardAndLevel[] = [];
        for (linkIndex; linkIndex < currentQuestIndex; linkIndex++) {
          links[linkIndex].rewards.forEach((r) =>
            rewards.push({
              reward: r,
              level: linkIndex,
              questLink: links[linkIndex]
            })
          );
        }
        if (rewards.length > 0) {
          rewards.sort((a, b) => this.compareRewardAndLevel(a, b));
          return rewards;
        }
      }
    } else {
      return null;
    }
  }

  private compareRewardAndLevel(a: RewardAndLevel, b: RewardAndLevel): number {
    if (a.level == b.level) {
      const perkA = this.props.perksByID[a.reward.perkID];
      const perkB = this.props.perksByID[b.reward.perkID];
      return perkA.name.localeCompare(perkB.name);
    }
    return a.level - b.level;
  }

  private renderPageControls(): React.ReactNode {
    const numPages = Math.ceil(this.state.sortedRewards?.length);
    if (numPages <= 1) {
      return null;
    }

    const firstPage: string = this.state.currentRewardIndex == 0 ? 'endPage' : '';
    const lastPage: string = this.state.currentRewardIndex >= numPages - 1 ? 'endPage' : '';

    const pageIsSelected: boolean[] = [];
    for (let i = 0; i < numPages; ++i) {
      pageIsSelected[i] = i === this.state.currentRewardIndex;
    }
    return (
      <div className={PageControls} style={{ marginTop: `2vmin` }}>
        <div
          className={`${PageArrow} ${firstPage} fs-icon-misc-chevron-left`}
          onClick={this.onLeftArrowClick.bind(this)}
        />
        {pageIsSelected.map((isSelected, page) => {
          return (
            <div
              className={`${PageControl} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                this.setState({
                  reward: this.state.sortedRewards[page],
                  currentRewardIndex: page
                });
              }}
              key={page}
            />
          );
        })}
        <div
          className={`${PageArrow} ${lastPage} fs-icon-misc-chevron-right`}
          onClick={this.onRightArrowClick.bind(this)}
        />
      </div>
    );
  }

  private onLeftArrowClick() {
    if (this.state.currentRewardIndex > 0) {
      this.setState({
        reward: this.state.sortedRewards[this.state.currentRewardIndex - 1],
        currentRewardIndex: this.state.currentRewardIndex - 1
      });
    }
  }

  private onRightArrowClick() {
    if (this.state.currentRewardIndex > -1 && this.state.currentRewardIndex < this.state.sortedRewards.length - 1) {
      this.setState({
        reward: this.state.sortedRewards[this.state.currentRewardIndex + 1],
        currentRewardIndex: this.state.currentRewardIndex + 1
      });
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const overmindSummary = state.gameStats.overmindSummary;
  const { selectedChampion } = state.championInfo;
  const { quests } = state.profile;
  const questsByType = state.quests.quests;
  const playerName = state.player.name;
  const { championIDToChampion } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    overmindSummary,
    selectedChampion,
    questsGQL: quests,
    quests: questsByType,
    playerName,
    championIDToChampion,
    perksByID,
    stringTable
  };
}

export const ProgressionReward = connect(mapStateToProps)(AProgressionReward);
