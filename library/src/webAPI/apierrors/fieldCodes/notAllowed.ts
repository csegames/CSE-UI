/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-13 18:27:27
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-13 18:27:27
 */

export interface UnspecifiedNotAllowed {
  Code: 2000;
  Message: string;
}

export interface RateLimitExceeded {
  Code: 2001;
  Message: string;
}

export interface InternalAction {
  Code: 2002;
  Message: string;
}
