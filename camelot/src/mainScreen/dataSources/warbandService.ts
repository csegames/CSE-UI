/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import {
  myWarbandSubscription,
  MyWarbandSubscriptionResult,
  warbandQuery,
  WarbandQueryResult,
  warbandSubscription,
  WarbandSubscriptionResult
} from './warbandNetworkingConstants';
import {
  addWarbandMember,
  joinWarband,
  leaveWarband,
  removeWarbandMember,
  updateWarband,
  updateWarbandMember
} from '../redux/warbandSlice';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import {
  GroupMemberRemovedUpdate,
  GroupMemberUpdate,
  GroupNotificationType,
  GroupTypes,
  GroupUpdateType
} from '@csegames/library/dist/camelotunchained/graphql/schema';

export class WarbandService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<WarbandQueryResult>({ query: warbandQuery }, this.handleWarband.bind(this), InitTopic.Warband),
      await this.subscribe<WarbandSubscriptionResult>(
        { query: warbandSubscription },
        this.handleSubscriptionUpdate.bind(this)
      ),
      await this.subscribe<MyWarbandSubscriptionResult>(
        { query: myWarbandSubscription },
        this.handleMySubscriptionUpdate.bind(this)
      )
    ];
  }

  private handleWarband(result: WarbandQueryResult): void {
    this.dispatch(updateWarband(result.myActiveWarband));
  }

  private handleSubscriptionUpdate(warbandResult: WarbandSubscriptionResult): void {
    const result = warbandResult?.activeGroupUpdates;
    if (!result) {
      console.warn('Got invalid response from Warband subscription.', result);
      return;
    }

    switch (result.updateType) {
      case GroupUpdateType.MemberJoined: {
        const update = result as GroupMemberUpdate;
        if (this.reduxState.warband.id === update.groupID && update.memberState) {
          this.dispatch(addWarbandMember(JSON.parse(update.memberState)));
        }
        break;
      }
      case GroupUpdateType.MemberUpdate: {
        const update = result as GroupMemberUpdate;
        if (this.reduxState.warband.id === update.groupID && update.memberState) {
          this.dispatch(updateWarbandMember(JSON.parse(update.memberState)));
        }
        break;
      }
      case GroupUpdateType.MemberRemoved: {
        const update = result as GroupMemberRemovedUpdate;
        if (this.reduxState.warband.id === update.groupID && update.characterID) {
          this.dispatch(removeWarbandMember(update.characterID));
        }
        break;
      }
    }
  }

  private handleMySubscriptionUpdate(myWarbandResult: MyWarbandSubscriptionResult): void {
    const result = myWarbandResult?.myGroupNotifications;
    if (!result) {
      console.warn('Got invalid response from MyWarband subscription.', result);
      return;
    }

    if (result.groupType === GroupTypes.Warband) {
      switch (result.type) {
        case GroupNotificationType.Joined: {
          if (result.groupID) {
            this.dispatch(joinWarband(result.groupID));
          }
          break;
        }
        case GroupNotificationType.Removed: {
          if (result.groupID) {
            this.dispatch(leaveWarband());
          }
          break;
        }
      }
    }
  }
}
