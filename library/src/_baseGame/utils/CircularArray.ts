/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class CircularArray<T> {
    public constructor(maxLength?: number);
    public length: number;
    public get(index: number): T;
    public getReversed(index: number): T;
    public push(item: T): void;
  }

  interface Window {
    CircularArray: typeof CircularArray;
  }
}

export class CircularArray<T> {
  private data: T[] = [];
  private _length: number = 0;

  public constructor(private maxLength: number = 250) {
  }

  public get length(): number {
    return this._length > this.maxLength ? this.maxLength : this._length;
  }

  public get(index: number): T {
    if (index < 0 || index > this.maxLength) return undefined;
    return this._length <= this.maxLength ?
      this.data[index] : this.data[((this._length % this.maxLength) + index) % this.maxLength];
  }

  public getReversed(index: number): T {
    return this.get(this.length - 1 - index);
  }

  public push(item: T) {
    this.data[this._length % this.maxLength] = item;
    this._length++;
  }
}
window.CircularArray = CircularArray;
