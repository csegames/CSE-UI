/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class CurrentMax {
    public static equals(a: CurrentMax, b: CurrentMax): boolean;
    public static percent(value: CurrentMax): number;
    public static cssPercent(value: CurrentMax): string;
  }

  class CurrentMaxExt {
    public static equals(a: CurrentMax, b: CurrentMax): boolean;
    public static percent(value: CurrentMax): number;
    public static cssPercent(value: CurrentMax): string;
  }
  interface Window {
    CurrentMax: typeof CurrentMaxExt;
  }
}

class CurrentMaxExt {
  public static equals(a: CurrentMax, b: CurrentMax) {
    if (Object.is(a, b)) {
      return true;
    }
    return Math.equals(a.current, b.current) && Math.equals(a.max, b.max);
  }

  public static percent(value: CurrentMax) {
    return value.current / value.max;
  }

  public static cssPercent(value: CurrentMax) {
    return value.current / value.max * 100 + '%';
  }
}
window.CurrentMax = CurrentMaxExt;
