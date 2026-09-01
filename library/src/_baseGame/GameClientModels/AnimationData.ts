/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// This global instance is bound by reference and will not notify the UI before its values change. It is meant to be used
// for animation of elements that need to be constantly changing such as minimap position and target bearings. If there is
// no valid game in progress these values may be NaN, and the global value may be undefined before it is bound.

export enum MapDataType {
  // This value is never sent by the client.  We just use it internally for UI purposes.
  Self = -1,
  // The rest needs to match the list in the client repo at UIMapMarkerType.h/.cpp
  Player = 0,
  KeepBank = 1,
  KeepMain = 2,
  KeepRoyalVendor = 3,
  KeepTowerArmory = 4,
  KeepTowerBarrack = 5,
  KeepTowerChurch = 6,
  KeepTowerStable = 7,
  ResourceEssence = 8,
  ResourceFishing = 9,
  ResourceMinerals = 10,
  ResourceMining = 11,
  ResourceHerbs = 12,
  ResourceLogging = 13,
  ResourceHunting = 14,
  PortalLocal = 15,
  PortalZone = 16,
  CraftingAlchemy = 17,
  CraftingArtifice = 18,
  CraftingCooking = 19,
  CraftingForge = 20,
  CraftingJewels = 21,
  CraftingLeatherworking = 22,
  CraftingSmithy = 23,
  CraftingTailoring = 24,
  CraftingWoodworking = 25,

  // Any POI with unsupported tags will show as INVALID
  INVALID = 26
}

export interface MapData {
  zoneId: string[];
  destinationZoneId: string[];
  id: string[];
  faction: number[];
  capturingFaction: number[];
  itemDefID: number[];
  type: MapDataType[];
  xpos: number[];
  ypos: number[];
  yaw: number[];
  tier: number[];
}

export interface AnimationData {
  cameraPitch: number;
  cameraYaw: number;
  enemyTargetDistance: number;
  enemyTargetBearing: number;
  friendlyTargetDistance: number;
  friendlyTargetBearing: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  playerYaw: number;
  viewX: number;
  viewY: number;
  viewZ: number;
  worldTime: number;
  fps: number;
  mapData: MapData;
}
