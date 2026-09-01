/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ExternalDataSource } from '../redux/externalDataSource';
import {
  zoneInstanceQuery,
  ZoneInstanceQueryResult,
  zoneInstanceSubscription,
  ZoneInstanceSubscriptionResult
} from './zoneInstanceGraphQLConstants';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { setSubscribedToQueues, setQueueID, setRoundID } from '../redux/loadingSlice';
import { QueueEntryRemoved, QueueEntryUpdated, ZoneInstanceUpdated, ZoneInstanceRemoved } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { WithWebInterface } from '../redux/withWebInterface';

export class ZoneInstanceService extends WithWebInterface(ExternalDataSource) {
  private lastCharacterID?: string;
  private alwaysBound: ListenerHandle[] = [];
  private currentQueueID: string | null = null;
  private currentRoundID: string | null = null;

  protected async bind(): Promise<ListenerHandle[]> {
    this.alwaysBound = [
      await this.onInitialize(this.setBindings.bind(this)),
      await this.onDisconnect(this.clearBindings.bind(this))
    ];
    const bindings = await this.remapBindings();
    return bindings;
  }

  // we need to reset our context each time the active character changes (including on logout) ... we may actually
  // see the same characterID twice in a row if, for instance, a developer refreshes the UI during gameplay
  private async setBindings(): Promise<void> {
    const characterID = this.getActiveCharacter();
    if (this.lastCharacterID === characterID) {
      return;
    }
    this.lastCharacterID = characterID;
    this.rebind(await this.remapBindings());
    this.dispatch(setSubscribedToQueues(true));
  }

  private clearBindings(): void {
    this.dispatch(setSubscribedToQueues(false));
    this.lastCharacterID = undefined;
    this.rebind([...this.alwaysBound]);
  }

  private async remapBindings(): Promise<ListenerHandle[]> {
    const handles: ListenerHandle[] = [...this.alwaysBound];
    if (this.lastCharacterID === undefined) {
      return handles;
    }

    handles.push(
      await this.query<ZoneInstanceQueryResult>(
        { operationName: 'zoneInstanceQuery', query: zoneInstanceQuery },
        this.handleZoneInstanceQuery.bind(this)
      ),
      await this.subscribe<ZoneInstanceSubscriptionResult>(
        { operationName: 'zoneInstanceStatus', query: zoneInstanceSubscription },
        this.handleZoneInstanceUpdate.bind(this)
      )
    );

    return handles;
  }

  private handleZoneInstanceQuery(result: ZoneInstanceQueryResult): void {
    if (result.zoneInstance?.currentQueues?.length !== undefined) {
      const queueID = result.zoneInstance?.currentQueues[0]?.queueID;
      if (queueID !== undefined) {
        this.updateQueueID(queueID, null);
      }
      else {
        this.updateQueueID(null, null);
      }
    }

    if (result.zoneInstance?.currentRounds?.length !== undefined) {
      const roundID = result.zoneInstance?.currentRounds[0]?.roundID;
      if (roundID !== undefined) {
        this.updateRoundID(roundID);
      }
      else {
        this.updateRoundID(null);
      }
    }
  }

  private handleZoneInstanceUpdate(result: ZoneInstanceSubscriptionResult): void {
    const msg = result.zoneInstanceUpdates;
    if (msg === null) return;
    switch (msg.type) {
      case 'QueueEntryRemoved': {
        const val = msg as QueueEntryRemoved;
        if (val.queueID === this.currentQueueID) {
          if (typeof val?.error?.type === 'string') {
            this.updateQueueID(null, val.error.type);
          }
          else {
            this.updateQueueID(null, null);
          }
        }
        break;
      }
      case 'QueueEntryUpdated': {
        const val = msg as QueueEntryUpdated;
        const queueID = val.entry?.queueID;
        if (queueID !== undefined) {
          this.updateQueueID(queueID, null);
        }
        break;
      }
      case 'ZoneInstanceUpdated': {
        const val = msg as ZoneInstanceUpdated;
        if (val.zoneInstance?.completed === null) {
          this.updateRoundID(val.zoneInstance.roundID);
        }
        break;
      }
      case 'ZoneInstanceRemoved': {
        const val = msg as ZoneInstanceRemoved;
        if (val.roundID === this.currentRoundID) {
          this.updateRoundID(null);
        }
        break;
      }
    }
  }

  private updateQueueID(queueID: string | null, error: string | null): void {
    if (queueID !== this.currentQueueID) {
      this.currentQueueID = queueID;
      this.dispatch(setQueueID({ queueID: queueID, error: error }));
    }
  }

  private updateRoundID(roundID: string | null): void {
    if (roundID !== this.currentRoundID) {
      this.currentRoundID = roundID;
      this.dispatch(setRoundID(roundID));
    }
  }
}
