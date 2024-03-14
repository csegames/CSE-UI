/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { ObjectivesList } from '../../../../redux/entitiesSlice';
import { Objective } from './Objective';
import { ObjectiveUIVisibility } from '@csegames/library/dist/_baseGame/types/Objective';
import { BaseEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';

const objectiveContainerStyle = 'MainScreen-ObjectiveContainer';

interface ComponentProps {}

interface InjectedProps {
  objectives: ObjectivesList;
}

type Props = ComponentProps & InjectedProps;

class AObjectivesContainer extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div id='ObjectivesContainer_HUD' className={objectiveContainerStyle}>
        {this.getObjectives()}
      </div>
    );
  }

  private getObjectives() {
    //as this component is in the HUD instead of the WorldSpace-UI, we can ignore anything that isn't set to a visiblity state compatible with the hud.
    const objectiveIDS: string[] = Object.keys(this.props.objectives).filter((curObjectiveID: string): boolean => {
      const curObjectiveState: BaseEntityStateModel = this.props.objectives[curObjectiveID];

      const visibilitySetToHUD: boolean = (curObjectiveState.objective.visibility & ObjectiveUIVisibility.Hud) !== 0;

      return visibilitySetToHUD;
    });

    objectiveIDS.sort();

    return objectiveIDS.map((curObjectiveID: string, index: number) => {
      return (
        <Objective
          key={curObjectiveID}
          objectiveID={curObjectiveID}
          hideDirectionArrow={false}
          hideDistanceText={false}
        />
      );
    });
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps): Props {
  return {
    objectives: state.entities.objectives || {}
  };
}

export const ObjectivesContainer = connect(mapStateToProps)(AObjectivesContainer);
