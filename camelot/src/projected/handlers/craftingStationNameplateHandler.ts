/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import * as Native from '../core/nativeTypes';

import NameplateInteractionCircle from '../../images/projected/control-point-capture-border-64x64.png';
import CaudexBold from '../../fonts/Caudex/Caudex-Bold.ttf';
import { preloadImage } from '../core/image';
import { fillTextWithDropShadow } from '../core/drawUtils';
import { lookupString } from '../core/stringTable';

const font = new FontFace('CaudexBold', `url(${CaudexBold})`);
font.load();

const settings = new Map<string, Promise<HTMLImageElement>>();
const imageWidth = 64;
const imageHeight = 64;
settings.set('nameplate-interact-circle', preloadImage(imageWidth, imageHeight, NameplateInteractionCircle));

const headerHeight = 24;
const nameFontSize = 24;
const interactKeyFontSize = 22;
const nameColor = 'white';
const generalPadding = 3;

export class CraftingStationNameplateHandler {
  async draw(region: Native.Region, content: Native.CraftingStationNameplateInterface): Promise<void> {
    await font.loaded;
    const interactionCircleImg = await settings.get('nameplate-interact-circle');

    await render(
      region,
      (ctx) => {
        const centerX = region.x + region.width / 2;

        // This draws elements from the bottom up. We want the name to always be in a fixed position,
        // with the optional elements appearing above it
        var runningHeightOffset = region.y + region.height;

        /***  NAME ***/
        runningHeightOffset -= generalPadding + generalPadding + headerHeight;
        ctx.font = `${nameFontSize}px ${font.family}, sans-serif`;
        ctx.fillStyle = nameColor;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        fillTextWithDropShadow(ctx, lookupString(content.name), centerX, runningHeightOffset);

        /*** INTERACTION CIRCLE ***/
        if (content.canInteract) {
          // Circle background image
          const drawSize = imageWidth;
          runningHeightOffset -= generalPadding + drawSize / 2;
          ctx.drawImage(
            interactionCircleImg,
            centerX - drawSize / 2,
            runningHeightOffset - drawSize / 2,
            drawSize,
            drawSize
          );

          // Keybind in circle
          ctx.save();
          ctx.font = `${interactKeyFontSize}px ${font.family}, sans-serif`;
          ctx.textBaseline = 'middle';
          fillTextWithDropShadow(ctx, content.interactionKey, centerX, runningHeightOffset);
          ctx.restore();
        }
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
