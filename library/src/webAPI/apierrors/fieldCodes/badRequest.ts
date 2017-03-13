/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-13 18:32:20
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-13 18:33:45
 */

export interface UnspecifiedRequestError {
  Code: 3000;
  Message: string;
}

export interface InvalidModel {
  Code: 3001;
  Message: string;
  ModelErrors: {
    Message: string;
    ParamName: string;
    TypeName: string;
  }[];
}
