/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Faction, SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { FactionData, getFactionData } from '../gameData/factionData';
import { requestAddImagesToCache, requestRemoveImagesFromCache } from '../dataSources/imageCacheService';
import { getRaceData } from '../gameData/raceData';
import { ClassDef } from '../dataSources/manifest/classManifest';

let cachedFaction: Faction | null = null;

export function cacheImagesForFaction(faction: Faction): void {
  if (faction === cachedFaction) {
    return;
  }

  const factionData = getFactionData(faction);
  const imageKeys = Object.keys(factionData).filter((key) => key.endsWith('Image'));
  const requestor = 'FactionData';

  if (cachedFaction !== null) {
    // Uncache all images for the previous faction.
    const cachedFactionData = getFactionData(cachedFaction);
    requestRemoveImagesFromCache(
      requestor,
      imageKeys.map((key) => cachedFactionData[key as keyof FactionData] as string)
    );

    // MapIcon images are stored differently.
    requestRemoveImagesFromCache(requestor, Object.values(cachedFactionData.mapIconImages));

    // EquipSlot images are stored differently.
    requestRemoveImagesFromCache(
      requestor,
      cachedFactionData.gearSlotImages.map(({ gearSlotID, image }) => image)
    );
  }

  cachedFaction = faction;
  // Cache all images for the new faction.
  requestAddImagesToCache(
    requestor,
    imageKeys.map((key) => factionData[key as keyof FactionData] as string)
  );

  // MapIcon images are stored differently.
  requestAddImagesToCache(requestor, Object.values(factionData.mapIconImages));

  // EquipSlot images are stored differently.
  requestAddImagesToCache(
    requestor,
    factionData.gearSlotImages.map(({ gearSlotID, image }) => image)
  );
}

let cachedRaceID: string | null = null;
let cachedBodyTypeID: string | null = null;
export function cacheCharacterRaceImages(raceID: string, bodyTypeID: string): void {
  const requestor = 'CharacterRace';

  // Uncache all images for the previous character.
  if (cachedRaceID != null) {
    const raceData = getRaceData(cachedRaceID);

    const equippedBodyImage = raceData?.equippedBodyImages.find((ebi) => ebi.bodyTypeID == cachedBodyTypeID)?.image;
    if (equippedBodyImage) {
      requestRemoveImagesFromCache(requestor, [equippedBodyImage]);
    }
  }

  cachedRaceID = raceID;
  cachedBodyTypeID = bodyTypeID;
  const raceData = getRaceData(raceID);
  // Cache all images for the current character.
  // EquippedBodyImage is the background of the character's Armory / Equipped Gear UI.
  const equippedBodyImage = raceData?.equippedBodyImages.find((ebi) => ebi.bodyTypeID == bodyTypeID)?.image;
  if (equippedBodyImage) {
    requestAddImagesToCache(requestor, [equippedBodyImage]);
  }
}

let cachedCharacterListImages: string[] = [];
const characterListRequestor = 'CharacterListImages';
export function cacheCharacterListImages(
  characters: SimpleCharacter[],
  classesByStringID: Record<string, ClassDef>
): void {
  let urls: string[] = [];
  characters.forEach((character) => {
    const userClass = classesByStringID[character.classID ?? ''];
    if (userClass) {
      // Class icon.
      if (!urls.includes(userClass.unitFrameIconImage)) {
        urls.push(userClass.unitFrameIconImage);
      }
    }

    const raceData = getRaceData(character.raceID);
    if (raceData) {
      // Race/gender portrait.
      const url = raceData.portraits.find((p) => p.bodyTypeID === character.bodyTypeID)?.image;
      if (url) {
        urls.push(url);
      }
    }
  });

  // Any characters that are no longer in the list should be uncached (e.g. character was deleted).
  const toDelete = cachedCharacterListImages.filter((url) => !urls.includes(url));
  requestRemoveImagesFromCache(characterListRequestor, toDelete);

  // Any dolls that were already in the list will be ignored by the requestor filter.  New ones will be added.
  requestAddImagesToCache(characterListRequestor, urls);
  cachedCharacterListImages = urls;
}

export function uncacheCharacterListImages(): void {
  requestRemoveImagesFromCache(characterListRequestor, cachedCharacterListImages);
}
