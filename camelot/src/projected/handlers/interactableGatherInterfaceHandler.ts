/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';

import CaudexBold from '../../fonts/Caudex/Caudex-Bold.ttf';
import { preloadImage } from '../core/image';
import { fillTextWithDropShadow } from '../core/drawUtils';
import { Faction, InteractableGatherInterface, Region } from '../core/nativeTypes';

import NameplateInteractionCircle from '../../images/projected/control-point-capture-border-64x64.png';
import ResourceBarFill_Common from '../../images/projected/gathering-nameplates/node-resource-fill.png';

import ResourceBarBackground_Arthurian from '../../images/projected/gathering-nameplates/node-resource-background-arthurian.png';
import ResourceBarFrame_Arthurian from '../../images/projected/gathering-nameplates/node-resource-frame-arthurian.png';

import ResourceBarBackground_TDD from '../../images/projected/gathering-nameplates/node-resource-background-tdd.png';
import ResourceBarFrame_TDD from '../../images/projected/gathering-nameplates/node-resource-frame-tdd.png';

import ResourceBarBackground_Viking from '../../images/projected/gathering-nameplates/node-resource-background-viking.png';
import ResourceBarFrame_Viking from '../../images/projected/gathering-nameplates/node-resource-frame-viking.png';

import ResourceBarBackground_Factionless from '../../images/projected/gathering-nameplates/node-resource-background-factionless.png';
import ResourceBarFrame_Factionless from '../../images/projected/gathering-nameplates/node-resource-frame-factionless.png';
import { lookupString } from '../core/stringTable';

const font = new FontFace('CaudexBold', `url(${CaudexBold})`);
font.load();

const interactionCircleSize = 64;
const preloadInteractButton = preloadImage(interactionCircleSize, interactionCircleSize, NameplateInteractionCircle);

const headerHeight = 40;
const nameFontSize = 38;
const subtitleFontSize = 30;
const interactKeyFontSize = 34;
const errorFontSize = 30;
const errorColor = 'red';

const resourceBarImageWidth = 384;
const resourceBarImageHeight = 64;

interface FactionData {
  background: HTMLImageElement;
  fill: HTMLImageElement;
  frame: HTMLImageElement;
  nameStyle: string;
}
const factionDrawData = new Map<Faction, Promise<FactionData>>();
const commonNameStyle = '#ffffff';
factionDrawData.set(
  Faction.Factionless,
  preloadFactionStyles(
    commonNameStyle,
    ResourceBarBackground_Factionless,
    ResourceBarFill_Common,
    ResourceBarFrame_Factionless
  )
);
factionDrawData.set(
  Faction.Arthurian,
  preloadFactionStyles(
    commonNameStyle,
    ResourceBarBackground_Arthurian,
    ResourceBarFill_Common,
    ResourceBarFrame_Arthurian
  )
);
factionDrawData.set(
  Faction.TDD,
  preloadFactionStyles(commonNameStyle, ResourceBarBackground_TDD, ResourceBarFill_Common, ResourceBarFrame_TDD)
);
factionDrawData.set(
  Faction.Viking,
  preloadFactionStyles(commonNameStyle, ResourceBarBackground_Viking, ResourceBarFill_Common, ResourceBarFrame_Viking)
);

async function preloadFactionStyles(
  nameStyle: string,
  backgroundUrl: string,
  fillUrl: string,
  frameUrl: string
): Promise<FactionData> {
  const background = preloadImage(resourceBarImageWidth, resourceBarImageHeight, backgroundUrl);
  const fill = preloadImage(resourceBarImageWidth, resourceBarImageHeight, fillUrl);
  const frame = preloadImage(resourceBarImageWidth, resourceBarImageHeight, frameUrl);
  return {
    background: await background,
    fill: await fill,
    frame: await frame,
    nameStyle: nameStyle
  };
}

export class InteractableGatherInterfaceHandler {
  async draw(region: Region, content: InteractableGatherInterface): Promise<void> {
    await font.loaded;
    const interactionCircleImg = await preloadInteractButton;
    const factionToDraw = await (factionDrawData.get(content.faction) ?? factionDrawData.get(Faction.Factionless))!;
    const centerX = region.x + region.width / 2;

    await render(
      region,
      (ctx) => {
        // Render elements from the bottom up. We want the name to always be in a fixed position,
        // with the optional elements appearing above it
        var runningHeightOffset = region.y + region.height;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        /*** ERROR/DISABLED MESSAGE ***/
        runningHeightOffset -= errorFontSize + 10; // Because characters like g/y dip below the baseline
        if (!content.canInteract) {
          ctx.save();
          ctx.font = `${errorFontSize}px ${font.family}, sans-serif`;
          ctx.fillStyle = errorColor;
          fillTextWithDropShadow(ctx, content.disabledMessage, centerX, runningHeightOffset);
          ctx.restore();
        }

        /*** YIELD BAR ***/
        runningHeightOffset -= resourceBarImageHeight - 10; // tuning value to get the spacing just right
        ctx.save();
        const barXPos = centerX - resourceBarImageWidth / 2;
        const barYPos = runningHeightOffset;
        ctx.drawImage(factionToDraw.background, barXPos, barYPos);
        // Fill bar -- Uses sourceWidth/destWidth variant of drawImage to clip
        var sWidth = resourceBarImageWidth * content.yieldFrac;
        var sHeight = resourceBarImageHeight;
        ctx.drawImage(
          factionToDraw.fill,
          0,
          0,
          sWidth,
          sHeight,
          barXPos,
          barYPos,
          resourceBarImageWidth * content.yieldFrac,
          resourceBarImageHeight
        );
        ctx.drawImage(factionToDraw.frame, barXPos, barYPos);
        ctx.restore();

        /***  NAME ***/
        runningHeightOffset -= headerHeight;
        ctx.font = `${nameFontSize}px ${font.family}, sans-serif`;
        ctx.fillStyle = factionToDraw.nameStyle;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        fillTextWithDropShadow(ctx, lookupString(content.name), centerX, runningHeightOffset);

        /*** SUBTITLE (TRADESKILL NAME) ***/
        runningHeightOffset -= subtitleFontSize;
        ctx.save();
        ctx.font = `${subtitleFontSize}px ${font.family}, sans-serif`;
        ctx.fillStyle = factionToDraw.nameStyle;
        fillTextWithDropShadow(ctx, content.associatedSkill, centerX, runningHeightOffset);
        ctx.restore();

        /*** INTERACTION CIRCLE ***/
        if (content.canInteract) {
          // Circle background image
          const drawSize = interactionCircleSize;
          runningHeightOffset -= drawSize / 2;
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
