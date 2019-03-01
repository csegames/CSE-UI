/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class Timing {
    public static equals(a: Timing, b: Timing): boolean;
    public static percent(value: Timing): number;
    public static cssPercent(value: Timing): string;
  }

  class TimingExt {
    public static equals(a: Timing, b: Timing): boolean;
    public static percent(value: Timing): number;
    public static cssPercent(value: Timing): string;
  }
  interface Window {
    Timing: typeof TimingExt;
  }
}

class TimingExt {
  public static equals(a: Timing, b: Timing) {
    if (Object.is(a, b)) {
      return true;
    }
    return Math.equals(a.start, b.start) && Math.equals(a.duration, b.duration);
  }

  public static percent(value: Timing) {
    return (Date.now() - value.start) / value.duration;
  }

  public static cssPercent(value: Timing) {
    return TimingExt.percent(value) * 100 + '%';
  }
}
window.Timing = TimingExt;
