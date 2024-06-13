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
  hideOverlay,
  hideRightPanel,
  isVideoParams,
  LifecyclePhase,
  Overlay,
  OverlayInstance,
  showOverlay
} from '../redux/navigationSlice';
import { RootState, store } from '../redux/store';
import Hud from './views/Hud';
import { Lobby } from './views/Lobby';
import { BottomToaster } from './BottomToaster';
import { isErrorData } from '../helpers/errorConversionHelpers';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { initializeConsole } from '../services/initialization/console';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ChampionSelect } from './views/ChampionSelect';
import { updateHUDSize } from '../redux/hudSlice';
import { RightModal } from './views/Lobby/RightModal';
import { BuildMismatchModal } from './overlays/BuildMismatchModal';
import { ChampionSelectCosmetics } from './overlays/ChampionSelectCosmetics';
import { ClaimBattlePassModal } from './overlays/ClaimBattlePassModal';
import { CreditsScreen } from './overlays/CreditsScreen';
import { DebugMenu } from './overlays/DebugMenu';
import { EmoteMenu } from './overlays/EmoteMenu';
import { EndedBattlePassModal } from './overlays/EndedBattlePassModal';
import { ErrorModal } from './overlays/ErrorModal';
import { EventAdvertisementModal } from './overlays/EventAdvertisementModal';
import { FreeBattlePassModal } from './overlays/FreeBattlePassModal';
import { FullScreenChampionDetails } from './overlays/FullScreenChampionDetails';
import { FullscreenSelectRuneMods } from './overlays/FullscreenSelectRuneMods';
import { MainMenuModal } from './overlays/MainMenu';
import { MOTDModal } from './overlays/MOTDModal';
import { NewBattlePassModal } from './overlays/NewBattlePassModal';
import { PurchaseGemsModal } from './overlays/PurchaseGemsModal';
import { PurchaseProcessingModal } from './overlays/PurchaseProcessingModal';
import { ReportPlayer } from './overlays/MainMenu/ReportPlayer';
import { RewardCollection } from './overlays/RewardCollection';
import { SetDisplayName } from './overlays/SetDisplayName';
import { Settings } from './overlays/Settings';
import { SpendQuestXPPotionsModal } from './overlays/SpendQuestXPPotionsModal';
import { VideoPlayerModal } from './overlays/VideoPlayerModal';

const overlayElements: Map<Overlay, JSX.Element> = new Map();
overlayElements.set(Overlay.ChampionDetails, <FullScreenChampionDetails />);
overlayElements.set(Overlay.ChampionSelectCosmetics, <ChampionSelectCosmetics />);
overlayElements.set(Overlay.ClaimBattlePassModal, <ClaimBattlePassModal />);
overlayElements.set(Overlay.Credits, <CreditsScreen />);
overlayElements.set(Overlay.Debug, <DebugMenu />);
overlayElements.set(Overlay.EmoteMenu, <EmoteMenu isVisible={true} />);
overlayElements.set(Overlay.EndedBattlePassModal, <EndedBattlePassModal />);
overlayElements.set(Overlay.EventAdvertisementModal, <EventAdvertisementModal />);
overlayElements.set(Overlay.FreeBattlePassModal, <FreeBattlePassModal />);
overlayElements.set(Overlay.MainMenu, <MainMenuModal />);
overlayElements.set(Overlay.MOTDModal, <MOTDModal />);
overlayElements.set(Overlay.NewBattlePassModal, <NewBattlePassModal />);
overlayElements.set(Overlay.PurchaseGems, <PurchaseGemsModal />);
overlayElements.set(Overlay.PurchaseProcessing, <PurchaseProcessingModal />);
overlayElements.set(Overlay.ReportPlayer, <ReportPlayer />);
overlayElements.set(Overlay.RewardCollection, <RewardCollection />);
overlayElements.set(Overlay.RuneMods, <FullscreenSelectRuneMods />);
overlayElements.set(Overlay.SetDisplayName, <SetDisplayName />);
overlayElements.set(Overlay.Settings, <Settings />);
overlayElements.set(Overlay.SpendQuestXPPotions, <SpendQuestXPPotionsModal />);

interface ReactProps {}

interface InjectedProps {
  initialization: InitializationState;
  lifecyclePhase: LifecyclePhase;
  overlays: OverlayInstance[];
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
        {this.props.overlays.map(this.renderOverlay.bind(this))}
        <RightModal />
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

  private renderOverlay(overlay: OverlayInstance): React.ReactNode {
    let element: JSX.Element;
    if (isErrorData(overlay.data)) {
      element = <ErrorModal error={overlay.data} />;
    } else if (isVideoParams(overlay.data)) {
      element = <VideoPlayerModal params={overlay.data} />;
    } else {
      element = overlayElements.get(overlay.data) ?? null;
    }
    return <React.Fragment key={overlay.id}>{element}</React.Fragment>;
  }

  // translate from a native code signal to a dispatched overlay request
  private handleNavigate(name: string): void {
    switch (name) {
      case 'settings':
        this.props.dispatch(showOverlay(Overlay.Settings));
        break;
      case 'gamemenu':
        // close menu system if open
        if (this.props.overlays.length > 0) {
          this.props.dispatch(hideOverlay(this.props.overlays[this.props.overlays.length - 1].data));
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
        if (this.props.overlays.some((overlay) => overlay.data === Overlay.EmoteMenu)) {
          this.props.dispatch(hideOverlay(Overlay.EmoteMenu));
        } else {
          this.props.dispatch(showOverlay(Overlay.EmoteMenu));
        }
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
  const { lifecyclePhase, overlays, rightPanelContent } = state.navigation;
  const { clientBuild, serverBuild } = state.featureFlags;
  return {
    ...ownProps,
    clientBuild,
    serverBuild,
    initialization,
    lifecyclePhase,
    overlays,
    rightPanelContent
  };
}

export default connect(mapStateToProps)(LifecycleViews);
