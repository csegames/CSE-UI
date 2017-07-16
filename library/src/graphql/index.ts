/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 17:21:38
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-22 15:29:14
 */

// Types are accumulated and exported from fragments, queries, or types
export * from './fragments';
export * from './queries';
export * from './schema';

import fragments from './fragments';
import queries from './queries';
import * as schema from './schema';

export {
  fragments,
  queries,
  schema,
};
