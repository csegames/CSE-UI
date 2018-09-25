/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http//mozilla.org/MPL/2.0/.
 */


class Stats {

  public strength: number;
  public agility: number;
  public endurance: number;
  public will: number;
  public resonance: number;
  public dexterity: number;
  public vitality: number;
  public attunement: number;
  public faith: number;
  public eyesight: number;


  public hearing: number;
  public clarity: number;
  public mass: number;
  public presence: number;
  public affinity: number;


  public maxMoveSpeed: number;
  public vision: number;
  public detection: number;
  public carryCapacity: number;
  public maxPanic: number;
  public panicDelay: number;
  public healthRegeneration: number;
  public staminaRegeneration: number;

  constructor(stats = <Stats> {}) {

    this.strength = stats.strength || 0;
    this.agility = stats.agility || 0;
    this.endurance = stats.endurance || 0;
    this.will = stats.will || 0;
    this.resonance = stats.resonance || 0;
    this.dexterity = stats.dexterity || 0;
    this.vitality = stats.vitality || 0;
    this.attunement = stats.attunement || 0;
    this.faith = stats.faith || 0;
    this.eyesight = stats.eyesight || 0;

    this.hearing = stats.hearing || 0;
    this.clarity = stats.clarity || 0;
    this.mass = stats.mass || 0;
    this.presence = stats.presence || 0;
    this.affinity = stats.affinity || 0;

    this.maxMoveSpeed = stats.maxMoveSpeed || 0;
    this.vision = stats.vision || 0;
    this.detection = stats.detection || 0;
    this.carryCapacity = stats.carryCapacity || 0;
    this.maxPanic = stats.maxPanic || 0;
    this.panicDelay = stats.panicDelay || 0;
    this.healthRegeneration = stats.healthRegeneration || 0;
    this.staminaRegeneration = stats.staminaRegeneration || 0;
  }

  public static create() {
    const a = new Stats();
    return a;
  }
}

export default Stats;
