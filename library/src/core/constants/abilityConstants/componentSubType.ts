/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http//mozilla.org/MPL/2.0/.
 */

export enum componentSubType {
  None = 0,
  // Magic
  Rune = 1 << 0,
  Shape = 1 << 1,
  Range = 1 << 2,
  Size = 1 << 3,
  Infusion = 1 << 4,
  Focus = 1 << 5,
  Transposition = 1 << 6,
  // Physical
  Weapon = 1 << 7,
  Style = 1 << 8,
  Speed = 1 << 9,
  Potential = 1 << 10,
  Target = 1 << 11,
  Stance = 1 << 12,
  // Ranged
  RangedWeapon = 1 << 13,
  Load = 1 << 14,
  Prepare = 1 << 15,
  Draw = 1 << 16,
  Aim = 1 << 17,
  // Sound
  Voice = 1 << 18,
  Instrument = 1 << 19,
  Shout = 1 << 20,
  Song = 1 << 21,
  Inflection = 1 << 22,
  Technique = 1 << 23,
  // TODO : remove these when abilities get updated, these are to cull components from showing in the UI
  DeadPrimary = 1 << 24,
  DeadSecondary = 1 << 25,
}

export default componentSubType;
