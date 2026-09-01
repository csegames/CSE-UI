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
/** LauncherApi.Discovery.Model.IDiscoveryUpdate */
export interface IDiscoveryUpdate {
  type: string | null;
}
/** LauncherApi.Distribution.Model.IInstallableUpdate */
export interface IInstallableUpdate {
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.INotificationUpdate */
export interface INotificationUpdate {
  type: string | null;
}
/** LauncherApi.Legacy.Model.IServerUpdate */
export interface IServerUpdate {
  type: ServerUpdateType | null;
}
/** LauncherApi.Shard.Model.IShardInfoUpdate */
export interface IShardInfoUpdate {
  type: string | null;
}
/** The root query object. */
export interface CUQuery {
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  discoveryAdmin: (ServerRecord | null)[] | null /** Admin only live service status queries */;
  installable: (Installable | null)[] | null /** Listing of items that can be installed by the launcher */;
  notificationAdmin: NotificationAdminData | null /** Admin only notification data */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  shardCharacters:
    | (SimpleCharacter | null)[]
    | null /** Gets all the characters from the requested shard for the account. */;
  shardInfo: (ShardInfo | null)[] | null /** Admin only shard info */;
}
/** LauncherApi.Legacy.Model.ConnectedServices */
export interface ConnectedServices {
  servers: (ServerModel | null)[] | null /** list of game server shards */;
}
/** LauncherApi.Legacy.Model.ServerModel */
export interface ServerModel {
  accessLevel: AccessType | null;
  apiHost: string | null;
  channelID: number | null;
  channelPatchPermissions: number | null;
  name: string | null;
  shardID: number | null;
  status: ServerStatus | null;
}
/** LauncherApi.Discovery.Model.ServerRecord */
export interface ServerRecord {
  discriminators: (Discriminator | null)[] | null;
  endPoints: (EndPointRecord | null)[] | null;
  health: (HealthEntry | null)[] | null;
  healthSummary: string | null;
  id: string | null;
  ipAddress: string | null;
  serviceName: string | null;
  shardID: number | null;
}
/** LauncherApi.Discovery.Model.Discriminator */
export interface Discriminator {
  key: string | null;
  values: (string | null)[] | null;
}
/** LauncherApi.Discovery.Model.EndPointRecord */
export interface EndPointRecord {
  formats: (FormatRecord | null)[] | null;
  port: number | null;
  protocol: string | null;
  version: number | null;
}
/** LauncherApi.Discovery.Model.FormatRecord */
export interface FormatRecord {
  name: string | null;
  versions: (number | null)[] | null;
}
/** LauncherApi.Discovery.Model.HealthEntry */
export interface HealthEntry {
  detail: string | null;
  name: string | null;
  status: string | null;
}
/** LauncherApi.Distribution.Model.Installable */
export interface Installable {
  accessRequirement: AccessType | null;
  apiHost: string | null;
  canAccess: boolean | null /** Can the current account access the servers for this item? */;
  canInstall: boolean | null /** Can the current account install this item? */;
  channelID: number | null;
  commandLineVersion: number | null;
  group: ShardGroup | null;
  isAvailable: boolean | null;
  isOnline: boolean | null;
  name: string | null;
  productID: number | null;
  productType: string | null;
  shardID: number | null;
}
/** LauncherApi.Shard.Model.ShardGroup */
export interface ShardGroup {
  name: string | null;
  priority: number | null;
}
/** LauncherApi.Notifications.Model.GraphQL.NotificationAdminData */
export interface NotificationAdminData {
  notifications: NotificationPage | null /** Notification targets (admin) */;
  script: Script | null /** Script by name (admin) */;
  scripts: ScriptPage | null /** Notification scripts (admin) */;
  target: Target | null /** Target by name (admin) */;
  targets: TargetPage | null /** Notification targets (admin) */;
}
/** LauncherApi.Notifications.Model.GraphQL.NotificationPage */
export interface NotificationPage {
  entries: (Notification | null)[] | null;
  nextPage: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Notification */
export interface Notification {
  broadcastDuration: string | null;
  content: string | null;
  counter: number | null;
  displayDuration: string | null;
  displayHints: (string | null)[] | null;
  displayTime: string | null;
  id: string | null;
  mimeType: string | null;
  purpose: string | null;
  sequenceID: string | null;
  tags: (string | null)[] | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Script */
export interface Script {
  messages: (ScriptEntry | null)[] | null;
  name: string | null;
  revision: number | null;
}
/** LauncherApi.Notifications.Model.GraphQL.ScriptEntry */
export interface ScriptEntry {
  broadcastDuration: string | null;
  content: string | null;
  displayDuration: string | null;
  displayHints: (string | null)[] | null;
  displayOffset: string | null;
  mimeType: string | null;
  purpose: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.ScriptPage */
export interface ScriptPage {
  entries: (Script | null)[] | null;
  nextPage: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Target */
export interface Target {
  name: string | null;
  revision: number | null;
  tags: (string | null)[] | null;
}
/** LauncherApi.Notifications.Model.GraphQL.TargetPage */
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
/** LauncherApi.Legacy.Model.SimpleCharacter */
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
/** LauncherApi.Shard.Model.ShardInfo */
export interface ShardInfo {
  access: AccessSettings | null;
  apiHost: string | null;
  channelID: number | null;
  chatServer: ServerAddress | null;
  clientCommandLineVersion: number | null;
  featureFlags: (FeatureFlag | null)[] | null;
  group: ShardGroup | null;
  id: number | null;
  name: string | null;
  notes: string | null;
  presenceServer: ServerAddress | null;
  productID: number | null;
  progressionDBName: string | null;
  progressionDBPath: string | null;
  worldStateDBName: string | null;
  worldStateDBPath: string | null;
  writeFormatVersions: (WriteFormatVersion | null)[] | null;
}
/** LauncherApi.Shard.Model.AccessSettings */
export interface AccessSettings {
  access: string | null;
  play: string | null;
  view: string | null;
}
/** LauncherApi.Shard.Model.ServerAddress */
export interface ServerAddress {
  host: string | null;
  port: number | null;
}
/** LauncherApi.Shard.Model.FeatureFlag */
export interface FeatureFlag {
  key: string | null;
  value: boolean | null;
}
/** LauncherApi.Shard.Model.WriteFormatVersion */
export interface WriteFormatVersion {
  key: string | null;
  value: number | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  discovery: IDiscoveryUpdate | null /** Admin only live service status updates */;
  installable: IInstallableUpdate | null /** Updates for items that can be installed by the launcher */;
  notificationAdmin: INotificationUpdate | null /** Admin only notification updates */;
  notifications: Notification | null /** Status or event broadcasts identified by purpose */;
  serverUpdates: IServerUpdate | null /** Server status updates */;
  shardInfo: IShardInfoUpdate | null /** Admin only shard info */;
}
/** LauncherApi.Legacy.Model.Updates.ServerUpdated */
export interface ServerUpdated extends IServerUpdate {
  server: ServerModel | null;
  type: ServerUpdateType | null;
}
/** LauncherApi.Legacy.Model.Updates.ServerUpdatedAll */
export interface ServerUpdatedAll extends IServerUpdate {
  server: ServerModel | null;
  type: ServerUpdateType | null;
}
/** LauncherApi.Legacy.Model.Updates.ServerUnavailableAllUpdate */
export interface ServerUnavailableAllUpdate extends IServerUpdate {
  type: ServerUpdateType | null;
}
/** LauncherApi.Discovery.Model.Update.RecordRemoved */
export interface RecordRemoved extends IDiscoveryUpdate {
  id: string | null;
  type: string | null;
}
/** LauncherApi.Discovery.Model.Update.RecordUpdated */
export interface RecordUpdated extends IDiscoveryUpdate {
  record: ServerRecord | null;
  type: string | null;
}
/** LauncherApi.Distribution.Model.InstallableUpdated */
export interface InstallableUpdated extends IInstallableUpdate {
  data: Installable | null;
  type: string | null;
}
/** LauncherApi.Distribution.Model.InstallableRemoved */
export interface InstallableRemoved extends IInstallableUpdate {
  shardID: number | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.NotificationRemoved */
export interface NotificationRemoved extends INotificationUpdate {
  id: string | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.NotificationUpdated */
export interface NotificationUpdated extends INotificationUpdate {
  notification: Notification | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.ScriptRemoved */
export interface ScriptRemoved extends INotificationUpdate {
  name: string | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.ScriptUpdated */
export interface ScriptUpdated extends INotificationUpdate {
  script: Script | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.SequenceRemoved */
export interface SequenceRemoved extends INotificationUpdate {
  sequenceID: string | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.TargetRemoved */
export interface TargetRemoved extends INotificationUpdate {
  name: string | null;
  type: string | null;
}
/** LauncherApi.Notifications.Model.GraphQL.Updates.TargetUpdated */
export interface TargetUpdated extends INotificationUpdate {
  target: Target | null;
  type: string | null;
}
/** LauncherApi.Shard.Model.Update.ShardInfoUpdated */
export interface ShardInfoUpdated extends IShardInfoUpdate {
  shardInfo: ShardInfo | null;
  type: string | null;
}
export interface DiscoveryAdmindiscoveryAdminArgs {
  shardID: number | null /** Filter returns by shard id */;
  serviceName: string | null /** Filter returns by serviceName */;
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
export interface ShardInfoshardInfoArgs {
  shardID: number | null /** Filter returns by shard id */;
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
export interface DiscoverydiscoveryArgs {
  shardIDs: (number | null)[] | null /** Optional filter for updates */;
}
export interface NotificationsnotificationsArgs {
  tags: (string | null)[] | null /** Strings to match for this subscription */;
}
export interface ServerUpdatesserverUpdatesArgs {
  tags: (string | null)[] | null /** Strings to match for this subscription */;
}
export interface ShardInfoshardInfoArgs {
  shardIDs: (number | null)[] | null /** Optional filter for updates */;
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
/** LauncherApi.Legacy.Model.ServerStatus */
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
/** LauncherApi.Legacy.Model.ServerUpdateType */
export enum ServerUpdateType {
  None = 'None',
  Updated = 'Updated',
  UpdatedAll = 'UpdatedAll',
  UnavailableAll = 'UnavailableAll'
}
