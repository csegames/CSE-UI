/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { HUDHorizontalAnchor, HUDLayer, HUDVerticalAnchor, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import PlayerUnitFrame from './PlayerUnitFrame';
import { camelotMocks } from '@csegames/library/dist/camelotunchained/camelotMockData';
import { ClassDefGQL } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

// Styles.
const Root = 'HUD-SelfUnitFrame-Root';

interface ReactProps {}

interface InjectedProps {
  player: PlayerEntityStateModel;
  classesByNumericID: Dictionary<ClassDefGQL>;
}

type Props = ReactProps & InjectedProps;

class ASelfUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    const player: PlayerEntityStateModel = this.props.player ?? mockData;
    return (
      <div className={Root}>
        <PlayerUnitFrame
          entityID={player.entityID}
          isAlive={player.isAlive}
          name={player.name}
          resources={player.resources}
          statuses={player.statuses}
          wounds={player.wounds}
          faction={player.faction}
          class={this.props.classesByNumericID[player.classID]}
        />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    player: state.player,
    classesByNumericID: state.gameDefs.classesByNumericID
  };
}

const SelfUnitFrame = connect(mapStateToProps)(ASelfUnitFrame);

const mockData: PlayerEntityStateModel = camelotMocks.createPlayerEntityState();

const WIDGET_NAME = 'Your Health Bar';
export const selfUnitFrameRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: -25
  },
  layer: HUDLayer.HUD,
  render: () => {
    return <SelfUnitFrame />;
  }
};
