/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http//mozilla.org/MPL/2.0/.
 */

enum abilityTags {
  SYSTEM = 0,
  NONAGGRESSIVE = 1,   // Used for effects that should affect caster and/or allies.
  NONINTERACTABLE = 2, // Can't interact or be interacted with

  // Non-elemental
  NOMAGIC = 3,

  // Physical types
  WEAPON = 4,
  STYLE = 5,
  SPEED = 6,
  POTENTIAL = 7,
  TARGETING = 8,

  // Vocal
  VOICE = 9,
  SHOUT = 10,
  INFLECTION = 11,

  // Primary elemental magics
  AIR = 12,
  EARTH = 13,
  FIRE = 14,
  WATER = 15,

  // Secondary elemental magics
  BLAST = 16,
  LAVA = 17,
  MUD = 18,
  SAND = 19,
  STEAM = 20,
  SPRAY = 21,

  // Non-elemental magics
  HEALING = 22,
  RESTORATION = 23,
  LIFEDRAIN = 24,
  SWIFTNESS = 25,
  DISPLACEMENT = 26,

  // Shape
  SELF = 27,
  DIRECT = 28,
  TOUCH = 29,
  DART = 30,
  BALL = 31,
  CLOUD = 32,
  FOUNTAIN = 33,
  WALL = 34,
  FIELD = 35,
  WAVE = 36,
  POOL = 37,
  CONE = 38,

  // Meta types
  RUNE = 39,
  SHAPE = 40,
  RANGE = 41,
  SIZE = 42,
  INFUSION = 43,
  FOCUS = 44,

  // Combat tags
  BLOCKING = 45,
  COUNTERATTACK = 46,
  UNBLOCKABLE = 47,

  // Bens test tags
  TESTTAGA = 48,
  TESTTAGB = 49,
  TESTTAGC = 50,
  TESTTAGD = 51,
  TESTTAGE = 52,

  // Total number of tags.  Do not use as a tag.
  COUNT = 53,
}

export default abilityTags;
