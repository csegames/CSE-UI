/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com {})
 * @Date: 2017-01-26 17:40:13
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-20 17:05:16
 */

import clientInterface from './clientInterface';
import configGroup from './config/configGroup';
import { Race, Gender, Faction } from '..';
import Item from './classes/Item';

const devClientInterface: clientInterface = {
  initialized: true,
  OnInitialized: function(c: () => void) {
    c();
    return -1;
  },
  CancelOnInitialized: function(c: number) {},

  /* Client Options */
  muteVolume: false,
  mainVolume: 1,

  /* Shared */
  
  patchResourceChannel: 4,
  loginToken: 'developer',
  pktHash: '0000',
  webAPIHost: 'https://api.camelotunchained.com',
  apiHost: 'https://api.camelotunchained.com',
  serverURL: '',
  serverTime: 1,
  vsync: 1,

  FOV: function(degrees: number) {},
  DropLight: function(intensity: number, radius: number, red: number, green: number, blue: number) {},
  ResetLights: function() {},

  OnServerConnected: function(c: (isConnected: boolean) => void): number {
    c(false);
    return -1;
  },
  CancelOnServerConnected: function(c: number): void {},
  PlaySoundEvent: function(id: number): void {},
  ToggleCamera: function(): void {},
  ReloadUI: function(name: string): void {},
  ReloadAllUI: function(): void {},
  OpenUI: function(name: string): void {},
  CloseUI: function(name: string): void {},
  HideUI: function(name: string): void {},
  ShowUI: function(name: string): void {},
  ToggleUIVisibility: function(name: string): void {},
  FocusUI: function(name: string): void {},
  RequestInputOwnership: function(): void {},
  ReleaseInputOwnership: function(): void {},
  Quit: function(): void {},
  CrashTheGame: function(): void {},
  OnUpdateNameplate: function(c: (cell: number, colorMod: number, name: string, gtag: string, title: string) => void): void {},
  OnOpenUI: function(callback: (name: string) => void): void {},
  OnCloseUI: function(callback: (name: string) => void): void {},
  OnShowUI: function(callback: (name: string) => void): void {},
  OnHideUI: function(callback: (name: string) => void): void {},

  Listen: function(event: string): void {},
  Ignore: function(event: string): void {},
  Fire: function(event: string, ...args: any[]): void {},
  OnEvent: function(callback: (event: string, ...args: any[]) => void): void {},

  /* Respawn */
  Respawn: function(id: string): void {},

  /* Abilities */

  OnAbilityNumbersChanged: function(callback: (abilityNumbers: string[]) => void): void {},

  Attack: function(abilityID: string): void {},

  OnAbilityCooldown: function(c: (cooldownID: number, timeStarted: number, duration: number) => void): number {
    return -1;
  },
  CancelOnAbilityCooldown: function(c: number): void {},

  OnAbilityActive: function(c: (currentAbility: string, timeStarted: number, timeTriggered: number, queuedAbility: string) => any): number {
    return -1;
  },
  CancelOnAbilityActive: function(c: number): void {},

  OnAbilityError: function(c: (message: string) => void): void {},

  /* Equipped Gear */

  SubscribeGear: function(subscribe: boolean): void {},
  OnGearAdded: function(callback: (item: Item) => void): void {},
  OnGearRemoved: function(callback: (itemID: string) => void): void {},

  UnequipItem: function(itemID: string): void {},

  /* Inventory */

  SubscribeInventory: function(subscribe: boolean): void {},
  OnInventoryAdded: function(callback: (item: Item) => void): void {},
  OnInventoryRemoved: function(callback: (itemID: string) => void): void {},

  EquipItem: function(itemID: string): void {},

  DropItem: function(itemID: string): void {},

  /* Config */

  OnReceiveConfigVars: function(c: (configs: string) => void): void {},
  OnReceiveConfigVar: function(c: (config: any) => void): void {},
  OnConfigVarChanged: function(c: (isChangeSuccessful: boolean) => void): void {},
  SaveConfigChanges: function(): void {},
  OnSavedConfigChanges: function(c: () => void): void {},
  RestoreConfigDefaults: function(tag: configGroup): void {},
  ChangeConfigVar: function(variable: string, value: string): void {},
  CancelChangeConfig: function(variable: string): void {},
  CancelAllConfigChanges: function(tag: configGroup): void {},
  GetConfigVars: function(tag: configGroup): void {},
  GetConfigVar: function(variable: string): void {},

  /* Building | CUBE */
  OnBuildingModeChanged: function(c: (buildingMode: number) => void): void {},
  
  // responds with all blocks -- triggered by a call to 'RequestBlocks'
  OnReceiveBlocks: function(c: (buildingDict: any) => void): void {},
  
  // responds with all substance ids -- triggered by a call to 'RequestSubstances'
  OnReceiveSubstances: function(c: (substances: any) => void): void {},
  
  // responds with block ids for a specific substance last passed into 'BlockIDsforSubstanceID'
  OnReceiveBlockIDs: function(c: (blockIds: [number]) => void): void {},
  
  OnReceiveBlockTags: function(c: (blockID: number, tagDict: any) => void): void {},
  OnReceiveScreenShot: function(c: (screenShotString: any) => void): void {},
  OnCopyBlueprint: function(c: () => void): void {},
  OnNewBlueprint: function(c: (index: number, name: string) => void): void {},
  OnDownloadBlueprints: function(c: (charId: string) => void): void {},
  OnUploadBlueprint: function(c: (charId: string, name: string, data: any) => void): void {},
  OnBlueprintSelected: function(c: () => void): void {},
  OnBlockSelected: function(c: (blockID: number) => void): void {},
  
  
  ToggleBuildingMode: function(): void {},
  SetBuildingMode: function(newMode: number): void {},
  UndoCube: function(): void {},
  RedoCube: function(): void {},
  CommitBlock: function(): void {},
  CancelBlockPlacement: function(): void {},
  BlockRotateX: function(): void {},
  BlockRotateY: function(): void {},
  BlockRotateZ: function(): void {},
  BlockFlipX: function(): void {},
  BlockFlipY: function(): void {},
  BlockFlipZ: function(): void {},
  CopyBlueprint: function(): void {},
  PasteBlueprint: function(): void {},
  RemoveIslands: function(): void {},
  ApplyStability: function(): void {},
  TestStability: function(): void {},
  SaveBuilding: function(): void {},
  ToggleStabilityLoop: function(): void {},
  RequestBlocks: function(): void {},
  RequestSubstances: function(): void {},
  BlockIDsforSubstanceID: function(substanceID: number): void {},
  RequestBlockTags: function(blockID: number): void {},
  ChangeBlockType: function(newType: number): void {},
  OpenScreenshotShare: function(): void {},
  TakeScreenshot: function(): void {},
  CountBlocks: function(): void {},

  ReplaceSubstance: function(block1: number, block2: number): void {},
  ReplaceSelectedSubstance: function(block1: number, block2: number): void {},
  ReplaceShapes: function(shape1: number, shape2: number): void {},
  ReplaceSelectedShapes: function(shape1: number, shape2: number): void {},
  RotateX: function(): void {},
  RotateY: function(): void {},
  RotateZ: function(): void {}, 
  SnapMode: function(): void {},
  BlockTypes: function(): void {},
  LoopAbility: function(hotbarIndex: number, interval: number): void {},
  EndLoopAbility: function(): void {},

  placedBlockCount: 0,
  blockTypes: 0,
  
  SelectBlueprint: function(index: number): void {},
  RequestBlueprints: function(): void {},
  SaveBlueprint: function(name: string): void {},
  DownloadBlueprints: function(): void {},
  ReceiveBlueprintFromServer: function(name: string, cellData: any, id: string): void {},
  DeleteLocalBlueprint: function(name: string): void {},
  

  /* Announcement */

  OnAnnouncement: function(c: (message: string, type: number) => void): void {},

  /* Plot */

  OnPlotStatus: function(c: (plotOwned: boolean, permissions: number, charID: string, entityID: string) => void): void {},

  /* Character */

  OnCharacterIDChanged: function(c: (id: string) => void): void {},
  OnCharacterFactionChanged: function(c: (faction: Faction) => void): void {},
  OnCharacterRaceChanged: function(c: (race: Race) => void): void {},
  OnCharacterGenderChanged: function(c: (gender: Gender) => void): void {},
  OnCharacterNameChanged: function(c: (name: string) => void): void {},
  OnCharacterHealthChanged: function(c: (health: number, maxHealth: number) => void): void {},
  OnCharacterStaminaChanged: function(c: (stamina: number, maxStamina: number) => void): void {},
  OnCharacterEffectsChanged: function(c: (effects: string) => void): void {},
  OnCharacterInjuriesChanged: function(c: (part: number, health: number, maxHealth: number, wounds: number) => void): void {},
  OnCharacterAliveOrDead: function(c: (alive: boolean) => void): void {},
  OnCharacterPositionChanged: function(c: (x: number, y: number, z: number) => void): void {},
  
  /* EMOTE */

  Emote: function(emote: number): void {},

  /* Enemy Target */

  OnEnemyTargetFactionChanged: function(c: (faction: Faction) => void): void {},
  OnEnemyTargetRaceChanged: function(c: (race: Race) => void): void {},
  OnEnemyTargetGenderChanged: function(c: (gender: Gender) => void): void {},
  OnEnemyTargetNameChanged: function(c: (name: string) => void): void {},
  OnEnemyTargetHealthChanged: function(c: (health: number, maxHealth: number) => void): void {},
  OnEnemyTargetStaminaChanged: function(c: (stamina: number, maxStamina: number) => void): void {},
  OnEnemyTargetEffectsChanged: function(c: (effects: string) => void): void {},
  OnEnemyTargetInjuriesChanged: function(c: (part: number, health: number, maxHealth: number, wounds: number) => void): void {},
  OnEnemyTargetAliveOrDead: function(c: (alive: boolean) => void): void {},
  OnEnemyTargetPositionChanged: function(c: (x: number, y: number, z: number) => void): void {},

  /* Friendly Target */

  OnFriendlyTargetFactionChanged: function(c: (faction: Faction) => void): void {},
  OnFriendlyTargetRaceChanged: function(c: (race: Race) => void): void {},
  OnFriendlyTargetGenderChanged: function(c: (gender: Gender) => void): void {},
  OnFriendlyTargetNameChanged: function(c: (name: string) => void): void {},
  OnFriendlyTargetHealthChanged: function(c: (health: number, maxHealth: number) => void): void {},
  OnFriendlyTargetStaminaChanged: function(c: (stamina: number, maxStamina: number) => void): void {},
  OnFriendlyTargetEffectsChanged: function(c: (effects: string) => void): void {},
  OnFriendlyTargetInjuriesChanged: function(c: (part: number, health: number, maxHealth: number, wounds: number) => void): void {},
  OnFriendlyTargetAliveOrDead: function(c: (alive: boolean) => void): void {},
  OnFriendlyTargetPositionChanged: function(c: (x: number, y: number, z: number) => void): void {},

  /* Chat */

  OnBeginChat: function(c: (commandMode: number, text: string) => void): void {},
  OnChat: function(c: (type: number, from: string, body: string, nick: string, iscse: boolean) => void): void {},
  SendChat: function(type: number, to: string, body: string): void {},
  JoinMUC: function(room: string): void {},
  LeaveMUC: function(room: string): void {},
  Stuck: function(): void {},
  ChangeZone: function(zoneID: number): void {},

  /* Ability Crafting */

  ShowAbility: function(abilityID: string): void {},
  OnShowAbility: function(callback: (abilityID: string) => void): void {},

  EditAbility: function(abilityID: string): void {},
  OnEditAbility: function(callback: (abilityID: string) => void): void {},

  AbilityCreated: function(abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string, ability: string): void {},
  OnAbilityCreated: function(callback: (abilityID: string, ability: string) => void): void {},

  AbilityDeleted: function(abilityID: string): void {},
  OnAbilityDeleted: function(callback: (abilityID: string) => void): void {},

  RegisterAbility: function(abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string): void {},
  OnAbilityRegistered: function(callback: (abilityID: string, cooldowns: string, duration: number, triggerTime: number) => void): void {},

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

  OnConsoleText: function(c: (text: string) => void): void {},
  ConsoleCommand: function(body: string): void {},
  SendSlashCommand: function(command: string): void {},
  
  /* Login */

  Connect: function(host: string, port: string, character: string, webAPIHost: string): void {},

  /* Logging */
  OnLogMessage: function(c: (category: string, level: number, time: string, process: number, thread: number, message: string) => void): void {},

  /* Combat Logs */
  OnCombatLogEvent: function(c: (events: any) => void): void {},


  apiVersion: 1,
  characterID: 'AABBCCDDEEFFGG',
  debug: true,
  signalRHost: 'https://api.camelotunchained.com/signalr',
  shardID: 1,
}

export default devClientInterface;
