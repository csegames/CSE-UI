/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { NavMenu } from './NavMenu';
import { Play } from './Play';
import { ChampionProfile } from './ChampionProfile';
import { Store } from './Store';
import { BattlePass } from './BattlePass';
import { CareerStats } from './CareerStats';
import { Leaderboards } from './Leaderboards';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { LifecyclePhase, LobbyView, Overlay, setLifecycleOverride, showOverlay } from '../../../redux/navigationSlice';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RightModal } from './RightModal';
import { FullscreenSelectEmote } from './FullscreenSelectEmote';
import { FullscreenSelectSkin } from './FullscreenSelectSkin';
import { FullscreenSelectWeapon } from './FullscreenSelectWeapon';
import { Button } from '../../shared/Button';
import { FullScreenSelectAppearance } from './FullScreenSelectAppearance';
import { FeatureFlags } from '../../../redux/featureFlagsSlice';
import { LobbyPartyHeader } from './LobbyPartyHeader';

const Container = 'Fullscreen-Container'; // TODO : reorganize names
const HideButton = 'Fullscreen-HideButton';
const TopSection = 'StartScreen-TopSection';
const Hamburger = 'StartScreen-Hamburger';
const PlayContainer = 'StartScreen-PlayContainer';
const GenericScreenContainer = 'StartScreen-GenericScreenContainer';
const CareerStatsBGImage = 'StartScreen-CareerStatsBGImage';

const StoreBGImage = 'StartScreen-StoreBGImage';

interface ReactProps {}

interface InjectedProps extends FeatureFlags.Source {
  lobbyView: LobbyView;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALobby extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      shouldShowEndOfSeason: false
    };
  }

  public render() {
    const innerContainerClass = this.props.lobbyView == LobbyView.Play ? PlayContainer : GenericScreenContainer;

    return (
      <>
        <div className={Container}>
          <div className={innerContainerClass}>{this.renderRoute()}</div>
          <div className={TopSection}>
            <div className={Hamburger} onClick={this.onHamburgerClick.bind(this)} />
            <NavMenu />
            <LobbyPartyHeader />
          </div>
        </div>
        <RightModal />
        {!game.isPublicBuild && (
          <div className={HideButton} onClick={() => this.props.dispatch(setLifecycleOverride(LifecyclePhase.Playing))}>
            <Button type='blue' text='Hide Full Screen UI' />
          </div>
        )}
      </>
    );
  }

  public componentDidMount() {
    // TODO : move once legacy matchmaking has been removed
    game.playGameSound(SoundEvents.PLAY_USER_FLOW_LOBBY);
  }

  private onHamburgerClick() {
    this.props.dispatch(showOverlay(Overlay.MainMenu));
  }

  private renderRoute() {
    switch (this.props.lobbyView) {
      case LobbyView.BattlePass:
        return (
          <BattlePass />
        );
      case LobbyView.CareerStats:
        return (
          <>
            <div className={CareerStatsBGImage} />
            <CareerStats />
          </>
        );
      case LobbyView.Champions:
        return <ChampionProfile />;
      case LobbyView.Leaderboards:
        return <Leaderboards />;
      case LobbyView.Play:
        return <Play />;
      case LobbyView.SelectEmote:
        return <FullscreenSelectEmote />;
      case LobbyView.SelectSkin:
        return <FullscreenSelectSkin />;
      case LobbyView.SelectWeapon:
        return <FullscreenSelectWeapon />;
      case LobbyView.SelectAppearance:
        return <FullScreenSelectAppearance />;
      case LobbyView.Store:
        return (
          <>
            <div className={StoreBGImage} />
            <Store />
          </>
        );
      default:
        return null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { lobbyView } = state.navigation;

  return {
    ...ownProps,
    lobbyView,
    featureFlags: state.featureFlags
  };
}

export const Lobby = connect(mapStateToProps)(ALobby);
