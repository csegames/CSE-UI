/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import Chat from './Chat';
import { disconnectChat } from './Chat/state/chat';

// import { ChannelBar } from './ChannelBar';
import { MatchInfo } from './MatchInfo';
import { Crosshair } from './Crosshair';
import { SprintBar } from './MovementTrackers/SprintBar';
import { KillStreakCounter } from './KillStreakCounter';
import { ObjectiveDetails } from './Objectives/ObjectiveDetails';
import { PlayerTrackers } from './PlayerTrackers';
import { Respawn } from './Respawn';
import { PopupAnnouncement } from './Announcements/Popup';
import { VictoryDefeatAnnouncement } from './Announcements/VictoryDefeat';
import { DialogueQueue } from './Announcements/Dialogue';
import { RuneAlerts } from './RuneAlerts';
import { ClientPerformanceInfo } from './ClientPerformanceInfo';
import { ScenarioIntro } from './ScenarioIntro';
import { Compass } from './Compass';
import { ObjectivesContainer } from './Objectives';
import { Console } from './Console';
import { SelfHealthBar } from './SelfHealthBar';
import { Consumables } from './Consumables';
import { FriendlyHealthBars } from './FriendlyHealthBars';
import { RuneFullScreenEffects } from './FullScreenEffects/Runes';
import { ExtraButtons } from './ExtraButtons';
import { UrgentMessage } from './UrgentMessage';
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
import { ProfileModel, startProfileRefresh } from '../../../redux/profileSlice';
import { Mocks } from './Mocks';
import { KilledBy } from './Announcements/KilledBy';
import { AutoRunTracker } from './MovementTrackers/AutoRunTracker';
import { SelfReviveBar } from './HealthBar/SelfReviveBar';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { FeatureFlags } from '../../../redux/featureFlagsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { MatchEndSequence, setMatchEnd } from '../../../redux/matchSlice';
import { ObjectiveTrackers } from './ObjectiveTrackers';

const Container = 'MainScreen-Container';
const MatchInfoPosition = 'MainScreen-MatchInfoPosition';
const KillStreakContainer = 'MainScreen-KillStreakContainer';
const VictoryDefeatAnnouncementContainer = 'MainScreen-VictoryDefeatAnnouncementContainer';

const CompassContainer = 'MainScreen-CompassContainer';

interface ReactProps {
  slashCommands: SlashCommandRegistry<RootState>;
}

interface InjectedProps extends FeatureFlags.Source {
  isAlive: boolean;
  matchID: string;
  scenarioRoundState: ScenarioRoundState;
  displayName: string;
  lobbyView: LobbyView;
  profile: ProfileModel;
  lifeState: LifeState;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

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
    disconnectChat();
  }

  public render() {
    return (
      <div id='HUDContainer' className={Container}>
        {this.props.isAlive ? this.getActiveScreen() : this.getDeathScreen()};
      </div>
    );
  }

  private getActiveScreen(): JSX.Element {
    return (
      <>
        <RuneFullScreenEffects />
        <ExtraButtons />
        <ClientPerformanceInfo />
        <Mocks />
        <Console slashCommands={this.props.slashCommands} />
        <div id='CompassContainer_HUD' className={CompassContainer}>
          <Compass />
          <ObjectivesContainer />
        </div>
        <PopupAnnouncement />
        <div id='VictoryDefeatAnnouncementContainer_HUD' className={VictoryDefeatAnnouncementContainer}>
          <VictoryDefeatAnnouncement />
        </div>
        <DialogueQueue />
        <RuneAlerts />
        <ScenarioIntro />
        <Crosshair />
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
        <Chat slashCommands={this.props.slashCommands} />
        <PlayerTrackers />
        <ObjectiveTrackers />
        <AutoRunTracker />
        <SprintBar />
        <LowHealthFullScreenEffects />
      </>
    );
  }

  private getDeathScreen(): JSX.Element {
    return (
      <>
        <ExtraButtons />
        <Console slashCommands={this.props.slashCommands} />
        <div id='CompassContainer_HUD' className={CompassContainer}>
          <Compass />
        </div>
        <PopupAnnouncement />
        <div id='VictoryDefeatAnnouncementContainer_HUD' className={VictoryDefeatAnnouncementContainer}>
          <VictoryDefeatAnnouncement />
        </div>
        <DialogueQueue />
        {this.getMatchInfo()}
        <ObjectiveDetails />
        <ObjectivesContainer />
        <FriendlyHealthBars />
        <Chat slashCommands={this.props.slashCommands} />
        <PlayerTrackers />
        <Respawn
          onLeaveMatch={this.leaveMatch.bind(this, true, true)}
          onSkipEpilogue={this.leaveMatch.bind(this, false, false)}
        />
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

  private leaveMatch(skipStatsScreen: boolean, refreshProfile: boolean) {
    game.playGameSound(SoundEvents.PLAY_SCENARIO_END);
    if (refreshProfile) {
      this.props.dispatch(startProfileRefresh());
    }

    const sequence = skipStatsScreen ? MatchEndSequence.GotoLobby : MatchEndSequence.GotoStats;
    this.props.dispatch(setMatchEnd({ matchID: this.props.matchID, sequence, refresh: true }));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { isAlive, scenarioRoundState } = state.player;
  const { displayName } = state.user;
  const { lobbyView } = state.navigation;
  const { lifeState } = state.player;
  const { featureFlags } = state;
  const matchID = state.match.currentRound?.roundID;
  return {
    ...ownProps,
    isAlive,
    matchID,
    featureFlags,
    scenarioRoundState,
    displayName,
    lobbyView,
    profile: state.profile,
    lifeState
  };
}

export default connect(mapStateToProps)(HUD);
