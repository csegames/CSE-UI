/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { BaseEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { Objective } from '../Objectives/Objective';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { Vec2f } from '@csegames/library/dist/hordetest/webAPI/definitions';

const Container = 'EntityTrackers-EntityTracker-Container';

interface ObjectiveTrackStyles {
  left: string | number;
  right: string | number;
  top: string | number;
  bottom: string | number;
  width: string;
  height: string;
  transition: string;
  flexDirection: 'column' | 'row';
  justifyContent: 'flex-start' | 'flex-end';
}

interface InjectedProps {
  screenPos: Vec2f;
  objective: BaseEntityStateModel;
}

interface ReactProps {
  objectiveID: string;
}

type Props = InjectedProps & ReactProps;

class AObjectiveTracker extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private getStyle(): ObjectiveTrackStyles {
    const { screenPos } = this.props;

    let xFlush = false;
    let yFlush = false;

    let left: string | number = 'auto';
    let right: string | number = 'auto';
    let top: string | number = 'auto';
    let bottom: string | number = 'auto';
    let transition = '';
    let flexDirection: 'column' | 'row';
    let justifyContent: 'flex-start' | 'flex-end';
    let width = 'auto';
    let height = 'auto';

    if (screenPos.x <= 0) {
      left = 0;
      flexDirection = 'row';
      justifyContent = 'flex-start';
      xFlush = true;
      width = '25vmin';
    }

    if (screenPos.x > 1) {
      right = 0;
      flexDirection = 'row';
      justifyContent = 'flex-end';
      xFlush = true;
      width = '25vmin';
    }

    if (screenPos.y <= 0) {
      top = 0;
      flexDirection = 'column';
      justifyContent = 'flex-start';
      yFlush = true;
      height = '25vmin';
    }

    if (screenPos.y > 1) {
      bottom = 0;
      flexDirection = 'column';
      justifyContent = 'flex-end';
      yFlush = true;
      height = '25vmin';
    }

    if (!xFlush) {
      left = `${screenPos.x * 95}%`;
    }

    if (!yFlush) {
      top = `${screenPos.y * 92}%`;
    }

    const ret: ObjectiveTrackStyles = {
      top: top,
      right: right,
      bottom: bottom,
      left: left,
      width: width,
      height: height,
      transition: transition,
      flexDirection: flexDirection,
      justifyContent: justifyContent
    };

    return ret;
  }

  public render() {
    const style = this.getStyle();

    return (
      <div className={Container} style={style}>
        <Objective objectiveID={this.props.objectiveID} hideDirectionArrow={true} hideDistanceText={true} />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const objective = state.entities.objectives[ownProps.objectiveID];
  const tracker: EntityDirection = state.game.entityDirections[ownProps.objectiveID];
  const screenPos: Vec2f = tracker != null ? tracker.screenPos : { x: 0, y: 0 };

  return {
    objective: objective,
    screenPos: screenPos,
    ...ownProps
  };
}

export const ObjectiveTracker = connect(mapStateToProps)(AObjectiveTracker);
