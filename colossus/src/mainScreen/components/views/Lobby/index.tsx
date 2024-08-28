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
import { Button } from '../../shared/Button';
import { FeatureFlags } from '../../../redux/featureFlagsSlice';
import { LobbyPartyHeader } from './LobbyPartyHeader';
import { PinnedNotices } from '../../shared/notifications/PinnedNotices';
import { getRaceIDFromCostumeForChampion } from '../../../helpers/characterHelpers';
import { ChampionGQL, PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Container = 'Fullscreen-Container'; // TODO : reorganize names
const HideButton = 'Fullscreen-HideButton';
const TopSection = 'StartScreen-TopSection';
const Hamburger = 'StartScreen-Hamburger';
const PinnedNoticesContainer = 'StartScreen-PinnedNoticesContainer';
const PlayContainer = 'StartScreen-PlayContainer';
const GenericScreenContainer = 'StartScreen-GenericScreenContainer';
const CareerStatsBGImage = 'StartScreen-CareerStatsBGImage';

const StoreBGImage = 'StartScreen-StoreBGImage';

interface ReactProps {}

interface InjectedProps extends FeatureFlags.Source {
  lobbyView: LobbyView;
  dispatch?: Dispatch;
  defaultChampionID: string;
  champions: (ChampionGQL | null)[];
  perksByID: Dictionary<PerkDefGQL>;
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

    // Update default champion audio state
    const raceID = getRaceIDFromCostumeForChampion(
      this.props.champions,
      this.props.perksByID,
      this.props.defaultChampionID
    );
    clientAPI.setUIRaceState(raceID);

    return (
      <>
        <div className={Container}>
          <div className={innerContainerClass}>{this.renderRoute()}</div>
          <div className={TopSection}>
            <div className={Hamburger} onClick={this.onHamburgerClick.bind(this)} />
            <div className={PinnedNoticesContainer}>
              <PinnedNotices />
            </div>
            <NavMenu />
            <LobbyPartyHeader />
          </div>
        </div>
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
        return <BattlePass />;
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

  const { defaultChampionID, champions } = state.profile;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    lobbyView,
    featureFlags: state.featureFlags,
    defaultChampionID,
    champions,
    perksByID
  };
}

export const Lobby = connect(mapStateToProps)(ALobby);
