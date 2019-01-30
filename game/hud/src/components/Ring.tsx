/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { keyframes } from 'react-emotion';

// Ring Animations
const blinkStroke = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const pulseStroke = keyframes`
  from {
    stroke-opacity: 1;
  }
  to {
    stroke-opacity: 0.25;
  }
`;

const opacityPulse = keyframes`
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0.1;
  }
`;

// const recoveryBgPulse = keyframes`
//   from {
//     background: rgba(25, 171, 255, 0.25);
//   }
//   to {
//     background: rgba(25, 171, 255, 0.1);
//   }
// `;

// const prepBgPulse = keyframes`
//   from {
//     background: rgba(255, 159, 25, 0.25);
//   }
//   to {
//     background: rgba(255, 159, 25, 0.1);
//   }
// `;

// Ring Elements
interface RingProps {
  radius: number;
  centerOffset: number;
  strokeWidth: number;
  foreground: CircleOpts;
  background?: CircleOpts;
}

interface CircleOpts {
  color: string;
  animation: 'solid' | 'pulse' | 'blink';
  percent: number; // 0 - 1
  blur: boolean;
}

const RingSVG = styled('svg')`
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible !important;
`;

const RingCircle = styled('path')`
  position: absolute;
  left: 0;
  top: 0;
  ${(props: CircleOpts & { isBackground: boolean }) => {
    switch (props.animation) {
      default:
      case 'solid': return;
      case 'pulse':
        if (props.isBackground) {
          return `
          animation: ${opacityPulse} .75s steps(5, start) infinite alternate;
          -webkit-animation: ${opacityPulse} .75s steps(5, start) infinite alternate;
        `;
        }
        return `
          animation: ${pulseStroke} .75s infinite alternate-reverse;
          -webkit-animation: ${pulseStroke} .75s infinite alternate-reverse;
        `;
      case 'blink':
        return `
          animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
          -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
        `;
    }
  }}
`;

const RingCircleBlur = styled(RingCircle)`
  filter: url(#blur);
`;

// Path Math
export const PIover180 = Math.PI / 180;

export function getRadius(d: number) {
  return d * PIover180;
}

export function p2c(centerPointOffset: number, radius: number, angle: number) {
  const radians = getRadius(angle - 90);
  return {
    x: (centerPointOffset + (radius * Math.cos(radians))).toFixed(2),
    y: (centerPointOffset + (radius * Math.sin(radians))).toFixed(2),
  };
}

export function arc2path(centerPointOffset: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(centerPointOffset, radius, startAngle);
  const start = p2c(centerPointOffset, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}

// tslint:disable-next-line:function-name
export function Ring(props: RingProps) {
  const showForeground = props.foreground.percent > 0;
  const showForegroundBlur = showForeground && props.foreground.blur;

  const showBackground = props.background && props.background.percent > 0;
  const showBackgroundBlur = showBackground && props.background.blur;

  const fgPath = showForeground ? arc2path(props.centerOffset, props.radius, 0, props.foreground.percent * 360) : '';
  const bgPath = showBackground ? arc2path(props.centerOffset, props.radius, 0, props.background.percent * 360) : '';

  return (
    <RingSVG width={props.centerOffset * 2} height={props.centerOffset * 2}>
      <defs>
        <filter id='blur'>
          <feGaussianBlur in='SourceGraphic' stdDeviation={props.strokeWidth / 2} />
        </filter>
      </defs>

      {
        showBackgroundBlur &&
          <RingCircleBlur
            d={bgPath}
            stroke={props.background.color}
            strokeWidth={props.strokeWidth}
            fill='none'
            {...props.background}
            isBackground
          />
      }

      {
        showBackground &&
          <RingCircle
            d={bgPath}
            stroke={props.background.color}
            strokeWidth={props.strokeWidth}
            fill='none'
            {...props.background}
            isBackground
          />
      }

      {
        showForegroundBlur &&
          <RingCircleBlur
            d={fgPath}
            stroke={props.foreground.color}
            strokeWidth={props.strokeWidth}
            fill='none'
            {...props.foreground}
          />
      }

      {
        showForeground &&
          <RingCircle
            d={fgPath}
            stroke={props.foreground.color}
            strokeWidth={props.strokeWidth}
            fill='none'
            {...props.foreground}
          />
      }
    </RingSVG>
  );
}
