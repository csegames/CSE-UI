/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ListenerHandle } from '../lib/ListenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { apiQuery, APIQueryResult, apiSubscription, APISubscriptionResult } from './apiNetworkingConstants';

import { Installable, InstallableRemoved, InstallableUpdated } from '../api/graphql/schema';
import { WithGraphQL } from '../api/graphql/withGraphQL';
import { removeInstallable, updateInstallable } from '../redux/installablesSlice';
import { Launchable, removeLaunchable, ServerType, updateLaunchable } from '../redux/launchablesSlice';
import { initializeCamelotSelection, Product } from '../redux/navigationSlice';
import { ChannelStatus } from '../api/patcher/channelStatus';
import { ChannelInfo } from '../api/patcher/channelInfo';
import { store } from '../redux/store';

export class APIDataSource extends WithGraphQL(ExternalDataSource) {
  protected async bind(): Promise<ListenerHandle[]> {
    return this.onConnect();
  }

  private async onConnect(): Promise<ListenerHandle[]> {
    return [
      await this.query<APIQueryResult>({ query: apiQuery }, this.handleQuery.bind(this)),
      await this.subscribe<APISubscriptionResult>({ query: apiSubscription }, this.handleSubscription.bind(this)),
      await this.onInitialize(this.refresh.bind(this))
    ];
  }

  private async refresh() {
    const listeners = await this.onConnect();
    this.rebind(listeners);
  }

  private handleQuery(result: APIQueryResult) {
    for (const inst of result.installable ?? []) {
      if (inst) this.onInstallable(inst);
    }
  }

  private handleSubscription(result: APISubscriptionResult) {
    if (!result.installable) return;

    switch (result.installable.type) {
      case 'InstallableUpdated': {
        const msg = result.installable as InstallableUpdated;
        if (msg.data) this.onInstallable(msg.data);
        break;
      }
      case 'InstallableRemoved': {
        const msg = result.installable as InstallableRemoved;
        if (msg.shardID) this.onRemoveInstallable(msg.shardID);
        break;
      }
    }
  }

  private onInstallable(inst: Installable) {
    if (!inst.channelID) return;

    this.dispatch(updateInstallable(inst));

    if (inst.group?.name) {
      const active = APIDataSource.updateGroupInstalls(inst.group.name, inst);
      if (active?.channelID !== inst.channelID) return;
    }

    const channel = this.reduxState.channels[inst.channelID];
    const launchable = APIDataSource.buildLaunchable(inst, channel);
    this.dispatch(updateLaunchable(launchable));
    if (launchable.product === Product.CamelotUnchained && launchable.canInstall) {
      // only sets the selection if no value is already present; used to initialize first-time loads
      this.dispatch(initializeCamelotSelection(launchable.selectionKey));
    }
  }

  private onRemoveInstallable(shardID: number) {
    for (const inst of Object.values(this.reduxState.installables)) {
      if (inst.shardID === shardID && inst.channelID) {
        const selectionKey = APIDataSource.getSelectionKey(inst);
        this.dispatch(removeInstallable(inst.channelID));
        const selected = inst.group?.name
          ? APIDataSource.updateGroupInstalls(inst.group.name, undefined, inst.channelID)
          : null;
        if (selected === null) {
          this.dispatch(removeLaunchable(selectionKey));
        } else {
          const channel = this.reduxState.channels[inst.channelID];
          this.dispatch(updateLaunchable(APIDataSource.buildLaunchable(selected, channel)));
        }
      }
    }
  }

  public static onChannel(channel: ChannelInfo) {
    const state = store.getState();

    for (const inst of Object.values(state.installables)) {
      if (inst.channelID === channel.id) {
        if (inst.group?.name) {
          const active = APIDataSource.updateGroupInstalls(inst.group.name, inst);
          if (active?.channelID !== inst.channelID) return;
        }
        store.dispatch(updateLaunchable(APIDataSource.buildLaunchable(inst, channel)));
        return;
      }
    }
  }

  private static buildLaunchable(inst: Installable, channel: ChannelInfo | undefined): Launchable {
    return {
      type: inst.shardID ? ServerType.CUGAME : ServerType.CHANNEL,
      product: inst.shardID ? Product.CamelotUnchained : Product.Tools,
      channelStatus: channel?.status ?? ChannelStatus.None,
      channelID: inst.channelID!,
      shardID: inst.shardID ?? 0,
      apiHost: inst.apiHost ?? 'https://hatcheryapi.camelotunchained.com',
      name: inst.group?.name ?? inst.name ?? channel?.name ?? inst.channelID!.toString(),
      selectionKey: this.getSelectionKey(inst),
      isOnline: inst.isOnline ?? false,
      isAvailable: inst.isAvailable ?? false,
      canInstall: inst.canInstall ?? false,
      canAccess: inst.canAccess ?? false,
      accessRequirement: inst.accessRequirement ?? 'Employees',
      lastUpdated: channel?.lastUpdated ?? null
    };
  }

  private static getSelectionKey(inst: Installable): string {
    if (inst.group?.name) return `g-${inst.group.name}`;
    if (inst.shardID?.toString()) return `s-${inst.shardID}`;
    return `c-${inst.channelID}`;
  }

  // if any group member is installed, install all of them (TODO : make the patch system aware of
  // upcoming builds and preload based on manifests instead so we can eliminate channel switching
  // and just cut over the shard at the API level)
  private static updateGroupInstalls(name: string, override?: Installable, ignore?: number): Installable | null {
    const { channels, installables } = store.getState();
    const uninstalled = [];
    let installed: number | null = null;
    let prioritized = override;
    for (const inst of Object.values(installables)) {
      if (inst.group && inst.group.name === name && inst.channelID !== ignore) {
        if ((inst.group.priority ?? 0) > (prioritized?.group?.priority ?? 0)) prioritized = inst;
        if (inst.channelID !== null) {
          const channel = channels[inst.channelID];
          if (!channel) continue;
          if (channel.status !== ChannelStatus.None) {
            installed = inst.channelID;
          } else {
            uninstalled.push(inst.channelID);
          }
        }
      }
    }

    if (installed && uninstalled.length) {
      for (const channelID of uninstalled) window.patcher.installChannel(channelID);
    }

    return prioritized ?? null;
  }
}
