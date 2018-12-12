/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class SelfPlayerState {
    public static equals(a: SelfPlayerState, b: SelfPlayerState): boolean;
  }

  class SelfPlayerStateExt {
    public static equals(a: SelfPlayerState, b: SelfPlayerState): boolean;
  }

  interface Window {
    SelfPlayerState: typeof SelfPlayerStateExt;
  }
}

class SelfPlayerStateExt {
  public static equals(a: SelfPlayerState, b: SelfPlayerState): boolean {
    if (Object.is(a, b)) {
      return true;
    }

    if (!PlayerState.equals(a, b)) {
      return false;
    }

    if (a.characterID !== b.characterID) {
      return false;
    }

    if (a.zoneID !== b.zoneID) {
      return false;
    }

    if (a.facing !== b.facing) {
      return false;
    }

    if (a.cameraFacing !== b.cameraFacing) {
      return false;
    }

    return true;
  }
}
window.SelfPlayerState = SelfPlayerStateExt;
