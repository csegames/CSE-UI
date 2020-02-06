/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

function Vec3fEquals(a: Vec3f, b: Vec3f) {
  if (Object.is(a, b)) {
    return true;
  }
  return Math.equals(a.x, b.x) && Math.equals(a.y, b.y) && Math.equals(a.z, b.z);
}


declare global {

  class PlayerState {
    public static equals(a: PlayerState, b: PlayerState): boolean;
    public static compareStatus(a: { id: number; } & Timing, b: {id: number} & Timing): boolean;
  }

  class PlayerStateExt {
    public static equals(a: PlayerState, b: PlayerState): boolean;
    public static compareStatus(a: { id: number; } & Timing, b: {id: number} & Timing): boolean;
  }

  interface Window {
    PlayerState: typeof PlayerStateExt;
  }
}

class PlayerStateExt {
  public static equals(a: PlayerState, b: PlayerState): boolean {
    if (Object.is(a, b)) {
      return true;
    }

    if (a.entityID !== b.entityID) {
      return false;
    }

    if (a.name !== b.name) {
      return false;
    }

    if (a.isAlive !== b.isAlive) {
      return false;
    }

    if (a.faction !== b.faction) {
      return false;
    }

    if (a.race !== b.race) {
      return false;
    }

    if (a.gender !== b.gender) {
      return false;
    }

    if (a.classID !== b.classID) {
      return false;
    }

    if (a.controlledEntityID !== b.controlledEntityID) {
      return false;
    }

    if ((a.health && !b.health) || (!a.health && b.health)) {
      return false;
    }

    if (a.health && b.health && ((a.health[0] && !b.health[0]) || (!a.health[0] && b.health[0]))) {
      return false;
    }

    if (a.health && b.health && !CurrentMax.equals(a.health[0], b.health[0])) {
      return false;
    }

    if (!CurrentMax.equals(a.blood, b.blood)) {
      return false;
    }

    if (!CurrentMax.equals(a.stamina, b.stamina)) {
      return false;
    }

    if (!Vec3fEquals(a.position, b.position)) {
      return false;
    }

    const aStatuses = a.statuses ? Object.values(a.statuses) : [];
    const bStatuses = b.statuses ? Object.values(b.statuses) : [];
    if (aStatuses.length !== bStatuses.length) {
      return false;
    }

    for (const status of aStatuses) {
      const index = bStatuses.findIndex(s => s.id === status.id);
      if ((index >= 0 && PlayerState.compareStatus(status, bStatuses[index])) === false) {
        return false;
      }
    }

    return true;
  }

  
  public static compareStatus(a: { id: number; } & Timing, b: {id: number} & Timing) {
    return a.id === b.id && Math.equals(a.start, b.start) && Math.equals(a.duration, b.duration);
  }
}
window.PlayerState = PlayerStateExt;
