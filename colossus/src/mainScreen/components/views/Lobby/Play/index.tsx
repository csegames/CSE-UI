/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { PlayerView } from './PlayerView';
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
  QuestGQL,
  Queue,
  QueueEntry
} from '@csegames/library/dist/hordetest/graphql/schema';
import { updateGroupState } from '../../../../redux/teamJoinSlice';
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
import { LoadingTopic } from '../../../../redux/loadingSlice';
import { EventAdvertisementPanel } from '../../../shared/notifications/EventAdvertisementPanel';
import { MOTDMessageData, setMOTDModalMessage } from '../../../../redux/notificationsSlice';
import { webConf } from '../../../../dataSources/networkConfiguration';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { GameModeDef } from '../../../../dataSources/manifest/gameModeManifest';
import { getDefaultQueueGameModeDef } from '../../../../redux/matchSlice';
import { getSelectedQueueID } from '../../../../helpers/queueHelpers';
import { StringTableEntryDef } from '../../../../dataSources/manifest/stringTableManifest';
import { QuestDef } from '../../../../dataSources/manifest/questManifest';

const Container = 'StartScreen-Play-Container';
const LeftPanel = 'StartScreen-Play-LeftPanel';
const CharacterContainer = 'StartScreen-Play-CharacterContainer';
const NotificationsListContainer = 'StartScreen-Play-NotificationsListContainer';
const LeaveGroupButtonClass = 'StartScreen-Play-LeaveGroupButton';
const QuestSection = 'StartScreen-Play-QuestSection';
const ActionButtonClass = 'StartScreen-Play-ActionButton';
const ModesButton = 'StartScreen-Play-ModesButton';
const ModesButtonContent = 'StartScreen-Play-ModesButtonContent';
const ModesHeading = 'StartScreen-Play-ModesHeading';
const ModeSubheading = 'StartScreen-Play-ModeSubheading';
const ModesChange = 'StartScreen-Play-ModesChange';
const ReadyButtonStyle = 'StartScreen-Play-ReadyButton';

const StringIDGroupsLeaveGroup = 'GroupsLeaveGroup';
const StringIDPlayQuestsButton = 'PlayQuestsButton';
const StringIDPlayButton = 'PlayButton';
const StringIDPlayModeChange = 'PlayModeChange';
const StringIDPlayModeInQueue = 'PlayModeInQueue';

interface ReactProps {}

