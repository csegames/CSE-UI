/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import * as Native from '../core/nativeTypes';

import ResourceIconMining from '../../images/projected/factionless-pickaxe.svg';
import ResourceReticle from '../../images/projected/control-point-capture-border-64x64.png';
import ResourceCantInteract from '../../images/projected/control-point-cannot-capture-64x64.png';
import ResourceProgressCircleFactionless from '../../images/projected/control-point-capture-circle-64x64.png';
import ResourceProgressCircleArthurian from '../../images/projected/control-point-capture-circle-64x64-arthurian.png';
import ResourceProgressCircleTDD from '../../images/projected/control-point-capture-circle-64x64-tuatha.png';
import ResourceProgressCircleViking from '../../images/projected/control-point-capture-circle-64x64-viking.png';
import CaudexBold from '../../fonts/Caudex/Caudex-Bold.ttf';
import { preloadImage } from '../core/image';
import { lookupString } from '../core/stringTable';

const font = new FontFace('CaudexBold', `url(${CaudexBold})`);
font.load();

const progressCenterY = 110;
const progressRadius = 50;
const interactKeyFontSize = 35;
const nameFontSize = 40;

const settings = new Map<string, Promise<HTMLImageElement>>();
const imageWidth = 80;
const imageHalfWidth = imageWidth / 2;
const imageHeight = 80;
const imageHalfHeight = imageHeight / 2;

settings.set('icon-mine', preloadImage(imageWidth, imageHeight, ResourceIconMining));
settings.set('icon-damage-water', preloadImage(imageWidth, imageHeight, ResourceIconMining));
settings.set('reticle', preloadImage(imageWidth, imageHeight, ResourceReticle));
settings.set('cant-interact', preloadImage(imageWidth, imageHeight, ResourceCantInteract));
settings.set('progress-circle-factionless', preloadImage(imageWidth, imageHeight, ResourceProgressCircleFactionless));
settings.set('progress-circle-arthurian', preloadImage(imageWidth, imageHeight, ResourceProgressCircleArthurian));
settings.set('progress-circle-tdd', preloadImage(imageWidth, imageHeight, ResourceProgressCircleTDD));
settings.set('progress-circle-viking', preloadImage(imageWidth, imageHeight, ResourceProgressCircleViking));

export class CaptureInterfaceHandler {
  progressCircleKeys: Record<Native.Faction, string> = {
    [Native.Faction.Arthurian]: 'progress-circle-arthurian',
    [Native.Faction.Factionless]: 'progress-circle-factionless',
    [Native.Faction.TDD]: 'progress-circle-tdd',
    [Native.Faction.Viking]: 'progress-circle-viking'
  };

  async drawFactionProgress(
    ctx: CanvasRenderingContext2D,
    region: Native.Region,
    content: Native.CaptureInterface
  ): Promise<void> {
    const centerX = region.x + region.width / 2;
    const centerY = region.y + progressCenterY;
    const [left, top] = [centerX - imageHalfWidth, centerY - imageHalfHeight];
    const progressCircleStart = -0.5 * Math.PI;

    const progressCircle = content.ownerProgress > 0 ? await settings.get(this.progressCircleKeys[content.ownerFaction]) : await settings.get(this.progressCircleKeys[content.capturingFaction]);
    const progress = content.ownerProgress > 0 ? content.ownerProgress : content.capturingProgress;
    const reticle = await settings.get('reticle');
    const cantInteract = await settings.get('cant-interact');

    ctx.fillStyle = '#00000040';
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    // A shadow background to make the rest more readable against pale terrain.
    const path = new Path2D();
    path.arc(centerX, centerY, progressRadius, 0, 2 * Math.PI);
    ctx.fill(path);

    // If needed, draw the circular progress bar.
    if (progressCircle && progress > 0) {
      // Save first so we can remove the clip after.
      ctx.save();
      // Set up the clipping region.
      const clipPath = new Path2D();
      clipPath.moveTo(centerX, centerY);
      clipPath.lineTo(centerX, centerY - imageHalfHeight);
      clipPath.arc(
        centerX,
        centerY,
        imageHalfHeight,
        progressCircleStart,
        progressCircleStart + 2 * Math.PI * progress
      );
      clipPath.closePath();
      ctx.clip(clipPath);
      // Anything draw between here and the restore() call will be clipped/masked.
      ctx.drawImage(progressCircle, left, top, imageWidth, imageHeight);

      // Restore() removes the clipping region so it doesn't affect later draw calls.
      ctx.restore();
    }

    // Draw the reticle.
    if (reticle) {
      ctx.drawImage(reticle, left, top, imageWidth, imageHeight);
    }

    // If interactable, draw the interaction key.
    if (content.canInteract) {
      // text
      ctx.fillStyle = 'white';
      ctx.font = `${interactKeyFontSize}px ${font.family}, sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';
      ctx.textBaseline = 'middle';
      const textSize = ctx.measureText(content.interactKey);
      const margin = (region.width - textSize.width) / 2;
      ctx.fillText(content.interactKey, region.x + margin, centerY, region.width);
    } else {
      if (cantInteract) {
        ctx.drawImage(cantInteract, left, top, imageWidth, imageHeight);
      }
    }
  }

  async draw(region: Native.Region, content: Native.CaptureInterface): Promise<void> {
    await font.loaded;
    // const icon = await settings.get(content.icon);

    await render(
      region,
      (ctx) => {
        this.drawFactionProgress(ctx, region, content);

        // header text
        ctx.fillStyle = 'white';
        ctx.font = `${nameFontSize}px ${font.family}, sans-serif`;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.textBaseline = 'top';
        const textSize = ctx.measureText(lookupString(content.name));
        const margin = (region.width - textSize.width) / 2;
        ctx.fillText(lookupString(content.name), region.x + margin, region.y, region.width);
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
