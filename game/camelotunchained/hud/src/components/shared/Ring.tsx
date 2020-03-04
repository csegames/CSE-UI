/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { VelocityComponent } from 'velocity-react';

const circleShared = `
  position: absolute;
  left: 0;
  top: 0;
  @keyframes blinkStroke {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes pulseStroke {
    from {
      stroke-opacity: 1;
    }
    to {
      stroke-opacity: 0.25;
    }
  }

  @keyframes opacityPulse {
    from {
      opacity: 0.3;
    }
    to {
      opacity: 0.1;
    }
  }
`;

const RingCircle = styled.path`
  ${circleShared}
`;

const RingCircleGlow = styled.path`
  ${circleShared}
  filter: url(#${(props: { blurID: string; } & React.SVGProps<SVGPathElement>) => props.blurID});
`;

const RingSVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible !important;
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

// VelocityComponent Animations

const pulseStrokeAnim = {
  animation: { opacity: [0.25, 1, 0.25] },
  duration: 750,
  runOnMount: true,
  loop: true,
};

const blinkAnim = {
  animation: { opacity: [1, 0, 1] },
  duration: 500,
  runOnMount: true,
  loop: true,
};

type RingAnim = 'none' | 'pulse' | 'blink';

export interface RingOpts {
  color: string;
  animation: RingAnim;
  percent: number; // 0 -> 1
  glow?: boolean;
}

interface RingProps {
  radius: number;
  centerOffset: number;
  strokeWidth: number;
  foreground: RingOpts;
  background?: RingOpts;
}

// tslint:disable-next-line:function-name
export function Ring(props: RingProps) {

  const opts = {
    showFG: false,
    showFGGlow: props.foreground.glow,
    showBG: !!props.background,
    showBGGlow: props.background && props.background.glow,
    fgPath: '',
    bgPath: '',
    fgAnim: {},
    bgAnim: {},
  };

  opts.showFG = props.foreground.percent > 0;
  if (opts.showFG) {
    opts.fgPath = arc2path(props.centerOffset, props.radius, 0, props.foreground.percent * 360);
  }

  switch (props.foreground.animation) {
    case 'pulse': opts.fgAnim = pulseStrokeAnim;
    case 'blink': opts.fgAnim = blinkAnim;
  }

  if (props.background) {
    opts.showBG = props.background.percent > 0;
    if (opts.showBG) {
      opts.bgPath = arc2path(props.centerOffset, props.radius, 0, props.background.percent * 360);
    }

    switch (props.background.animation) {
      case 'pulse': opts.bgAnim = pulseStrokeAnim;
      case 'blink': opts.bgAnim = blinkAnim;
    }
  }

  const blurID = 'blur-' + genID();
  return (
    <>
      <RingSVG width={props.centerOffset * 2} height={props.centerOffset * 2} style={{ zIndex: 0 }}>
        <defs>
          <filter id={blurID}>
            <feGaussianBlur in='SourceGraphic' stdDeviation={props.strokeWidth / 2} />
          </filter>
        </defs>

        {
          opts.showBGGlow &&
            <VelocityComponent {...opts.bgAnim}>
              <RingCircleGlow
                d={opts.bgPath}
                stroke={props.background.color}
                strokeWidth={props.strokeWidth}
                fill='none'
                blurID={blurID}
              />
            </VelocityComponent>
        }

        {
          opts.showBG &&
            <VelocityComponent {...opts.bgAnim}>
              <RingCircle
                d={opts.bgPath}
                stroke={props.background.color}
                strokeWidth={props.strokeWidth}
                fill='none'
                style={{ zIndex: -1 }}
              />
            </VelocityComponent>
        }
      </RingSVG>
      <RingSVG width={props.centerOffset * 2} height={props.centerOffset * 2} style={{ zIndex: 1 }}>
        <defs>
          <filter id={blurID}>
            <feGaussianBlur in='SourceGraphic' stdDeviation={props.strokeWidth / 2} />
          </filter>
        </defs>

        {
          opts.showFGGlow &&
            <VelocityComponent {...opts.fgAnim}>
              <RingCircleGlow
                d={opts.fgPath}
                stroke={props.foreground.color}
                strokeWidth={props.strokeWidth}
                fill='none'
                blurID={blurID}
              />
            </VelocityComponent>
        }

        {
          opts.showFG &&
            <VelocityComponent {...opts.fgAnim}>
              <RingCircle
                d={opts.fgPath}
                stroke={props.foreground.color}
                strokeWidth={props.strokeWidth}
                fill='none'
                style={{ zIndex: 1 }}
              />
            </VelocityComponent>
        }
      </RingSVG>
    </>
  );
}
