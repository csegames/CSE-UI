/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { PlayerView } from './PlayerView';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

import { NotificationList } from './NotificationList';
import { Button } from '../../../shared/Button';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Group,
  MatchAccess,
  MatchStatsGQL,
  PerkGQL,
  QuestDefGQL,
  QuestGQL,
  Queue,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { TutorialQueueID, updateGroupState } from '../../../../redux/teamJoinSlice';
import { TeamJoinAPIError } from '../../../../dataSources/teamJoinNetworkingConstants';
import { TeamJoinAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Overlay, OverlayInstance, showOverlay, showRightPanel } from '../../../../redux/navigationSlice';
import { PlayButton } from './PlayButton';
import { LobbyChampionStatus } from './LobbyChampionStatus';
import { DailyQuestPanel } from '../BattlePass/DailyQuestPanel';
import {
  hasUncollectedDailyQuest,
  shouldShowClaimBattlePassModal,
  shouldShowEndedBattlePassModal
} from '../BattlePass/BattlePassUtils';
import { LobbyBattlePassStatus } from './LobbyBattlePassStatus';
import { QuestsByType } from '../../../../redux/questSlice';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { shouldShowBattlePassSplashScreen } from '../BattlePass/BattlePassUtils';
import { battlePassLocalStore } from '../../../../localStorage/battlePassLocalStorage';
import { InitTopic } from '../../../../redux/initializationSlice';
import { EventAdvertisementPanel } from '../../../shared/eventMessaging/EventAdvertisementPanel';
import { MOTDMessageData, setMOTDModalMessage } from '../../../../redux/notificationsSlice';
import { webConf } from '../../../../dataSources/networkConfiguration';

const Container = 'StartScreen-Play-Container';
const LeftPanel = 'StartScreen-Play-LeftPanel';
const CharacterContainer = 'StartScreen-Play-CharacterContainer';
const NotificationsListContainer = 'StartScreen-Play-NotificationsListContainer';
const LeaveGroupButtonClass = 'StartScreen-Play-LeaveGroupButton';
const QuestSection = 'StartScreen-Play-QuestSection';
const ActionButtonClass = 'StartScreen-Play-ActionButton';
const TutorialContainer = 'StartScreen-Play-TutorialContainer';
const TutorialText = 'StartScreen-Play-TutorialText';

const ReadyButtonStyle = 'StartScreen-Play-ReadyButton';
const TutorialButtonStyle = 'StartScreen-Play-TutorialButton';

const StringIDGroupsLeaveGroup = 'GroupsLeaveGroup';
const StringIDPlayQuestsButton = 'PlayQuestsButton';
const StringIDPlayTutorialButton = 'PlayTutorialButton';
const StringIDPlayButton = 'PlayButton';
const StringIDPlayNewToGame = 'PlayNewToGame';

const TutorialScenario = 'tutorial';

interface ReactProps {}

interface InjectedProps {
  access: MatchAccess;
  defaultQueueID: string;
  group: Group;
  lifetimeStats: MatchStatsGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  questsByType: QuestsByType;
  currentBattlePass: QuestDefGQL;
  previousBattlePass: QuestDefGQL;
  nextBattlePass: QuestDefGQL;
  questsProgress: QuestGQL[];
  overlays: OverlayInstance[];
  initializationTopics: Dictionary<boolean>;
  quests: QuestGQL[];
  perks: PerkGQL[];
  battlePassQuests: QuestDefGQL[];
  queues: Queue[];
  serverTimeDeltaMS: number;
  motdMessagesData: MOTDMessageData[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APlay extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    this.checkForPrestitial();

    return (
      <div className={Container}>
        <div className={LeftPanel}>
          <div className={NotificationsListContainer} id={'Fullscreen_Play_NotificationsListContainer'}>
            <NotificationList />
          </div>
          <div className={CharacterContainer}>
            <LobbyBattlePassStatus />
            {this.getPlayButton()}
            <LobbyChampionStatus />
            {this.getTutorialButton()}
            <div className={QuestSection}>{this.getQuestsButton()}</div>
            <EventAdvertisementPanel />
          </div>
        </div>
        <PlayerView />
        {this.getLeaveGroupButton()}
      </div>
    );
  }

  private checkForPrestitial(): void {
    // If an overlay is already open, wait to replace it until the user is finished interacting with it.
    if (this.props.overlays.length > 0) {
      return;
    }

    const motdMessageData = this.props.motdMessagesData[0];
    if (motdMessageData) {
      this.props.dispatch(setMOTDModalMessage(motdMessageData));
      this.props.dispatch(showOverlay(Overlay.MOTDModal));
      return;
    }

    if (this.props.initializationTopics[InitTopic.Store] && this.props.initializationTopics[InitTopic.Quests]) {
      // If there is an unseen, recently ended battlepass, splash the end of season.
      if (
        this.props.previousBattlePass &&
        shouldShowEndedBattlePassModal(this.props.previousBattlePass.id, this.props.questsProgress)
      ) {
        battlePassLocalStore.setLastEndedBattlePassID(this.props.previousBattlePass.id);
        this.props.dispatch(showOverlay(Overlay.EndedBattlePassModal));
        return;
      }

      // If the user has unclaimed rewards from expired battlepasses, let them claim those rewards now.
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

      // If a new season has started, but we haven't splashed the user yet, splash them!
      if (shouldShowBattlePassSplashScreen(this.props.currentBattlePass?.id ?? '')) {
        // Make sure we don't double-splash.
        battlePassLocalStore.setLastSplashedBattlePassID(this.props.currentBattlePass?.id);
        // Show the splash.
        this.props.dispatch(showOverlay(Overlay.NewBattlePassModal));
        return;
      }
    }
  }

