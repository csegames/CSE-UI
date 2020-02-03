/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export {};

declare global {
  enum CharacterKind {
    User = 0,
    MinorNPC = 1,
    ElitNPC = 2,
  }

  interface Window {
    CharacterKind: typeof CharacterKind;
  }
}

enum CharacterKind {
  User = 0,
  MinorNPC = 1,
  ElitNPC = 2,
}
window.CharacterKind = CharacterKind;
