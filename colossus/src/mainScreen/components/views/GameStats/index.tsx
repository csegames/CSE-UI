/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  OvermindSummaryGQL,
  ScenarioResolution,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';

import { StatsList } from './StatsList';
import { SummaryMVP } from './SummaryMVP';
import { ScorePanelItem } from './ScorePanelItem';
import { Button } from '../../shared/Button';
import { game } from '@csegames/library/dist/_baseGame';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Dispatch } from 'redux';
import { MatchEndSequence, setMatchEnd } from '../../../redux/matchSlice';
import { PlayerProgression } from './PlayerProgression';
import { startProfileRefresh } from '../../../redux/profileSlice';
import { AccountID, ScenarioDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';
import { updateMutedAll } from '../../../redux/voiceChatSlice';

const Container = 'GameStats-Container';
const TopContainer = 'GameStats-TopContainer';
const TitleContainer = 'GameStats-TitleContainer';
const OutcomeText = 'GameStats-OutcomeText';
const TeamStats = 'GameStats-TeamStats';
const TeamStatName = 'GameStats-TeamStatName';
const ScenarioTitleContainer = 'GameStats-ScenarioTitleContainer';
const MatchSummary = 'GameStats-MatchSummary';
const ScenarioName = 'GameStats-ScenarioName';
const MainSection = 'GameStats-MainSection';
const StatsTabSection = 'GameStats-StatsTabSection';
const ButtonStyle = 'GameStats-Button';
const ButtonMargin = 'GameStats-ButtonMargin';
const TabsContainer = 'GameStats-TabsContainer';
const Tab = 'GameStats-Tab';
const TabSeparator = 'GameStats-TabSeparator';
const ConsoleIcon = 'GameStats-ConsoleIcon';

const ScorePanelContainer = 'GameStats-ScorePanelContainer';

const StringIDGameStatsVictory = 'GameStatsVictory';
const StringIDGameStatsDefeat = 'GameStatsDefeat';
const StringIDGameStatsMatchSummary = 'GameStatsMatchSummary';
const StringIDGameStatsFinalScore = 'GameStatsFinalScore';
const StringIDGameStatsMatchOverview = 'GameStatsMatchOverview';
const StringIDGameStatsMVP = 'GameStatsMVP';
const StringIDGameStatsLeaderboard = 'GameStatsLeaderboard';
const StringIDGameStatsPlayerStats = 'GameStatsPlayerStats';
const StringIDGameStatsLeave = 'GameStatsLeave';

interface ReactProps {}

interface InjectedProps {
  matchID: string;
  overmindSummary: OvermindSummaryGQL;
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  scenarioDef: ScenarioDefGQL;
  accountID: AccountID;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

enum CurrentTab {
  MVP,
  Progression,
  Leaderboard,
  MatchOverview
}

interface State {
  currentTab: CurrentTab;
  closedMVPPage: boolean;
  fetchedProfile: boolean;
  timeoutHandle: number;
}

class AGameStats extends React.Component<Props, State> {
  private hasSeenSummary: boolean = false;
  constructor(props: Props) {
    super(props);

    this.state = {
      currentTab: CurrentTab.MVP,
      closedMVPPage: false,
      fetchedProfile: false,
      timeoutHandle: window.setTimeout(this.onTimeout.bind(this), 5000) // do not freeze on this page
    };
  }

  public render() {
    this.tryFetchProfile();
    const backgroundImage =
      this.props.scenarioDef?.summaryBackgroundImage ?? 'images/fullscreen/gamestats/end-match-bg.jpg';
    return (
      <div className={Container} style={{ backgroundImage: `url("${backgroundImage}")` }}>
        {this.tryRenderStats()}
      </div>
    );
  }

  private tryRenderStats(): JSX.Element {
    const { overmindSummary } = this.props;
    if (overmindSummary?.resolution != ScenarioResolution.Finished) {
      // TODO : display loading screen / spinner
      return null;
    }
    const winLoseClass = this.scenarioWon() ? 'victory' : 'defeat';
    const winLoseText = this.scenarioWon()
      ? getStringTableValue(StringIDGameStatsVictory, this.props.stringTable)
      : getStringTableValue(StringIDGameStatsDefeat, this.props.stringTable);
    const displayName = this.props.scenarioDef?.name ?? '';

    const scoreTokens = { SCORE: printWithSeparator(this.getTotalScore(overmindSummary), ',') };
    return (
      <>
        <div className={`${TopContainer} ${winLoseClass}`}>
          <div className={TitleContainer}>
            <div className={ScenarioTitleContainer}>
              <div className={MatchSummary}>
                {getStringTableValue(StringIDGameStatsMatchSummary, this.props.stringTable)}
              </div>
              <div className={ScenarioName}>{displayName}</div>
            </div>
            <div className={`${OutcomeText} ${winLoseClass}`}>{winLoseText}</div>
            <div className={TeamStats}>
              <div className={TeamStatName}>
                {getTokenizedStringTableValue(StringIDGameStatsFinalScore, this.props.stringTable, scoreTokens)}
              </div>
            </div>
          </div>
        </div>
        <div className={MainSection}>
          {this.renderTabButtons()}
          {this.state.closedMVPPage && <div className={TabSeparator} />}
          <div className={StatsTabSection}>{this.tryRenderCurrentPage()}</div>
          {this.state.closedMVPPage && <div className={ButtonMargin}>{this.renderLeaveButton()}</div>}
        </div>
      </>
    );
  }

  private tryFetchProfile(): void {
    // in order for the summary page to show the correct amount of xp gain, we must have
    // an up to date version of the  profile with the new overmind summary applied.
    // To ensure this happens, we're doing a one time fetch of the summary when we open this page,
    // after we've pulled down the overmind summary.  This is really a hack, which will become unnecessary
    // once we have subscriptions for profile updates.
    if (!this.state.fetchedProfile && this.props.overmindSummary != null) {
      this.props.dispatch(startProfileRefresh());
      this.setState({ fetchedProfile: true });
    }
  }

  private onTimeout(): void {
    // safety net: if we can't load data in timely fashion, move to the lobby
    if (this.props.overmindSummary != null) return;
    this.props.dispatch(
      setMatchEnd({ matchID: this.props.matchID, sequence: MatchEndSequence.GotoLobby, refresh: true })
    );
  }

  private renderTabButtons(): JSX.Element {
    if (this.state.closedMVPPage == false) {
      return null;
    }

    return (
      <div className={TabsContainer}>
        {this.renderTab(CurrentTab.MVP, StringIDGameStatsMVP)}
        {this.allowPlayerProgressTab() && this.renderTab(CurrentTab.Progression, StringIDGameStatsPlayerStats)}
        {this.renderMatchOverview()}
        {this.renderTab(CurrentTab.Leaderboard, StringIDGameStatsLeaderboard)}
      </div>
    );
  }

  private renderMatchOverview(): JSX.Element {
    if (this.allowMatchOverviewTab()) {
      return this.renderTab(CurrentTab.MatchOverview, StringIDGameStatsMatchOverview);
    }
  }

  private renderTab(tab: CurrentTab, stringID: string): JSX.Element {
    const selectedStyle = this.getCurrentTab() == tab ? 'Selected' : '';
    return (
      <div className={`${Tab} ${selectedStyle}`} onClick={this.openTab.bind(this, tab)}>
        {getStringTableValue(stringID, this.props.stringTable)}
      </div>
    );
  }

  private openTab(tab: CurrentTab) {
    this.setState({ currentTab: tab });
  }

  private tryRenderCurrentPage(): JSX.Element {
    if (this.props.overmindSummary.characterSummaries == null) {
      return null;
    }

    switch (this.getCurrentTab()) {
      case CurrentTab.Progression:
        const animate = !this.hasSeenSummary;
        this.hasSeenSummary = true;
        return <PlayerProgression shouldAnimateExperienceBars={animate} />;
      case CurrentTab.Leaderboard:
        return <StatsList />;
      case CurrentTab.MatchOverview:
        return this.renderScorePanels();
      case CurrentTab.MVP:
        return (
          <SummaryMVP
            overmindSummary={this.props.overmindSummary}
            initialPageShow={this.state.closedMVPPage == false}
            onClose={this.onCloseMVPPage.bind(this)}
          />
        );
    }
  }

  private onCloseMVPPage(): void {
    var newTab: CurrentTab = CurrentTab.Leaderboard;
    if (this.allowPlayerProgressTab()) {
      newTab = CurrentTab.Progression;
    } else if (this.allowMatchOverviewTab()) {
      newTab = CurrentTab.MatchOverview;
    }

    this.setState({ closedMVPPage: true, currentTab: newTab });
  }

  private renderScorePanels(): JSX.Element {
    const showOnFirstRow = Math.max(3, Math.ceil(this.props.overmindSummary.scorePanels.length / 2));

    return (
      <div>
        <div className={ScorePanelContainer}>
          {this.props.overmindSummary.scorePanels.map((panel, index) => {
            return index < showOnFirstRow ? <ScorePanelItem key={index} scorePanel={panel} /> : null;
          })}
        </div>
        <div className={ScorePanelContainer}>
          {this.props.overmindSummary.scorePanels.map((panel, index) => {
            return index >= showOnFirstRow ? <ScorePanelItem key={index} scorePanel={panel} /> : null;
          })}
        </div>
      </div>
    );
  }

  private scenarioWon(): boolean {
    const { overmindSummary } = this.props;
    const player = overmindSummary.characterSummaries.find((p) => p.accountID == this.props.accountID);
    return (
      player &&
      overmindSummary.winningTeamIDs &&
      overmindSummary.winningTeamIDs.find((teamID) => player.teamID == teamID) != null
    );
  }

  private getCurrentTab(): CurrentTab {
    // only show the progression tab if the scenario supports progression
    if (this.state.currentTab == CurrentTab.Progression && !this.allowPlayerProgressTab()) {
      return CurrentTab.MatchOverview;
    }

    return this.state.currentTab;
  }

  private allowPlayerProgressTab(): boolean {
    return this.props.scenarioDef != null && this.props.scenarioDef.showPlayerProgressionTab;
  }

  private allowMatchOverviewTab(): boolean {
    return (
      this.props.overmindSummary != null &&
      this.props.overmindSummary.scorePanels != null &&
      this.props.overmindSummary.scorePanels.length > 0
    );
  }

  private getTotalScore(overmindSummary: OvermindSummaryGQL): number {
    if (!overmindSummary || !overmindSummary.scorePanels) {
      return totalScore;
    }
    var totalScore: number = 0;
    for (const panel of overmindSummary.scorePanels) {
      totalScore += panel.instance.score;
    }

    return totalScore;
  }

  private renderLeaveButton(): JSX.Element {
    return this.props.usingGamepad && this.props.usingGamepadInMainMenu ? (
      <Button
        type='blue'
        text={
          <>
            <span className={`${ConsoleIcon} icon-xb-b`} />{' '}
            {getStringTableValue(StringIDGameStatsLeave, this.props.stringTable)}
          </>
        }
        styles={ButtonStyle}
      />
    ) : (
      <Button
        type='blue'
        text={getStringTableValue(StringIDGameStatsLeave, this.props.stringTable)}
        onClick={this.onLeaveClick.bind(this)}
        styles={ButtonStyle}
      />
    );
  }

  public componentDidMount() {
    game.releaseMouseCapture();
    game.playGameSound(SoundEvents.PLAY_EPILOGUE_1);
  }

  public componentWillUnmount() {
    game.playGameSound(SoundEvents.PLAY_SCENARIO_RESET);
    window.clearTimeout(this.state.timeoutHandle);
  }

  private onLeaveClick(): void {
    this.props.dispatch(startProfileRefresh());
    this.props.dispatch(updateMutedAll(false));
    this.props.dispatch(
      setMatchEnd({ matchID: this.props.matchID, sequence: MatchEndSequence.GotoLobby, refresh: true })
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { overmindSummary } = state.gameStats;
  const accountID = state.user.id;
  const scenarioDef = state.scenarios.scenarioDefs[overmindSummary?.scenarioID];
  const matchID = state.match.currentRound?.roundID;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    matchID,
    overmindSummary,
    usingGamepad,
    usingGamepadInMainMenu,
    scenarioDef,
    accountID,
    stringTable
  };
}

export const GameStats = connect(mapStateToProps)(AGameStats);
