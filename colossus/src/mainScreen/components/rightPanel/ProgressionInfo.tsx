/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { ChampionInfo, PerkDefGQL, QuestGQL, QuestLinkDefGQL, QuestDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from 'redux';
import { hideRightPanel } from '../../redux/navigationSlice';
import { ResourceBar } from '../shared/ResourceBar';
import { Dictionary } from '@reduxjs/toolkit';
import { QuestsByType } from '../../redux/questSlice';
import { ProgressionReward } from '../views/Lobby/ChampionProfile/ProgressionReward';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { findChampionQuestProgress, findChampionQuest } from '../../helpers/characterHelpers';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'ChampionProfile-SkillInfo-Container';
const Title = 'ChampionProfile-ProgressionInfo-Title';
const Description = 'ChampionProfile-ProgressionInfo-Description';
const ProgressContainer = 'ChampionProfile-ProgressionInfo-ProgressContainer';
const LevelContainer = 'ChampionProfile-ProgressionInfo-LevelContainer';
const Level = 'ChampionProfile-ProgressionInfo-Level';
const Experience = 'ChampionProfile-ProgressionInfo-Experience';
const ExperienceBar = 'ChampionProfile-ProgressionInfo-ExperienceBar';
const MaxLevelDescription = 'ChampionProfile-ProgressionInfo-MaxLevelDescription';
const ButtonPosition = 'ChampionProfile-SkillInfo-ButtonPosition';

const StringIDProgressionInfoDescription = 'ProgressionInfoDescription';
const StringIDProgressionInfoMaxLevelDescription = 'ProgressionInfoMaxLevelDescription';
const StringIDChampionProgressionLevel = 'ChampionProgressionLevel';
const StringIDChampionProgressionXPToNextLevel = 'ChampionProgressionXPToNextLevel';
const StringIDChampionProgressionXPToMaxLevel = 'ChampionProgressionXPToMaxLevel';
const StringIDChampionProgressionMaxLevel = 'ChampionProgressionMaxLevel';
const StringIDProgressionInfoHideUI = 'ProgressionInfoHideUI';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AProgressionInfo extends React.Component<Props> {
  render(): JSX.Element {
    const questGQL = findChampionQuestProgress(this.props.selectedChampion, this.props.questsGQL);
    const quest = findChampionQuest(this.props.selectedChampion, this.props.quests.Champion);
    const notMaxLevel = !quest || !questGQL || quest.links.length > questGQL.currentQuestIndex;
    const questLink = notMaxLevel && quest ? quest.links[questGQL?.currentQuestIndex ?? 0] : null;
    const maxLevel = notMaxLevel ? '' : 'MaxLevel';
    const tokens: Dictionary<string> = {
      CHAMPION_LEVEL: this.getLevel(questGQL, notMaxLevel),
      CHAMPION_NAME: this.props.selectedChampion.name
    };

    return (
      <div className={Container}>
        <span className={Title}>Experience Points</span>
        <span className={Description}>
          {getStringTableValue(StringIDProgressionInfoDescription, this.props.stringTable)}
        </span>
        <div className={ProgressContainer}>
          <div className={LevelContainer}>
            <span className={`${Level} ${maxLevel}`}>
              {getTokenizedStringTableValue(StringIDChampionProgressionLevel, this.props.stringTable, tokens)}
            </span>
            <span className={Experience}>{this.getProgress(questGQL, questLink, quest)}</span>
          </div>
          <ResourceBar
            isSquare
            type={'blue'}
            current={this.getCurrentBarProgress(questGQL, questLink)}
            max={this.getMaxBarProgress(questLink)}
            hideText={true}
            containerClasses={`${ExperienceBar}`}
          />
        </div>
        {notMaxLevel ? this.getReward(questLink) : this.getMaxLevelDescription(tokens)}
        <div className={ButtonPosition}>
          <Button
            type={'double-border'}
            text={getStringTableValue(StringIDProgressionInfoHideUI, this.props.stringTable)}
            onClick={this.onHideClick.bind(this)}
            disabled={false}
          />
        </div>
      </div>
    );
  }

  private getLevel(questGQL: QuestGQL, notMaxLevel: boolean): string {
    if (!questGQL) {
      return '1';
    }

    return notMaxLevel ? `${questGQL.currentQuestIndex + 1}` : `${questGQL.currentQuestIndex}`;
  }

  private getProgress(questGQL: QuestGQL, questLink: QuestLinkDefGQL, quest: QuestDefGQL): string {
    if (!quest) {
      return '';
    }

    const nextChampLevel = (questGQL?.currentQuestIndex ?? 0) + 2;
    const currentQuestProgress = questGQL?.currentQuestProgress ?? 0;

    if (questLink && questLink.progress) {
      const tokens: Dictionary<string> = {
        CURRENT_XP: `${addCommasToNumber(currentQuestProgress)}`,
        MAX_XP: `${addCommasToNumber(questLink.progress)}`,
        NEXT_CHAMPION_LEVEL: `${nextChampLevel}`
      };

      if (quest.links.length > nextChampLevel) {
        return getTokenizedStringTableValue(StringIDChampionProgressionXPToNextLevel, this.props.stringTable, tokens);
      } else {
        return getTokenizedStringTableValue(StringIDChampionProgressionXPToMaxLevel, this.props.stringTable, tokens);
      }
    } else {
      return getStringTableValue(StringIDChampionProgressionMaxLevel, this.props.stringTable);
    }
  }

  private getMaxBarProgress(questLink: QuestLinkDefGQL): number {
    // If there is no current link, then you have reached max level, so return a full bar.
    return questLink?.progress ?? 100;
  }

  private getCurrentBarProgress(questGQL: QuestGQL, questLink: QuestLinkDefGQL): number {
    if (!questGQL) {
      return 0;
    }

    // If there is no current link, then you have reached max level, so return a full bar.
    return questLink ? questGQL.currentQuestProgress : 100;
  }

  private getMaxLevelDescription(tokens: Dictionary<string>) {
    return (
      <span className={MaxLevelDescription}>
        {getTokenizedStringTableValue(StringIDProgressionInfoMaxLevelDescription, this.props.stringTable, tokens)}
      </span>
    );
  }

  private onHideClick() {
    this.props.dispatch(hideRightPanel());
  }

  private getReward(questLink: QuestLinkDefGQL): JSX.Element {
    if (questLink && questLink.rewards.length > 0) {
      return <ProgressionReward nextReward={true} />;
    }
    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const questsGQL = state.profile.quests;
  const { perksByID } = state.store;
  const { quests } = state.quests;
  const { stringTable } = state.stringTable;

  return { ...ownProps, selectedChampion, questsGQL, quests, perksByID, stringTable };
}

export const ProgressionInfo = connect(mapStateToProps)(AProgressionInfo);
