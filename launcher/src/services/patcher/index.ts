/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ServerType } from '../../widgets/Controller/ControllerContext';
import { PatchPermissions } from '../../api/webapi';
import { Dictionary } from '../../lib/Dictionary';

// These interfaces must match what is being set in the Launcher.exe C++ project, which will be passing values into
// the UI through global settings.

export enum PatchChannelMode {
  Automatic,
  ThiryTwoBit
}

export function permissionsString(p: PatchPermissions) {
  // Check UCE first
  if ((p & PatchPermissions.Development) !== 0) return 'Developer';

  // Then check pre-release access
  if ((p & PatchPermissions.InternalTest) !== 0) return 'IT';
  if ((p & PatchPermissions.Alpha) !== 0) return 'Alpha';
  if ((p & PatchPermissions.Beta1) !== 0) return 'Beta 1';
  if ((p & PatchPermissions.Beta2) !== 0) return 'Beta 2';
  if ((p & PatchPermissions.Beta3) !== 0) return 'Beta 3';
  if ((p & PatchPermissions.Live) !== 0) return 'Live';

  // Then lastly check backers and public
  if ((p & PatchPermissions.AllBackers) !== 0) return 'Backers';
  if (p === PatchPermissions.Public) return 'Public';
  return 'None';
}

export function canAccessChannel(p: PatchPermissions, channelPermissions: number) {
  if (!channelPermissions) return false;
  return (p & channelPermissions) !== 0;
}

export interface User {
  email: string;
  password: string;
  rememberMe: boolean;
}

export enum ChannelStatus {
  NotInstalled,
  Validating,
  Updating,
  OutOfDate,
  Ready,
  Launching,
  Running,
  Uninstalling,
  UpdateFailed
}

export interface Channel {
  channelName: string;
  channelID: number;
  channelStatus: ChannelStatus;
  lastUpdated: number;
  channelSupportedTypes: number;
  mode: PatchChannelMode;
}

export interface PatcherError {
  message: string;
  fatal: boolean;
}

const API: string = 'patcherAPI';
const defaultHost: string = 'https://api.camelotunchained.com';

const dummyAPI = {
  userEmail: '',
  userPass: '###',
  accessToken: '',
  permissions: {},
  screenName: '###',
  loginError: '',
  apiHost: defaultHost,
  channelData: [{ channelID: 1000, channelName: 'Hatchery', channelStatus: ChannelStatus.Ready }],
  patcherState: 1,
  downloadRemaining: 50,
  downloadEstimate: 100,
  numberOfFiles: 1000,
  completedFiles: 734,
  hasReadFAQ: false,
  ValidateClient: () => {
    return true;
  },
  InvalidateClient: () => {},
  UninstallChannel: () => {},
  LaunchChannel: () => {},
  MarkFAQAsRead: () => {},
  OnPatcherError: (callback: (alert: string, isFatal: boolean) => void) => {}
};

export enum Product {
  CamelotUnchained = 0,
  Colossus = 1,
  Tools = 2,
  Cube = 3
}

export class PatcherAPI {
  private _hasReadFAQ: boolean = false;
  private _api: any;
  private _product: Product;

  constructor() {
    this._api = API in window ? (<any>window)[API] : dummyAPI;
    this._product = Number.parseInt(localStorage.getItem('selected_product')) ?? Product.CamelotUnchained;
  }

  public get isLoggedIn(): boolean {
    return this.hasAccessToken();
  }

  public get product(): Product {
    return this._product;
  }
  public set product(value: Product) {
    this._product = value;
    localStorage.setItem('selected_product', value.toString());
  }

