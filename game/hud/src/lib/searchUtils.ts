/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-22 11:28:48
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-22 15:01:40
 */

// tslint:disable-next-line
import * as fuzzySearch from 'fuzzysearch';

export function doesSearchInclude(searchValue: string, itemName: string): boolean {
  return fuzzySearch(searchValue.toLowerCase().replace(/\s/g, ''), itemName.toLowerCase());
}
