/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Define types

export enum PatchPermissions {
  Public = 0,
  Backers = 1 << 0,
  IT = 1 << 1,
  Devs = 1 << 2,
  Alpha = 1 << 3,
  Beta1 = 1 << 4,
  Beta2 = 1 << 5,
  Beta3 = 1 << 6,
}

export function permissionsString(p: PatchPermissions) {
  if ((p & PatchPermissions.Devs) !== 0) return 'Developer';
  if ((p & PatchPermissions.IT) !== 0) return 'IT';
  if ((p & PatchPermissions.Alpha) !== 0) return 'Alpha';
  if ((p & PatchPermissions.Beta1) !== 0) return 'Beta 1';
  if ((p & PatchPermissions.Beta2) !== 0) return 'Beta 2';
  if ((p & PatchPermissions.Beta3) !== 0) return 'Beta 3';
  if ((p & PatchPermissions.Backers) !== 0) return 'Backers';
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
  UpdateFailed,
}

export interface Channel {
  channelName: string;
  channelID: number;
  channelStatus: ChannelStatus;
  lastUpdated: number;
}

export interface PatcherError {
  message: string;
  fatal: boolean;
}

const API: string = 'patcherAPI';

// Define patcher class

export class PatcherAPI {
  private _hasReadFAQ: boolean = false;
  private _api: any;
  constructor() {
    if (API in window) {
      this._api = (<any> window)[API];
    } else {
      // Install a dummy API (for testing)
      this._api = {
        userEmail: '',
        userPass: '###',
        accessToken: '',
        permissions: -1,
        screenName: '###',
        loginError: '',
        apiHost: 'https://api.camelotunchained.com',
        channelData: [
          { channelID: 4, channelName: 'Hatchery', channelStatus: ChannelStatus.Ready },
          { channelID: 5, channelName: 'Editor', channelStatus: ChannelStatus.Ready },
        ],
        patcherState: 1,
        downloadRemaining: 50,
        downloadEstimate: 100,
        numberOfFiles: 1000,
        completedFiles: 734,
        hasReadFAQ: false,
        ValidateClient: () => { return true; },
        InvalidateClient: () => {},
        UninstallChannel: () => {},
        LaunchChannel: () => {},
        MarkFAQAsRead: () => {},
        OnPatcherError: (callback: (alert: string, isFatal: boolean) => void) => {},
      };
    }
  }
  public apiHost(): string {
    return this._api.apiHost || 'https://api.camelotunchained.com';
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
  public getPermissions(): PatchPermissions {
    return this._api.permissions;
  }
  public hasPermissions(): boolean {
    const permissions = this.getPermissions();
    return permissions >= 0;
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
  public getAllChannels(): Channel[] {
    if (this._api.channelData) {
      return Array.prototype.slice.call(this._api.channelData).sort((a: Channel, b: Channel) => {
        return this.getChannelValue(a) - this.getChannelValue(b);
      });
    }
    return [];
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
    this._api.LaunchChannel(channelID, params);
  }
  public uninstallChannel(channelID: number) {
    this._api.UninstallChannel(channelID);
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

  private getChannelValue(channel: Channel): number {
    // force sort order to Hatchery, Wyrmling, Other Channels, and Editor last
    if (channel.channelID === 4) return 0; // Hatchery
    if (channel.channelID === 10) return 1; // Wyrmling
    if (channel.channelID === 5) return 3; // Editor
    return 2;
  }
}

export const patcher = new PatcherAPI();

export default PatcherAPI;
