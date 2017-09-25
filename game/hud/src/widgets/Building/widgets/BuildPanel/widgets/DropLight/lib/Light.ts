/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Color } from './Color';

export interface Light
{
  index: number;
  radius: number;
  intensity: number;
  color: Color;
  preset: boolean;
  presetName: string;
}

