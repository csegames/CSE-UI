/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface CompassData {
  facing: number;
  facingNorth: number;
  position: Vec3f;
}

export function getCompassData() {
  if (game.selfPlayerState.isReady) {
    let facing: number = game.selfPlayerState.facing % 360;
    if (facing < 0) {
      facing = 360 - Math.abs(facing);
    }
    facing = Math.round(facing);
    const facingNorth = Math.round((360 - (facing - 90)) % 360);
    const x = Math.round(game.selfPlayerState.position.x);
    const y = Math.round(game.selfPlayerState.position.y);
    const z = Math.round(game.selfPlayerState.position.z);
    return {
      facing,
      facingNorth,
      position: {
        x,
        y,
        z,
      },
    };
  } else {
    return {
      facing: 0,
      facingNorth: 0,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
  }
}

export function getCompassFacingData() {
  if (game.selfPlayerState.isReady) {
    let facing: number = game.selfPlayerState.facing % 360;
    if (facing < 0) {
      facing = 360 - Math.abs(facing);
    }
    facing = Math.round(facing);
    const facingNorth = Math.round((360 - (facing - 90)) % 360);
    return {
      facing,
      facingNorth,
    };
  } else {
    return {
      facing: 0,
      facingNorth: 0,
    };
  }
}

export function getCompassPositionData() {
  if (game.selfPlayerState.isReady) {
    const x = Math.round(game.selfPlayerState.position.x);
    const y = Math.round(game.selfPlayerState.position.y);
    const z = Math.round(game.selfPlayerState.position.z);
    return {
      position: {
        x,
        y,
        z,
      },
    };
  } else {
    return {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
  }
}

export function isVec3f(value: any): value is Vec3f {
  if (
    typeof value === 'object' &&
    value.hasOwnProperty('x') &&
    value.hasOwnProperty('y') &&
    value.hasOwnProperty('z')
  ) {
    return true;
  }
  return false;
}

export function calculateDistance(origin: Vec2f | Vec3f, target: Vec2f | Vec3f) {
  if (isVec3f(origin) && isVec3f(target)) {
    return Math.sqrt(
      Math.pow(target.x - origin.x, 2) +
      Math.pow(target.y - origin.y, 2) +
      Math.pow(target.z - origin.z, 2),
    );
  } else {
    return Math.sqrt(
      Math.pow(target.x - origin.x, 2) +
      Math.pow(target.y - origin.y, 2),
    );
  }
}

export function calculateBearing(origin: Vec2f | Vec3f,  target: Vec2f | Vec3f) {
  let bearing = Math.atan2(target.x - origin.x, target.y - origin.y);
  if (bearing < 0.0) {
    bearing += (Math.PI * 2);
  }
  return bearing * (180 / Math.PI);
}

export function calculateElevation(origin: Vec2f | Vec3f,  target: Vec2f | Vec3f) {
  if (isVec3f(origin) && isVec3f(target)) {
    return target.z - origin.z;
  } else {
    return 0;
  }
}

export function convertToMinusAngle(angle: number) {
  if (angle <= 360 && angle >= 180) {
    return -180 + (angle - 180);
  } else {
    return angle;
  }
}
