/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { game } from '@csegames/library/dist/_baseGame';
import { RootState } from '../../../../redux/store';
import { ProgressCircle, ProgressCircleUnit } from '../../../../../shared/components/ProgressCircle';
import { Vec3f } from '@csegames/library/dist/hordetest/graphql/schema';
import { ObjectiveState, Vec2f } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { distanceVec3 } from '@csegames/library/dist/_baseGame/utils/distance';
import {
  BaseEntityStateModel,
  EntityResource,
  findEntityResource
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { isItem } from '@csegames/library/dist/hordetest/game/GameClientModels/ItemEntityState';
import { getBearingDegreesForWorldLocation } from '../../../../redux/playerSlice';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

// radius in viewport units of the outer objective circle
const OBJECTIVE_OUTER_CIRCLE_RADIUS_VMIN: number = 2.77;

// radius in viewport units of the objective progress bar indicator circle
const OBJECTIVE_PROGRESS_CIRCLE_RADIUS_VMIN: number = 2.08;

// width and height in viewport units of the directional arrow indicator
const INDICATOR_SIZE_VMIN: number = 1.39;

// number of seconds to show the objective flashing red if the capture score changes
const DANGER_MIN_TIME_SHOWN_SECONDS: number = 2;
const Container = 'Objective-Container';
const Circle = 'Objective-Circle';
const DirectionalIndicator = 'Objective-DirectionalIndicator';
const Icon = 'Objective-Icon';

//@TODO change this to a span or p tag.
const ObjectiveIndicator = 'Objective-ObjectiveIndicator';
const IndicatorLabel = 'Objective-IndicatorLabel';
const Info = 'Objective-Info';

const DistanceText = 'Objective-DistanceText';

interface ComponentProps {
  objectiveID: string;
  hideDirectionArrow: boolean;
  hideDistanceText: boolean;
}

interface InjectedProps {
  footprintRadius: number;
  iconClass?: string;
  iconClassColor: number;
  indicator: number;
  indicatorLabel: string;
  objectivePosition: Vec3f;
  objectiveState: ObjectiveState;
  playerPosition: Vec3f;
  viewBearing: number;
  viewOrigin: Vec3f;
  resources: ArrayMap<EntityResource>;
  //dispatch is added implicitly by the connect function
  dispatch?: Dispatch;
}

type Props = ComponentProps & InjectedProps;

export interface State {
  showingInDanger: boolean;
}

class AObjective extends React.Component<Props, State> {
  private dangerTimer: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      showingInDanger: this.shouldShowDangerState()
    };

    if (this.state.showingInDanger) {
      this.dangerTimer = window.setInterval(() => this.checkDangerState(), DANGER_MIN_TIME_SHOWN_SECONDS * 1000);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    this.checkDangerState();
  }

  public componentWillUnmount() {
    this.clearDangerTimer();
  }

  public render() {
    const unstartedClass = this.props.objectiveState == ObjectiveState.Unstarted ? 'Unstarted' : '';

    return (
      <div
        id={`Objective_${this.props.objectiveID}`}
        className={`${Container} ${unstartedClass} ${this.getDisabledClass()}`}
      >
        {this.objectiveLabel()}
        {this.objectiveCircle()}
        <div className={`${Info} ${this.getMinimizedClass()} ${this.getDangerClass()}`}>{this.getDistanceText()}</div>
      </div>
    );
  }

  private objectiveLabel(): JSX.Element {
    if (this.props.indicatorLabel) {
      return <div className={`${IndicatorLabel} ${this.getDisabledClass()}`}>{this.props.indicatorLabel}</div>;
    }
    return null;
  }

  private objectiveCircle(): JSX.Element {
    const circleClasses: string = `${Circle} ${this.getDangerClass()} ${this.getDisabledClass()}`;

    let progressCircleStrokeWidthVmin: number = 0.3;
    let backgroundCircleStrokeWidthVmin: number = 0.13;
    let progressCircleRadiusVmin: number = OBJECTIVE_PROGRESS_CIRCLE_RADIUS_VMIN;

    // size tweaks when disabled
    if (this.isDisabled()) {
      progressCircleStrokeWidthVmin = 0.3;
      backgroundCircleStrokeWidthVmin = 0.1;
      progressCircleRadiusVmin += 0.2;
    }

    // JC: used to be diameter*2, no idea why it needs to be so big
    const objectiveProgressCircleElementSizeVmin = progressCircleRadiusVmin * 4;

    const circleSizeStyle = {
      width: `${OBJECTIVE_OUTER_CIRCLE_RADIUS_VMIN * 2}vmin`,
      height: `${OBJECTIVE_OUTER_CIRCLE_RADIUS_VMIN * 2}vmin`
    };

    const captureProgress = findEntityResource(this.props.resources, EntityResourceIDs.CaptureProgress);

    return (
      <div id={`ObjectiveCircle_${this.props.objectiveID}`} className={circleClasses} style={circleSizeStyle}>
        {this.directionalIndicator()}
        {this.objectiveIcon()}
        <ProgressCircle
          progressCurrent={captureProgress?.current ?? 0}
          progressMax={captureProgress?.max ?? 0}
          size={objectiveProgressCircleElementSizeVmin}
          radius={progressCircleRadiusVmin}
          strokeWidth={progressCircleStrokeWidthVmin}
          unit={ProgressCircleUnit.vmin}
          strokeColor={this.getObjectiveProgressBarColor()}
          style={{ position: 'absolute' }}
        />
        <ProgressCircle
          size={objectiveProgressCircleElementSizeVmin}
          radius={progressCircleRadiusVmin}
          strokeWidth={backgroundCircleStrokeWidthVmin}
          unit={ProgressCircleUnit.vmin}
          strokeColor={`rgba(255, 255, 255, ${this.isDisabled() ? 0.2 : 0.7})`}
          style={{ position: 'absolute', zIndex: -1 }}
        />
      </div>
    );
  }

  private getObjectiveProgressBarColor(): string {
    if (this.state.showingInDanger) {
      return '#fe0000';
    } else if (this.isDisabled()) {
      return '#bbb';
    }
    return '#ffffff';
  }

  private directionalIndicator(): JSX.Element {
    //Don't show the indicator if we're too close.
    if (this.directionalIndicatorIsMinimized()) {
      return;
    }

    const styles = this.getDirectionIndicatorStyle();
    if (!styles) {
      return;
    }

    styles.width = `${INDICATOR_SIZE_VMIN}vmin`;
    styles.height = `${INDICATOR_SIZE_VMIN}vmin`;
    styles.fontSize = `${INDICATOR_SIZE_VMIN + 0.926}vmin`;

    return <div style={styles} className={`${DirectionalIndicator} fs-icon-misc-caret-down`} />;
  }

  private objectiveIcon(): JSX.Element {
    let iconClassNames: string = `${Icon} ${this.props.iconClass}`;

    return (
      <div
        id={`ObjectiveIcon_${this.props.objectiveID}`}
        className={iconClassNames}
        style={{ color: this.getIconColor() }}
      >
        {this.objectiveIndicator()}
      </div>
    );
  }

  private getIconColor(): string {
    if (this.state.showingInDanger) {
      return `#FF0000`;
    } else if (this.isDisabled()) {
      return `#666`;
    }

    return `#${this.props.iconClassColor.toString(16).padStart(6, '0')}`;
  }

  private objectiveIndicator(): JSX.Element {
    if (this.props.indicator == 0) {
      return;
    }

    return <div className={ObjectiveIndicator}>{String.fromCharCode(this.props.indicator)}</div>;
  }

  private getDistanceText(): JSX.Element {
    if (this.props.hideDistanceText) {
      return;
    }

    const distance: number = this.getDistance();
    if (isNaN(distance)) {
      return;
    }

    return <span className={DistanceText}>{`${this.getDistance()}m`}</span>;
  }

  // various utils:

  private clearDangerTimer() {
    if (this.dangerTimer) {
      window.clearTimeout(this.dangerTimer);
      this.dangerTimer = null;
    }
  }

  private checkDangerState() {
    const inDanger: boolean = this.shouldShowDangerState();
    if (inDanger && this.state.showingInDanger == false) {
      this.setState({ showingInDanger: true });
      this.dangerTimer = window.setInterval(() => this.checkDangerState(), DANGER_MIN_TIME_SHOWN_SECONDS * 1000);
    } else if (inDanger == false && this.state.showingInDanger == true) {
      this.setState({ showingInDanger: false });
      this.clearDangerTimer();
    }
  }

  private getDisabledClass(): string {
    return this.isDisabled() ? 'Disabled' : '';
  }

  private getDangerClass(): string {
    if (this.state.showingInDanger) {
      return 'danger';
    }
    return '';
  }

  private shouldShowDangerState(): boolean {
    const captureProgress = findEntityResource(this.props.resources, EntityResourceIDs.CaptureProgress);
    if (!captureProgress) {
      return false;
    }

    const timeSinceLastCaptureChange = game.worldTime - captureProgress.lastDecreaseTime;
    return !this.isDisabled() && timeSinceLastCaptureChange < DANGER_MIN_TIME_SHOWN_SECONDS;
  }

  private isDisabled(): boolean {
    return this.props.objectiveState == ObjectiveState.Canceled;
  }

  private getMinimizedClass(): string {
    return this.directionalIndicatorIsMinimized() ? 'minimized' : '';
  }

  private directionalIndicatorIsMinimized(): boolean {
    return this.props.hideDirectionArrow || this.getDistance() < 40;
  }

  private getDistance(): number {
    const distanceToTargetCenter = Math.floor(distanceVec3(this.props.playerPosition, this.props.objectivePosition));

    const distanceToTargetFootprint: number = distanceToTargetCenter - this.props.footprintRadius;

    const isInsideObjectiveFootprintRadius: boolean = distanceToTargetFootprint < 0;

    return isInsideObjectiveFootprintRadius ? 0 : distanceToTargetFootprint;
  }

  private getDirectionIndicatorStyle(): React.CSSProperties {
    if (!this.props.objectivePosition) {
      return null;
    }

    const bearingDegrees = getBearingDegreesForWorldLocation(this.props.objectivePosition, this.props.viewOrigin);
    const bearingRadians = ((360 - bearingDegrees) * Math.PI) / 180;

    const objectiveVector: Vec2f = {
      x: Math.cos(bearingRadians),
      y: Math.sin(bearingRadians)
    };

    const facingBearing: number = (this.props.viewBearing + 90) % 360;
    const playerRadians: number = ((360 - facingBearing) * Math.PI) / 180;
    const playerVector: Vec2f = {
      x: Math.cos(playerRadians),
      y: Math.sin(playerRadians)
    };

    let radians: number = -(
      Math.atan2(objectiveVector.y, objectiveVector.x) - Math.atan2(playerVector.y, playerVector.x)
    );

    const radius = OBJECTIVE_OUTER_CIRCLE_RADIUS_VMIN;
    const radiusOffsetVmin = 1.575;
    const x: number = (radius - radiusOffsetVmin) * Math.cos(radians) + (radius - INDICATOR_SIZE_VMIN / 2);
    const y: number = (radius - radiusOffsetVmin) * Math.sin(radians) + (radius - INDICATOR_SIZE_VMIN / 2);

    return {
      top: `${y}vmin`,
      left: `${x}vmin`,
      transform: `rotate(${(radians * 180) / Math.PI - 90}deg)`
    };
  }
}

function mapStateToProps(rootState: RootState, ownProps: ComponentProps): Props {
  const entity: BaseEntityStateModel = rootState.entities.objectives[ownProps.objectiveID];
  const position: Vec3f = rootState.entities.positions[ownProps.objectiveID];
  const { viewBearing, viewOrigin } = rootState.player;
  const playerPosition = rootState.entities.positions[rootState.player.entityID];
  const { footprintRadius, indicator, indicatorLabel, state } = entity.objective;
  return {
    footprintRadius,
    iconClass: isItem(entity) ? entity.iconClass : '',
    iconClassColor: isItem(entity) ? entity.iconClassColor : 0xffffff,
    indicator,
    indicatorLabel,
    objectivePosition: position,
    objectiveState: state,
    playerPosition: playerPosition,
    resources: entity.resources,
    viewBearing,
    viewOrigin,

    ...ownProps
  };
}

export const Objective = connect(mapStateToProps)(AObjective);
