/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum damageTypes {
  NONE = 0,
  SLASHING = 1 << 0,
  PIERCING = 1 << 1,
  CRUSHING = 1 << 2,
  ACID = 1 << 3,
  POISON = 1 << 4,
  DISEASE = 1 << 5,
  EARTH = 1 << 6,
  WATER = 1 << 7,
  FIRE = 1 << 8,
  AIR = 1 << 9,
  LIGHTNING = 1 << 10,
  FROST = 1 << 11,
  PHYSICSIMPACT = 1 << 12,
  WEAPON = SLASHING | PIERCING | CRUSHING,
  PHYSICALTYPES =
    SLASHING | PIERCING | CRUSHING | ACID | POISON | DISEASE | EARTH | WATER | FIRE | AIR | LIGHTNING | FROST |
    PHYSICSIMPACT,
  LIFE = 1 << 13,
  MIND = 1 << 14,
  SPIRIT = 1 << 15,
  RADIANT = 1 << 16,
  DEATH = 1 << 17,
  SHADOW = 1 << 18,
  CHAOS = 1 << 19,
  VOID = 1 << 20,
  ARCANE = 1 << 21,
  MAGICALTYPES = LIFE | MIND | SPIRIT | RADIANT | DEATH | SHADOW | CHAOS | VOID | ARCANE,
  ALL = ~0,
  SYSTEM = 1 << 31, // UNAVOIDABLE TYPE DAMAGE, SHOULD NOT BE USED IN ABILITIES.
}
