/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import configGroup from './config/configGroup';
import { Race, Gender, Faction, Archetype } from '..';
import Item from './classes/Item';

export interface EntityState {
  faction: Faction;
  id: string;
  name: string;
  isAlive: boolean;

  // position of this entity, or null / undefined if we're not sending position
  position?: {
    x: number;
    y: number;
    z: number;
  };

  // status -- null / undefined if no status on entity
  statuses?: {
    id: number;
    duration: number;
  }[];
}

export type AnyEntityState = PlayerState | SiegeState | null;

export interface PlayerState extends EntityState {
  type: 'player';
  race: Race;
  gender: Gender;
  class: Archetype;
  // health per body part, ordered according to the bodyParts enum found
  // in ../constants/bodyParts.ts -- TODO: use an enum from C# generated
  // through webAPI definitions.ts file
  health: {
    current: number;
    max: number;
    wounds: number;
  }[];
  stamina: {
    current: number;
    max: number;
  };
  blood: {
    current: number;
    max: number;
  };
  // An EntityState object for the entity this Character is in control of, ie
  // a siege engine, a vehicle, a creature, ect..
  controllingEntityState?: AnyEntityState;
}

export enum SkillStateTypeEnum {
  Standard,
  Modal,
}

export enum SkillStateStatusEnum {
  None = 0,
  Ready = 1 << 0,
  Unusable = 1 << 1,
  Disabled = 1 << 2,
  Queued = 1 << 3,
  Preparation = 1 << 4,
  Channel = 1 << 5,
  Running = 1 << 6,
  Recovery = 1 << 7,
  Cooldown = 1 << 8,
  Error = 1 << 9,
  Held = 1 << 10,
}

export enum SkillStateReasonEnum {
  None = 0,
  NoAmmo = 1 << 0,
  NoWeapon = 1 << 1,
}

export enum SkillStateTrackEnum {
  None = 0,
  PrimaryWeapon = 1 << 0,
  SecondaryWeapon = 1 << 1,
  BothWeapons = PrimaryWeapon | SecondaryWeapon,
  Voice = 1 << 2,
  Mind = 1 << 3,
}

export interface SkillStateProgression {
  current: number;
  end: number;
}

export interface ClientSkillState {
  id: number;
  type: SkillStateTypeEnum;
  track: SkillStateTrackEnum;
  keybind: number;
  status: SkillStateStatusEnum;
  reason?: SkillStateReasonEnum;
  timing?: SkillStateProgression;
  disruption?: SkillStateProgression;
}

export interface ClientSkillBarItem {
  id: number;
  keybind: number;
}

export interface SiegeState extends EntityState {
  type: 'siege';
  health: {
    current: number;
    max: number;
  };
}

export interface DisplayModeConfig {
  width: number;
  height: number;
}

export interface Bindable {
  id: number;
  name: string;
}

export interface Binding {
  alias: number;
  boundKeyName: string;
  boundKeyValue: number;
  id: number;       // of Bindable this binding applies to
}

export interface Keybind extends Binding{
  name: string;
}

interface clientInterface {
  // These are the only things that are guaranteed to exist from the time
  // the page is created. Everything else will be constructed over the course
  // of the client's setup, concurrent to the page load and inital script
  // execution. Anything you need to do in setup should be attached to
  // cu.OnInitialized(), which will be called after the page is loaded
  // and this is fully set up.
  initialized: boolean;

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

  placedBlockCount: number;
  blockTypes: number;

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

  apiVersion?: number;
  characterID?: string;
  debug?: boolean;
  signalRHost?: string;
  shardID?: number;

  /* player state object */
  playerState: PlayerState;

  OnInitialized(c: () => void): number;

  // Everything else only exists after this.initialized is set and the
  // OnInitialized callbacks are invoked.

  FOV(degrees: number): void;

  DropLight(intensity: number, radius: number, red: number, green: number, blue: number): void;

  ResetLights(): void;

  RemoveLight(): void;

  OnServerConnected(c: (isConnected: boolean) => void): number;

  PlaySoundEvent(id: number): void;

  ToggleCamera(): void;

  ReloadUI(name: string): void;

  ReloadAllUI(): void;

  OpenUI(name: string): void;

  CloseUI(name: string): void;

  HideUI(name: string): void;

