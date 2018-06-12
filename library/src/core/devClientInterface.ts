/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import clientInterface, { PlayerState, AnyEntityState, ClientSkillState, ClientSkillBarItem } from './clientInterface';
import configGroup from './config/configGroup';
import { Race, Gender, Faction } from '..';
import Item from './classes/Item';

const devClientInterface: clientInterface = {
  initialized: true,
  OnInitialized: (c: () => void): number => {
    c();
    return -1;
  },
  /* Client Options */
  muteVolume: false,
  mainVolume: 1,

  /* Shared */

  patchResourceChannel: 4,
  loginToken: 'developer',
  pktHash: '0000',
  webAPIHost: 'hatcheryd.camelotunchained.com',
  apiHost: 'https://api.camelotunchained.com',
  serverURL: '',
  serverTime: 1,
  vsync: 1,
  playerState: {
    id: 'TestPlayer',
    name: 'CSEaj',
    type: 'player',
    isAlive: true,
    race: 2,
    faction: 1,
    gender: 1,
    health: [
      { current: 500, max: 500, wounds: 0 },
      { current: 500, max: 500, wounds: 0 },
      { current: 500, max: 500, wounds: 0 },
      { current: 500, max: 500, wounds: 0 },
      { current: 500, max: 500, wounds: 0 },
      { current: 500, max: 500, wounds: 0 },
    ],
    stamina: { current: 500, max: 1000 },
    blood: { current: 500, max: 1000 },
  },

  FOV: (degrees: number) => {
  },
  DropLight: (intensity: number, radius: number, red: number, green: number, blue: number) => {
  },
  ResetLights: () => {
  },

  OnServerConnected: (c: (isConnected: boolean) => void): number => {
    c(false);
    return -1;
  },
  PlaySoundEvent: (id: number): void => {
  },
  ToggleCamera: (): void => {
  },
  ReloadUI: (name: string): void => {
  },
  ReloadAllUI: (): void => {
  },
  OpenUI: (name: string): void => {
  },
  CloseUI: (name: string): void => {
  },
  HideUI: (name: string): void => {
  },
  ShowUI: (name: string): void => {
  },
  ToggleUIVisibility: (name: string): void => {
  },
  RequestInputOwnership: (): void => {
  },
  ReleaseInputOwnership: (): void => {
  },
  Quit: (): void => {
  },
  CrashTheGame: (): void => {
  },
  OnOpenUI: (callback: (name: string) => void): void => {
  },
  OnCloseUI: (callback: (name: string) => void): void => {
  },
  OnShowUI: (callback: (name: string) => void): void => {
  },
  OnHideUI: (callback: (name: string) => void): void => {
  },

  /* Respawn */
  Respawn: (id: string): void => {
  },

  /* Skills */

  OnSkillStateChanged: (callback: (skillState: ClientSkillState) => void): void => {},

  OnSkillBarChanged: (callback: (newSkillBar: ClientSkillBarItem[]) => void): void => {},

  /* Abilities */

  Attack: (abilityID: string): void => {
  },

  OnAbilityError: (c: (message: string) => void): void => {
  },

  /* HUD */
  OnToggleHUDItem: (c: (name: string) => void): void => {
  },

  /* Equipped Gear */

  SubscribeGear: (subscribe: boolean): void => {
  },
  OnGearAdded: (callback: (item: Item) => void): void => {
  },
  OnGearRemoved: (callback: (itemID: string) => void): void => {
  },

  UnequipItem: (itemID: string): void => {
  },

  /* Inventory */

  SubscribeInventory: (subscribe: boolean): void => {
  },
  OnInventoryAdded: (callback: (item: Item) => void): void => {
  },
  OnInventoryRemoved: (callback: (itemID: string) => void): void => {
  },

  EquipItem: (itemID: string): void => {
  },

  DropItem: (itemID: string): void => {
  },

  /* Config */

  OnReceiveConfigVars: (c: (configs: string) => void): void => {
  },
  OnReceiveConfigVar: (c: (config: any) => void): void => {
  },
  OnConfigVarChanged: (c: (isChangeSuccessful: boolean) => void): void => {
  },
  SaveConfigChanges: (): void => {
  },
  OnSavedConfigChanges: (c: () => void): void => {
  },
  RestoreConfigDefaults: (tag: configGroup): void => {
  },
  ChangeConfigVar: (variable: string, value: string): void => {
  },
  CancelChangeConfig: (variable: string): void => {
  },
  CancelAllConfigChanges: (tag: configGroup): void => {
  },
  GetConfigVars: (tag: configGroup): void => {
  },
  GetConfigVar: (variable: string): void => {
  },

  /* Building | CUBE */
  OnBuildingModeChanged: (c: (buildingMode: number) => void): void => {
  },

  // responds with all blocks -- triggered by a call to 'RequestBlocks'
  OnReceiveBlocks: (c: (buildingDict: any) => void): void => {
  },

  // responds with all substance ids -- triggered by a call to 'RequestSubstances'
  OnReceiveSubstances: (c: (substances: any) => void): void => {
  },

  // responds with block ids for a specific substance last passed into 'BlockIDsforSubstanceID'
  OnReceiveBlockIDs: (c: (blockIds: [number]) => void): void => {
  },

  OnReceiveBlockTags: (c: (blockID: number, tagDict: any) => void): void => {
  },
  OnReceiveScreenShot: (c: (screenShotString: any) => void): void => {
  },
  OnCopyBlueprint: (c: () => void): void => {
  },
  OnNewBlueprint: (c: (index: number, name: string) => void): void => {
  },
  OnDownloadBlueprints: (c: (charId: string) => void): void => {
  },
  OnUploadBlueprint: (c: (charId: string, name: string, data: any) => void): void => {
  },
  OnBlueprintSelected: (c: () => void): void => {
  },
  OnBlockSelected: (c: (blockID: number) => void): void => {
  },


  ToggleBuildingMode: (): void => {
  },
  SetBuildingMode: (newMode: number): void => {
  },
  UndoCube: (): void => {
  },
  RedoCube: (): void => {
  },
  CommitBlock: (): void => {
  },
  CancelBlockPlacement: (): void => {
  },
  BlockRotateX: (): void => {
  },
  BlockRotateY: (): void => {
  },
  BlockRotateZ: (): void => {
  },
  BlockFlipX: (): void => {
  },
  BlockFlipY: (): void => {
  },
  BlockFlipZ: (): void => {
  },
  CopyBlueprint: (): void => {
  },
  PasteBlueprint: (): void => {
  },
  RemoveIslands: (): void => {
  },
  ApplyStability: (): void => {
  },
  TestStability: (): void => {
  },
  SaveBuilding: (): void => {
  },
  ToggleStabilityLoop: (): void => {
  },
  RequestBlocks: (): void => {
  },
  RequestSubstances: (): void => {
  },
  BlockIDsforSubstanceID: (substanceID: number): void => {
  },
  RequestBlockTags: (blockID: number): void => {
  },
  ChangeBlockType: (newType: number): void => {
  },
  OpenScreenshotShare: (): void => {
  },
  TakeScreenshot: (): void => {
  },
  CountBlocks: (): void => {
  },

  ReplaceSubstance: (block1: number, block2: number): void => {
  },
  ReplaceSelectedSubstance: (block1: number, block2: number): void => {
  },
  ReplaceShapes: (shape1: number, shape2: number): void => {
  },
  ReplaceSelectedShapes: (shape1: number, shape2: number): void => {
  },
  RotateX: (): void => {
  },
  RotateY: (): void => {
  },
  RotateZ: (): void => {
  },
  SnapMode: (): void => {
  },
  BlockTypes: (): void => {
  },
  LoopAbility: (hotbarIndex: number, interval: number): void => {
  },
  EndLoopAbility: (): void => {
  },

  placedBlockCount: 0,
  blockTypes: 0,

  SelectBlueprint: (index: number): void => {
  },
  RequestBlueprints: (): void => {
  },
  SaveBlueprint: (name: string): void => {
  },
  DownloadBlueprints: (): void => {
  },
  ReceiveBlueprintFromServer: (name: string, cellData: any, id: string): void => {
  },
  DeleteLocalBlueprint: (name: string): void => {
  },


  /* Announcement */

  OnAnnouncement: (c: (message: string, type: number) => void): void => {
  },

  /* Plot */

  OnPlotStatus: (c: (plotOwned: boolean, permissions: number, charID: string, entityID: string) => void): void => {
  },

  /* Character State Changes */
  OnPlayerStateChanged: (c: (state: PlayerState) => void): void => {
  },
  OnEnemyTargetStateChanged: (c: (state: AnyEntityState) => void): void => {
  },
  OnFriendlyTargetStateChanged: (c: (state: AnyEntityState) => void): void => {
  },


  /* Character */

  OnCharacterZoneChanged: (c: (zoneID: string) => void): void => {
  },

  OnCharacterCanReleaseControlChanged: (c: (canRelease: boolean) => void): void => {
  },

  /* EMOTE */

  Emote: (emote: number): void => {
  },

  /* Chat */

  OnBeginChat: (c: (commandMode: number, text: string) => void): void => {
  },
  OnChat: (c: (type: number, from: string, body: string, nick: string, iscse: boolean) => void): void => {
  },
  SendChat: (type: number, to: string, body: string): void => {
  },
  Stuck: (): void => {
  },
  ChangeZone: (zoneID: number): void => {
  },

  /* Ability Crafting */

  AbilityCreated: (abilityID: string, primaryBaseComponentID: string,
                   secondaryBaseComponentID: string, ability: string): void => {
  },
  OnAbilityCreated: (callback: (abilityID: string, ability: string) => void): void => {
  },

  AbilityDeleted: (abilityID: string): void => {
  },
  OnAbilityDeleted: (callback: (abilityID: string) => void): void => {
  },

  RegisterAbility: (abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string): void => {
  },
  OnAbilityRegistered: (callback: (abilityID: string, cooldowns: string,
                                   duration: number, triggerTime: number) => void): void => {
  },

  /* Stats */

  fps: 0,
  frameTime: 0,
  netstats_udpPackets: 0,
  netstats_udpBytes: 0,
  netstats_tcpMessages: 0,
  netstats_tcpBytes: 0,
  netstats_players_updateBits: 0,
  netstats_players_updateCount: 0,
  netstats_players_newCount: 0,
  netstats_players_newBits: 0,
  netstats_lag: 0,
  netstats_delay: 0,
  netstats_selfUpdatesPerSec: 0,
  netstats_syncsPerSec: 0,
  particlesRenderedCount: 0,
  characters: 0,
  terrain: 0,
  perfHUD: '',

  /* Physics Debugging */

  locationX: 0,
  locationY: 0,
  locationZ: 0,
  serverLocationX: 0,
  serverLocationY: 0,
  serverLocationZ: 0,
  facing: 0,
  velocityX: 0,
  velocityY: 0,
  velocityZ: 0,
  speed: 0,
  horizontalSpeed: 0,
  velFacing: 0,
  downCollisionAngle: 0,
  terrainCollisionAngle: 0,

  /* Console */

  OnConsoleText: (c: (text: string) => void): void => {
  },
  ConsoleCommand: (body: string): void => {
  },
  SendSlashCommand: (command: string): void => {
  },

  /* Logging */
  OnLogMessage: (c: (category: string,
                     level: number,
                     time: string,
                     process: number,
                     thread: number,
                     message: string) => void): void => {
  },

  /* Combat Logs */
  OnCombatLogEvent: (c: (events: any) => void): void => {
  },

  /* Dev UI */
  OnUpdateDevUI: (c: (pageID: string, rootPage: any) => void): void => {
  },

  /* Scenarios */
  ScenarioRoundEnded: (c: (scenarioID: string, roundID: string, scenarioEnded: boolean, didWin: boolean) => void): void => {
  },

  /* Deployable Items */
  StartPlacingItem: (resourceID: string, itemInstanceIDString: string, rulesOrSettings: any): void => {},

  ResetItemPlacement: (): void => {},

  CommitItemPlacement: (): void => {},

  CancelItemPlacement: (): void => {},

  SendCommitItemRequest: (callback: (itemINstanceIDString: string, position: any, rotation: any, scale: any) => void)
  : void => {},

  /* Target */
  RequestFriendlyTargetEntityID: (entityID:string): void => {},
  RequestEnemyTargetEntityID: (entityID:string): void => {},

  apiVersion: 1,
  characterID: 'AABBCCDDEEFFGG',
  debug: false,
  signalRHost: 'https://api.camelotunchained.com/signalr',
  shardID: 1,
};

export default devClientInterface;