  public getApiHost(): string {
    return this._api.apiHost || defaultHost;
  }
  public hasApi(): boolean {
    return this._api !== undefined;
  }
  public hasRealApi(): boolean {
    return API in window;
  }
  public getUserEmail(): string {
    return this._api.userEmail;
  }
  public hasUserEmail(): boolean {
    const email = this.getUserEmail();
    return email && email.length > 0;
  }
  public getAccessToken(): string {
    return this._api.accessToken;
  }
  public hasAccessToken(): boolean {
    const token = this.getAccessToken();
    return token && token.length > 0;
  }
  public getScreenName(): string {
    return this._api.screenName;
  }
  public hasScreenName(): boolean {
    const screenName = this.getScreenName();
    return screenName && screenName.length > 0;
  }
  public getPermissions(serverType: ServerType): PatchPermissions {
    switch (serverType) {
      case ServerType.CHANNEL:
      case ServerType.CUBE:
      case ServerType.CUGAME:
        return this._api.permissions['CamelotUnchained'] ?? PatchPermissions.Public;

      case ServerType.COLOSSUS:
        return this._api.permissions['Colossus'] ?? PatchPermissions.Public;

      case ServerType.UNKNOWN:
      case ServerType.HIDDEN:
      default:
        return PatchPermissions.Public;
    }
  }
  public hasPermissions(): boolean {
    return Object.keys(this._api.permissions).length > 0;
  }
  public hasLoginError(): boolean {
    const error = this.getLoginError();
    return error && error.length > 0;
  }
  public getLoginError(): string {
    return this._api.loginError;
  }
  public hasUserPass(): boolean {
    const error = this.getUserPass();
    return error && error.length > 0;
  }
  public getUserPass(): string {
    return this._api.userPass;
  }
  public getAllChannels(): Dictionary<Channel> {
    const result: Dictionary<Channel> = {};
    for (const channel of this._api.channelData ?? []) {
      result[channel.channelID] = channel;
    }
    return result;
  }
  public getPatcherState(): number {
    return this._api.patcherState;
  }
  public isPatcherReconnecting(): boolean {
    return this._api.patcherState === 10;
  }
  public getDownloadSecondsRemaining(): number {
    return this._api.downloadRemaining / this._api.downloadRate;
  }
  public getDownloadRemaining(): number {
    return this._api.downloadRemaining;
  }
  public getDownloadEstimate(): number {
    return this._api.downloadEstimate;
  }
  public getDownloadRate(): number {
    return this._api.downloadRate;
  }
  public getDownloadProgressRatio(): number {
    const estimate = this.getDownloadEstimate();
    return estimate !== 0 ? (estimate - this.getDownloadRemaining()) / estimate : 1;
  }
  public getDownloadProgressPercent(): number {
    return Math.round(this.getDownloadProgressRatio() * 100);
  }
  public getTotalFiles(): number {
    return this._api.numberOfFiles;
  }
  public getCompletedFiles(): number {
    return this._api.completedFiles;
  }
  public login(user: User): void {
    this._api.loginError = '';
    this._api.ValidateClient(user.email, user.password, user.rememberMe === true);
  }
  public logout(): void {
    this._api.InvalidateClient();
  }
  public installChannel(channelID: number): void {
    this._api.UpdateClient(channelID);
  }
  public launchChannelfunction(channelID: number, params: string) {
    console.info('Launching', channelID, params);
    this._api.LaunchChannel(channelID, params);
  }
  public uninstallChannel(channelID: number) {
    this._api.UninstallChannel(channelID);
  }
  public setChannelMode(channelID: number, mode: PatchChannelMode) {
    this._api.SetChannelMode(channelID, mode);
  }

  public getShardHostOverride(id?: number): string | undefined {
    if (
      id === undefined ||
      this._api === undefined ||
      this._api.shardOverride === undefined ||
      this._api.shardOverride.id !== id
    ) {
      return undefined;
    }
    return this._api.shardOverride.host;
  }

  public hasReadFAQ(): boolean {
    return this._hasReadFAQ || this._api.hasReadFAQ;
  }
  public markFAQAsRead() {
    this._hasReadFAQ = true;
    this._api.MarkFAQAsRead();
  }

  public OnPatcherError = (callback: (alert: string, isFatal: boolean) => void) => {
    if (this._api.OnPatcherError) {
      this._api.OnPatcherError(callback);
    }
  };

  public hasToolsAccess(serverType: ServerType): boolean {
    return serverType !== ServerType.CHANNEL || (this.getPermissions(serverType) & PatchPermissions.Development) !== 0;
  }

  /**
   * Window Controls
   */
  public closeWindow() {
    this._api.closeWindow();
  }

  public minimizeWindow() {
    this._api.minimizeWindow();
  }

  public maximizeWindow() {
    this._api.maxmizeWindow();
  }

  public onError(handler: (error: PatcherError) => void) {
    if (this._api.OnPatcherError) this._api.OnPatcherError(handler);
  }
}

export const patcher = new PatcherAPI();
