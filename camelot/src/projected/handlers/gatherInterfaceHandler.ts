/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import * as Native from '../core/nativeTypes';

import ResourceIconMining from '../../images/projected/factionless-pickaxe.svg';
import CaudexBold from '../../fonts/Caudex/Caudex-Bold.ttf';
import { preloadImage } from '../core/image';
import { lookupString } from '../core/stringTable';

const font = new FontFace('CaudexBold', `url(${CaudexBold})`);
font.load();

const settings = new Map<string, Promise<HTMLImageElement>>();
const imageWidth = 48;
const imageHeight = 64;

settings.set('icon-mine', preloadImage(imageWidth, imageHeight, ResourceIconMining));
settings.set('icon-damage-water', preloadImage(imageWidth, imageHeight, ResourceIconMining));

const barWidth = 35;
const barHeight = 60;
const barYOffset = 50;
const barXGap = 10;
const barBorder = 3;
const barXShift = barXGap + barWidth;

const imageYOffset = barYOffset + barHeight + 10;

export class GatherInterfaceHandler {
  async draw(region: Native.Region, content: Native.GatherInterface): Promise<void> {
    await font.loaded;
    const icon = await settings.get(content.icon);

    await render(
      region,
      (ctx) => {
        const centerX = region.x + region.width / 2;

        // progress bars
        const barCount = content.progress.length;
        let barXOffset = centerX - (barXShift * (barCount - 1)) / 2;
        for (const progress of content.progress) {
          ctx.fillStyle = 'black';
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'black';
          ctx.fillRect(barXOffset - barWidth / 2, region.y + barYOffset, barWidth, barHeight);

          const filledY = progress * (barHeight - 2 * barBorder);
          ctx.fillStyle = '#b2b2b2';
          ctx.fillRect(
            barXOffset - barWidth / 2 + barBorder,
            region.y + barYOffset - barBorder + (barHeight - filledY),
            barWidth - 2 * barBorder,
            filledY
          );

          barXOffset += barXShift;
        }

        // icon
        if (icon) {
          ctx.drawImage(icon, centerX - imageWidth / 2, region.y + imageYOffset);
        }

        // header text
        ctx.fillStyle = 'white';
        ctx.font = `40px ${font.family}, sans-serif`;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.textBaseline = 'top';
        const displayName = lookupString(content.name);
        const textSize = ctx.measureText(displayName);
        const margin = (region.width - textSize.width) / 2;
        ctx.fillText(displayName, region.x + margin, region.y, region.width);
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
