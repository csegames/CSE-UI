/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


export {};

declare global {
  interface CharacterAbilityDef {
    name: string;
    iconClass: string;
    description: string;
  }

  interface CharacterClassDef {
    id: number;
    name: string;
    abilities: CharacterAbilityDef[];
  }

  interface CharacterRaceDef {
    id: number;
    name: string;
    description: string;
    thumbnailURL: string;
    standingImageURL: string;
    championSelectImageURL: string;
  }
}
