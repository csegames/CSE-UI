/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ObjectivesList } from '../../../../redux/entitiesSlice';
import { ObjectiveTracker } from './ObjectiveTracker';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { BaseEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { ObjectiveUIVisibility } from '@csegames/library/dist/_baseGame/types/Objective';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';

const ObjectiveTrackersContainer = 'ObjectiveTrackers-ObjectiveTrackersContainer';

interface ComponentProps {}
interface InjectedProps {
  objectives: ObjectivesList;
  entityDirections: Dictionary<EntityDirection>;
}

type Props = ComponentProps & InjectedProps;

class AObjectiveTracker extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div id='ObjectiveTrackersContainer_HUD' className={ObjectiveTrackersContainer}>
        {this.getObjectiveTrackers()}
      </div>
    );
  }

  private getObjectiveTrackers(): JSX.Element[] {
    const trackers: JSX.Element[] = [];

    for (let objectiveID in this.props.objectives) {
      const obj: BaseEntityStateModel = this.props.objectives[objectiveID];
      if (
        (obj.objective.visibility & ObjectiveUIVisibility.ScreenEdge) !== 0 &&
        this.props.entityDirections[objectiveID]
      ) {
        trackers.push(<ObjectiveTracker objectiveID={objectiveID} />);
      }
    }

    return trackers;
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps): Props {
  return {
    objectives: state.entities.objectives,
    entityDirections: state.game.entityDirections
  };
}

export const ObjectiveTrackers = connect(mapStateToProps)(AObjectiveTracker);
