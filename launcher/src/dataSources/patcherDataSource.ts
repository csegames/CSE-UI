/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ListenerHandle } from '../lib/ListenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';

import { updateDownload } from '../redux/downloadSlice';
import { updateLogin, updateToken } from '../redux/loginSlice';
import { updateChannel } from '../redux/channelsSlice';
import { ChannelInfo } from '../api/patcher/channelInfo';
import { DownloadInfo } from '../api/patcher/downloadInfo';
import { LoginInfo } from '../api/patcher/loginInfo';
import { PatchPermissions } from '../api/patcher/patchPermissions';
import { APIDataSource } from './apiDataSource';

type ListenerFunc<T> = (update: T) => void;

export function shouldHide(channel: ChannelInfo): boolean {
  switch (channel.id) {
    case 1:
    case 4:
    case 6:
    case 7:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 15:
    case 16:
    case 18:
      return true;
  }
  return !channel.name; // hide nameless channels
}

export class PatcherDataSource extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    const patcher = window.patcher;
    if (patcher.login) this.onLoginUpdate(patcher.login);
    if (patcher.download) this.onDownloadUpdate(patcher.download);
    if (patcher.accessToken) this.onTokenUpdate(patcher.accessToken);
    for (const channel of Object.values(patcher.channels ?? {})) {
      this.onChannelUpdate(channel);
    }
    return [
      this.bindListener(patcher.attachChannelUpdateListener, this.onChannelUpdate.bind(this)),
      this.bindListener(patcher.attachDownloadUpdateListener, this.onDownloadUpdate.bind(this)),
      this.bindListener(patcher.attachLoginUpdateListener, this.onLoginUpdate.bind(this)),
      this.bindListener(patcher.attachTokenUpdateListener, this.onTokenUpdate.bind(this))
    ];
  }

  private bindListener<T>(
    bindFunc: (listenerFunc: ListenerFunc<T>) => number,
    listenerFunc: ListenerFunc<T>
  ): ListenerHandle {
    const handle = bindFunc(listenerFunc);
    return {
      close: () => window.patcher.detachListener(handle)
    };
  }

  private onChannelUpdate(info: ChannelInfo) {
    if (shouldHide(info)) return;
    this.dispatch(updateChannel(info));
    APIDataSource.onChannel(info);
  }

  private onDownloadUpdate(info: DownloadInfo) {
    this.dispatch(updateDownload(info));
  }

  private onLoginUpdate(info: LoginInfo) {
    this.dispatch(updateLogin(info));
  }

  private onTokenUpdate(accessToken: string | null) {
    this.dispatch(updateToken({ accessToken, permissions: this.getPermissions(accessToken) }));
  }

  private getPermissions(accessToken: string | null): Record<number, PatchPermissions> {
    if (!accessToken) return {};
    try {
      const data = JSON.parse(atob(accessToken.split('.')[1]));
      return data.al;
    } catch {
      return {};
    }
  }
}
