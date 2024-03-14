/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { stringTableQuery, StringTableQueryResult } from './stringTableNetworkingConstants';
import { updateStringTable } from '../redux/stringTableSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { InitTopic } from '../redux/initializationSlice';

export class StringTableNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<StringTableQueryResult>(
        { query: stringTableQuery },
        this.handleStringTable.bind(this),
        InitTopic.StringTable
      )
    ];
  }

  private handleStringTable(result: StringTableQueryResult): void {
    // Validate the result.
    if (!result?.game?.stringTable) {
      console.warn('Received invalid response from StringTable fetch.');
      return;
    }

    const entriesByID: Dictionary<StringTableEntryDef> = {};
    for (const entry of result.game.stringTable) {
      entriesByID[entry.id] = entry;
    }

    this.dispatch(updateStringTable(entriesByID));
  }
}
