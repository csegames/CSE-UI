/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ObjectiveState } from './index';
import { ObjectiveState as ObjectiveStateEnum } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { isItem, ItemEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/ItemEntityState';
import '@csegames/library/dist/_baseGame/types/Objective';
import '@csegames/library/dist/hordetest/webAPI/definitions';
import { ProgressCircle, ProgressCircleUnit } from '../../shared/components/ProgressCircle';
import {
  BaseEntityStateModel,
  findEntityResource
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

// radius in pixels of the outer objective circle
const OBJECTIVE_OUTER_CIRCLE_RADIUS_PX: number = 25;
const Container = 'WorldSpace-Objective-Container';
const IndicatorLabel = 'WorldSpace-Objective-IndicatorLabel';
const Circle = 'WorldSpace-Objective-Circle';
const Icon = 'WorldSpace-Objective-Icon';

const ObjectiveIndicator = 'WorldSpace-Objective-ObjectiveIndicator';

export interface Props {
  state: ObjectiveState;
}

export interface State {
  isDanger: boolean;
}

export class Objective extends React.Component<Props, State> {
  private dangerTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      isDanger: this.isInDanger()
    };

    if (this.state.isDanger) {
      this.showDanger();
    }
  }

  public render() {
    const entity = this.props.state.entity;

    if (!isItem(entity)) {
      console.error(
        'Objective.tsx assumes that Objectives are found only on ItemEntityStateModel.  If that is no longer true, please fix it!'
      );
      return null;
    }

    const captureProgress = findEntityResource(entity.resources, EntityResourceIDs.CaptureProgress);
    const iconClass: string = entity.iconClass || '';
    const dangerClassName = this.state.isDanger ? 'danger' : '';

    let disabledClass: string = '';
    let progressCircleStrokeWidth: number = 5;
    let backgroundCircleStrokeWidth: number = 2;
    let progressCircleRadius: number = OBJECTIVE_OUTER_CIRCLE_RADIUS_PX - 7;

    // size tweaks when disabled
    if (this.isDisabled()) {
      disabledClass = 'Disabled';
      progressCircleStrokeWidth = 3;
      backgroundCircleStrokeWidth = 1;
      progressCircleRadius += 2;
    }

    // JC: used to be diameter*2, no idea why it needs to be so big
    const objectiveProgressCircleElementSize = progressCircleRadius * 4;

    return (
      <div className={`${Container} ${disabledClass}`}>
        {this.objectiveLabel()}
        <div className={`${Circle} ${dangerClassName}`}>
          <div style={{ color: this.getObjectiveColor(entity) }} className={`${Icon} ${iconClass}`}>
            <div className={ObjectiveIndicator}>{this.props.state.indicator}</div>
          </div>
          <ProgressCircle
            progressCurrent={captureProgress ? captureProgress.current : 0}
            progressMax={captureProgress ? captureProgress.max : 0}
            size={objectiveProgressCircleElementSize}
            radius={progressCircleRadius}
            strokeWidth={progressCircleStrokeWidth}
            unit={ProgressCircleUnit.px}
            strokeColor={this.getObjectiveProgressBarColor()}
            style={{ position: 'absolute' }}
          />
          <ProgressCircle
            size={objectiveProgressCircleElementSize}
            radius={progressCircleRadius}
            strokeWidth={backgroundCircleStrokeWidth}
            unit={ProgressCircleUnit.px}
            strokeColor={`rgba(255, 255, 255, ${this.isDisabled() ? 0.4 : 0.9})`}
            style={{ position: 'absolute', zIndex: -1 }}
          />
        </div>
      </div>
    );
  }

  private getObjectiveColor(itemEntity: ItemEntityStateModel): string {
    if (this.state.isDanger) {
      return `#FF0000`;
    } else if (this.isDisabled()) {
      return `#666`;
    }

    return `#${itemEntity.iconClassColor.toString(16).padStart(6, '0')}`;
  }

  private objectiveLabel(): JSX.Element {
    const entity: BaseEntityStateModel = this.props.state.entity;
    if (!entity.objective || !entity.objective.indicatorLabel) {
      return null;
    }

    return <div className={IndicatorLabel}>{entity.objective.indicatorLabel}</div>;
  }

  private getObjectiveProgressBarColor(): string {
    if (this.state.isDanger) {
      return '#fe0000';
    } else if (this.isDisabled()) {
      return '#bbb';
    }
    return '#ffffff';
  }

  private isDisabled(): boolean {
    const entity: BaseEntityStateModel = this.props.state.entity;
    return entity.objective && entity.objective.state == ObjectiveStateEnum.Canceled;
  }

  private isInDanger = () => {
    return this.props.state.lastDecreaseDate.getTime() + 2000 > new Date().getTime();
  };

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.isInDanger()) {
      this.showDanger();
    } else if (this.dangerTimeout && prevProps.state.entity.entityID != this.props.state.entity.entityID) {
      // Objective UI views can be reused.  This happens when the number or order of the elements on the screen changes
      // if the entity that this UI used to represent is in danager, it doesn't mean that the new entity is also in danger
      // this code checks for that, and clears the timer when needed
      window.clearTimeout(this.dangerTimeout);
      this.setState({ isDanger: false });
    }
  }

  private showDanger = () => {
    if (this.dangerTimeout) {
      window.clearTimeout(this.dangerTimeout);
    }

    if (!this.state.isDanger) {
      this.setState({ isDanger: true });
    }

    this.dangerTimeout = window.setTimeout(() => {
      this.setState({ isDanger: false });
    }, 2000);
  };
}