  ShowUI(name: string): void;

  ToggleUIVisibility(name: string): void;

  RequestInputOwnership(): void;

  ReleaseInputOwnership(): void;

  Quit(): void;

  CrashTheGame(): void;

  OnOpenUI(callback: (name: string) => void): void;

  OnCloseUI(callback: (name: string) => void): void;

  OnShowUI(callback: (name: string) => void): void;

  OnHideUI(callback: (name: string) => void): void;

  /* Respawn */
  Respawn(id: string): void;

  /* Skills */
  OnSkillStateChanged(callback: (skillState: ClientSkillState) => void): void;

  OnSkillBarChanged(callback: (newSkillBar: ClientSkillBarItem[]) => void): void;

  /* Abilities */
  Attack(abilityID: string): void;

  OnAbilityError(c: (message: string) => void): void;

  /* HUD */
  OnToggleHUDItem(c: (name: string) => void): void;

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

  RequestDisplayModes(): void;

  OnDisplayModesChanged(c: (displayModes: DisplayModeConfig[]) => void): void;

  SetDisplayMode(wantFullScreen: boolean, width: number, height: number): void;

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


  /* Character State Changes */
  OnPlayerStateChanged(c: (state: PlayerState) => void): void;

  OnEnemyTargetStateChanged(c: (state: AnyEntityState) => void): void;

  OnFriendlyTargetStateChanged(c: (state: AnyEntityState) => void): void;


  /* Character */

  OnCharacterZoneChanged(c: (zoneID: string) => void): void;

  OnCharacterCanReleaseControlChanged(c: (canRelease: boolean) => void): void;

  /* Chat */

  OnBeginChat(c: (commandMode: number, text: string) => void): void;

  OnChat(c: (type: number, from: string, body: string, nick: string, iscse: boolean) => void): void;

  SendChat(type: number, to: string, body: string): void;

  // SendSlashCommand(command: string, parameters: string): void;
  Stuck(): void;

  ChangeZone(zoneID: number): void;

  /* Ability Crafting */

  AbilityCreated(abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string, ability: string): void;

  OnAbilityCreated(callback: (abilityID: string, ability: string) => void): void;

  AbilityDeleted(abilityID: string): void;

  OnAbilityDeleted(callback: (abilityID: string) => void): void;

  RegisterAbility(abilityID: string, primaryBaseComponentID: string, secondaryBaseComponentID: string): void;

  OnAbilityRegistered(callback: (abilityID: string, cooldowns: string, duration: number, triggerTime: number) => void): void;

  /* Console */

  OnConsoleText(c: (text: string) => void): void;

  ConsoleCommand(body: string): void;

  SendSlashCommand(command: string): void;

  /* Logging */
  OnLogMessage(c: (category: string, level: number, time: string,
                   process: number, thread: number, message: string) => void): void;

  /* Combat Logs */
  OnCombatLogEvent(c: (events: any) => void): void;

  /* Dev UI */
  OnUpdateDevUI(c: (pageID: string, rootPage: any) => void): void;

  /* Scenarios */
  ScenarioRoundEnded(c: (scenarioID: string, roundID: string, scenarioEnded: boolean, didWin: boolean) => void): void;

  /* Deployable Items */
  StartPlacingItemByID(numbericItemDefID: number, itemInstanceID: string, extraParameters?: string): void;

  ResetItemPlacement(): void;

  CommitItemPlacement(): void;

  CancelItemPlacement(): void;

  SendCommitItemRequest(callback: (itemInstanceIDString: string, position: any, rotation: any,
    arbitraryString?: string) => void): void;

  /* Target */
  RequestFriendlyTargetEntityID(entityID:string): void;
  RequestEnemyTargetEntityID(entityID:string): void;

  /* Keybind API */
  // new call from client -> UI
  OnKeybindRecorded(c: (keybind: Keybind) => void): void;
  OnAllKeybindsRequested(c: (bindables: Bindable[], bindings: Binding[]) => void): void;

  // new calls from UI -> client
  RequestAllKeybinds(): void;
  StartRecordingKeybind(button: number, alias: number): void;
  CancelRecordingKeybind(): void;
  SetKeybind(button: number, alias: number, boundKeyValue: number);
  ClearKeybind(button: number, alias: number): void;
}

export default clientInterface;
