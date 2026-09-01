/* tslint:disable */

export type Decimal = any;

/** CU.WebApi.Models.ProfileDateTime */
export type ProfileDateTime = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTime = any;

/** The `DateTimeOffset` scalar type represents a date, time and offset from UTC. `DateTimeOffset` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTimeOffset = any;

/** The `Seconds` scalar type represents a period of time represented as the total number of seconds. */
export type Seconds = any;

/** The `Milliseconds` scalar type represents a period of time represented as the total number of milliseconds. */
export type Milliseconds = any;

/** CSE.CharacterID */
export type CharacterID = any;
/** CU.WebApi.Models.Characters.IPatcherCharacterUpdate */
export interface IPatcherCharacterUpdate {
  type: PatcherCharacterUpdateType | null;
}
/** CU.WebApi.Models.ZoneInstance.IZoneInstanceUpdate */
export interface IZoneInstanceUpdate {
  type: string | null;
}
/** The root query object. */
export interface CUQuery {
  characterRestrictions: CharacterCreationRestrictions | null /** Limitations on character creation and use */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  game: GameDefsGQLData | null /** Information about gameplay definition data */;
  guild: Guild | null /** Information about an account's current guild */;
  guildOfferPermissions: GuildOfferPermissionSettings | null /** Information about an account's current guild offer permissions */;
  guildOffers: GuildOfferSummary | null /** Information about an account's current guild offers */;
  party: Party | null /** Information about a character's current party */;
  partyOfferPermissions: OfferPermissionSettings | null /** Invormation about an account's current FSR group offer permissions */;
  partyOffers: OfferSummary | null /** Information about an account's current FSR lobby group offers */;
  serverBuildNumber: number | null /** Build number for the actively running server */;
  serverTimestamp: string | null /** Retrieve the current time on the server. */;
  shardCharacters: (SimpleCharacter | null)[] | null /** Gets all characters from this shard */;
  traits: TraitsInfo | null /** Get all possible traits. */;
  zoneInstance: ZoneInstanceStatus | null /** ZoneInstance Queue Status */;
}
/** CU.WebApi.Models.CharacterRestrictions.CharacterCreationRestrictions */
export interface CharacterCreationRestrictions {
  allowCrossFaction: boolean | null;
  maxSlots: number | null;
}
/** CU.WebApi.GraphQL.GameDefsGQLData */
export interface GameDefsGQLData {
  baseStatValues: (StatBonusGQL | null)[] | null /** Base stat values which apply to all races */;
  classes: (ClassDefGQL | null)[] | null /** Static information about classes */;
  genders: (GenderDefGQL | null)[] | null /** All possible genders */;
  manifests: (ManifestDef | null)[] | null;
  races: (RaceDefGQL | null)[] | null /** Static information about races */;
  raceStatMods:
    | (RaceStatBonuses | null)[]
    | null /** Stat modifiers that are applied additively to the base stat value for each Race */;
  stats: (StatDefinitionGQL | null)[] | null /** Array of definitions for all available stats */;
}
/** CU.WebApi.GraphQL.StatBonusGQL */
export interface StatBonusGQL {
  amount: Decimal | null;
  stat: string | null;
}
/** CU.WebApi.Models.Defs.ClassDefGQL */
export interface ClassDefGQL {
  buildableAbilityNetworks: (string | null)[] | null;
  factionID: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** CU.WebApi.Models.Defs.GenderDefGQL */
export interface GenderDefGQL {
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** CU.WebApi.Models.ManifestDefGQL */
export interface ManifestDef {
  contents: string | null;
  id: string | null;
  schemaVersion: number | null;
}
/** CU.WebApi.Models.Defs.RaceDefGQL */
export interface RaceDefGQL {
  buildableAbilityNetworks: (string | null)[] | null;
  description: string | null;
  factionID: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
  raceTags: (string | null)[] | null;
}
/** CU.WebApi.GraphQL.RaceStatBonuses */
export interface RaceStatBonuses {
  race: number | null;
  statBonuses: (StatBonusGQL | null)[] | null;
}
/** CU.WebApi.GraphQL.StatDefinitionGQL */
export interface StatDefinitionGQL {
  addPointsAtCharacterCreation: boolean | null;
  description: string | null;
  id: string | null;
  itemRequirementStat: string | null;
  name: string | null;
  operation: string | null;
  showAtCharacterCreation: boolean | null;
  statType: StatType | null;
}
/** CU.WebApi.Models.Guilds.Guild */
export interface Guild {
  applications: (GuildApplication | null)[] | null;
  capacity: number | null;
  id: string | null;
  invitations: (GuildInvitation | null)[] | null;
  members: (GuildMember | null)[] | null;
  motd: string | null;
  name: string | null;
  ranks: (GuildRank | null)[] | null;
  revision: number | null;
  size: number | null;
  totalChanges: number | null;
  updateLog: (GuildUpdate | null)[] | null;
}
/** CU.WebApi.Models.Guilds.GuildApplication */
export interface GuildApplication {
  from: Account | null;
  sent: string | null;
  to: Account | null;
}
/** CU.WebApi.Models.Common.Account */
export interface Account {
  displayName: string | null;
  id: string | null;
}
/** CU.WebApi.Models.Guilds.GuildInvitation */
export interface GuildInvitation {
  expires: string | null;
  from: Account | null;
  sent: string | null;
  to: Account | null;
}
/** CU.WebApi.Models.Guilds.GuildMember */
export interface GuildMember {
  displayName: string | null;
  id: string | null;
  isOnline: boolean | null;
  rank: string | null;
}
/** CU.WebApi.Models.Guilds.GuildRank */
export interface GuildRank {
  name: string | null;
  permissions: (string | null)[] | null;
}
/** CU.WebApi.Models.Guilds.GuildUpdate */
export interface GuildUpdate {
  action: string | null;
  target: Account | null;
}
/** CU.WebApi.Models.Guilds.GuildOfferPermissionSettings */
export interface GuildOfferPermissionSettings {
  allowApplications: boolean | null;
  allowInvitations: boolean | null;
  alwaysAllowed: (Account | null)[] | null;
  blocked: (Account | null)[] | null;
  player: Account | null;
  revision: number | null;
}
/** CU.WebApi.Models.Guilds.GuildOfferSummary */
export interface GuildOfferSummary {
  applications: (GuildApplication | null)[] | null;
  invitations: (GuildInvitation | null)[] | null;
  player: Account | null;
}
/** CU.WebApi.Models.Warbands.Party */
export interface Party {
  applications: (Application | null)[] | null;
  capacity: number | null;
  id: string | null;
  invitations: (Invitation | null)[] | null;
  leader: PartyMember | null;
  members: (PartyMember | null)[] | null;
  revision: number | null;
  size: number | null;
  totalChanges: number | null;
  updateLog: (PartyUpdate | null)[] | null;
}
/** CU.WebApi.Models.Warbands.Application */
export interface Application {
  from: Character | null;
  sent: string | null;
  to: Character | null;
}
/** CU.WebApi.Models.Common.Character */
export interface Character {
  bodyTypeID: string | null;
  classID: string | null;
  factionID: Faction | null;
  id: string | null;
  name: string | null;
  raceID: string | null;
}
/** CU.WebApi.Models.Warbands.Invitation */
export interface Invitation {
  expires: string | null;
  from: Character | null;
  sent: string | null;
  to: Character | null;
}
/** CU.WebApi.Models.Warbands.PartyMember */
export interface PartyMember {
  bodyTypeID: string | null;
  classID: string | null;
  factionID: Faction | null;
  id: string | null;
  isOnline: boolean | null;
  name: string | null;
  raceID: string | null;
}
/** CU.WebApi.Models.Warbands.PartyUpdate */
export interface PartyUpdate {
  action: string | null;
  target: Character | null;
}
/** CU.WebApi.Models.Warbands.OfferPermissionSettings */
export interface OfferPermissionSettings {
  allowApplications: boolean | null;
  allowInvitations: boolean | null;
  alwaysAllowed: (Character | null)[] | null;
  blocked: (Character | null)[] | null;
  player: Character | null;
  revision: number | null;
}
/** CU.WebApi.Models.Warbands.OfferSummary */
export interface OfferSummary {
  applications: (Application | null)[] | null;
  invitations: (Invitation | null)[] | null;
  player: Character | null;
}
/** CU.WebApi.Models.Characters.SimpleCharacter */
export interface SimpleCharacter {
  bodyTypeID: string | null;
  classID: string | null;
  factionID: Faction | null;
  id: string | null;
  lastLogin: string | null;
  name: string | null;
  raceID: string | null;
}
/** CSE.GameplayDefs.Store.Cache.TraitsInfo */
export interface TraitsInfo {
  maxAllowed: number | null;
  minRequired: number | null;
  traits: (Trait | null)[] | null;
}
/** CSE.GameplayDefs.Store.Cache.Trait */
export interface Trait {
  category: TraitCategory | null /** Category */;
  description: string | null /** The description of this trait */;
  exclusives: ExclusiveTraitsInfo | null /** List of exclusive traits.  Only one trait from this group may be selected. */;
  icon: string | null /** Url for the icon for this trait */;
  id: string | null;
  isBoon: boolean | null /** If this trait is a boon */;
  name: string | null /** The name of this trait */;
  points: number | null /** The point value of this trait */;
  prerequisites:
    | (string | null)[]
    | null /** List of trait id's that are required to be selected in order to select this trait */;
  ranks:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  required: boolean | null /** Whether or not this is a required trait. */;
  specifier: string | null /** Specifies the defining type based on category */;
}
/** CSE.GameplayDefs.Store.Cache.ExclusiveTraitsInfo */
export interface ExclusiveTraitsInfo {
  ids: (string | null)[] | null;
  maxAllowed: number | null;
  minRequired: number | null;
}
/** CU.WebApi.Models.ZoneInstance.ZoneInstanceStatus */
export interface ZoneInstanceStatus {
  currentQueues: (QueueEntry | null)[] | null;
  currentRounds: (ZoneInstanceRound | null)[] | null;
  zoneInstanceAccess: ZoneInstanceAccess | null;
}
/** CU.WebApi.Models.ZoneInstance.QueueEntry */
export interface QueueEntry {
  entryID: string | null;
  queueID: string | null;
}
/** CU.WebApi.Models.ZoneInstance.ZoneInstanceRound */
export interface ZoneInstanceRound {
  completed: ProfileDateTime | null;
  created: ProfileDateTime | null;
  ended: ProfileDateTime | null;
  error: Error | null;
  gameServerAddress: string | null;
  restrictToFaction: Faction | null;
  revision: number | null;
  roundID: string | null;
  zoneInstanceID: string | null;
  zoneName: string | null;
}
/** CU.WebApi.Models.Common.Error */
export interface Error {
  fields: (Field | null)[] | null;
  system: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Common.Field */
export interface Field {
  name: string | null;
  value: string | null;
}
/** The root subscription object. */
export interface CUSubscription {
  characterRestrictions: CharacterCreationRestrictions | null /** Limitations on character creation and use */;
  characterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  guildOffers: GuildOfferEvent | null /** State updates for an account's current guild offers */;
  manifestUpdates: ManifestUpdate | null /** Updates to a manifest */;
  notifications: Notification | null /** Status or event broadcasts identified by purpose */;
  partyOffers: OfferEvent | null /** State updates for a characters's current party offers */;
  zoneInstanceUpdates: IZoneInstanceUpdate | null /** State updates for zone instance queues */;
}
/** CU.WebApi.Models.Guilds.GuildOfferEvent */
export interface GuildOfferEvent {
  expires: string | null;
  from: Account | null;
  groupSize: number | null;
  hasEnded: boolean | null;
  isInvite: boolean | null;
  sent: string | null;
  status: string | null;
  to: Account | null;
}
/** CU.WebApi.GraphQL.ManifestUpdate */
export interface ManifestUpdate {
  manifests: (ManifestDef | null)[] | null;
}
/** CU.WebApi.Models.Notifications.Notification */
export interface Notification {
  broadcastDuration: string | null;
  content: string | null;
  counter: number | null;
  displayDuration: string | null;
  displayHints: (string | null)[] | null;
  displayTime: string | null;
  mimeType: string | null;
  purpose: string | null;
  sequenceID: string | null;
  tags: (string | null)[] | null;
}
/** CU.WebApi.Models.Warbands.OfferEvent */
export interface OfferEvent {
  expires: string | null;
  from: Character | null;
  groupSize: number | null;
  hasEnded: boolean | null;
  isInvite: boolean | null;
  sent: string | null;
  status: string | null;
  to: Character | null;
}
/** CU.WebApi.Models.ZoneInstance.Updates.QueueEntryRemoved */
export interface QueueEntryRemoved extends IZoneInstanceUpdate {
  entryID: string | null;
  error: Error | null;
  queueID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.ZoneInstance.Updates.QueueEntryUpdated */
export interface QueueEntryUpdated extends IZoneInstanceUpdate {
  entry: QueueEntry | null;
  type: string | null;
}
/** CU.WebApi.Models.ZoneInstance.Updates.ZoneInstanceRemoved */
export interface ZoneInstanceRemoved extends IZoneInstanceUpdate {
  roundID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.ZoneInstance.Updates.ZoneInstanceUpdated */
export interface ZoneInstanceUpdated extends IZoneInstanceUpdate {
  type: string | null;
  zoneInstance: ZoneInstanceRound | null;
}
/** CU.WebApi.Models.Characters.Updates.CharacterRemovedUpdate */
export interface CharacterRemovedUpdate extends IPatcherCharacterUpdate {
  characterID: CharacterID | null;
  type: PatcherCharacterUpdateType | null;
}
/** CU.WebApi.Models.Characters.Updates.CharacterUpdate */
export interface CharacterUpdate extends IPatcherCharacterUpdate {
  character: SimpleCharacter | null;
  type: PatcherCharacterUpdateType | null;
}
/** CU.WebApi.GraphQL.UnusedStructure */
export interface UnusedStructure {
  unused: boolean | null;
}
/** CSE.GameplayDefs.ColorRGBA */
export interface ColorRGBA {
  a: Decimal | null;
  b: number | null;
  g: number | null;
  hex: string | null /** Color in Hex format */;
  hexa: string | null /** Color in Hex format with alpha */;
  r: number | null;
  rgba: string | null /** Color in RGBA format */;
}
/** CU.Permissions.PermissionInfo */
export interface PermissionInfo {
  description: string | null;
  enables: (string | null)[] | null;
  id: string | null;
  name: string | null;
}
/** CU.GraphQL.Vec3fGQL */
export interface Vec3f {
  x: Decimal | null;
  y: Decimal | null;
  z: Decimal | null;
}
/** CU.GraphQL.Euler3fGQL */
export interface Euler3f {
  pitch: Decimal | null;
  roll: Decimal | null;
  yaw: Decimal | null;
}
/** CSE.GameplayDefs.ColorRGBA */
export interface ColorRGBA {
  a: Decimal | null;
  b: number | null;
  g: number | null;
  hex: string | null /** Color in Hex format */;
  hexa: string | null /** Color in Hex format with alpha */;
  r: number | null;
  rgba: string | null /** Color in RGBA format */;
}
/** CU.WebApi.Models.Characters.Updates.CharacterRemovedUpdate */
export interface CharacterRemovedUpdate extends IPatcherCharacterUpdate {
  characterID: CharacterID | null;
  type: PatcherCharacterUpdateType | null;
}
/** CU.WebApi.Models.Characters.Updates.CharacterUpdate */
export interface CharacterUpdate extends IPatcherCharacterUpdate {
  character: SimpleCharacter | null;
  type: PatcherCharacterUpdateType | null;
}
/** CU.WebApi.GraphQL.UnusedStructure */
export interface UnusedStructure {
  unused: boolean | null;
}
/** World.SecureTradeLocation */
export interface SecureTradeLocation {
  characterID: CharacterID | null /** The character that currently owns this item */;
}
export interface GuildguildArgs {
  forAccount: string | null /** AccountID to look up for a current guild (optional, defaults to logged in account) */;
}
export interface GuildOfferPermissionsguildOfferPermissionsArgs {
  forAccount:
    | string
    | null /** AccountID to look up for current guild offer permissions (optional, defaults to logged in account) */;
}
export interface GuildOffersguildOffersArgs {
  forAccount:
    | string
    | null /** AccountID to look up for current guild offers (optional, defaults to logged in account) */;
}
export interface PartypartyArgs {
  forCharacter:
    | string
    | null /** CharacterID to look up for a current group (optional, defaults to logged in character) */;
}
export interface PartyOfferPermissionspartyOfferPermissionsArgs {
  forAccount:
    | string
    | null /** AccountID to look up for current group offer permissions (optional, defaults to logged in account) */;
}
export interface PartyOfferspartyOffersArgs {
  forCharacter:
    | string
    | null /** CharacterID to look up for current group offers (optional, defaults to logged in character) */;
}
export interface GuildOffersguildOffersArgs {
  forAccount:
    | string
    | null /** AccountID to look up for guild offer changes (optional, defaults to logged in account) */;
}
export interface NotificationsnotificationsArgs {
  tags: (string | null)[] | null /** Strings to match for this subscription (defaults to shard notifications) */;
}
export interface PartyOfferspartyOffersArgs {
  forAccount: string | null /** AccountID to look up for group changes (optional, defaults to logged in account) */;
}
export interface ZoneInstanceUpdateszoneInstanceUpdatesArgs {
  forCharacter:
    | string
    | null /** CharacterID to look up for activity changes (optional, defaults to logged in character) */;
}
/** CSE.GameplayDefs.StatType */
export enum StatType {
  None = 'None',
  Primary = 'Primary',
  Secondary = 'Secondary',
  Derived = 'Derived',
  Hidden = 'Hidden'
}
/** CSE.Common.Camelot.Faction */
export enum Faction {
  Factionless = 'Factionless',
  TDD = 'TDD',
  Viking = 'Viking',
  Arthurian = 'Arthurian'
}
/** CSE.GameplayDefs.Store.Cache.TraitCategory */
export enum TraitCategory {
  General = 'General',
  Faction = 'Faction',
  Race = 'Race',
  Class = 'Class'
}
/** CU.WebApi.Models.ZoneInstance.ZoneInstanceAccess */
export enum ZoneInstanceAccess {
  Forbidden = 'Forbidden',
  Offline = 'Offline',
  Online = 'Online'
}
/** CU.WebApi.Models.Characters.PatcherCharacterUpdateType */
export enum PatcherCharacterUpdateType {
  None = 'None',
  Updated = 'Updated',
  Removed = 'Removed'
}
