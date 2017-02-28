/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import configGroup from './config/configGroup';
import { Race, Gender, Faction } from '..';
import Item from './classes/Item';

interface clientInterface {
  // These are the only things that are guaranteed to exist from the time
  // the page is created. Everything else will be constructed over the course
  // of the client's setup, concurrent to the page load and inital script
  // execution. Anything you need to do in setup should be attached to
  // cu.OnInitialized(), which will be called after the page is loaded
  // and this is fully set up.
  initialized: boolean;
  OnInitialized(c: () => void): number;
  CancelOnInitialized(c: number): void;

  // Everything else only exists after this.initialized is set and the
  // OnInitialized callbacks are invoked.

  /* Client Options */
  muteVolume: boolean;
  mainVolume: number;

  /* Shared */

  patchResourceChannel: number;
  loginToken: string;
  pktHash: string;
  webAPIHost: string;
  apiHost: string;
  serverURL: string;
  serverTime: number;
  vsync: number;

  FOV(degrees: number): void;
  DropLight(intensity: number, radius: number, red: number, green: number, blue: number): void;
  ResetLights(): void;

  OnServerConnected(c: (isConnected: boolean) => void): number;
  CancelOnServerConnected(c: number): void;
  PlaySoundEvent(id: number): void;
  ToggleCamera(): void;
  ReloadUI(name: string): void;
  ReloadAllUI(): void;
  OpenUI(name: string): void;
  CloseUI(name: string): void;
  HideUI(name: string): void;
  ShowUI(name: string): void;
  ToggleUIVisibility(name: string): void;
  FocusUI(name: string): void;
  RequestInputOwnership(): void;
  ReleaseInputOwnership(): void;
  Quit(): void;
  CrashTheGame(): void;
  OnUpdateNameplate(c: (cell: number, colorMod: number, name: string, gtag: string, title: string) => void): void;
  OnOpenUI(callback: (name: string) => void): void;
  OnCloseUI(callback: (name: string) => void): void;
  OnShowUI(callback: (name: string) => void): void;
  OnHideUI(callback: (name: string) => void): void;

  Listen(event: string): void;
  Ignore(event: string): void;
  Fire(event: string, ...args: any[]): void;
  OnEvent(callback: (event: string, ...args: any[]) => void): void;

  /* Respawn */
  Respawn(id: string): void;

  /* Abilities */

  OnAbilityNumbersChanged(callback: (abilityNumbers: string[]) => void): void;

  Attack(abilityID: string): void;

  OnAbilityCooldown(c: (cooldownID: number, timeStarted: number, duration: number) => void): number;
  CancelOnAbilityCooldown(c: number): void;

  OnAbilityActive(c: (currentAbility: string, timeStarted: number, timeTriggered: number, queuedAbility: string) => any): number;
  CancelOnAbilityActive(c: number): void;

  OnAbilityError(c: (message: string) => void): void;

  /* Equipped Gear */

  SubscribeGear(subscribe: boolean): void;
  OnGearAdded(callback: (item: Item) => void): void;
  OnGearRemoved(callback: (itemID: string) => void): void;

  UnequipItem(itemID: string): void;

  /* Inventory */

  SubscribeInventory(subscribe: boolean): void;
  OnInventoryAdded(callback: (item: Item) => void): void;
  OnInventoryRemoved(callback: (itemID: string) => void): void;

  EquipItem(itemID: string): void;

  DropItem(itemID: string): void;

  /* Config */

  OnReceiveConfigVars(c: (configs: string) => void): void;
  OnReceiveConfigVar(c: (config: any) => void): void;
  OnConfigVarChanged(c: (isChangeSuccessful: boolean) => void): void;
  SaveConfigChanges(): void;
  OnSavedConfigChanges(c: () => void): void;
  RestoreConfigDefaults(tag: configGroup): void;
  ChangeConfigVar(variable: string, value: string): void;
  CancelChangeConfig(variable: string): void;
  CancelAllConfigChanges(tag: configGroup): void;
  GetConfigVars(tag: configGroup): void;
  GetConfigVar(variable: string): void;

  /* Building | CUBE */
  OnBuildingModeChanged(c: (buildingMode: number) => void): void;
  
  // responds with all blocks -- triggered by a call to 'RequestBlocks'
  OnReceiveBlocks(c: (buildingDict: any) => void): void;
  
