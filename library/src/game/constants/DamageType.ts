/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  export enum DamageType {
    None = 0,
    Slashing = 1 << 0,
    Piercing = 1 << 1,
    Crushing = 1 << 2,
    Acid = 1 << 3,
    Poison = 1 << 4,
    Disease = 1 << 5,
    Earth = 1 << 6,
    Water = 1 << 7,
    Fire = 1 << 8,
    Air = 1 << 9,
    Lightning = 1 << 10,
    Frost = 1 << 11,
    PhysicsImpact = 1 << 12,
    Weapon = Slashing | Piercing | Crushing,
    PhysicalTypes =
      Slashing | Piercing | Crushing | Acid | Poison | Disease | Earth | Water | Fire | Air | Lightning | Frost |
      PhysicsImpact,
    Life = 1 << 13,
    Mind = 1 << 14,
    Spirit = 1 << 15,
    Radiant = 1 << 16,
    Death = 1 << 17,
    Shadow = 1 << 18,
    Chaos = 1 << 19,
    Void = 1 << 20,
    Arcane = 1 << 21,
    MagicalTypes = Life | Mind | Spirit | Radiant | Death | Shadow | Chaos | Void | Arcane,
    All = ~0,
    System = 1 << 31, // Unavoidable damage type, should not be used in skills.
  }
  interface Window {
    DamageType: typeof DamageType;
  }
}
export enum DamageType {
  None = 0,
  Slashing = 1 << 0,
  Piercing = 1 << 1,
  Crushing = 1 << 2,
  Acid = 1 << 3,
  Poison = 1 << 4,
  Disease = 1 << 5,
  Earth = 1 << 6,
  Water = 1 << 7,
  Fire = 1 << 8,
  Air = 1 << 9,
  Lightning = 1 << 10,
  Frost = 1 << 11,
  PhysicsImpact = 1 << 12,
  Weapon = Slashing | Piercing | Crushing,
  PhysicalTypes =
    Slashing | Piercing | Crushing | Acid | Poison | Disease | Earth | Water | Fire | Air | Lightning | Frost |
    PhysicsImpact,
  Life = 1 << 13,
  Mind = 1 << 14,
  Spirit = 1 << 15,
  Radiant = 1 << 16,
  Death = 1 << 17,
  Shadow = 1 << 18,
  Chaos = 1 << 19,
  Void = 1 << 20,
  Arcane = 1 << 21,
  MagicalTypes = Life | Mind | Spirit | Radiant | Death | Shadow | Chaos | Void | Arcane,
  All = ~0,
  System = 1 << 31, // Unavoidable damage type, should not be used in skills.
}
window.DamageType = DamageType;
