/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-13 18:27:51
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-13 18:52:32
 */

import * as FieldCodes from './fieldCodes';

export {
  FieldCodes,
}

export interface Unauthorized {
  Code: 401;
  Message: string;
  FieldCodes: [ FieldCodes.UnspecifiedAuthorizationDenied |
          FieldCodes.APIKeyAuthorizationFailed |
          FieldCodes.LoginTokenAuthorizationFailed |
          FieldCodes.RealmRestricted
        ];
}


export interface NotAllowed {
  Code: 405;
  Message: string;

  FieldCodes: [FieldCodes.UnspecifiedNotAllowed | 
         FieldCodes.RateLimitExceeded | 
         FieldCodes.InternalAction
        ];
}

export interface BadRequest {
  Code: 400;
  Message: string;
  FieldCodes: [ FieldCodes.UnspecifiedRequestError |
          FieldCodes.InvalidModel
        ];
}

export interface ExecutionError {
  Code: 500;
  Message: string;
  FieldCodes: [ FieldCodes.UnspecifiedExecutionError |
          FieldCodes.UnhandledExecutionException |
          FieldCodes.DoesNotExist |
          FieldCodes.UserStateConflict |
          FieldCodes.InsufficientResource
        ];
}

export interface ServiceUnavailable {
  Code: 503;
  Message: string;
  FieldCodes: [ FieldCodes.UnspecifiedServiceUnavailable |
          FieldCodes.DatabaseUnavailable |
          FieldCodes.GroupServiceUnavailable |
          FieldCodes.GameServiceUnavailable |
          FieldCodes.PresenceServiceUnavailable
        ];
}

export type CSEError = Unauthorized | NotAllowed | BadRequest | ExecutionError | ServiceUnavailable;
