/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-30 12:05:36
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-30 15:32:43
 */

enum warbandPermissions {
  NONE = 0,
  JOIN = 1 << 0,
  INVITE = 1 << 1,
  KICK = 1 << 2,
  MANAGEPRIVACY = 1 << 3,
  MANGEPERMANENT = 1 << 4,
  MANAGEBANNER = 1 << 5,
  MANAGENAME = 1 << 6,
  ALL = ~NONE,
}

export default warbandPermissions;
