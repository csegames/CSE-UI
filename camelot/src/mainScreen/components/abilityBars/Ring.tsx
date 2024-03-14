/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';

// Styles
const RingSVG = 'HUD-Ring-RingSVG';
const RingCircle = 'HUD-Ring-RingCircle';

// Path Math
export const PIover180 = Math.PI / 180;

export function getRadius(d: number) {
  return d * PIover180;
}

export function p2c(centerPointOffset: number, radius: number, angle: number) {
  const radians = getRadius(angle - 90);
  return {
    x: (centerPointOffset + radius * Math.cos(radians)).toFixed(2),
    y: (centerPointOffset + radius * Math.sin(radians)).toFixed(2)
  };
}

export function arc2path(centerPointOffset: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(centerPointOffset, radius, startAngle);
  const start = p2c(centerPointOffset, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}

type RingAnim = 'none' | 'pulse' | 'blink';

export interface RingOptions {
  color: string;
  animation: RingAnim;
  percent: number; // 0 -> 1
  glow?: boolean;
}

interface ReactProps {
  radius: number;
  centerOffset: number;
  strokeWidth: number;
  foreground: RingOptions;
  background?: RingOptions;
}

interface InjectedProps {
  hudWidth: number;
  hudHeight: number;
}

type Props = ReactProps & InjectedProps;

class ARing extends React.Component<Props> {
  render(): React.ReactNode {
    const { radius, centerOffset, strokeWidth, foreground, background } = this.props;

    // radius, centerOffset, and strokeWidth are in `vmin` units, but SVG only works in pixels, so we have to convert.
    const oneVmin: number = Math.min(this.props.hudHeight, this.props.hudWidth) / 100;
    const radiusPx = radius * oneVmin;
    const centerOffsetPx = centerOffset * oneVmin;
    const strokeWidthPx = strokeWidth * oneVmin;

    const fgAnim: RingAnim = foreground.animation;
    const bgAnim: RingAnim = background?.animation ?? 'none';
    const showFG = foreground.percent > 0;
    const showBG = background?.percent > 0 ?? false;
    let fgPath: string = '';
    let bgPath: string = '';

    // These paths are a bit expensive, so we only calculate them conditionally.
    if (showFG) {
      fgPath = arc2path(centerOffsetPx, radiusPx, 0, foreground.percent * 360);
    }
    if (showBG) {
      bgPath = arc2path(centerOffsetPx, radiusPx, 0, background.percent * 360);
    }

    const blurID = 'blur-' + genID();
    return (
      <>
        <svg className={RingSVG} width={centerOffsetPx * 2} height={centerOffsetPx * 2}>
          <defs>
            <filter id={blurID}>
              <feGaussianBlur in='SourceGraphic' stdDeviation={strokeWidthPx / 2} />
            </filter>
          </defs>

          {background?.glow && (
            <path
              className={`${RingCircle} ${bgAnim}`}
              d={bgPath}
              stroke={background.color}
              strokeWidth={strokeWidthPx}
              fill='none'
              // This references the SVG feGaussianBlur we defined in <defs> above.
              style={{ filter: `url(#${blurID})` }}
            />
          )}

          {showBG && (
            <path
              className={`${RingCircle} ${bgAnim}`}
              d={bgPath}
              stroke={background.color}
              strokeWidth={strokeWidthPx}
              fill='none'
            />
          )}
        </svg>

        <svg className={RingSVG} width={centerOffsetPx * 2} height={centerOffsetPx * 2}>
          <defs>
            <filter id={blurID}>
              <feGaussianBlur in='SourceGraphic' stdDeviation={strokeWidthPx / 2} />
            </filter>
          </defs>

          {foreground.glow && (
            <path
              className={`${RingCircle} ${fgAnim}`}
              d={fgPath}
              stroke={foreground.color}
              strokeWidth={strokeWidthPx}
              fill='none'
              style={{ filter: `url(#${blurID})` }}
            />
          )}

          {showFG && (
            <path
              className={`${RingCircle} ${fgAnim}`}
              d={fgPath}
              stroke={foreground.color}
              strokeWidth={strokeWidthPx}
              fill='none'
            />
          )}
        </svg>
      </>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { hudWidth, hudHeight } = state.hud;

  return {
    ...ownProps,
    hudWidth,
    hudHeight
  };
}

export const Ring = connect(mapStateToProps)(ARing);
