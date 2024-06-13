/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Dispatch } from 'redux';
import { QuestDefGQL, QuestType } from '@csegames/library/dist/hordetest/graphql/schema';
import { StringIDGeneralBP, StringIDGeneralXP, getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { ExperienceBar } from '../../shared/ExperienceBar';

const QuestContainer = 'GameStats-PlayerProgression-QuestContainer';
const QuestResourceBar = 'GameStats-PlayerProgression-QuestResourceBar';
const BattlePassCurrentTierContainer = 'GameStats-PlayerProgression-BattlePassCurrentTierContainer';
const BattlePassCurrentTierLabel = 'GameStats-PlayerProgression-BattlePassCurrentTierLabel';
const BattlePassCurrentTier = 'GameStats-PlayerProgression-BattlePassCurrentTier';
const ChampionLevelContainer = 'GameStats-PlayerProgression-ChampionLevelContainer';
const TitleAndBarContainer = 'GameStats-PlayerProgression-QuestBar-TitleAndBarContainer';
const TitleContainer = 'GameStats-PlayerProgression-QuestBar-TitleContainer';
const Title = 'GameStats-PlayerProgression-QuestBar-Title';
const NextLevelContainer = 'GameStats-PlayerProgression-QuestBar-NextLevelContainer';
const NextLevelXP = 'GameStats-PlayerProgression-QuestBar-NextLevelXP';

const StringIDBattlePassTierLabel = 'BattlePassTierLabel';
const StringIDGameStatsToNextLevel = 'GameStatsToNextLevel';

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
  initialLevel: number;
  initialXP: number;
  endingLevel: number;
  endingXP: number;
  questDef: QuestDefGQL;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAnimatedQuestBar extends React.Component<Props, State> {
  private animTimeout: number = null;
  private xpAnimTimer: number = null;
  private isAnimationHandled: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = this.getNewState(true);
  }

  public render() {
    const xpForLevels: number[] = this.props.questDef.links.map((link) => {
      return link.progress;
    });

    return (
      <div className={QuestContainer}>
        {this.renderLevel()}
        <div className={TitleAndBarContainer}>
          <div className={TitleContainer}>
            <div className={Title}>{this.props.questDef.name}</div>
            {this.renderNextLevelText()}
          </div>
          <ExperienceBar
            className={`${QuestResourceBar}`}
            current={this.state.barXP}
            level={this.state.barLevel}
            xpForLevels={xpForLevels}
            hideText={true}
            suppressMaxStyle={true}
            fillStyle={this.props.questDef.questType.toString()}
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
      </div>
    );
  }

  private renderNextLevelText(): JSX.Element {
    if (this.state.emblemLevel != this.props.endingLevel || this.props.endingLevel > this.props.questDef.links.length) {
      return null;
    }

    const xpDescriptionID =
      this.props.questDef.questType == QuestType.BattlePass ? StringIDGeneralBP : StringIDGeneralXP;

    return (
      <div className={NextLevelContainer}>
        {this.props.questDef.links[this.props.endingLevel - 1].progress - this.props.endingXP}
        <span className={`${NextLevelXP} ${this.props.questDef.questType}`}>
          {getStringTableValue(xpDescriptionID, this.props.stringTable)}
        </span>
        {getStringTableValue(StringIDGameStatsToNextLevel, this.props.stringTable)}
      </div>
    );
  }

  private renderLevel(): JSX.Element {
    const displayLevel = Math.min(this.props.questDef.links.length, this.state.emblemLevel);

    if (this.props.questDef.questType == QuestType.BattlePass) {
      return (
        <div className={BattlePassCurrentTierContainer}>
          <span className={BattlePassCurrentTier}>{displayLevel}</span>
          <span className={BattlePassCurrentTierLabel}>
            {getStringTableValue(StringIDBattlePassTierLabel, this.props.stringTable)}
          </span>
        </div>
      );
    } else if (this.props.questDef.questType == QuestType.Champion) {
      const maxLevel = this.state.emblemLevel <= this.props.questDef.links.length ? '' : 'MaxLevel';
      return <span className={`${ChampionLevelContainer} ${maxLevel}`}>{displayLevel}</span>;
    }
  }

  componentDidMount(): void {
    // If we want to animate the display, queue the animation.
    if (this.shouldAnimate()) {
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
    if (this.shouldAnimate() && !this.isAnimationHandled) {
      const newState = this.getNewState(true);

      // If the animateFrom values have changes and we haven't started animating yet, update our current state so we start
      // from the right spot when the animation finally kicks in!
      if (
        this.props.initialLevel !== prevProps.initialLevel ||
        this.props.endingLevel !== prevProps.endingLevel ||
        this.props.initialXP !== prevProps.initialXP ||
        this.props.endingXP !== prevProps.endingXP
      ) {
        this.setState(newState);
      }

      if (newState.barLevel !== this.state.barLevel || newState.barXP !== this.state.barXP) {
        this.startAnimation();
      }
    }
  }

  private shouldAnimate(): boolean {
    return this.props.initialLevel != this.props.endingLevel || this.props.initialXP != this.props.endingXP;
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

  private getNewState(isInit?: boolean): State {
    const barLevel = isInit ? this.props.initialLevel : this.props.endingLevel;
    const atMaxLevel = barLevel > this.props.questDef.links.length;
    const barMaxXP = atMaxLevel ? 100 : this.props.questDef.links[barLevel - 1].progress;

    let barXP: number = isInit ? this.props.initialXP : this.props.endingXP;
    if (!this.shouldAnimate() && atMaxLevel) {
      barXP = barMaxXP;
    }

    return {
      barLevel: barLevel,
      barMaxLevel: this.props.questDef.links.length,
      barXP: barXP,
      barMaxXP: barMaxXP,
      // The emblems initialize the same as the XP bar, but after that we want to control them separately.
      emblemLevel: isInit ? barLevel : this.state.emblemLevel,
      emblemXP: isInit ? barXP : this.state.emblemXP,
      emblemMaxXP: isInit ? barMaxXP : this.state.emblemMaxXP
    };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const AnimatedQuestBar = connect(mapStateToProps)(AAnimatedQuestBar);
