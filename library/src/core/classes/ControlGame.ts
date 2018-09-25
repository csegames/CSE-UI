/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface ControlPoint {
  faction: string;
  id: string;
  size: string;
  x: number;
  y: number;
}

class ControlGame {

  public arthurianScore: number;
  public controlPoints: ControlPoint[];
  public gameState: number;
  public timeLeft: number;
  public tuathaDeDanannScore: number;
  public vikingScore: number;

  constructor(controlGame = <ControlGame> {}) {

    // Game State
    this.gameState = controlGame.gameState || 0;

    // Game Score
    this.arthurianScore = controlGame.arthurianScore || 0;
    this.tuathaDeDanannScore = controlGame.tuathaDeDanannScore || 0;
    this.vikingScore = controlGame.vikingScore || 0;

    // Time remaining
    this.timeLeft = controlGame.timeLeft || 0;

    // Control Points (if included)
    this.controlPoints = controlGame.controlPoints || <ControlPoint[]> [];
  }

  public static create() {
    const a = new ControlGame();
    return a;
  }

}

export default ControlGame;
