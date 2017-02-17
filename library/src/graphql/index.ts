/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 17:21:38
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-16 12:10:52
 */

// Types are accumulated and exported from fragments, queries, or types
export * from './fragments';
export * from './queries';

import fragments from './fragments';
import queries from './queries';

export {
  fragments,
  queries,
};
