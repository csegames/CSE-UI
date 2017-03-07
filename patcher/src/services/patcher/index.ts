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
  Beta3 = 1 << 6
}

export function permissionsString(p: PatchPermissions) {
  if ((p & PatchPermissions.Devs) != 0) return 'Developer';
  if ((p & PatchPermissions.IT) != 0) return 'IT';
  if ((p & PatchPermissions.Alpha) != 0) return 'Alpha';
  if ((p & PatchPermissions.Beta1) != 0) return 'Beta 1';
  if ((p & PatchPermissions.Beta2) != 0) return 'Beta 2';
  if ((p & PatchPermissions.Beta3) != 0) return 'Beta 3';
  if ((p & PatchPermissions.Backers) != 0) return 'Backers';
  if (p === PatchPermissions.Public) return 'Public';
  return 'None';
}

export function canAccessChannel(p: PatchPermissions, channelPermissions: number) {
  if (!channelPermissions) return false;
  return (p & channelPermissions) != 0;
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
}

const API : string = "patcherAPI";

// Define patcher class

export class PatcherAPI {
  private _hasReadFAQ : boolean = false;
  private _api : any;
  constructor() {
    if (API in window) {
      this._api = (<any>window)[API];
    } else {
      // Install a dummy API (for testing)
      this._api = {
        userEmail: "",
        userPass: "###",
        loginToken: "",
        permissions: -1,
        screenName: "###",
        loginError: "",
        apiHost: 'https://api.camelotunchained.com',
        channelData: [
          { channelID: 4, channelName: 'Hatchery', channelStatus: ChannelStatus.Ready },
          { channelID: 10, channelName: 'Wyrmling', channelStatus: ChannelStatus.Ready },
          { channelID: 5, channelName: 'Editor', channelStatus: ChannelStatus.Ready }
        ],
        patcherState: 1,
        downloadRemaining: 50,
        downloadEstimate: 100,
        numberOfFiles: 1000,
        completedFiles: 734,
        hasReadFAQ: false,
        ValidateClient: function() { return true; },
        InvalidateClient: function() {},
        UninstallChannel: function() {},
        LaunchChannel: function() {},
        MarkFAQAsRead: function() {}
      };
    }
  }
  apiHost(): string {
    return this._api.apiHost || 'https://api.camelotunchained.com';
  }
  hasApi() :boolean {
    return this._api !== undefined;
  }
  hasRealApi(): boolean {
    return API in window;
  }
  getUserEmail() :string {
    return this._api.userEmail;
  }
  hasUserEmail() :boolean {
    const email = this.getUserEmail();
    return email && email.length > 0;
  }
  getLoginToken() :string {
    return this._api.loginToken;
  }
  hasLoginToken() :boolean {
    const loginToken = this.getLoginToken();
    return loginToken && loginToken.length > 0;
  }
  getScreenName() :string {
    return this._api.screenName;
  }
  hasScreenName() :boolean {
    const screenName = this.getScreenName();
    return screenName && screenName.length > 0;
  }
  getPermissions() :PatchPermissions {
    return this._api.permissions;
  }
  hasPermissions() :boolean {
    const permissions = this.getPermissions();
    return permissions >= 0;
  }
  hasLoginError() :boolean {
    const error = this.getLoginError();
    return error && error.length > 0;
  }
  getLoginError() :string {
    return this._api.loginError;
  }
  hasUserPass() :boolean {
    const error = this.getUserPass();
    return error && error.length > 0;
  }
  getUserPass() :string {
    return this._api.userPass;
  }
  private getChannelValue(channel:Channel) : number {
    // force sort order to Hatchery, Wyrmling, Other Channels, and Editor last
    if (channel.channelID === 4) return 0; // Hatchery
    if (channel.channelID === 10) return 1; // Wyrmling
    if (channel.channelID === 5) return 3; // Editor
    return 2;
  }
  public getAllChannels() : Channel[] {
    if (this._api.channelData) {
      return Array.prototype.slice.call(this._api.channelData).sort(function(a:Channel, b:Channel) {
        return this.getChannelValue(a) - this.getChannelValue(b);
      }.bind(this));
    }
    return [];
  }
  getPatcherState() :number {
    return this._api.patcherState;
  }
  isPatcherReconnecting() :boolean {
    return this._api.patcherState == 10;
  }
  getDownloadSecondsRemaining() :number {
    return this._api.downloadRemaining / this._api.downloadRate;
  }
  getDownloadRemaining() :number {
    return this._api.downloadRemaining;
  }
  getDownloadEstimate() :number {
    return this._api.downloadEstimate;
  }
  getDownloadRate() :number {
    return this._api.downloadRate;
  }
  getDownloadProgressRatio() :number {
    var estimate = this.getDownloadEstimate();
    return estimate != 0 ? (estimate - this.getDownloadRemaining()) / estimate : 1;
  }
  getDownloadProgressPercent() :number {
    return Math.round(this.getDownloadProgressRatio() * 100);
  }
  getTotalFiles() :number {
    return this._api.numberOfFiles;
  }
  getCompletedFiles() :number {
    return this._api.completedFiles;
  }
  login(user :User) :void {
    this._api.loginError = '';
    this._api.ValidateClient(user.email, user.password, user.rememberMe === true);
  }
  logout() :void {
    this._api.InvalidateClient();
  }
  installChannel(channelID: number) :void {
    this._api.UpdateClient(channelID);
  }
  launchChannelfunction(channelID: number, params:string) {
    this._api.LaunchChannel(channelID, params);
  }
  uninstallChannel(channelID: number) {
    this._api.UninstallChannel(channelID);
  }
  hasReadFAQ() :boolean {
    return this._hasReadFAQ || this._api.hasReadFAQ;
  }
  markFAQAsRead() {
    this._hasReadFAQ = true;
    this._api.MarkFAQAsRead();
  }

  /**
   * Window Controls
   */
  closeWindow() {
    this._api.closeWindow();
  }

  minimizeWindow() {
    this._api.minimizeWindow();
  }

  maximizeWindow() {
    this._api.maxmizeWindow();
  }


}

export const patcher = new PatcherAPI();

export default PatcherAPI;
