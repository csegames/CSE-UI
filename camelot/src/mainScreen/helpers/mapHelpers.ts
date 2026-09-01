// We have to use imported URLs because they are from the `images` folder tree, which gets
// flattened at compile time.  The import fixes up the reference.
import LoadingScreenFactionlessURL from '../../images/loading-screens/factionless-loading-screen-bg.png';
import LoadingScreenCamelotURL from '../../images/loading-screens/arthurian-camelot-loading-screen-bg.png';
import LoadingScreenCamelotHillsURL from '../../images/loading-screens/arthurian-camelot-hills-loading-screen-bg.png';
import LoadingScreenEriuURL from '../../images/loading-screens/tdd-eriu-loading-screen-bg.png';
import LoadingScreenNiefelheimURL from '../../images/loading-screens/viking-niefelheim-loading-screen-bg.png';
import LoadingScreenSilvermineHillsURL from '../../images/loading-screens/tdd-silvermine-loading-screen-bg.png';
import LoadingScreenYggdraForestURL from '../../images/loading-screens/viking-yggdra-forest-loading-screen-bg.png';

import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { StringIDGeneralHyphen, StringIDGeneralUnnamed } from './stringTableHelpers';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { PartyMember } from '@csegames/library/dist/camelotunchained/game/GameClientModels/PartySnapshot';
import { WarbandSubgroup } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { requestAddImagesToCache } from '../dataSources/imageCacheService';

requestAddImagesToCache('MapHelpers', [
  LoadingScreenCamelotHillsURL,
  LoadingScreenCamelotURL,
  LoadingScreenEriuURL,
  LoadingScreenFactionlessURL,
  LoadingScreenNiefelheimURL,
  LoadingScreenSilvermineHillsURL,
  LoadingScreenYggdraForestURL
]);

export interface ContinentDetails {
  key: string;
  faction: 'Arthurian' | 'TDD' | 'Viking';
  // Zone Name (ZoneInfo.Name) used to match keep ownership from animation data.
  mapID?: string;
}

export const allContinents: ContinentDetails[] = [
  { key: 'world-map-camelot',              faction: 'Arthurian', mapID: 'cu2_camelot_home_island_v1' },
  { key: 'world-map-camelot-hills',        faction: 'Arthurian', mapID: 'camelothills_v02' },
  { key: 'world-map-lyonesse',             faction: 'Arthurian' },
  { key: 'world-map-forest-sauvage',       faction: 'Arthurian', mapID: 'cu2_sauvage_forest_zone_v3' },
  { key: 'world-map-penning-mountains',    faction: 'Arthurian' },
  { key: 'world-map-snowdonia',            faction: 'Arthurian' },
  { key: 'world-map-jamtland-mountains',   faction: 'Viking' },
  { key: 'world-map-uppland',              faction: 'Viking' },
  { key: 'world-map-niefilheim',           faction: 'Viking',    mapID: 'cu2_niefelheim_viking_home_v01' },
  { key: 'world-map-yggdra-forest',        faction: 'Viking',    mapID: 'yggdra_forest_v01a' },
  { key: 'world-map-myrkwood-forest',      faction: 'Viking' },
  { key: 'world-map-skona-ravine',         faction: 'Viking' },
  { key: 'world-map-shannon-estuary',      faction: 'TDD' },
  { key: 'world-map-eriu',                 faction: 'TDD',       mapID: 'cu2_eriu_tdd_homeisland_v01' },
  { key: 'world-map-emain-macha',          faction: 'TDD' },
  { key: 'world-map-lough-gur',            faction: 'TDD' },
  { key: 'world-map-louch-derg',           faction: 'TDD' },
  { key: 'world-map-silvermine-mountains', faction: 'TDD',       mapID: 'cu2_silvermine_mountains_v02a' }
];

export enum MapDisplayCategory {
  General,
  Structures,
  ResourceNodes,
  CraftingStations
}

