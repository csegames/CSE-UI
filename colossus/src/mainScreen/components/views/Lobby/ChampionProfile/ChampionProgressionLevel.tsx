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
  QuestGQL,
  QuestLinkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../../redux/questSlice';
import { ResourceBar } from '../../../shared/ResourceBar';
import { showRightPanel } from '../../../../redux/navigationSlice';
import { ProgressionInfo } from '../../../rightPanel/ProgressionInfo';
import { findChampionQuestProgress, findChampionQuest } from '../../../../helpers/characterHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import TooltipSource from '../../../../../shared/components/TooltipSource';
import { StringIDGeneralXPProgress, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

const ProgressionContainer = 'ChampionProfile-ChampionProgressionLevel-ProgressionContainer';
const ProgressionLevel = 'ChampionProfile-ChampionProgressionLevel-ProgressionLevel';
const ProgressionProgressContainer = 'ChampionProfile-ChampionProgressionLevel-ProgressionProgressContainer';
const ProgressionLevelContainer = 'ChampionProfile-ChampionProgressionLevel-ProgressionLevelContainer';
const ProgressionBadge = 'ChampionProfile-ChampionProgressionLevel-ProgressionBadge';
const ProgressionExperienceBar = 'ChampionProfile-ChampionProgressionLevel-ProgressionExperienceBar';
const ProgressionExperienceBarFill = 'ChampionProfile-ChampionProgressionLevel-ProgressionExperienceBarFill';

interface ReactProps {
  gameStats?: boolean;
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

class AChampionProgressionLevel extends React.Component<Props> {
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
    const questLink = notMaxLevel && quest ? quest.links[currentQuestIndex] : null;
    const gameStats = this.props.gameStats ? 'Gamestats' : '';
    const maxLevel = notMaxLevel ? '' : 'MaxLevel';
    const current = this.getCurrentBarProgress(questGQL, questLink);
    const max = this.getMaxBarProgress(questLink);
    return (
      <div
        className={ProgressionContainer}
        onClick={this.onProgressionClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
      >
        <span className={`${ProgressionLevel} ${gameStats} ${maxLevel}`}>{`${this.getLevel(
          questGQL,
          notMaxLevel
        )}`}</span>
        <div className={ProgressionProgressContainer}>
          <div className={ProgressionLevelContainer}>
            <div className={ProgressionBadge} />
          </div>
          <TooltipSource
            tooltipParams={{
              id: 'ChampionProgressionLevelResourceBar',
              content: notMaxLevel
                ? getTokenizedStringTableValue(StringIDGeneralXPProgress, this.props.stringTable, {
                    CURRENT_XP: String(current),
                    MAX_XP: String(max)
                  })
                : null
            }}
          >
            <ResourceBar
              isSquare
              type={'blue'}
              current={current}
              max={max}
              hideText={true}
              containerClasses={`${ProgressionExperienceBar} ${gameStats}`}
              fillClasses={ProgressionExperienceBarFill}
            />
          </TooltipSource>
        </div>
      </div>
    );
  }

  private onMouseEnter(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private getLevel(questGQL: QuestGQL, notMaxLevel: boolean): string {
    if (!questGQL) {
      return '1';
    }
    // We offset by 1 when not at max level because questIndex starts at 0, and no offset at max to keep an even level 30.
    return notMaxLevel ? `${questGQL.currentQuestIndex + 1}` : `${questGQL.currentQuestIndex}`;
  }

  private getMaxBarProgress(questLink: QuestLinkDefGQL): number {
    // if there is no current link you have reached max level, so return a full bar.
    return questLink?.progress ?? 100;
  }

  private getCurrentBarProgress(questGQL: QuestGQL, questLink: QuestLinkDefGQL): number {
    if (!questGQL) {
      return 0;
    }

    // if there is no current link you have reached max level, so return a full bar.
    return questLink ? questGQL.currentQuestProgress : 100;
  }

  private onProgressionClick(): void {
    this.props.dispatch(showRightPanel(<ProgressionInfo />));
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

export const ChampionProgressionLevel = connect(mapStateToProps)(AChampionProgressionLevel);
