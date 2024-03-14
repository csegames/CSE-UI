/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { Button } from '../shared/Button';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from 'redux';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { hideOverlay, Overlay, showError } from '../../redux/navigationSlice';
import { webConf } from '../../dataSources/networkConfiguration';
import {
  ChampionInfo,
  QuestDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../redux/questSlice';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { startProfileRefresh } from '../../redux/profileSlice';
import { ProgressionReward } from '../views/Lobby/ChampionProfile/ProgressionReward';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { findChampionQuestProgress, findChampionQuest } from '../../helpers/characterHelpers';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { Dictionary } from '@reduxjs/toolkit';
import { createAlertsForCollectedQuestProgress } from '../../helpers/perkUtils';
import { PerkDefGQL } from '@csegames/library/src/hordetest/graphql/schema';

const Container = 'RewardCollection-Container';
const LevelUpTitle = 'RewardCollection-LevelUpTitle';
const LevelContainer = 'RewardCollection-LevelContainer';
const Level = 'ChampionProfile-ProgressionInfo-Level';
const Experience = 'RewardCollection-ProgressionExperience';
const ButtonContainer = 'SetDisplayName-ButtonsContainer';
const BackButton = 'SetDisplayName-ButtonStyles ';

const StringIDRewardCollectionMaxLevel = 'RewardCollectionMaxLevel';
const StringIDRewardCollectionLevel = 'RewardCollectionLevel';
const StringIDRewardCollectionXPToNextLevel = 'RewardCollectionXPToNextLevel';
const StringIDRewardCollectionTitle = 'RewardCollectionTitle';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  waitingOnRequest: boolean;
  resultMessage: string;
  resultIsSuccess: boolean;
}

class ARewardCollection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      waitingOnRequest: false,
      resultMessage: ' ', // Needs to be non-empty, else the div gets optimized out of existence.
      resultIsSuccess: true
    };
  }

  public render() {
    const questGQL = findChampionQuestProgress(this.props.selectedChampion, this.props.questsGQL);
    const quest = findChampionQuest(this.props.selectedChampion, this.props.quests.Champion);
    const questLinkToCollect = quest.links[questGQL.nextCollection];
    this.claimReward(quest, questGQL);
    if (!questLinkToCollect || questLinkToCollect.rewards.length <= 0) {
      this.props.dispatch(hideOverlay(Overlay.RewardCollection));
    }

    const questLinkReached = quest.links[questGQL.currentQuestIndex];
    const tokens: Dictionary<string> = {
      CHAMPION_LEVEL: `${questGQL.currentQuestIndex + 1}`,
      CURRENT_XP: questLinkReached ? `${addCommasToNumber(questGQL.currentQuestProgress)}` : '',
      MAX_XP: questLinkReached ? `${addCommasToNumber(questLinkReached.progress)}` : ''
    };

    const levelDescription = !questLinkReached
      ? getStringTableValue(StringIDRewardCollectionMaxLevel, this.props.stringTable)
      : getTokenizedStringTableValue(StringIDRewardCollectionLevel, this.props.stringTable, tokens);
    const xpDescription = getTokenizedStringTableValue(
      StringIDRewardCollectionXPToNextLevel,
      this.props.stringTable,
      tokens
    );

    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onCloseClick.bind(this)}>
        <div className={Container}>
          <span className={LevelUpTitle}>
            {getStringTableValue(StringIDRewardCollectionTitle, this.props.stringTable)}
          </span>
          <div className={LevelContainer}>
            <span className={Level}>{levelDescription}</span>
            {questLinkReached && <span className={Experience}>{xpDescription}</span>}
          </div>
          <ProgressionReward />
          <div className={ButtonContainer}>
            <Button
              type={'blue-outline'}
              text={'Close'}
              disabled={false}
              onClick={this.onCloseClick.bind(this)}
              styles={BackButton}
            />
          </div>
        </div>
      </MiddleModalDisplay>
    );
  }

  private async claimReward(quest: QuestDefGQL, questProgress: QuestGQL) {
    const res = await ProfileAPI.CollectQuestReward(webConf, quest.id);
    if (!res.ok) {
      this.props.dispatch(showError(res));
    } else {
      createAlertsForCollectedQuestProgress(quest, questProgress, this.props.perksByID, this.props.dispatch);
    }
  }

  private onCloseClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
    this.props.dispatch(startProfileRefresh());
    this.props.dispatch(hideOverlay(Overlay.RewardCollection));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { quests } = state.profile;
  const questsByType = state.quests.quests;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    selectedChampion,
    questsGQL: quests,
    quests: questsByType,
    stringTable,
    perksByID
  };
}

export const RewardCollection = connect(mapStateToProps)(ARewardCollection);
