/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { PatcherAPI, Product } from './patcher';

// Most of the top-level components in the patcher have logic that looks
// like "if logged out, do X -- otherwise switch on Product". This enum
// is a property once removed from those two concepts that flattens the
// logic and decouples the display from the live patcher values for
// those fields so that transitions can display properly. It would be
// far better if we represented those differences in distinct
// components, but a launcher rewrite will not retain any of this layout
// and the goal here is to replace the rediculous "BadBadHack" system
// with idiomatic react.

export enum ContentPhase {
  Login,
  Camelot,
  Colossus,
  Tools,
  Cube
}

export function toProduct(phase: ContentPhase): Product {
  switch (phase) {
    case ContentPhase.Login:
    case ContentPhase.Camelot:
    default:
      return Product.CamelotUnchained;
    case ContentPhase.Colossus:
      return Product.Colossus;
    case ContentPhase.Tools:
      return Product.Tools;
    case ContentPhase.Cube:
      return Product.Cube;
  }
}

export function currentPhase(patcher: PatcherAPI): ContentPhase {
  if (!patcher.isLoggedIn) return ContentPhase.Login;
  switch (patcher.product) {
    case Product.Colossus:
      return ContentPhase.Colossus;
    case Product.Cube:
      return ContentPhase.Cube;
    case Product.Tools:
      return ContentPhase.Tools;
    case Product.CamelotUnchained:
    default:
      return ContentPhase.Camelot;
  }
}
