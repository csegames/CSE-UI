/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-17 13:27:56
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-18 12:11:23
 */

export function craftingTimeToString(sec: number, short: boolean = false) {
  if (sec <= 0) return 'instant';
  if (sec < 1) return 'less than a second';
  let r = '';
  const hrs = (sec / 3600) | 0;
  sec -= hrs * 3600;
  const min = (sec / 60) | 0;
  sec -= min * 60;
  function plaural(t: string, n: number) {
    return t + (n === 1 ? '' : 's');
  }
  function space() {
    return r === '' ? '' : ' ';
  }
  if (hrs) r += hrs + ' ' + plaural(short ? 'hr' : 'hour', hrs);
  if (min) r += space() + min + ' ' + plaural(short ? 'min' : 'minute', min);
  if (sec) r += space() + sec + ' ' + plaural(short ? 'sec' : 'second', sec);
  return r;
}
