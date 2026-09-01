import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import { Region, RawText } from '../core/nativeTypes';

export class RawTextHandler {
  async draw(region: Region, content: RawText): Promise<void> {
    await render(
      region,
      (ctx) => {
        ctx.fillStyle = 'white';
        ctx.font = '24px CaudexBold';
        ctx.lineWidth = 3;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        const centerX = region.x + region.width / 2;
        ctx.fillText(content.text, centerX, region.y, region.width);
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
