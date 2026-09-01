import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import * as Native from '../core/nativeTypes';

import CaudexBold from '../../fonts/Caudex/Caudex-Bold.ttf';

const font = new FontFace('CaudexBold', `url(${CaudexBold})`);
font.load();

type Align = 'left' | 'center' | 'right';
type Baseline = 'top' | 'middle' | 'bottom';

export class CombatFlytextHandler {
  drawAlignedText(
    ctx: CanvasRenderingContext2D,
    rect: Native.Region,
    text: string,
    align: Align,
    baseline: Baseline
  ): void {
    ctx.textBaseline = baseline;
    const metrics = ctx.measureText(text);
    let maxWidth = rect.width;
    let xOffset = 0;
    let yOffset = 0;
    switch (align) {
      case 'left':
        break;
      case 'center':
        xOffset = (rect.width - maxWidth) / 2;
        maxWidth -= xOffset;
        break;
      case 'right':
        maxWidth = metrics.width;
        xOffset = rect.width - metrics.width;
        break;
    }
    switch (baseline) {
      case 'bottom':
        yOffset = rect.height - (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent);
        break;
      case 'middle':
        yOffset = (rect.height - (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)) / 2;
        break;
      case 'top':
        break;
    }
    ctx.fillText(text, rect.x + xOffset, rect.y + yOffset, maxWidth);
  }

  async draw(region: Native.Region, content: Native.CombatFlytext): Promise<void> {
    await font.loaded;
    await render(
      region,
      (ctx) => {
        ctx.fillStyle = 'white';
        ctx.font = `20px ${font.family}, sans-serif`;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';

        switch (content.event) {
          case Native.CombatEventType.None:
            this.drawAlignedText(ctx, region, content.type, 'center', 'top');
            break;
          case Native.CombatEventType.Damaged: {
            const damageString = content.amount.toLocaleString('en-US', {
              maximumFractionDigits: 0
            });
            this.drawAlignedText(ctx, region, damageString, 'center', 'top');
            break;
          }
          case Native.CombatEventType.Deflected:
            this.drawAlignedText(ctx, region, 'Deflected', 'center', 'top');
            break;
          case Native.CombatEventType.Healed: {
            const healString = content.amount.toLocaleString('en-US', {
              maximumFractionDigits: 0
            });
            this.drawAlignedText(ctx, region, healString, 'center', 'top');
            break;
          }
          case Native.CombatEventType.Killed:
            this.drawAlignedText(ctx, region, content.type, 'center', 'top');
            break;
          case Native.CombatEventType.KnockedBack:
            this.drawAlignedText(ctx, region, 'Knocked back', 'center', 'top');
            break;
          case Native.CombatEventType.Interrupted:
            this.drawAlignedText(ctx, region, 'Interrupted', 'center', 'top');
            break;
          case Native.CombatEventType.ResourceUpdated:
            this.drawAlignedText(ctx, region, `${content.amount} ${content.name}`, 'center', 'top');
            break;
          case Native.CombatEventType.StatusAdded:
            this.drawAlignedText(ctx, region, `+${content.name}`, 'center', 'top');
            break;
          case Native.CombatEventType.StatusRemoved:
            this.drawAlignedText(ctx, region, `-${content.name}`, 'center', 'top');
            break;
        }
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
