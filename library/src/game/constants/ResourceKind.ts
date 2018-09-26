/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

// TODO: Get these from the server, add to defintions.ts
declare global {
  export enum ResourceKind {
    Blood = 0,
    Stamina = 1,
    Elixir_1 = 2,
    Elixir_2 = 3,
    Elixir_End = 4,
    Basic_Arrow = 5,
    Black_Arrow = 6,
    Flight_Arrow = 7,
    Blunt_Arrow = 8,
    Broadhead_Arrow = 9,
    Barbed_Error = 10,
    Leafblade_Arrow = 11,
    Serrated_Arrow = 12,
    Notched_Arrow  = 13,
    Crescent_Arrow = 14,
    Light_Arrow = 15,
    Dart_Point_Arrow = 16,
    Forked_Arrow = 17,
    Heavy_War_Arrow = 18,
    Arrow_End = 19,
    Doodad = 20,
  }
  interface Window {
    ResourceKind: typeof ResourceKind;
  }
}
export enum ResourceKind {
  Blood = 0,
  Stamina = 1,
  Elixir_1 = 2,
  Elixir_2 = 3,
  Elixir_End = 4,
  Basic_Arrow = 5,
  Black_Arrow = 6,
  Flight_Arrow = 7,
  Blunt_Arrow = 8,
  Broadhead_Arrow = 9,
  Barbed_Error = 10,
  Leafblade_Arrow = 11,
  Serrated_Arrow = 12,
  Notched_Arrow  = 13,
  Crescent_Arrow = 14,
  Light_Arrow = 15,
  Dart_Point_Arrow = 16,
  Forked_Arrow = 17,
  Heavy_War_Arrow = 18,
  Arrow_End = 19,
  Doodad = 20,
}
window.ResourceKind = ResourceKind;
