/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { memoize } from 'lodash';

const cache = memoize((s: string) => {
  return new RegExp('^' + s.replace(/./g, (x) => {
    return /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/.test(x) ? '\\' + x + '?' : x + '?';
  }) + '$', 'i');
});

export default (s: string, pattern: string) => {
  return cache(s).test(pattern);
};
