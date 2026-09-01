import { clamp } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { render } from '../core/canvas';
import { preloadImage } from '../core/image';
import { Region, HealthBar, Faction } from '../core/nativeTypes';

import HealthBarBackgroundArthurian from '../../images/health-bars/health-bar-background-arthurian.png';
import HealthBarFrameArthurian from '../../images/health-bars/health-bar-frame-arthurian.png';
import HealthBarFrameSelectedArthurian from '../../images/health-bars/health-bar-frame-selected-arthurian.png';
import HealthBarResourceArthurian from '../../images/health-bars/health-bar-resource-arthurian.png';
import HealthBarBackgroundTDD from '../../images/health-bars/health-bar-background-tdd.png';
import HealthBarFrameTDD from '../../images/health-bars/health-bar-frame-tdd.png';
import HealthBarFrameSelectedTDD from '../../images/health-bars/health-bar-frame-selected-tdd.png';
import HealthBarResourceTDD from '../../images/health-bars/health-bar-resource-tdd.png';
import HealthBarBackgroundViking from '../../images/health-bars/health-bar-background-viking.png';
import HealthBarFrameViking from '../../images/health-bars/health-bar-frame-viking.png';
import HealthBarFrameSelectedViking from '../../images/health-bars/health-bar-frame-selected-viking.png';
import HealthBarResourceViking from '../../images/health-bars/health-bar-resource-viking.png';
import HealthBarBackgroundFactionless from '../../images/health-bars/health-bar-background-factionless.png';
import HealthBarFrameFactionless from '../../images/health-bars/health-bar-frame-factionless.png';
import HealthBarFrameSelectedFactionless from '../../images/health-bars/health-bar-frame-selected-factionless.png';
import HealthBarResourceFactionless from '../../images/health-bars/health-bar-resource-factionless.png';
import CaudexBold from '../../fonts/Caudex/Caudex-Bold.ttf';
import { lookupString } from '../core/stringTable';

const font = new FontFace('CaudexBold', `url(${CaudexBold})`);
font.load();

interface NameplateSettings {
  background: HTMLImageElement;
  resource: HTMLImageElement;
  selected: HTMLImageElement;
  unselected: HTMLImageElement;
  nameStyle: string;
}

const settings = new Map<Faction, Promise<NameplateSettings>>();
const imageWidth = 512;
const imageHeight = 128;
const imageX = 0;
const imageY = 0;
const resourceLeftEdge = imageX + 75;
const resourceWidth = imageX + 512 - resourceLeftEdge * 2;
const markerY = imageY + 62;
const markerWidth = 3;
const markerHeight = 40;
const nameX = imageX + 256;
const nameY = 53;
const dropShadowOffset = 2;
const arthurianNameStyle = '#ffffff';
const factionlessNameStyle = '#ffffff';
const tddNameStyle = '#ffffff';
const vikingNameStyle = '#ffffff';
const partiedNameStyle = '#fcba05';

function calcResourceMarkerX(offsetX: number, resourceAmount: number): number {
  return offsetX + resourceLeftEdge + clamp(resourceAmount, 0, 1) * resourceWidth;
}

async function preloadSettings(
  nameStyle: string,
  backgroundUrl: string,
  resourceUrl: string,
  selectedFrameUrl: string,
  unselectedFrameUrl: string
): Promise<NameplateSettings> {
  const background = preloadImage(imageWidth, imageHeight, backgroundUrl);
  const resource = preloadImage(imageWidth, imageHeight, resourceUrl);
  const selected = preloadImage(imageWidth, imageHeight, selectedFrameUrl);
  const unselected = preloadImage(imageWidth, imageHeight, unselectedFrameUrl);
  return {
    background: await background,
    nameStyle,
    resource: await resource,
    selected: await selected,
    unselected: await unselected
  };
}

settings.set(
  Faction.Arthurian,
  preloadSettings(
    arthurianNameStyle,
    HealthBarBackgroundArthurian,
    HealthBarResourceArthurian,
    HealthBarFrameSelectedArthurian,
    HealthBarFrameArthurian
  )
);
settings.set(
  Faction.Factionless,
  preloadSettings(
    factionlessNameStyle,
    HealthBarBackgroundFactionless,
    HealthBarResourceFactionless,
    HealthBarFrameSelectedFactionless,
    HealthBarFrameFactionless
  )
);
settings.set(
  Faction.TDD,
  preloadSettings(
    tddNameStyle,
    HealthBarBackgroundTDD,
    HealthBarResourceTDD,
    HealthBarFrameSelectedTDD,
    HealthBarFrameTDD
  )
);
settings.set(
  Faction.Viking,
  preloadSettings(
    vikingNameStyle,
    HealthBarBackgroundViking,
    HealthBarResourceViking,
    HealthBarFrameSelectedViking,
    HealthBarFrameViking
  )
);

export class HealthBarHandler {
  async draw(region: Region, content: HealthBar): Promise<void> {
    await font.loaded;
    const toDraw = await (settings.get(content.faction) ?? settings.get(Faction.Factionless))!;

    await render(
      region,
      (ctx) => {
        ctx.drawImage(toDraw.background, region.x + imageX, region.y + imageY);
        const amount = clamp(content.resourceAmount, 0, 1);
        const markerX = calcResourceMarkerX(region.x, amount);
        ctx.save();
        ctx.beginPath();
        ctx.rect(region.x, region.y, markerX - region.x, region.height);
        ctx.clip();
        ctx.drawImage(toDraw.resource, region.x + imageX, region.y + imageY);
        ctx.restore();
        if (amount < 1) {
          ctx.fillStyle = 'white';
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'white';
          ctx.fillRect(markerX, region.y + markerY, markerWidth, markerHeight);
        }
        if (content.isTargeted) {
          ctx.drawImage(toDraw.selected, region.x + imageX, region.y + imageY);
        } else {
          ctx.drawImage(toDraw.unselected, region.x + imageX, region.y + imageY);
        }

        const nameStyle = content.isInParty ? partiedNameStyle : toDraw.nameStyle;
        ctx.fillStyle = '#00000088'; // 50% alpha black for contrast
        ctx.font = `24px ${font.family}, sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#00000088';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
          lookupString(content.name),
          region.x + nameX + dropShadowOffset,
          region.y + nameY + dropShadowOffset,
          400
        );
        ctx.fillStyle = nameStyle;
        ctx.lineWidth = 3;
        ctx.strokeStyle = nameStyle;
        ctx.fillText(lookupString(content.name), region.x + nameX, region.y + nameY, 400);
      },
      clientAPI.getDebugHints().drawNameplateGrids
    );
  }
}
