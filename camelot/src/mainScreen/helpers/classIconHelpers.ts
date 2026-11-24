/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ClassDef } from '../dataSources/manifest/classManifest';

export type ClassIconSize = 'small' | 'full';

// 1440p. The small unit frame class icons are sized so they never upscale at or below this.
const SmallClassIconMaxVminPx = 14.4;

export function getClassIconSize(vminPx: number): ClassIconSize {
  return vminPx <= SmallClassIconMaxVminPx ? 'small' : 'full';
}

export function getUnitFrameTransparentClassIconImage(classDef: ClassDef, size: ClassIconSize): string {
  return size === 'small' ? classDef.unitFrameIconTransparencySmallImage : classDef.unitFrameIconTransparencyImage;
}