  private getLeaveGroupButton() {
    if (this.props.group) {
      return (
        <Button
          type={'blue-outline'}
          text={getStringTableValue(StringIDGroupsLeaveGroup, this.props.stringTable)}
          styles={LeaveGroupButtonClass}
          onClick={this.onLeaveGroup.bind(this)}
        />
      );
    } else {
      return null;
    }
  }

  private getQuestsButton(): React.ReactNode {
    // For now, the only quests we care about are the BattlePass quests.  So if you have no BattlePass, you don't get the quests button!
    if (!!this.props.currentBattlePass) {
      return (
        <Button
          type='blue'
          styles={ActionButtonClass}
          text={getStringTableValue(StringIDPlayQuestsButton, this.props.stringTable)}
          onClick={this.onQuestsClick.bind(this)}
          alertStar={hasUncollectedDailyQuest(this.props.questsByType, this.props.questsProgress)}
        />
      );
    } else {
      return null;
    }
  }

  private onQuestsClick(): void {
    this.props.dispatch(showRightPanel(<DailyQuestPanel />));
  }

  private async onLeaveGroup() {
    // TODO : convert to request queue model
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
    const res = await TeamJoinAPI.LeaveV1(webConf);
    const success = res.ok;

    if (success) {
      // On Success we update the redux state that we are no longer in the party.
      try {
        this.props.dispatch(updateGroupState(null));
      } catch (e) {
        console.log('Leave Group dispatch or Json parse failed.', e);
      }
    } else {
      // failed
      try {
        const data: TeamJoinAPIError = JSON.parse(res.data);
        console.log('Leave Group network call failed failed.', data);
      } catch (e) {
        console.log('Leave Group Error Json Parse Failed', e);
      }
    }
  }

  private getTutorialButton(): JSX.Element {
    if (!this.showTutorialButton()) {
      return null;
    }

    return (
      <div className={TutorialContainer}>
        <span className={TutorialText}>{getStringTableValue(StringIDPlayNewToGame, this.props.stringTable)}</span>
        <PlayButton
          buttonType='blue'
          playText={getStringTableValue(StringIDPlayTutorialButton, this.props.stringTable)}
          buttonID='tutorial'
          queueID={TutorialQueueID}
          style={TutorialButtonStyle}
        />
      </div>
    );
  }

  private getPlayButton(): JSX.Element {
    return (
      <PlayButton
        buttonType='primary'
        playText={getStringTableValue(StringIDPlayButton, this.props.stringTable)}
        buttonID='standard'
        queueID={this.props.defaultQueueID ?? 'standard'}
        style={ReadyButtonStyle}
      />
    );
  }

  private showTutorialButton(): boolean {
    // if we're in a multiplayer group, hide the button
    if (this.props.group?.size > 1) {
      return false;
    }

    // if we've played the tutorial, hide the button
    if (this.props.lifetimeStats?.find((matchStats) => matchStats.scenarioID == TutorialScenario)?.matchesPlayed > 0) {
      return false;
    }

    if (this.props.queues.find((q) => q.queueID == TutorialQueueID) == null) {
      return;
    }

    // if we're offline, hide the button (play button will read "Offline")
    return this.props.access == MatchAccess.Online;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { group } = state.teamJoin;
  const { quests: questsByType, currentBattlePass, previousBattlePass, nextBattlePass } = state.quests;
  const questsProgress = state.profile.quests;
  const { defaultQueueID, access, queues } = state.match;
  const lifetimeStats = state.profile.lifetimeStats;
  const { stringTable } = state.stringTable;
  const { overlays } = state.navigation;
  const initializationTopics = state.initialization.componentStatus;
  const { perks, quests } = state.profile;
  const battlePassQuests = state.quests.quests?.BattlePass;
  const { serverTimeDeltaMS } = state.clock;
  const { motdMessagesData } = state.notifications;

  return {
    ...ownProps,
    access,
    defaultQueueID,
    group,
    lifetimeStats,
    questsByType,
    quests,
    perks,
    initializationTopics,
    currentBattlePass,
    previousBattlePass,
    nextBattlePass,
    questsProgress,
    stringTable,
    overlays,
    battlePassQuests,
    queues,
    serverTimeDeltaMS,
    motdMessagesData
  };
}

export const Play = connect(mapStateToProps)(APlay);
