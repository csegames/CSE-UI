/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
declare const cuAPI: any;

export default class RespawnLocation {
  id: number;
  x: number;
  y: number;
  distance: number;
  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  public respawn = (): void => {
    cuAPI.Respawn(this.id);
  }
  public calcDistanceFromXY = (x: number, y: number): number => {
    const Dx : number = x - this.x;
    const Dy : number = y - this.y;
    return this.distance = Math.sqrt((Dx*Dx)+(Dy*Dy));
  }
}
