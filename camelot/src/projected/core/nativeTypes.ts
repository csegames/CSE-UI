export enum Faction {
  Factionless = 0,
  TDD = 1,
  Viking = 2,
  Arthurian = 3
}

export enum CombatEventType {
  None = 0,
  Damaged = 1,
  Deflected = 2,
  Healed = 3,
  Killed = 4,
  KnockedBack = 5,
  Interrupted = 6,
  ResourceUpdated = 7,
  StatusAdded = 8,
  StatusRemoved = 9
}

export enum CaptureStatus {
  Neutral = 0,
  Friendly = 1,
  Enemy = 2
}

export enum CaptureMomentum {
  None = 0,
  Filling = 1,
  Paused = 2,
  Draining = 3
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CaptureInterface {
  type: 'CaptureInterface';
  name: string;
  icon: string;
  ownerFaction: Faction;
  ownerProgress: number;
  capturingFaction: Faction;
  capturingProgress: number;
  arthurianContestedCount: number;
  neutralContestedCount: number;
  tddContestedCount: number;
  vikingContestedCount: number;
  status: CaptureStatus;
  momentum: CaptureMomentum;
  canInteract: boolean;
  interactKey: string;
}

export interface CombatFlytext {
  type: 'CombatFlytext';
  event: CombatEventType;
  name: string;
  icon: string;
  amount: number;
}

export interface CraftingStationNameplateInterface {
  type: 'CraftingStationNameplateInterface';
  name: string;
  canInteract: boolean;
  interactionKey: string;
}

export interface GatherInterface {
  type: 'GatherInterface';
  name: string;
  icon: string;
  progress: number[];
  isTargeted: boolean;
}

export interface InteractableGatherInterface {
  type: 'InteractableGatherInterface';
  name: string;
  associatedSkill: string;
  disabledMessage: string;
  canInteract: boolean;
  interactionKey: string;
  yieldFrac: number;
  faction: Faction;
}

export interface HealthBar {
  type: 'HealthBar';
  faction: Faction;
  name: string;
  resourceAmount: number;
  isInParty: boolean;
  isTargeted: boolean;
}

export interface Icon {
  type: 'Icon';
  faction: Faction;
}

export interface RawText {
  type: 'RawText';
  text: string;
}

export type Content =
  | CaptureInterface
  | CombatFlytext
  | CraftingStationNameplateInterface
  | GatherInterface
  | InteractableGatherInterface
  | HealthBar
  | Icon
  | RawText;

export interface Entry {
  region: Region;
  content: Content;
}
