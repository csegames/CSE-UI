/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import {
  AnyEntityStateModel,
  isPlayer,
  PlayerEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { HUDHorizontalAnchor, HUDLayer, HUDVerticalAnchor, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import PlayerUnitFrame from './PlayerUnitFrame';
import NonPlayerUnitFrame from './NonPlayerUnitFrame';
import { camelotMocks } from '@csegames/library/dist/camelotunchained/camelotMockData';
import { ClassDefGQL } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

// Styles.
const Root = 'HUD-TargetUnitFrame-Root';

interface ReactProps {
  isFriendly: boolean;
}

interface InjectedProps {
  target: AnyEntityStateModel;
  selectedWidgetID: string;
  classesByNumericID: Dictionary<ClassDefGQL>;
}

type Props = ReactProps & InjectedProps;

class ATargetUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    const isSelected =
      (this.props.isFriendly && this.props.selectedWidgetID === WIDGET_NAME_FRIENDLY) ||
      (!this.props.isFriendly && this.props.selectedWidgetID === WIDGET_NAME_ENEMY);

    if (!this.props.target && !isSelected) {
      return null;
    }
    const target: AnyEntityStateModel = this.props.target ? this.props.target : mockData;

    return (
      <div className={Root}>
        {isPlayer(target) ? (
          <PlayerUnitFrame
            entityID={target.entityID}
            isAlive={target.isAlive}
            name={target.name}
            position={target.position}
            resources={target.resources}
            statuses={target.statuses}
            showDistance={true}
            wounds={target.wounds}
            faction={target.faction}
            class={this.props.classesByNumericID[target.classID]}
          />
        ) : (
          <NonPlayerUnitFrame entity={target} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedWidgetId: selectedWidgetID } = state.hud.editor;
  return {
    ...ownProps,
    target: ownProps.isFriendly ? state.entities.friendlyTarget : state.entities.enemyTarget,
    selectedWidgetID,
    classesByNumericID: state.gameDefs.classesByNumericID
  };
}

const TargetUnitFrame = connect(mapStateToProps)(ATargetUnitFrame);

const mockData: PlayerEntityStateModel = camelotMocks.createPlayerEntityState();

const WIDGET_NAME_FRIENDLY = 'Friendly Target';
export const friendlyTargetUnitFrameRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_FRIENDLY,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 37,
    yOffset: -11
  },
  layer: HUDLayer.HUD,
  render: () => {
    return <TargetUnitFrame isFriendly={true} />;
  }
};

const WIDGET_NAME_ENEMY = 'Enemy Target';
export const enemyTargetUnitFrameRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_ENEMY,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 37.6,
    yOffset: 19
  },
  layer: HUDLayer.HUD,
  render: () => {
    return <TargetUnitFrame isFriendly={false} />;
  }
};
