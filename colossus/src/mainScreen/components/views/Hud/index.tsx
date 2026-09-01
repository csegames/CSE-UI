/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import Chat from './Chat';
import { ChatService } from '../../../dataSources/chatNetworking';

import { MatchInfo } from './MatchInfo';
import { Crosshair } from './Crosshair';
/* TODO_ANIMATION_REFACTOR
import { Compass } from './Compass/Compass';
import { Consumables } from './Consumables';
import { FriendlyHealthBars } from './FriendlyHealthBars';
import { KillStreakCounter } from './KillStreakCounter';
import { ObjectiveDetails } from './Objectives/ObjectiveDetails';
import { ObjectivesContainer } from './Objectives';
import { ObjectiveTrackers } from './ObjectiveTrackers';
import { SelfHealthBar } from './SelfHealthBar';
import { SelfReviveBar } from './HealthBar/SelfReviveBar';
import { SprintBar } from './MovementTrackers/SprintBar';
import { UrgentMessage } from './UrgentMessage';
*/
import { PlayerTrackers } from './PlayerTrackers';
import { Respawn } from './Respawn';
import { VictoryDefeatAnnouncement } from './Announcements/VictoryDefeat';
import { DialogueQueue } from './Announcements/Dialogue';
import { RuneAlerts } from './RuneAlerts';
import { ScenarioIntro } from './ScenarioIntro';
import { Console } from './Console';
import { RuneFullScreenEffects } from './FullScreenEffects/Runes';
import { ExtraButtons } from './ExtraButtons';
import { PressToSkipToSummary } from './PressToSkipToSummary';
import { game } from '@csegames/library/dist/_baseGame';
import { hordetest } from '@csegames/library/dist/hordetest';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

import { LowHealthFullScreenEffects } from './FullScreenEffects/LowHealth';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { LobbyView } from '../../../redux/navigationSlice';
import { Dispatch } from 'redux';
import { ProfileModel } from '../../../redux/profileSlice';
import { Mocks } from './Mocks';
import { KilledBy } from './Announcements/KilledBy';
import { AutoRunTracker } from './MovementTrackers/AutoRunTracker';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { FeatureFlags } from '../../../redux/featureFlagsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { MatchEndSequence, setMatchEnd } from '../../../redux/matchSlice';
import { AnnouncementPopups } from './Announcements/AnnouncementPopups';
import { updateMutedAll } from '../../../redux/voiceChatSlice';
import { refreshProfile } from '../../../dataSources/profileNetworking';
import { FervorStatus } from './FervorStatus';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Container = 'MainScreen-Container';
const MatchInfoPosition = 'MainScreen-MatchInfoPosition';
const KillStreakContainer = 'MainScreen-KillStreakContainer';
const VictoryDefeatAnnouncementContainer = 'MainScreen-VictoryDefeatAnnouncementContainer';

const CompassContainer = 'MainScreen-CompassContainer';

interface ReactProps {
  slashCommands: SlashCommandRegistry<RootState, Dispatch>;
}

interface InjectedProps extends FeatureFlags.Source {
  isAlive: boolean;
  matchID: string;
  scenarioID: string;
  scenarioRoundState: ScenarioRoundState;
  displayName: string;
  lobbyView: LobbyView;
  profile: ProfileModel;
  lifeState: LifeState;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

// TODO_ANIMATION_REFACTOR
class Empty extends React.Component {
  public render(): React.ReactNode { return null; }
}
class Compass extends Empty {}
class Consumables extends Empty {}
class FriendlyHealthBars extends Empty {}
class KillStreakCounter extends Empty {}
class ObjectiveDetails extends Empty {}
class ObjectivesContainer extends Empty {}
class ObjectiveTrackers extends Empty {}
class SelfHealthBar extends Empty {}
class SelfReviveBar extends Empty {}
class SprintBar extends Empty {}
class UrgentMessage extends Empty {}
// END TODO_ANIMATION_REFACTOR

class HUD extends React.Component<Props> {
  private eventHandlers: Dictionary<ListenerHandle> = {};

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    this.eventHandlers = {
      scenarioEndedEVH: hordetest.game.onScenarioRoundEnded(this.handleScenarioRoundEnded.bind(this))
    };
  }

  public componentWillUnmount() {
    for (let curHandlerKey in this.eventHandlers) {
      this.eventHandlers[curHandlerKey].close();
    }
  }

  public render() {
    return (
      <div id='HUDContainer' className={Container}>
        {this.props.isAlive ? this.getActiveScreen() : this.getDeathScreen()};
        <ChatService slashCommands={this.props.slashCommands} />
      </div>
    );
  }

