/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Dispatch } from 'redux';
import { ChampionInfo, OvermindSummaryGQL, QuestGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../../redux/questSlice';
import { showRightPanel } from '../../../../redux/navigationSlice';
import { ProgressionInfo } from '../../../rightPanel/ProgressionInfo';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { findChampionQuestProgress, findChampionQuest } from '../../../../helpers/characterHelpers';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { ExperienceBar } from '../../../shared/ExperienceBar';

const ProgressionContainer = 'ChampionProfile-ChampionProgressionLevel-ProgressionContainer';
const ProgressionLevel = 'ChampionProfile-ChampionProgressionLevel-ProgressionLevel';
const ProgressionProgressContainer = 'ChampionProfile-ChampionProgressionLevel-ProgressionProgressContainer';
const ProgressionLevelContainer = 'ChampionProfile-ChampionProgressionLevel-ProgressionLevelContainer';
const ProgressionBadge = 'ChampionProfile-ChampionProgressionLevel-ProgressionBadge';
const ProgressionExperience = 'ChampionProfile-ChampionProgressionLevel-ProgressionExperience';
const ProgressionExperienceBar = 'ChampionProfile-ChampionProgressionLevel-ProgressionExperienceBar';
const ProgressionArrow = 'ChampionProfile-ChampionProgressionLevel-ProgressionArrow';

const StringIDChampionMaxLevel = 'ChampionProgressionMaxLevel';
const StringIDXPToNextLevel = 'ChampionProgressionXPToNextLevel';
const StringIDXPToMaxLevel = 'ChampionProgressionXPToMaxLevel';

interface State {
  // These are for the XP bar.
  barLevel: number;
  barMaxLevel: number;
  barXP: number;
  barMaxXP: number;
  // These are for the text outside the xp bar.
  emblemLevel: number;
  emblemXP: number;
  emblemMaxXP: number;
}

interface ReactProps {
  gameStats?: boolean;
  animateFrom?: [number, number];
}

interface InjectedProps {
  overmindSummary: OvermindSummaryGQL;
  selectedChampion: ChampionInfo;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  playerName: string;
  championIDToChampion: { [championID: string]: ChampionInfo };
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAnimatedChampionProgressionLevel extends React.Component<Props, State> {
  private animTimeout: number = null;
  private xpAnimTimer: number = null;
  private isAnimationHandled: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = this.getNewState(true);
  }

  public render() {
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
    const currentQuestIndex: number = questGQL?.currentQuestIndex ?? 0;
    const notMaxLevel = !quest || quest.links.length > currentQuestIndex;
    const gameStats = this.props.gameStats ? 'Gamestats' : '';
    const maxLevel = notMaxLevel ? '' : 'MaxLevel';

    return (
      <div className={ProgressionContainer} onClick={this.onProgressionClick.bind(this)}>
        <span className={`${ProgressionLevel} ${gameStats} ${maxLevel}`}>{this.state.emblemLevel}</span>
        <div className={ProgressionProgressContainer}>
          <div className={ProgressionLevelContainer}>
            <div className={ProgressionBadge} />
            <span className={`${ProgressionExperience} ${gameStats}`}>{this.getProgressText()}</span>
          </div>
          <ExperienceBar
            className={`${ProgressionExperienceBar} ${gameStats}`}
            current={this.state.barXP}
            level={this.state.barLevel}
            xpForLevels={quest.links.map((link) => {
              return link.progress;
            })}
            hideText={true}
            onLevelUpAnimationBegun={(newLevel: number, durationMS: number) => {
              this.setState({ emblemLevel: newLevel });
            }}
            onXPAnimationBegun={(xpFrom: number, xpTo: number, xpMax: number, durationMS: number) => {
              if (this.xpAnimTimer) {
                clearInterval(this.xpAnimTimer);
                this.xpAnimTimer = null;
              }
              const numSteps = 16;
              const xpStep = Math.ceil((xpTo - xpFrom) / numSteps);
              const tickDuration = Math.floor(durationMS / numSteps);
              this.setState({ emblemXP: xpFrom, emblemMaxXP: xpMax });
              this.xpAnimTimer = window.setInterval(() => {
                if (this.state.emblemXP < xpTo) {
                  this.setState({ emblemXP: Math.min(this.state.emblemXP + xpStep, xpTo) });
                } else {
                  clearInterval(this.xpAnimTimer);
                  this.xpAnimTimer = null;
                }
              }, tickDuration);
            }}
          />
        </div>
        <div className={`${ProgressionArrow} ${gameStats} fs-icon-misc-chevron-right`} />
      </div>
    );
  }

  componentDidMount(): void {
    // If we want to animate the display, queue the animation.
    if (this.props.animateFrom) {
      this.startAnimation();
    }
  }

  componentWillUnmount(): void {
    if (this.animTimeout) {
      clearTimeout(this.animTimeout);
      this.animTimeout = null;
    }

    if (this.xpAnimTimer) {
      clearInterval(this.xpAnimTimer);
      this.xpAnimTimer = null;
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If we should animate but haven't yet...
    if (this.props.animateFrom && !this.isAnimationHandled) {
      const newState = this.getNewState(true);

      // If the animateFrom values have changes and we haven't started animating yet, update our current state so we start
      // from the right spot when the animation finally kicks in!
      if (
        this.props.animateFrom[0] !== prevProps.animateFrom[0] ||
        this.props.animateFrom[1] !== prevProps.animateFrom[1]
      ) {
        this.setState(newState);
      }

      if (newState.barLevel !== this.state.barLevel || newState.barXP !== this.state.barXP) {
        this.startAnimation();
      }
    }
  }

  private startAnimation(): void {
    // There is no guarantee as to whether we will get the progress update or the champion update first.
    // By clearing the timeout, we ensure that we only animate the most recent data.
    if (this.animTimeout) {
      clearTimeout(this.animTimeout);
    }
    this.animTimeout = window.setTimeout(() => {
      this.isAnimationHandled = true;
      this.setState(this.getNewState());
      this.animTimeout = null;
    }, 1000);
  }

  private getProgressText(): string {
    if (this.state.barLevel < this.state.barMaxLevel) {
      const tokens: Dictionary<string> = {
        CURRENT_XP: `${addCommasToNumber(this.state.emblemXP)}`,
        MAX_XP: `${addCommasToNumber(this.state.emblemMaxXP)}`,
        NEXT_CHAMPION_LEVEL: `${this.state.emblemLevel + 1}`
      };
      if (this.state.barLevel + 1 < this.state.barMaxLevel) {
        // Next level is not max.
        return getTokenizedStringTableValue(StringIDXPToNextLevel, this.props.stringTable, tokens);
      } else {
        // Next level is max.
        return getTokenizedStringTableValue(StringIDXPToMaxLevel, this.props.stringTable, tokens);
      }
    } else {
      // Current level is max.
      return getStringTableValue(StringIDChampionMaxLevel, this.props.stringTable);
    }
  }

  private onProgressionClick(): void {
    this.props.dispatch(showRightPanel(<ProgressionInfo />));
  }

  private getNewState(isInit?: boolean): State {
    const dummyData: State = {
      barLevel: 1,
      barMaxLevel: 30,
      barXP: 0,
      barMaxXP: 100,
      emblemLevel: 1,
      emblemXP: 0,
      emblemMaxXP: 100
    };

    let champion: ChampionInfo = null;
    if (this.props.selectedChampion) {
      champion = this.props.selectedChampion;
    } else if (this.props.overmindSummary) {
      const characterSummary = this.props.overmindSummary.characterSummaries.find(
        (c) => c.userName == this.props.playerName
      );
      champion = this.props.championIDToChampion[characterSummary?.classID];
    }

    if (champion) {
      // Prepare xp data.
      const questGQL = findChampionQuestProgress(champion, this.props.questsGQL);
      const quest = findChampionQuest(champion, this.props.quests.Champion);

      if (!quest || !questGQL) {
        return dummyData;
      }

      const notMaxLevel = quest.links.length > questGQL.currentQuestIndex;
      const questLink = quest.links[questGQL.currentQuestIndex];

      let level = Math.min(quest.links.length, questGQL.currentQuestIndex + 1);
      let xp = notMaxLevel ? questGQL.currentQuestProgress : 100;
      let maxXP = notMaxLevel ? questLink.progress : 100;
      if (isInit && this.props.animateFrom) {
        level = this.props.animateFrom[0];
        xp = this.props.animateFrom[1];
        maxXP = quest.links[level - 1]?.progress ?? 100;
      }

      return {
        barLevel: level,
        barMaxLevel: quest.links.length,
        barXP: xp,
        barMaxXP: maxXP,
        // The emblems initialize the same as the XP bar, but after that we want to control them separately.
        emblemLevel: isInit || !this.props.animateFrom ? level : this.state.emblemLevel,
        emblemXP: isInit || !this.props.animateFrom ? xp : this.state.emblemXP,
        emblemMaxXP: isInit || !this.props.animateFrom ? maxXP : this.state?.emblemMaxXP
      };
    } else {
      return dummyData;
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

  return {
    ...ownProps,
    overmindSummary,
    selectedChampion,
    questsGQL: quests,
    quests: questsByType,
    playerName,
    championIDToChampion,
    stringTable
  };
}

export const AnimatedChampionProgressionLevel = connect(mapStateToProps)(AAnimatedChampionProgressionLevel);
