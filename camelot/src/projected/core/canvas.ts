/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Region } from './nativeTypes';
import { drawDebugGrid } from './drawUtils';

const element = document.getElementById('drawn') as HTMLCanvasElement;
element.width = 2048;
element.height = 2048;

const ctx = element.getContext('2d');

export function render(region: Region, callback: (ctx: CanvasRenderingContext2D) => void, drawGrid?: boolean) {
  ctx.clearRect(region.x, region.y, region.width, region.height);
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.width, region.height);
  ctx.clip();
  if (drawGrid) {
    drawDebugGrid(ctx, region.x, region.y, region.width, region.height);
  }
  callback(ctx);
  ctx.restore();
}
