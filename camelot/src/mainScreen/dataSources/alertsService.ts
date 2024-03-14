/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO: [CU-12497] Add back interactive alerts query to phoenixed CU UI

import ExternalDataSource from '../redux/externalDataSource';
import {
  // interactiveAlertsQuery,
  // InteractiveAlertsQueryResult,
  interactiveAlertsSubscription,
  InteractiveAlertsSubscriptionResult
} from './alertsNetworkingConstants';
// import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { addInteractiveAlert } from '../redux/alertsSlice';

export class AlertsService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      // await this.query<InteractiveAlertsQueryResult>(
      //   { query: interactiveAlertsQuery },
      //   this.handleInteractiveAlerts.bind(this),
      //   InitTopic.InteractiveAlerts
      // ),
      await this.subscribe<InteractiveAlertsSubscriptionResult>(
        { query: interactiveAlertsSubscription },
        this.handleInteractiveSubscriptionUpdate.bind(this)
      )
    ];
  }

  // private handleInteractiveAlerts(result: InteractiveAlertsQueryResult): void {
  //   result.myInteractiveAlerts.forEach((interactiveAlert) => {
  //     this.dispatch(addInteractiveAlert(interactiveAlert));
  //   });
  // }

  private handleInteractiveSubscriptionUpdate(alertsResult: InteractiveAlertsSubscriptionResult): void {
    const result = alertsResult?.interactiveAlerts;
    if (!result) {
      console.warn('Got invalid response from Alerts subscription.', result);
      return;
    }
    this.dispatch(addInteractiveAlert(result));
  }
}
