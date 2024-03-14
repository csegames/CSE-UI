/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { PlayerTracker } from './PlayerTracker';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';

const PlayerTrackersContainer = 'PlayerTrackers-PlayerTrackersContainer';

interface ComponentProps {}
interface InjectedProps {
  playerDirections: Dictionary<EntityDirection>;
}

type Props = ComponentProps & InjectedProps;

class APlayerTrackers extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div id='PlayerTrackersContainer_HUD' className={PlayerTrackersContainer}>
        {this.getPlayerTrackers()}
      </div>
    );
  }

  private getPlayerTrackers(): JSX.Element[] {
    const trackers: JSX.Element[] = [];

    Object.keys(this.props.playerDirections).forEach((curID) => {
      trackers.push(<PlayerTracker key={curID} playerName={curID} />);
    });

    return trackers;
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps): Props {
  return {
    playerDirections: state.game.playerDirections
  };
}

export const PlayerTrackers = connect(mapStateToProps)(APlayerTrackers);
