/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-13 18:39:44
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-13 18:41:04
 */

export interface UnspecifiedServiceUnavailable {
  Code: 5000;
  Message: string;
}

export interface DatabaseUnavailable {
  Code: 5001;
  Message: string;
}

export interface GroupServiceUnavailable {
  Code: 5002;
  Message: string;
}

export interface GameServiceUnavailable {
  Code: 5003;
  Message: string;
}

export interface PresenceServiceUnavailable {
  Code: 5004;
  Message: string;
}
