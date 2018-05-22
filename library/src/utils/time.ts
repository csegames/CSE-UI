/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as _ from 'lodash';
import * as moment from 'moment';

export function prettyPrintTimeSpan(fromDate: string, untilSecondsPass: string) {
  const from = moment(fromDate);
  const until = from.add(untilSecondsPass, 'seconds');
  if (_.includes(moment().to(until, true), 'seconds')) {
    // If there are seconds, then just show seconds. ex.) 30s -> 29s -> 28s
    const now = Date.parse(new Date().toISOString());
    const elapsedTime = Number(Math.floor((now - Date.parse(fromDate)) / 1000).toFixed(0));
    if (Number(untilSecondsPass) - elapsedTime > 0) {
      return `${(Number(untilSecondsPass) - elapsedTime).toString()}s`;
    }
    return '';
  }

  // If there are more than seconds, ex.) in an hour, in 2 hours
  const now = moment();

  if (now.isAfter(until)) {
    return '';
  }
  return now.to(until, true);
}