interface InjectedProps {
  access: MatchAccess;
  defaultQueueID: string;
  group: Group;
  lifetimeStats: MatchStatsGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  questsByType: QuestsByType;
  currentBattlePass: QuestDef;
  previousBattlePass: QuestDef;
  nextBattlePass: QuestDef;
  questsProgress: QuestGQL[];
  overlays: OverlayInstance[];
  loadingTopics: Dictionary<boolean>;
  accountID: string;
  currentEntry: QueueEntry | null;
  quests: QuestGQL[];
  perks: PerkGQL[];
  battlePassQuests: QuestDef[];
  queues: Queue[];
  serverTimeDeltaMS: number;
  motdMessagesData: MOTDMessageData[];
  selectedQueueID: string | null;
  gameModes: Dictionary<GameModeDef>;
  gameDefsLoaded: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APlay extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div className={Container}>
        <div className={LeftPanel}>
          <div className={NotificationsListContainer} id={'Fullscreen_Play_NotificationsListContainer'}>
            <NotificationList />
          </div>
          <div className={CharacterContainer}>
            <LobbyBattlePassStatus />
            {this.getModesButton()}
            {this.getPlayButton()}
            <LobbyChampionStatus />
            <div className={QuestSection}>{this.getQuestsButton()}</div>
            <EventAdvertisementPanel />
          </div>
        </div>
        <PlayerView />
        {this.getLeaveGroupButton()}
      </div>
    );
  }

  public componentDidMount() {
    this.checkForPrestitial();
  }

  public componentDidUpdate() {
    this.checkForPrestitial();
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

    if (this.props.loadingTopics[LoadingTopic.Store] && this.props.gameDefsLoaded) {
      // If there is an unseen, recently ended battlepass, splash the end of season.
      if (
        this.props.previousBattlePass &&
        shouldShowEndedBattlePassModal(this.props.previousBattlePass.id, this.props.questsProgress)
      ) {
        clientAPI.setLastEndedBattlePassID(this.props.previousBattlePass.id);
        this.props.dispatch(showOverlay(Overlay.EndedBattlePassModal));
        return;
      }

      // If the user has unclaimed rewards from expired battlepasses, let them claim those rewards now.
      if (
        shouldShowClaimBattlePassModal(
          this.props.previousBattlePass,
          this.props.currentBattlePass,
          this.props.nextBattlePass,
          this.props.loadingTopics,
          this.props.battlePassQuests,
          this.props.perks,
          this.props.quests,
          this.props.serverTimeDeltaMS,
          this.props.gameDefsLoaded
        )
      ) {
        this.props.dispatch(showOverlay(Overlay.ClaimBattlePassModal));
        return;
      }

      // If a new season has started, but we haven't splashed the user yet, splash them!
      if (shouldShowBattlePassSplashScreen(this.props.currentBattlePass?.id ?? '')) {
        // Make sure we don't double-splash.
        clientAPI.setLastSplashedBattlePassID(this.props.currentBattlePass?.id);
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
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_NO);
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

  private getModesButton(): JSX.Element {
    const queueDisplay = this.getGameMode();
    if (!queueDisplay) return null;

    const [modesString, shouldShowModes] = this.getIsQueued();
    const disabledColor = shouldShowModes ? '' : 'queued';
    return (
      <div
        style={{ backgroundImage: `url(${queueDisplay.bannerImage})` }}
        className={`${ModesButton} ${disabledColor}`}
        onClick={this.showGameModeSelectionOverlay.bind(this, shouldShowModes)}
      >
        <div className={ModesButtonContent}>
          <span className={ModesHeading}>{queueDisplay.name}</span>
          <span className={ModeSubheading}>{queueDisplay.description}</span>
          <span className={`${ModesChange} ${disabledColor}`}>{modesString}</span>
        </div>
      </div>
    );
  }

  private getIsQueued(): [string, boolean] {
    switch (this.props.access) {
      case MatchAccess.Forbidden:
      case MatchAccess.Offline:
        return [getStringTableValue(StringIDPlayModeChange, this.props.stringTable), false];
    }

    const isGroupLead = this.props.accountID === this.props.group?.leader.id;
    const current = this.props.currentEntry;
    const queueID = getSelectedQueueID(this.props.selectedQueueID, this.props.defaultQueueID, this.props.queues);
    if (current) {
      const enteredSolo = !this.props.group && this.props.accountID === current.enteredBy.id;
      if (current.queueID !== queueID && current.userTag !== 'standard') {
        // in another queue
        return [getStringTableValue(StringIDPlayModeInQueue, this.props.stringTable), false];
      }
      if (enteredSolo || isGroupLead) {
        return [getStringTableValue(StringIDPlayModeInQueue, this.props.stringTable), false];
      }
      return [getStringTableValue(StringIDPlayModeInQueue, this.props.stringTable), false];
    }

    const queue = this.props.queues.find((q) => q.queueID === queueID && q.enabled);
    if (!queue) {
      return [getStringTableValue(StringIDPlayModeChange, this.props.stringTable), false];
    }

    const numPlayers = this.props.group?.size ?? 1;
    if (queue.maxEntrySize < numPlayers || queue.minEntrySize > numPlayers) {
      return [getStringTableValue(StringIDPlayModeChange, this.props.stringTable), false];
    }

    if (this.props.group && !isGroupLead) {
      return [getStringTableValue(StringIDPlayModeChange, this.props.stringTable), false];
    }

    return [getStringTableValue(StringIDPlayModeChange, this.props.stringTable), true];
  }

  private getGameMode(): GameModeDef | null {
    if (
      this.props.defaultQueueID === null ||
      (this.props.selectedQueueID !== null && this.props.selectedQueueID !== this.props.defaultQueueID)
    ) {
      const queue = this.props.queues.find(
        (q) =>
          q.queueID === getSelectedQueueID(this.props.selectedQueueID, this.props.defaultQueueID, this.props.queues) &&
          q.enabled
      );
      if (!queue) return null;
      return this.props.gameModes[queue.displayAlias];
    }
    return getDefaultQueueGameModeDef(this.props.defaultQueueID);
  }

  private getPlayButton(): JSX.Element {
    return (
      <PlayButton
        buttonType='primary'
        playText={getStringTableValue(StringIDPlayButton, this.props.stringTable)}
        buttonID='standard'
        queueID={getSelectedQueueID(this.props.selectedQueueID, this.props.defaultQueueID, this.props.queues)}
        style={ReadyButtonStyle}
      />
    );
  }

  private showGameModeSelectionOverlay(isNotQueued: boolean): void {
    if (!isNotQueued) {
      return;
    }
    this.props.dispatch(showOverlay(Overlay.GameModeSelection));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const accountID = state.user.id;
  const { group } = state.teamJoin;
  const { quests: questsByType, currentBattlePass, previousBattlePass, nextBattlePass } = state.quests;
  const questsProgress = state.profile.quests;
  const { currentEntry, defaultQueueID, access, queues, selectedQueueID, gameModes } = state.match;
  const lifetimeStats = state.profile.lifetimeStats;
  const { stringTable } = state.stringTable;
  const { overlays } = state.navigation;
  const loadingTopics = state.loading.componentStatus;
  const { perks, quests } = state.profile;
  const battlePassQuests = state.quests.quests?.BattlePass;
  const { serverTimeDeltaMS } = state.clock;
  const { motdMessagesData } = state.notifications;
  const { gameDefsLoaded } = state.game;

  return {
    ...ownProps,
    access,
    accountID,
    currentEntry,
    defaultQueueID,
    group,
    lifetimeStats,
    questsByType,
    quests,
    perks,
    loadingTopics,
    currentBattlePass,
    previousBattlePass,
    nextBattlePass,
    questsProgress,
    stringTable,
    overlays,
    battlePassQuests,
    queues,
    serverTimeDeltaMS,
    motdMessagesData,
    selectedQueueID,
    gameModes,
    gameDefsLoaded
  };
}

export const Play = connect(mapStateToProps)(APlay);
