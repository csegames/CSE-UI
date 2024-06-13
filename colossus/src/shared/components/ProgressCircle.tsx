/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { arc2path, clamp, currentMax2circleDegrees } from '@csegames/library/dist/_baseGame/utils/numberUtils';

export enum ProgressCircleUnit {
  vmin,
  px
}

export interface ProgressCircleProps {
  progressCurrent?: number;
  progressMax?: number;
  size: number; // width and height of the svg element
  radius?: number; // circle radius
  strokeWidth?: number;
  unit: ProgressCircleUnit;
  strokeColor: string;
  fillColor?: string;
  style?: React.CSSProperties;
}

export class ProgressCircle extends React.Component<ProgressCircleProps, {}> {
  constructor(props: ProgressCircleProps) {
    super(props);
  }

  public render(): JSX.Element {
    if (this.props.size <= 0) {
      return null;
    }

    let unitName = '';
    switch (this.props.unit) {
      case ProgressCircleUnit.vmin: {
        unitName = 'vmin';
        break;
      }
      case ProgressCircleUnit.px: {
        unitName = 'px';
        break;
      }
    }

    console.assert(unitName.length > 0);

    let curProgress = 1.0;
    let maxProgress = 1.0;

    if (this.props.progressCurrent !== undefined && this.props.progressMax !== undefined) {
      if (this.props.progressCurrent <= 0 || this.props.progressMax <= 0) {
        // avoid divide by zero, plus with no progress there's nothing to show anyway
        return null;
      }

      curProgress = clamp(this.props.progressCurrent, 0, this.props.progressMax);
      maxProgress = this.props.progressMax;
    }

    let strokeWidth = this.props.strokeWidth;
    if (strokeWidth === undefined) {
      switch (this.props.unit) {
        case ProgressCircleUnit.vmin: {
          strokeWidth = 0.09;
          break;
        }
        case ProgressCircleUnit.px: {
          strokeWidth = 1.0;
          break;
        }
      }
    }

    // default to half the width of the svg element minus the stroke width if no radius is specified
    const circleRadius =
      this.props.radius !== undefined ? this.props.radius : Math.max(0.1, this.props.size * 0.5 - strokeWidth);

    const degrees = currentMax2circleDegrees(curProgress, maxProgress);
    if (isNaN(degrees)) {
      return null;
    }

    // we'll use a "virtual" svg pixel size of 100x100 and use css to scale it to the desired size

    let strokeWidthValue = `${strokeWidth}${unitName}`;
    if (strokeWidth <= 0) {
      strokeWidthValue = '0';
    } else if (
      (this.props.unit == ProgressCircleUnit.px && strokeWidth <= 1.0) ||
      (this.props.unit === ProgressCircleUnit.vmin && strokeWidth <= 0.1)
    ) {
      strokeWidthValue = '1px';
    }

    let style = { ...this.props.style };
    style.width = `${this.props.size}${unitName}`;
    style.height = `${this.props.size}${unitName}`;

    const circleRadiusPx = (circleRadius / this.props.size) * 100;

    return (
      <svg viewBox='0 0 100 100' style={style}>
        <path
          d={arc2path(50, 50, circleRadiusPx, 360 - degrees, 360)}
          strokeWidth={strokeWidthValue}
          stroke={this.props.strokeColor}
          fill={this.props.fillColor !== undefined ? this.props.fillColor : 'transparent'}
        />
      </svg>
    );
  }
}