  // responds with all substance ids -- triggered by a call to 'RequestSubstances'
  OnReceiveSubstances(c: (substances: any) => void): void;
  
  // responds with block ids for a specific substance last passed into 'BlockIDsforSubstanceID'
  OnReceiveBlockIDs(c: (blockIds: [number]) => void): void;
  
  OnReceiveBlockTags(c: (blockID: number, tagDict: any) => void): void;
  OnReceiveScreenShot(c: (screenShotString: any) => void): void;
  OnCopyBlueprint(c: () => void): void;
  OnNewBlueprint(c: (index: number, name: string) => void): void;
  OnDownloadBlueprints(c: (charId: string) => void): void;
  OnUploadBlueprint(c: (charId: string, name: string, data: any) => void): void;
  OnBlueprintSelected(c: () => void): void;
  OnBlockSelected(c: (blockID: number) => void): void;
  
  
  ToggleBuildingMode(): void;
  SetBuildingMode(newMode: number): void;
  UndoCube(): void;
  RedoCube(): void;
  CommitBlock(): void;
  CancelBlockPlacement(): void;
  BlockRotateX(): void;
  BlockRotateY(): void;
  BlockRotateZ(): void;
  BlockFlipX(): void;
  BlockFlipY(): void;
  BlockFlipZ(): void;
  CopyBlueprint(): void;
  PasteBlueprint(): void;
  RemoveIslands(): void;
  ApplyStability(): void;
  TestStability(): void;
  SaveBuilding(): void;
  ToggleStabilityLoop(): void;
  RequestBlocks(): void;
  RequestSubstances(): void;
  BlockIDsforSubstanceID(substanceID: number): void;
  RequestBlockTags(blockID: number): void;
  ChangeBlockType(newType: number): void;
  OpenScreenshotShare(): void;
  TakeScreenshot(): void;
  CountBlocks(): void;

  ReplaceSubstance(block1: number, block2: number): void;
  ReplaceSelectedSubstance(block1: number, block2: number): void;
  ReplaceShapes(shape1: number, shape2: number): void;
  ReplaceSelectedShapes(shape1: number, shape2: number): void;
  RotateX(): void;
  RotateY(): void;
  RotateZ(): void; 
  SnapMode(): void;
  BlockTypes(): void;
  LoopAbility(hotbarIndex: number, interval: number): void;
  EndLoopAbility(): void;

  placedBlockCount: number;
  blockTypes: number;
  
  SelectBlueprint(index: number): void;
  RequestBlueprints(): void;
  SaveBlueprint(name: string): void;
  DownloadBlueprints(): void;
  ReceiveBlueprintFromServer(name: string, cellData: any, id: string): void;
  DeleteLocalBlueprint(name: string): void;
  

  /* Announcement */

  OnAnnouncement(c: (message: string, type: number) => void): void;

  /* Plot */

  OnPlotStatus(c: (plotOwned: boolean, permissions: number, charID: string, entityID: string) => void): void;

  /* EMOTE */

  Emote(emote: number): void;

  /* Character */

  OnCharacterIDChanged(c: (id: string) => void): void;
  OnCharacterFactionChanged(c: (faction: Faction) => void): void;
  OnCharacterRaceChanged(c: (race: Race) => void): void;
  OnCharacterGenderChanged(c: (gender: Gender) => void): void;
  OnCharacterNameChanged(c: (name: string) => void): void;
  OnCharacterHealthChanged(c: (health: number, maxHealth: number) => void): void;
  OnCharacterStaminaChanged(c: (stamina: number, maxStamina: number) => void): void;
  OnCharacterEffectsChanged(c: (effects: string) => void): void;
  OnCharacterInjuriesChanged(c: (part: number, health: number, maxHealth: number, wounds: number) => void): void;
  OnCharacterAliveOrDead(c: (alive: boolean) => void): void;
  OnCharacterPositionChanged(c: (x: number, y: number, z: number) => void): void;
  
  
  /* Enemy Target */

