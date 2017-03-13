/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-13 18:34:36
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-13 18:37:47
 */

export interface UnspecifiedExecutionError {
  Code: 4000;
  Message: string;
}

export interface UnhandledExecutionException {
  Code: 4001;
  Message: string;
  Exception?: string;
}

export interface DoesNotExist {
  Code: 4002;
  Message: string;
}

export interface UserStateConflict {
  Code: 4003;
  Message: string;
}

export interface InsufficientResource {
  Code: 4004;
  Message: string;
  Resources: {
    Name: string;
    Required: string | number;
    Available: string | number;
  }[];
}
