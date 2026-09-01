import { engine } from '@csegames/library/dist/_baseGame/engine';
import { CaptureInterfaceHandler } from './handlers/captureInterfaceHandler';
import { CombatFlytextHandler } from './handlers/combatFlytextHandler';
import { CraftingStationNameplateHandler } from './handlers/craftingStationNameplateHandler';
import { GatherInterfaceHandler } from './handlers/gatherInterfaceHandler';
import { InteractableGatherInterfaceHandler } from './handlers/interactableGatherInterfaceHandler';
import { HealthBarHandler } from './handlers/healthBarHandler';
import { PlayerIconHandler } from './handlers/playerIconHandler';
import { RawTextHandler } from './handlers/rawTextHandler';
import * as Native from './core/nativeTypes';
import { loadStringTable } from './core/stringTable';

import './projected.scss';

// This code provides browser rendered components that are injected into
// 3d scenes as billboards by our main rendering engine. We accomplish
// this by rendering each requested component into a canvas at the
// coordinates requested by the native client. The data passed to this
// system should all be pre-calculated and boiled down to the minimum
// amount of information required to render the desired component. There
// should be no javascript side state tracking or calculation beyond
// the absolute minimum amount required to perform the desired canvas
// updates.

const captureInterface = new CaptureInterfaceHandler();
const combatInfo = new CombatFlytextHandler();
const craftingStationNameplate = new CraftingStationNameplateHandler();
const gatherInterface = new GatherInterfaceHandler();
const interactableGatherInterface = new InteractableGatherInterfaceHandler();
const healthBar = new HealthBarHandler();
const playerIcon = new PlayerIconHandler();
const rawText = new RawTextHandler();

let processedFrames = 0;
let processedRequests = 0;
let lastErrorFrame = -100;

function reportFailure(reason: any) {
  if (lastErrorFrame < processedFrames + 10) {
    console.error(`Draw failure: ${reason}`, reason);
    lastErrorFrame = processedFrames;
  }
  updateTotalDrawn();
}

function updateTotalDrawn() {
  processedRequests += 1;
}

async function draw(region: Native.Region, content: Native.Content): Promise<void> {
  switch (content.type) {
    case 'CaptureInterface':
      return captureInterface.draw(region, content);
    case 'CraftingStationNameplateInterface':
      return craftingStationNameplate.draw(region, content);
    case 'CombatFlytext':
      return combatInfo.draw(region, content);
    case 'GatherInterface':
      return gatherInterface.draw(region, content);
    case 'InteractableGatherInterface':
      return interactableGatherInterface.draw(region, content);
    case 'HealthBar':
      return healthBar.draw(region, content);
    case 'Icon':
      return playerIcon.draw(region, content);
    case 'RawText':
      return rawText.draw(region, content);
  }
}

async function updateCanvas(totalFrames: number, totalRequests: number, entries: Native.Entry[]) {
  ++processedFrames;

  if (entries.length) {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < entries.length; ++i) {
      const entry = entries[i];
      const content = entry?.content;
      const region = entry?.region;
      if (!content || !region) {
        reportFailure('content or region was not properly set');
        continue;
      }
      promises.push(draw(region, content).then(updateTotalDrawn, reportFailure));
    }
    await Promise.all(promises);
    engine.trigger('requestComplete');
  }

  const frameDelta = totalFrames - processedFrames;
  if (frameDelta) console.warn(`Missing ${frameDelta} frames`);
  processedFrames += frameDelta;
  const requestDelta = totalRequests - processedRequests;
  processedRequests += requestDelta;
  if (requestDelta) console.warn(`Missing ${requestDelta} requests`);
}

console.log(`engine.isAttached: ${engine.isAttached}`);
engine.on('drawRequest', updateCanvas);
engine.on('updateStrings', loadStringTable);