  OnEnemyTargetFactionChanged(c: (faction: Faction) => void): void;
  OnEnemyTargetRaceChanged(c: (race: Race) => void): void;
  OnEnemyTargetGenderChanged(c: (gender: Gender) => void): void;
  OnEnemyTargetNameChanged(c: (name: string) => void): void;
  OnEnemyTargetHealthChanged(c: (health: number, maxHealth: number) => void): void;
  OnEnemyTargetStaminaChanged(c: (stamina: number, maxStamina: number) => void): void;
  OnEnemyTargetEffectsChanged(c: (effects: string) => void): void;
  OnEnemyTargetInjuriesChanged(c: (part: number, health: number, maxHealth: number, wounds: number) => void): void;
  OnEnemyTargetAliveOrDead(c: (alive: boolean) => void): void;
  OnEnemyTargetPositionChanged(c: (x: number, y: number, z: number) => void): void;

  /* Friendly Target */

  OnFriendlyTargetFactionChanged(c: (faction: Faction) => void): void;
  OnFriendlyTargetRaceChanged(c: (race: Race) => void): void;
  OnFriendlyTargetGenderChanged(c: (gender: Gender) => void): void;
  OnFriendlyTargetNameChanged(c: (name: string) => void): void;
  OnFriendlyTargetHealthChanged(c: (health: number, maxHealth: number) => void): void;
  OnFriendlyTargetStaminaChanged(c: (stamina: number, maxStamina: number) => void): void;
  OnFriendlyTargetEffectsChanged(c: (effects: string) => void): void;
  OnFriendlyTargetInjuriesChanged(c: (part: number, health: number, maxHealth: number, wounds: number) => void): void;
  OnFriendlyTargetAliveOrDead(c: (alive: boolean) => void): void;
  OnFriendlyTargetPositionChanged(c: (x: number, y: number, z: number) => void): void;

  /* Chat */

  OnBeginChat(c: (commandMode: number, text: string) => void): void;
  OnChat(c: (type: number, from: string, body: string, nick: string, iscse: boolean) => void): void;
  SendChat(type: number, to: string, body: string): void;
  JoinMUC(room: string): void;
  LeaveMUC(room: string): void;
  //SendSlashCommand(command: string, parameters: string): void;
  Stuck(): void;
  ChangeZone(zoneID: number): void;

  /* Ability Crafting */

  ShowAbility(abilityID: string): void;
  OnShowAbility(callback: (abilityID: string) => void): void;

  EditAbility(abilityID: string): void;
  OnEditAbility(callback: (abilityID: string) => void): void;

  AbilityCreated(abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string, ability: string): void;
  OnAbilityCreated(callback: (abilityID: string, ability: string) => void): void;

  AbilityDeleted(abilityID: string): void;
  OnAbilityDeleted(callback: (abilityID: string) => void): void;

  RegisterAbility(abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string): void;
  OnAbilityRegistered(callback: (abilityID: string, cooldowns: string, duration: number, triggerTime: number) => void): void;

  /* Stats */

  fps: number;
  frameTime: number;
  netstats_udpPackets: number;
  netstats_udpBytes: number;
  netstats_tcpMessages: number;
  netstats_tcpBytes: number;
  netstats_players_updateBits: number;
  netstats_players_updateCount: number;
  netstats_players_newCount: number;
  netstats_players_newBits: number;
  netstats_lag: number;
  netstats_delay: number;
  netstats_selfUpdatesPerSec: number;
  netstats_syncsPerSec: number;
  particlesRenderedCount: number;
  characters: number;
  terrain: number;
  perfHUD: string;

  /* Physics Debugging */

  locationX: number;
  locationY: number;
  locationZ: number;
  serverLocationX: number;
  serverLocationY: number;
  serverLocationZ: number;
  facing: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  speed: number;
  horizontalSpeed: number;
  velFacing: number;
  downCollisionAngle: number;
  terrainCollisionAngle: number;

  /* Console */

  OnConsoleText(c: (text: string) => void): void;
  ConsoleCommand(body: string): void;
  SendSlashCommand(command: string): void;
  
  /* Login */

  Connect(host: string, port: string, character: string, webAPIHost: string): void;

  /* Logging */
  OnLogMessage(c: (category: string, level: number, time: string, process: number, thread: number, message: string) => void): void;

  /* Combat Logs */
  OnCombatLogEvent(c: (events: any) => void): void;


  apiVersion?: number;
  characterID?: string;
  debug?: boolean;
  signalRHost?: string;
  shardID?: number;
}

export default clientInterface;
