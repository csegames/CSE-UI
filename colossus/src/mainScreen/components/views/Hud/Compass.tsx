/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { EntityList } from '../../../redux/entitiesSlice';
import { RootState } from '../../../redux/store';
import { ObjectivesList } from '../../../redux/entitiesSlice';
import { ObjectiveDetailsList } from '../../../redux/gameSlice';
import { ObjectiveDetailsProgressBar } from './Objectives/ObjectiveDetails';
import { isItem, ItemEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/ItemEntityState';
import {
  ObjectiveDetailMessageState,
  ObjectiveDetailState,
  ObjectiveUIVisibility
} from '@csegames/library/dist/_baseGame/types/Objective';
import { ObjectiveState, Vec3f } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { BossHealthBars } from './Objectives/BossHealthBars';
import {
  BaseEntityStateModel,
  PlayerEntityStateModel,
  EntityPositionMapModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { getBearingDegreesForWorldLocation } from '../../../redux/playerSlice';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'Compass-Container';
const CompassContainer = 'Compass-CompassContainer';
const TopBorder = 'Compass-TopBorder';
const GradientBackground = 'Compass-GradientBackground';
const IndicatorContainer = 'Compass-IndicatorContainer';
const IndicatorNumber = 'Compass-IndicatorNumber';
const Indicator = 'Compass-Indicator';
const Cardinal = 'Compass-Cardinal';
const Objective = 'Compass-Objective';
const ObjectiveIndicator = 'Compass-ObjectiveIndicator';
const PrimaryObjectiveDetailsContainer = 'Compass-PrimaryObjectiveDetailsContainer';
const PrimaryObjectiveDetailsWrap = 'Compass-PrimaryObjectiveDetailsWrap';
const PrimaryObjectiveDetailsState = 'Compass-PrimaryObjectiveDetailsState';
const PrimaryObjectiveDetailsTitle = 'Compass-PrimaryObjectiveDetailsTitle';

const PrimaryObjectiveDetailsText = 'Compass-PrimaryObjectiveDetailsText';

const StringIDHUDCompassDirectionNorth = 'HUDCompassDirectionNorth';
const StringIDHUDCompassDirectionNorthEast = 'HUDCompassDirectionNorthEast';
const StringIDHUDCompassDirectionEast = 'HUDCompassDirectionEast';
const StringIDHUDCompassDirectionSouthEast = 'HUDCompassDirectionSouthEast';
const StringIDHUDCompassDirectionSouth = 'HUDCompassDirectionSouth';
const StringIDHUDCompassDirectionSouthWest = 'HUDCompassDirectionSouthWest';
const StringIDHUDCompassDirectionWest = 'HUDCompassDirectionWest';
const StringIDHUDCompassDirectionNorthWest = 'HUDCompassDirectionNorthWest';

interface ComponentProps {}

interface InjectedProps {
  objectives: ObjectivesList;
  primaryObjectiveDetails: ObjectiveDetailsList;
  positions: EntityPositionMapModel;
  lastUpdatedTime: number;
  scenarioRoundStartTime: number;
  viewBearing: number;
  viewOrigin: Vec3f;
  bosses: EntityList;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ComponentProps & InjectedProps;

class ACompass extends React.Component<Props, {}> {
  public name: string = 'Compass';

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const facing: number = this.props.viewBearing;
    return (
      <div id='Compass_HUD' className={Container}>
        <div className={CompassContainer}>
          <div className={TopBorder} />
          <div className={GradientBackground} />
          <div className={IndicatorContainer}>
            <div className={IndicatorNumber}>{Math.round(facing)}</div>
            <div className={Indicator} />
          </div>
          <div className={`${Cardinal} direction`} style={this.positionStyle(facing, 0)}>
            {getStringTableValue(StringIDHUDCompassDirectionNorth, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 15)}>
            15
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 30)}>
            30
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 45)}>
            {getStringTableValue(StringIDHUDCompassDirectionNorthEast, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 60)}>
            60
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 75)}>
            75
          </div>
          <div className={`${Cardinal} direction`} style={this.positionStyle(facing, 90)}>
            {getStringTableValue(StringIDHUDCompassDirectionEast, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 105)}>
            105
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 120)}>
            120
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 135)}>
            {getStringTableValue(StringIDHUDCompassDirectionSouthEast, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 150)}>
            150
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 165)}>
            165
          </div>
          <div className={`${Cardinal} direction`} style={this.positionStyle(facing, 180)}>
            {getStringTableValue(StringIDHUDCompassDirectionSouth, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 195)}>
            195
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 210)}>
            210
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 225)}>
            {getStringTableValue(StringIDHUDCompassDirectionSouthWest, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 240)}>
            240
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 255)}>
            255
          </div>
          <div className={`${Cardinal} direction`} style={this.positionStyle(facing, 270)}>
            {getStringTableValue(StringIDHUDCompassDirectionWest, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 285)}>
            285
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 300)}>
            300
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 315)}>
            {getStringTableValue(StringIDHUDCompassDirectionNorthWest, this.props.stringTable)}
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 330)}>
            330
          </div>
          <div className={Cardinal} style={this.positionStyle(facing, 345)}>
            345
          </div>
          {this.getCompassObjectives()}
          {this.getBossIndicators()}
        </div>
        <BossHealthBars />
        {this.getPrimaryObjectiveDetails()}
      </div>
    );
  }

  private getCompassObjectives(): JSX.Element[] {
    if (!this.props.objectives) {
      return;
    }

    const compassObjectives: JSX.Element[] = [];
    for (let entityId in this.props.objectives) {
      const obj: BaseEntityStateModel = this.props.objectives[entityId];
      const position: Vec3f = this.props.positions[entityId];
      if (!position) {
        continue;
      }
      if ((obj.objective.visibility & ObjectiveUIVisibility.Compass) !== 0) {
        if (!isItem(obj)) {
          console.error(
            'Compass.tsx assumes that Objectives are found only on ItemEntityStateModel.  If that is no longer true, please fix it!'
          );
          continue;
        }
        const itemObjective: ItemEntityStateModel = obj as ItemEntityStateModel;
        const stateClassName = ObjectiveState[obj.objective.state];
        const positionPercent: number = this.positionPercent(
          this.props.viewBearing,
          getBearingDegreesForWorldLocation(position, this.props.viewOrigin),
          true
        );
        const objectiveStyle: React.CSSProperties = {};
        objectiveStyle.left = `${positionPercent}%`;
        objectiveStyle.color = `#${itemObjective.iconClassColor.toString(16).padStart(6, '0')}`;

        compassObjectives.push(
          <div style={objectiveStyle} className={`${Objective} ${itemObjective.iconClass} ${stateClassName}`}>
            <div className={ObjectiveIndicator}>{obj.objective.indicator}</div>
          </div>
        );
      }
    }

    return compassObjectives;
  }

  private getPrimaryObjectiveDetails(): JSX.Element {
    const objectiveDetails: JSX.Element[] = [];
    const sortedObjDetails: ObjectiveDetailMessageState[] = Object.values(this.props.primaryObjectiveDetails).sort(
      (a, b) => a.messageID.localeCompare(b.messageID)
    );
    for (let objDetail of sortedObjDetails) {
      let state = '';
      let stateClass = '';
      if (objDetail.state == ObjectiveDetailState.CompletedSuccess) {
        state = String.fromCharCode(10003);
        stateClass = 'is-success';
      } else if (objDetail.state == ObjectiveDetailState.CompletedFailed) {
        state = String.fromCharCode(0x2717);
        stateClass = 'is-failure';
      }

      const titleElement: JSX.Element = objDetail.title ? (
        <div className={PrimaryObjectiveDetailsTitle}>{objDetail.title}</div>
      ) : null;
      const textElement: JSX.Element = objDetail.text ? (
        <div className={PrimaryObjectiveDetailsText}>{objDetail.text}</div>
      ) : null;
      const stateIcon: JSX.Element = state ? (
        <span className={`${PrimaryObjectiveDetailsState} ${stateClass}`}>{state}</span>
      ) : null;

      objectiveDetails.push(
        <div key={objDetail.messageID} className={PrimaryObjectiveDetailsWrap}>
          {titleElement}
          {textElement}
          <ObjectiveDetailsProgressBar objective={objDetail} scenarioRoundStartTime={this.props.scenarioRoundStartTime}>
            {stateIcon}
          </ObjectiveDetailsProgressBar>
        </div>
      );
    }

    if (objectiveDetails.length == 0) {
      return;
    }

    return (
      <div id='HUD_PrimaryObjectiveDetailsContainer' className={PrimaryObjectiveDetailsContainer}>
        {objectiveDetails}
      </div>
    );
  }

  private getBossIndicators(): JSX.Element[] {
    let indicators = [];

    for (let entityID in this.props.bosses) {
      const boss: PlayerEntityStateModel = this.props.bosses[entityID];
      if (!boss.iconClass) {
        continue;
      }

      const position: Vec3f = this.props.positions[entityID];
      if (!position) {
        continue;
      }

      const bearingDegrees = getBearingDegreesForWorldLocation(position, this.props.viewOrigin);
      const bossStyle = boss.characterKind == CharacterKind.BossNPC ? 'Boss' : '';

      indicators.push(
        <div
          style={this.positionStyle(this.props.viewBearing, bearingDegrees, true)}
          className={`${Objective} fs-icon-${boss.iconClass} NPC ${bossStyle}`}
        />
      );
    }

    return indicators;
  }

  private convertToMinusAngle = (angle: number) => {
    if (angle <= 360 && angle >= 180) {
      return -180 + (angle - 180);
    } else {
      return angle;
    }
  };

  private angleToPercentage = (facing: number, angle: number): number => {
    const percentPerDegree = 80 / 150;
    const facingAdjustment = Math.round((360 - facing) % 360);
    const adjustedAngle = this.convertToMinusAngle((facingAdjustment + angle) % 360);
    const leftPosition = adjustedAngle * percentPerDegree + 50;

    return leftPosition;
  };

  private positionPercent(facing: number, angle: number, clampAngleOnScreen: boolean = false): number {
    let percent: number = this.angleToPercentage(facing, angle);
    if (clampAngleOnScreen) {
      // How we clamp icons on the screen:
      //   For the most part, we want to keep a clamped icon visibly on the compass.
      //   The compass has some fade out at the edges which needs to be compensated for.
      //   There is also a small range in which we do not want to show the icon, basically
      //   when the point is right behind you.  So we want to push the icon out of the view
      //   space right as it nears being directly behind you.
      const upperBounds: number = 150; // the max value returned by angleToPercentage
      const lowerBounds: number = -50; // the min value returned by angleToPercentage
      const lowerAngleClamp: number = 6; // how close to the edge of the compass we want a clamped icon to get on the left side
      const upperAngleClamp: number = 94; // how close to the edge of the compass we want a clamped icon to get on the right side
      const hideRange: number = 10; // the range in which we start hiding a clamped icon

      if (percent < lowerBounds + hideRange) {
        percent += -lowerBounds - hideRange + lowerAngleClamp;
      } else if (percent < lowerAngleClamp) {
        percent = lowerAngleClamp;
      } else if (percent > upperBounds - hideRange) {
        percent -= upperBounds - hideRange - upperAngleClamp;
      } else if (percent > upperAngleClamp) {
        percent = upperAngleClamp;
      }
    }

    return percent;
  }

  private positionStyle(facing: number, angle: number, clampAngleOnScreen: boolean = false): React.CSSProperties {
    return { left: this.positionPercent(facing, angle, clampAngleOnScreen) + '%' };
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps) {
  // lastUpdatedTime is needed to keep objective detail timers ticking when the player isn't looking around
  return {
    primaryObjectiveDetails: state.game.objectiveDetailsPrimary,
    lastUpdatedTime: Math.floor(state.baseGame.worldTime),
    viewBearing: Math.round(state.player.viewBearing),
    viewOrigin: state.player.viewOrigin,
    scenarioRoundStartTime: state.player.scenarioRoundStateStartTime,
    objectives: state.entities.objectives,
    bosses: state.entities.bosses,
    stringTable: state.stringTable.stringTable,
    positions: state.entities.positions
  };
}

export const Compass = connect(mapStateToProps)(ACompass);
