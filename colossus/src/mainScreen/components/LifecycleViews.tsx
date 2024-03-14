/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GameStats } from './views/GameStats';
import { InitializationState } from '../redux/initializationSlice';
import {
  hideAllOverlays,
  hideRightPanel,
  isVideoParams,
  LifecyclePhase,
  Overlay,
  OverlayFieldType,
  showOverlay
} from '../redux/navigationSlice';
import { RootState, store } from '../redux/store';
import { CreditsScreen } from './overlays/CreditsScreen';
import { MainMenuModal } from './overlays/MainMenu';
import { SetDisplayName } from './overlays/SetDisplayName';
import { Settings } from './overlays/Settings';
import { EmoteMenu } from './overlays/EmoteMenu';
import Hud from './views/Hud';
import { Lobby } from './views/Lobby';
import { BottomToaster } from './BottomToaster';
import { BuildMismatchModal } from './overlays/BuildMismatchModal';
import { ErrorModal } from './overlays/ErrorModal';
import { isErrorData } from '../helpers/errorConversionHelpers';
import { VideoPlayerModal } from './overlays/VideoPlayerModal';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { initializeConsole } from '../services/initialization/console';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ChampionSelect } from './views/ChampionSelect';
import { RewardCollection } from './overlays/RewardCollection';
import { updateHUDSize } from '../redux/hudSlice';
import { FreeBattlePassModal } from './overlays/FreeBattlePassModal';
import { SpendQuestXPPotionsModal } from './overlays/SpendQuestXPPotionsModal';
import { NewBattlePassModal } from './overlays/NewBattlePassModal';
import { DebugMenu } from './overlays/DebugMenu';
import { EndedBattlePassModal } from './overlays/EndedBattlePassModal';
import { ClaimBattlePassModal } from './overlays/ClaimBattlePassModal';
import { FullscreenSelectRuneMods } from './overlays/FullscreenSelectRuneMods';
import { FullScreenChampionDetails } from './overlays/FullScreenChampionDetails';
import { PurchaseProcessingModal } from './overlays/PurchaseProcessingModal';
import { ReportPlayer } from './overlays/MainMenu/ReportPlayer';

interface ReactProps {}

interface InjectedProps {
  initialization: InitializationState;
  lifecyclePhase: LifecyclePhase;
  overlay: OverlayFieldType;
  rightPanelContent: React.ReactNode;
  clientBuild: number;
  serverBuild: number | null;
  dispatch?: Dispatch;
}

const slashCommands = new SlashCommandRegistry<RootState>(() => store.getState());
initializeConsole(slashCommands);

type Props = ReactProps & InjectedProps;

class LifecycleViews extends React.Component<Props> {
  private onNavigate: ListenerHandle = null;

  public componentDidMount(): void {
    // React doesn't inherently detect resizes in a way that triggers all of the updates we need,
    // so we listen at the window level, and anyone who cares can watch the size via Redux.
    window.addEventListener('resize', this.reportCurrentSize.bind(this));

    this.onNavigate = clientAPI.bindNavigateListener(this.handleNavigate.bind(this));

    game.setSelectedEmoteIndex(0);
  }

  public componentWillUnmount(): void {
    this.onNavigate?.close();
    this.onNavigate = null;
  }

  public render(): React.ReactNode {
    if (!this.props.initialization.completed) {
      return null;
    }
    this.reportCurrentSize();
    if (this.hasBuildMismatch()) {
      return <BuildMismatchModal serverIsNewer={this.props.serverBuild > this.props.clientBuild} />;
    }
    return (
      <>
        {this.renderLifecycle()}
        {this.renderOverlay()}
        <BottomToaster />
      </>
    );
  }

  private renderLifecycle(): React.ReactNode {
    switch (this.props.lifecyclePhase) {
      case LifecyclePhase.ChampionSelect:
        return <ChampionSelect />;
      case LifecyclePhase.Lobby:
        return <Lobby />;
      case LifecyclePhase.Playing:
        return <Hud slashCommands={slashCommands} />;
      case LifecyclePhase.GameStats:
        return <GameStats />;
      default:
        return null;
    }
  }

  private renderOverlay(): React.ReactNode {
    if (isErrorData(this.props.overlay)) {
      return <ErrorModal error={this.props.overlay} />;
    }
    if (isVideoParams(this.props.overlay)) {
      return <VideoPlayerModal params={this.props.overlay} />;
    }
    switch (this.props.overlay) {
      case Overlay.ChampionDetails:
        return <FullScreenChampionDetails />;
      case Overlay.ClaimBattlePassModal:
        return <ClaimBattlePassModal />;
      case Overlay.Credits:
        return <CreditsScreen />;
      case Overlay.Debug:
        return <DebugMenu />;
      case Overlay.EmoteMenu:
        return <EmoteMenu isVisible={true} />;
      case Overlay.EndedBattlePassModal:
        return <EndedBattlePassModal />;
      case Overlay.FreeBattlePassModal:
        return <FreeBattlePassModal />;
      case Overlay.MainMenu:
        return <MainMenuModal />;
      case Overlay.NewBattlePassModal:
        return <NewBattlePassModal />;
      case Overlay.PurchaseProcessing:
        return <PurchaseProcessingModal />;
      case Overlay.ReportPlayer:
        return <ReportPlayer />;
      case Overlay.RewardCollection:
        return <RewardCollection />;
      case Overlay.SetDisplayName:
        return <SetDisplayName />;
      case Overlay.SpendQuestXPPotions:
        return <SpendQuestXPPotionsModal />;
      case Overlay.Settings:
        return <Settings />;
      case Overlay.RuneMods:
        return <FullscreenSelectRuneMods />;
      default:
        return null;
    }
  }

  // translate from a native code signal to a dispatched overlay request
  private handleNavigate(name: string): void {
    switch (name) {
      case 'settings':
        this.props.dispatch(showOverlay(Overlay.Settings));
        break;
      case 'gamemenu':
        // close menu system if open
        if (this.props.overlay !== null) {
          this.props.dispatch(hideAllOverlays());
          break;
        }
        if (this.props.rightPanelContent !== null) {
          this.props.dispatch(hideRightPanel());
          break;
        }
        // otherwise open root menu
        this.props.dispatch(showOverlay(Overlay.MainMenu));
        break;
      case 'emotemenu':
        this.props.dispatch(showOverlay(Overlay.EmoteMenu));
        break;
    }
  }

  private reportCurrentSize(): void {
    if (window.innerWidth > 0) {
      this.props.dispatch(updateHUDSize([window.innerWidth, window.innerHeight]));
    }
  }

  // we want to be able to mix local development and shard builds while debugging, so sanity
  // check for local dev (build 0) before we attempt to compare the actual build numbers
  private hasBuildMismatch(): boolean {
    return this.props.clientBuild && this.props.serverBuild && this.props.clientBuild != this.props.serverBuild;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const initialization = state.initialization;
  const { lifecyclePhase, overlay, rightPanelContent } = state.navigation;
  const { clientBuild, serverBuild } = state.featureFlags;
  return {
    ...ownProps,
    clientBuild,
    serverBuild,
    initialization,
    lifecyclePhase,
    overlay,
    rightPanelContent
  };
}

export default connect(mapStateToProps)(LifecycleViews);
