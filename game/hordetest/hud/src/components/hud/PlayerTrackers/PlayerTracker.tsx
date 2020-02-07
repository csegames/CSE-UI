/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
`;

const Diamond = styled.div`
  width: 12px;
  height: 12px;
  border: 1px solid black;
  outline: 1px solid white;
  outline-offset: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: cyan;
  color: white;
  transform: rotate(45deg);
`;

export interface Props {
  index: number;
  degrees: number;
  scale: number;
  screenPos: Vec2f;
}

const FLUSH_MARGIN = 10;

export function PlayerTracker(props: Props) {
  // function getAlignment() {
  //   // the game coordinate system hurts everyones brains so flip this around so we can think about it
  //   const backwardsDegrees = props.degrees;
  //   const degrees = 360 - backwardsDegrees;

  //   const isLeftNorth = degrees > 315 && degrees <= 360;
  //   const isRightNorth = degrees >= 0 && degrees <= 45;
  //   const isEast = degrees > 45 && degrees <= 135;
  //   const isSouth = degrees > 135 && degrees <= 225;

  //   let styles = {};
  //   let alignment: Alignment = null;
  //   if (isLeftNorth || isRightNorth) {
  //     // North - Top of screen
  //     alignment = Alignment.North;
  //     if (isLeftNorth) {
  //       styles = {
  //         top: 0,
  //         left: `${((degrees - 315) / 90) * 100}%`,
  //         transform: 'translateX(-50%)',
  //         transition: 'left 0.1s',
  //       }
  //     }

  //     if (isRightNorth) {
  //       styles = {
  //         top: 0,
  //         right: `${((45 - degrees) / 90) * 100}%`,
  //         transform: 'translateX(-50%)',
  //         transition: 'right 0.1s',
  //       }
  //     }
  //   } else if (isEast) {
  //     // East - Right of screen
  //     alignment = Alignment.East;
  //     styles = {
  //       right: 0,
  //       top: `${((90 - (135 - degrees)) / 90) * 100}%`,
  //       transform: 'translateY(-50%)',
  //       transition: 'top 0.1s',
  //     }
  //   } else if (isSouth) {
  //     // South - Bottom of screen
  //     alignment = Alignment.South;
  //     styles = {
  //       bottom: 0,
  //       right: `${((90 - (225 - degrees)) / 90) * 100}%`,
  //       transform: 'translateX(-50%)',
  //       transition: 'right 0.1s',
  //     }
  //   } else {
  //     // West - Left of Screen
  //     alignment = Alignment.West,
  //     styles = {
  //       left: 0,
  //       bottom: `${((90 - (315 - degrees)) / 90) * 100}%`,
  //       transform: 'translateY(-50%)',
  //       transition: 'bottom 0.1s',
  //     }
  //   }

  //   return {
  //     styles,
  //     alignment,
  //   }
  // }

  function getAlignment() {
    const { screenPos } = props;

    let xFlush = false;
    let yFlush = false;

    let left: string | number = 'auto';
    let right: string | number = 'auto';
    let top: string | number = 'auto';
    let bottom: string | number = 'auto';
    let transition = '';
    if (screenPos.x <= 0) {
      left = FLUSH_MARGIN;
      xFlush = true;
    }

    if (screenPos.x > 1) {
      right = FLUSH_MARGIN;
      xFlush = true;
    }

    if (screenPos.y <= 0) {
      top = FLUSH_MARGIN;
      yFlush = true;
    }

    if (screenPos.y > 1) {
      bottom = FLUSH_MARGIN;
      yFlush = true;
    }

    if (!xFlush) {
      left = `${screenPos.x * 100}%`;
      // transition = 'left 0.1s';
    }

    if (!yFlush) {
      top = `${screenPos.y * 100}%`;
      // transition = transition + ', top 0.1s';
    }

    return {
      top,
      right,
      bottom,
      left,
      transition,
    };
  }

  const alignment = getAlignment();
  return (
    <Container style={alignment}>
      <Diamond />
    </Container>
  );
}