  private getActiveScreen(): JSX.Element {
    const isBackfill =
      this.props.scenarioRoundState === ScenarioRoundState.Backfill ||
      this.props.scenarioRoundState === ScenarioRoundState.BackfillLocked;
    return (
      <>
        <RuneFullScreenEffects />
        <ExtraButtons />
        <Mocks />
        <Console slashCommands={this.props.slashCommands} />
        {!isBackfill && (
          <div id='CompassContainer_HUD' className={CompassContainer}>
            <Compass />
            <ObjectivesContainer />
          </div>
        )}
        <AnnouncementPopups />
        <DialogueQueue />
        <RuneAlerts />
        <ScenarioIntro />
        <Crosshair />
        <FervorStatus />
        <UrgentMessage />
        {this.getMatchInfo()}
        <div id='KillstreakContainer_HUD' className={KillStreakContainer}>
          <KillStreakCounter />
        </div>
        <ObjectiveDetails />
        <SelfHealthBar />
        {this.getSelfReviveBar()}
        <KilledBy />
        <Consumables />
        {this.getSkipToSummary()}
        <FriendlyHealthBars />
        <Chat />
        <PlayerTrackers />
        <ObjectiveTrackers />
        <AutoRunTracker />
        <SprintBar />
        <LowHealthFullScreenEffects />
        <div id='VictoryDefeatAnnouncementContainer_HUD' className={VictoryDefeatAnnouncementContainer}>
          <VictoryDefeatAnnouncement />
        </div>
      </>
    );
  }

  private getDeathScreen(): JSX.Element {
    const isBackfill =
      this.props.scenarioRoundState === ScenarioRoundState.Backfill ||
      this.props.scenarioRoundState === ScenarioRoundState.BackfillLocked;
    return (
      <>
        <ExtraButtons />
        <Console slashCommands={this.props.slashCommands} />
        {!isBackfill && (
          <div id='CompassContainer_HUD' className={CompassContainer}>
            <Compass />
            <ObjectivesContainer />
          </div>
        )}
        <AnnouncementPopups />
        <DialogueQueue />
        {this.getMatchInfo()}
        <ObjectiveDetails />
        <FriendlyHealthBars />
        <Chat />
        <PlayerTrackers />
        <Respawn
          onLeaveMatch={this.leaveMatch.bind(this, true, true)}
          onSkipEpilogue={this.leaveMatch.bind(this, false, false)}
        />
        <div id='VictoryDefeatAnnouncementContainer_HUD' className={VictoryDefeatAnnouncementContainer}>
          <VictoryDefeatAnnouncement />
        </div>
      </>
    );
  }

  private getMatchInfo(): JSX.Element {
    const topAlign = game.showPerfHUD ? ' at-top' : '';
    return (
      <div className={`${MatchInfoPosition}${topAlign}`}>
        <MatchInfo />
      </div>
    );
  }

  private getSkipToSummary(): JSX.Element {
    if (this.props.scenarioRoundState == ScenarioRoundState.Epilogue) {
      return <PressToSkipToSummary onLeaveMatch={this.leaveMatch.bind(this, false, false)} />;
    }
    return null;
  }

  private getSelfReviveBar(): JSX.Element {
    if (this.props.lifeState == LifeState.Downed) {
      return <SelfReviveBar />;
    }
  }

  private handleScenarioRoundEnded = (scenarioID: string, didEnd: boolean) => {
    if (didEnd) {
      this.leaveMatch(false, false);
    }
  };

  private leaveMatch(skipStatsScreen: boolean, shouldRefreshProfile: boolean) {
    clientAPI.playGameSound(SoundEvents.PLAY_SCENARIO_END);
    if (shouldRefreshProfile) {
      refreshProfile();
    }
    this.props.dispatch(updateMutedAll(false));

    const sequence = skipStatsScreen ? MatchEndSequence.GotoLobby : MatchEndSequence.GotoStats;
    this.props.dispatch(setMatchEnd({ matchID: this.props.matchID, sequence, refresh: true }));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { isAlive, scenarioRoundState, lifeState } = state.entities.self;
  const { displayName } = state.user;
  const { lobbyView } = state.navigation;
  const { featureFlags } = state;
  const matchID = state.match.currentRound?.roundID;
  const scenarioID = state.match.currentRound?.scenarioID;
  return {
    ...ownProps,
    isAlive,
    matchID,
    scenarioID,
    featureFlags,
    scenarioRoundState,
    displayName,
    lobbyView,
    profile: state.profile,
    lifeState
  };
}

export default connect(mapStateToProps)(HUD);