// These define the categories in which POIs will be displayed on the map legend.
let typesByDisplayCategory: Record<MapDisplayCategory, MapDataType[]> = {
  [MapDisplayCategory.General]: [MapDataType.Player],
  [MapDisplayCategory.Structures]: [
    MapDataType.KeepBank,
    MapDataType.KeepMain,
    MapDataType.KeepRoyalVendor,
    MapDataType.KeepTowerArmory,
    MapDataType.KeepTowerBarrack,
    MapDataType.KeepTowerChurch,
    MapDataType.KeepTowerStable,
    MapDataType.PortalLocal,
    MapDataType.PortalZone
  ],
  [MapDisplayCategory.ResourceNodes]: [
    MapDataType.ResourceEssence,
    MapDataType.ResourceFishing,
    MapDataType.ResourceHerbs,
    MapDataType.ResourceHunting,
    MapDataType.ResourceLogging,
    MapDataType.ResourceMinerals,
    MapDataType.ResourceMining
  ],
  [MapDisplayCategory.CraftingStations]: [
    MapDataType.CraftingAlchemy,
    MapDataType.CraftingArtifice,
    MapDataType.CraftingCooking,
    MapDataType.CraftingForge,
    MapDataType.CraftingJewels,
    MapDataType.CraftingLeatherworking,
    MapDataType.CraftingSmithy,
    MapDataType.CraftingTailoring,
    MapDataType.CraftingWoodworking
  ]
};
export function getMapDataTypesForCategory(cat: MapDisplayCategory): MapDataType[] {
  return typesByDisplayCategory[cat];
}

interface MapDetails {
  nameStringID: string;
  descriptionStringID: string;
  factionID: string;
  mapURL: string;
  loadingScreenURL: string;
  bounds: SimpleBounds;
  // Home islands are only visible to members of their own realm (see isMapVisibleToFaction).
  isHomeIsland?: boolean;
}

// Home islands are only visible/interactive to members of their own realm.
export function isMapVisibleToFaction(mapID: string, factionID: string): boolean {
  const details = allMapDetails[mapID];
  return !(details?.isHomeIsland && details.factionID !== factionID);
}

// 'cu2_sauvage_forest_zone_v3' (Forest of Sauvage) temporarily removed from the map dropdown.
const arthurian = ['cu2_camelot_home_island_v1', 'camelothills_v02'];
const tdd = ['cu2_eriu_tdd_homeisland_v01', 'cu2_silvermine_mountains_v02a'];
const viking = ['cu2_niefelheim_viking_home_v01', 'yggdra_forest_v01a'];

// Region ID of the whole-world map view; also its NameStringID in the string table.
export const MAP_REGION_WORLD = 'MapRegion_World';

// Key: NameStringID, Value: MapIDs
export const allMapRegions: Record<string, string[]> = {
  [MAP_REGION_WORLD]: [...arthurian, ...tdd, ...viking],
  MapRegion_Arthurian: arthurian,
  MapRegion_TDD: tdd,
  MapRegion_Viking: viking
};

export const allMapDetails: Record<string, MapDetails> = {
  ['cu2_camelot_home_island_v1']: {
    nameStringID: 'MapName_Camelot',
    descriptionStringID: 'MapDescription_Camelot',
    factionID: Faction.Arthurian,
    mapURL: '/dynamic/zones/assets/world-map-camelot.jpg',
    loadingScreenURL: LoadingScreenCamelotURL,
    bounds: { x: -4800, y: -3285, width: 9000, height: 6570 },
    isHomeIsland: true
  },
  ['camelothills_v02']: {
    nameStringID: 'MapName_CamelotHills',
    descriptionStringID: 'MapDescription_CamelotHills',
    factionID: Faction.Arthurian,
    mapURL: '/dynamic/zones/assets/world-map-camelot-hills.jpg',
    loadingScreenURL: LoadingScreenCamelotHillsURL,
    bounds: { x: -4500, y: -3375, width: 9000, height: 6750 }
  },
  ['cu2_sauvage_forest_zone_v3']: {
    nameStringID: 'MapName_SauvageForest',
    descriptionStringID: 'MapDescription_SauvageForest',
    factionID: Faction.Arthurian,
    mapURL: '/dynamic/zones/assets/world-map-forest-of-sauvage.jpg',
    loadingScreenURL: LoadingScreenFactionlessURL,
    bounds: { x: -4630, y: -3100, width: 8600, height: 6450 }
  },
  ['cu2_eriu_tdd_homeisland_v01']: {
    nameStringID: 'MapName_Eriu',
    descriptionStringID: 'MapDescription_Eriu',
    factionID: Faction.TDD,
    mapURL: '/dynamic/zones/assets/world-map-eriu.jpg',
    loadingScreenURL: LoadingScreenEriuURL,
    bounds: { x: -4800, y: -3285, width: 9000, height: 6570 },
    isHomeIsland: true
  },
  ['cu2_niefelheim_viking_home_v01']: {
    nameStringID: 'MapName_Niefelheim',
    descriptionStringID: 'MapDescription_Niefelheim',
    factionID: Faction.Viking,
    mapURL: '/dynamic/zones/assets/world-map-niefelheim.jpg',
    loadingScreenURL: LoadingScreenNiefelheimURL,
    bounds: { x: -4700, y: -3700, width: 9400, height: 6885 },
    isHomeIsland: true
  },
  ['cu2_silvermine_mountains_v02a']: {
    nameStringID: 'MapName_SilvermineMountains',
    descriptionStringID: 'MapDescription_SilvermineMountains',
    factionID: Faction.TDD,
    mapURL: '/dynamic/zones/assets/world-map-silvermine-mountains.jpg',
    loadingScreenURL: LoadingScreenSilvermineHillsURL,
    bounds: { x: -4600, y: -3475, width: 9000, height: 6750 }
  },
  ['yggdra_forest_v01a']: {
    nameStringID: 'MapName_YggdraForest',
    descriptionStringID: 'MapDescription_YggdraForest',
    factionID: Faction.Viking,
    mapURL: '/dynamic/zones/assets/world-map-yggdra-forest.jpg',
    loadingScreenURL: LoadingScreenYggdraForestURL,
    bounds: { x: -5300, y: -3775, width: 9500, height: 7250 }
  }
};

