/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Sentry from '@sentry/browser';
import { userQuery, UserQueryResult } from './userNetworkingConstants';
import { updateUser } from '../redux/userSlice';
import ExternalDataSource from '../redux/externalDataSource';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { EventEmitter } from '@csegames/library/dist/_baseGame/types/EventEmitter';

const userServiceEventEmitter = new EventEmitter();

export class UserNetworkingService extends ExternalDataSource {
  private refreshHandle: ListenerHandle = null;

  protected async bind(): Promise<ListenerHandle[]> {
    userServiceEventEmitter.on('refresh', this.refresh.bind(this));
    return [await this.query<UserQueryResult>({ query: userQuery }, this.handleUserData.bind(this), InitTopic.User)];
  }

  private handleUserData(result: UserQueryResult): void {
    Sentry.setUser({ userInfo: result.myUser });
    this.dispatch(updateUser(result.myUser));
  }

  private async refresh(): Promise<void> {
    this.refreshHandle?.close();
    this.refreshHandle = await this.query<UserQueryResult>(
      { query: userQuery },
      this.handleUserData.bind(this),
      InitTopic.User
    );
  }
}

export const refreshUser = (): void => {
  userServiceEventEmitter.trigger('refresh');
};
