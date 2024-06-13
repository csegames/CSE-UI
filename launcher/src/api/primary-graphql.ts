/* tslint:disable */

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** CSE.CharacterID */
export type CharacterID = any;

/** ShardID */
export type ShardID = any;

/** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTime = any;

/** The `DateTimeOffset` scalar type represents a date, time and offset from UTC. `DateTimeOffset` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTimeOffset = any;

/** The `Seconds` scalar type represents a period of time represented as the total number of seconds. */
export type Seconds = any;

/** The `Milliseconds` scalar type represents a period of time represented as the total number of milliseconds. */
export type Milliseconds = any;

export type Decimal = any;
/** ServerLib.GraphQL.IServerUpdate */
export interface IServerUpdate {
  type: ServerUpdateType | null;
}
/** ServerLib.ApiModels.IPatcherCharacterUpdate */
export interface IPatcherCharacterUpdate {
  shard: ShardID | null;
  type: PatcherCharacterUpdateType | null;
}
/** The root query object. */
export interface CUQuery {
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  notificationAdmin: NotificationAdminData | null /** Admin only notification data */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  shardCharacters:
    | (SimpleCharacter | null)[]
    | null /** Gets all the characters from the requested shard for the account. */;
}
/** ServerLib.GraphQL.ConnectedServices */
export interface ConnectedServices {
  servers: (ServerModel | null)[] | null;
}
/** ServerLib.ApiModels.ServerModel */
export interface ServerModel {
  accessLevel: AccessType | null;
  apiHost: string | null;
  channelID: number | null;
  channelPatchPermissions: number | null;
  name: string | null;
  shardID: number | null;
  status: ServerStatus | null;
}
/** LauncherApi.Model.Notifications.GraphQL.NotificationAdminData */
export interface NotificationAdminData {
  notifications: NotificationPage | null /** Notification targets (admin) */;
  script: Script | null /** Script by name (admin) */;
  scripts: ScriptPage | null /** Notification scripts (admin) */;
  target: Target | null /** Target by name (admin) */;
  targets: TargetPage | null /** Notification targets (admin) */;
}
/** LauncherApi.Model.Notifications.GraphQL.NotificationPage */
export interface NotificationPage {
  entries: (Notification | null)[] | null;
  nextPage: string | null;
}
/** LauncherApi.Model.Notifications.GraphQL.Notification */
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
/** LauncherApi.Model.Notifications.GraphQL.Script */
export interface Script {
  messages: (ScriptEntry | null)[] | null;
  name: string | null;
  revision: number | null;
}
/** LauncherApi.Model.Notifications.GraphQL.ScriptEntry */
export interface ScriptEntry {
  broadcastDuration: string | null;
  content: string | null;
  displayDuration: string | null;
  displayHints: (string | null)[] | null;
  displayOffset: string | null;
  mimeType: string | null;
  purpose: string | null;
}
/** LauncherApi.Model.Notifications.GraphQL.ScriptPage */
export interface ScriptPage {
  entries: (Script | null)[] | null;
  nextPage: string | null;
}
/** LauncherApi.Model.Notifications.GraphQL.Target */
export interface Target {
  name: string | null;
  revision: number | null;
  tags: (string | null)[] | null;
}
/** LauncherApi.Model.Notifications.GraphQL.TargetPage */
export interface TargetPage {
  entries: (Target | null)[] | null;
  nextPage: string | null;
}
/** CU.Databases.Models.Content.PatchNote */
export interface PatchNote {
  channels: (number | null)[] | null /** Which channels will this patch note be presented on. */;
  htmlContent: string | null /** HTML Content for the patch note. */;
  id: string | null;
  jSONContent: string | null /** JSON data of HTML Content for the patch note. */;
  patchNumber: string | null;
  title: string | null;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** ServerLib.ApiModels.SimpleCharacter */
export interface SimpleCharacter {
  archetype: string | null;
  faction: Faction | null;
  gender: string | null;
  id: CharacterID | null;
  lastLogin: string | null;
  name: string | null;
  race: string | null;
  shardID: ShardID | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  notifications: Notification | null /** Status or event broadcasts identified by purpose */;
  serverUpdates: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
}
/** ServerLib.GraphQL.ServerUpdated */
export interface ServerUpdated extends IServerUpdate {
  server: ServerModel | null;
  type: ServerUpdateType | null;
}
/** ServerLib.GraphQL.ServerUpdatedAll */
export interface ServerUpdatedAll extends IServerUpdate {
  server: ServerModel | null;
  type: ServerUpdateType | null;
}
/** ServerLib.GraphQL.ServerUnavailableAllUpdate */
export interface ServerUnavailableAllUpdate extends IServerUpdate {
  type: ServerUpdateType | null;
}
export interface PatchNotepatchNoteArgs {
  id: string | null /** Required: ID of the patch note. */;
}
export interface PatchNotespatchNotesArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
  channel: number | null /** Required: Channel ID from which to return patch notes. */;
}
export interface ShardCharactersshardCharactersArgs {
  onShard:
    | number
    | null /** If you want to request for a specific shard, use this parameter. Otherwise, will fetch characters on all shards. */;
}
export interface NotificationsnotificationsArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
  sequenceID: string | null /** Optional: Sequence to use as a filter */;
}
export interface ScriptscriptArgs {
  name: string | null /** Optional: Name of the script to pull */;
}
export interface ScriptsscriptsArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface TargettargetArgs {
  name: string | null /** Optional: Name of the script to pull */;
}
export interface TargetstargetsArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface NotificationsnotificationsArgs {
  tags: (string | null)[] | null /** Strings to match for this subscription */;
}
export interface ShardCharacterUpdatesshardCharacterUpdatesArgs {
  onShard: number | null /** Shard ID of the server you'd like to subscribe to for character updates */;
}
/** AccessType */
export enum AccessType {
  Public = 'Public',
  Live = 'Live',
  Beta3 = 'Beta3',
  Beta2 = 'Beta2',
  Beta1 = 'Beta1',
  Alpha = 'Alpha',
  InternalTest = 'InternalTest',
  Employees = 'Employees',
  Invalid = 'Invalid'
}
/** ServerLib.ApiModels.ServerStatus */
export enum ServerStatus {
  Offline = 'Offline',
  Starting = 'Starting',
  Online = 'Online'
}
/** CSE.GameplayDefs.Faction */
export enum Faction {
  Factionless = 'Factionless',
  TDD = 'TDD',
  Viking = 'Viking',
  Arthurian = 'Arthurian'
}
/** ServerLib.GraphQL.ServerUpdateType */
export enum ServerUpdateType {
  None = 'None',
  Updated = 'Updated',
  UpdatedAll = 'UpdatedAll',
  UnavailableAll = 'UnavailableAll'
}
/** ServerLib.ApiModels.PatcherCharacterUpdateType */
export enum PatcherCharacterUpdateType {
  None = 'None',
  Updated = 'Updated',
  Removed = 'Removed'
}
