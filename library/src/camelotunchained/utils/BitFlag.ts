/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class BitFlag {
    public static hasBits(flag: number, bits: number): boolean;
    public static flipBits(flag: number, bits: number): number;
    public static enableBits(flag: number, bits: number): number;
    public static disableBits(flag: number, bits: number): number;
  }

  interface Window {
    BitFlag: typeof BitFlag;
  }
}

class BitFlag {
  public static hasBits(flag: number, bits: number) {
    return (flag & bits) !== 0;
  }
  public static flipBits(flag: number, bits: number) {
    return flag ^ bits;
  }
  public static enableBits(flag: number, bits: number) {
    return flag | bits;
  }
  public static disableBits(flag: number, bits: number) {
    return flag & ~bits;
  }
}
window.BitFlag = BitFlag;