export function getMapDetails(zone: ZoneInfo): MapDetails {
  if (allMapDetails[zone.Name]) {
    return allMapDetails[zone.Name];
  } else {
    // This is for when we do have a zone, but no map set up yet.
    const defaultDetails: MapDetails = {
      nameStringID: StringIDGeneralUnnamed,
      descriptionStringID: StringIDGeneralHyphen,
      factionID: 'Factionless',
      mapURL: '/images/MissingAsset.png',
      loadingScreenURL: '/images/loading-screens/factionless-loading-screen-bg.png',
      bounds: parseZoneBounds(zone.Bounds)
    };
    return defaultDetails;
  }
}

export const getGroupMemberName = (
  entityID: string,
  partyMembers: PartyMember[],
  warbandSubgroups: WarbandSubgroup[]
): string | null => {
  const partyMatch = partyMembers.find((member) => member.entityID === entityID);
  if (partyMatch) {
    return partyMatch.name;
  }
  for (const subgroup of warbandSubgroups) {
    const warbandMatch = subgroup.members.find((member) => member.entityID === entityID);
    if (warbandMatch) {
      return warbandMatch.name;
    }
  }
  return null;
};

export interface SimpleBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Zone bounds strings are static for the life of a zone, so parsing is cached by the source string.
const parsedBoundsCache: Record<string, SimpleBounds> = {};
export function parseZoneBounds(bounds: string): SimpleBounds {
  const cached = parsedBoundsCache[bounds];
  if (cached) {
    return cached;
  }

  const zoneCoordinates = bounds.split(' - ');
  const startX = Number(zoneCoordinates[0].substring(1, bounds.indexOf(',')));
  const endX = Number(zoneCoordinates[1].substring(0, zoneCoordinates[1].indexOf(',')));
  const startY = Number(zoneCoordinates[0].substring(zoneCoordinates[0].indexOf(',') + 1));
  const endY = Number(zoneCoordinates[1].substring(zoneCoordinates[1].indexOf(',') + 1, zoneCoordinates[1].length - 1));

  const parsed: SimpleBounds = {
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY
  };
  parsedBoundsCache[bounds] = parsed;
  return parsed;
}

export const getMapIconXPercent = (entityX: number, bounds: SimpleBounds): number => {
  return ((entityX - bounds.x) / bounds.width) * 100.0;
};

export const getMapIconYPercent = (entityY: number, bounds: SimpleBounds): number => {
  return ((entityY - bounds.y) / bounds.height) * 100.0;
};

export const getElementIconSize = (type: MapDataType): number => {
  switch (type) {
    // Note that this is OTHER players, not the local player.
    // Local Player size is handled in WorldMapIcons @ renderPlayerIcon()
    case MapDataType.Player:
      return 2.5;
    default:
      return 3;
  }
};
