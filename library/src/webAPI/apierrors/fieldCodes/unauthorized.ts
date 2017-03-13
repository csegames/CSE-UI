/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-13 18:26:38
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-13 18:26:38
 */

export interface UnspecifiedAuthorizationDenied {
  Code: 1000;
  Message: string;
}

export interface APIKeyAuthorizationFailed {
  Code: 1001;
  Message: string;
}

export interface LoginTokenAuthorizationFailed {
  Code: 1002;
  Message: string;
}

export interface RealmRestricted {
  Code: 1003;
  Message: string;
}
