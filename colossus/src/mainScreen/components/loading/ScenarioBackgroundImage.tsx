/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { ChampionInfo, PerkDefGQL, ScenarioDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Round } from '../../../mainScreen/redux/matchSlice';

const Background = 'LoadingScreen-ScenarioBackgroundImage';

interface InjectedProps {
  currentRound: Round;
  scenarioDefs: Dictionary<ScenarioDefGQL>;
  championIDToChampion: Dictionary<ChampionInfo>;
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

interface ReactProps {}

class AScenarioBackgroundImage extends React.Component<Props> {
  public render(): JSX.Element {
    const image =
      this.props.scenarioDefs[this.props.currentRound?.scenarioID]?.loadingBackgroundImage ??
      'images/fullscreen/loadingscreen/bg-battle.jpg';
    return <img className={Background} src={image} />;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRound } = state.match;
  const { scenarioDefs } = state.scenarios;
  const { championIDToChampion } = state.championInfo;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    currentRound,
    scenarioDefs,
    championIDToChampion,
    perksByID
  };
}

export const ScenarioBackgroundImage = connect(mapStateToProps)(AScenarioBackgroundImage);
