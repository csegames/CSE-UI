import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import { preloadImage } from '../core/image';
import { Faction, Region, Icon } from '../core/nativeTypes';

import HealthBarIconArthurian from '../../images/health-bars/health-bar-icon-arthurian.png';
import HealthBarIconTDD from '../../images/health-bars/health-bar-icon-tdd.png';
import HealthBarIconViking from '../../images/health-bars/health-bar-icon-viking.png';

const settings = new Map<Faction, Promise<HTMLImageElement>>();
const imageWidth = 128;
const imageHeight = 128;

settings.set(Faction.Arthurian, preloadImage(imageWidth, imageHeight, HealthBarIconArthurian));
settings.set(Faction.TDD, preloadImage(imageWidth, imageHeight, HealthBarIconTDD));
settings.set(Faction.Viking, preloadImage(imageWidth, imageHeight, HealthBarIconViking));

export class PlayerIconHandler {
  async draw(region: Region, content: Icon): Promise<void> {
    if (!settings.has(content.faction)) {
      return;
    }
    const img = await settings.get(content.faction)!;

    await render(
      region,
      (ctx) => {
        ctx.drawImage(img, region.x, region.y);
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
