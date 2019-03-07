/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { CLASS_NAMES } from './styles';
import { AbilityButtonInfo } from '../AbilityButtonView';
export * from './styles';


// Arc logic
export const PIo180 = Math.PI / 180;

export function getRadius(d: number) {
  return d * PIo180;
}

export function p2c(x: number, y: number, radius: number, angle: number) {
  const radians = getRadius(angle - 90);
  return {
    x: x + (radius * Math.cos(radians)),
    y: y + (radius * Math.sin(radians)),
  };
}

export function time2circleDegrees(current: number, end: number) {
  return current / end * 360;
}

export function arc2path(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(x, y, radius, startAngle);
  const start = p2c(x, y, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}

export function makeGlowPathFor(end: number,
                                current: number,
                                x: number,
                                y: number,
                                radius: number,
                                clockwise: boolean) {
  // generate outerPath for percent curve
  const degrees = time2circleDegrees(current, end);
  const path = arc2path(x, y, radius, 0, clockwise ? 360 - degrees : degrees);
  return path;
}

export function getTimingEnd(timing: DeepImmutableObject<Timing>) {
  const timingEnd = ((timing.start + timing.duration) - game.worldTime) * 1000;
  return timingEnd;
}

export const getClassNames = (abilityState: AbilityButtonInfo) => {
  const classNames: string[] = [];
  if (abilityState.type === AbilityButtonType.Modal) {
    classNames.push(CLASS_NAMES.MODAL_STATE);
  }
  const status = abilityState.status;
  const reason = abilityState.error;
  if (status & AbilityButtonState.Unusable) {
    classNames.push(CLASS_NAMES.UNAVAILABLE_STATE);
    if (reason & AbilityButtonErrorFlag.NoAmmo) {
      classNames.push(CLASS_NAMES.NO_AMMO_STATE);
    }
    if (reason & AbilityButtonErrorFlag.NoWeapon) {
      classNames.push(CLASS_NAMES.NO_WEAPON_STATE);
    }
  }

  if (status & AbilityButtonState.Ready) {
    classNames.push(CLASS_NAMES.READY_STATE);
  }

  if (status & AbilityButtonState.Error) {
    classNames.push(CLASS_NAMES.ERROR_STATE);
  }

  if (status & AbilityButtonState.Queued) {
    classNames.push(CLASS_NAMES.QUEUED_STATE);
  }

  if (status & AbilityButtonState.Cooldown) {
    classNames.push(CLASS_NAMES.COOLDOWN_STATE);
  }

  if (status & AbilityButtonState.Channel) {
    classNames.push(CLASS_NAMES.CHANNEL_STATE);
  }

  if (status & AbilityButtonState.Recovery) {
    classNames.push(CLASS_NAMES.RECOVERY_STATE);
  }

  if (status & AbilityButtonState.Preparation) {
    classNames.push(CLASS_NAMES.PREPARATION_STATE);
  }

  if (status & AbilityButtonState.Running ! & AbilityButtonState.Preparation ! & AbilityButtonState.Channel) {
    classNames.push(CLASS_NAMES.RUNNING_STATE);
  }

  if (status & AbilityButtonState.Held) {
    classNames.push(CLASS_NAMES.HELD_STATE);
  }

  return classNames;
};
