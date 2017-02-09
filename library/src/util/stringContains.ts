/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-23 11:54:00
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 12:05:11
 */

import { memoize } from 'lodash';

const cache = memoize(function(s: string){
  return new RegExp("^"+s.replace(/./g, function(x){
    return /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/.test(x) ? "\\"+x+"?" : x+"?";
  })+"$", 'i');
});

export default function(s: string, pattern: string){
  return cache(s).test(pattern)
}
