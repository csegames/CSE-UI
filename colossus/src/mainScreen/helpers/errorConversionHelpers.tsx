/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldCodes } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';

// This is the target format used for our error dialogs

type ErrorSeverity = 'standard' | 'critical';

export interface ErrorData {
  severity: ErrorSeverity;
  title: string;
  message: string;
  code: string;
}

export const defaultError: ErrorData = {
  severity: 'standard',
  title: 'Error',
  message: 'An error occurred.  Please try again later',
  code: 'unspecified_error'
};

export function isErrorData(data: any): data is ErrorData {
  return (
    typeof data === 'object' &&
    typeof data?.message === 'string' &&
    typeof data.title === 'string' &&
    typeof data.code === 'string' &&
    typeof data.severity === 'string'
  );
}

// There are two different REST error standards depending on the age of the interface being called.
//
// The older one uses numeric error codes to determine the error type and provide a message at the top level
// but also includes an array of "field codes" that repeat this information.  The position of the information
// we need is not standardized between these positions.
//
// The newer error standard specifies two string keys to determine the error type: "system" and "code". The system
// can be used to categorize the title of the error dialog and the code can be used to select a more specific error
// message. In addition, the new format has proper HTML error codes to hint about who is at fault for the problem and
// a dictionary of fields that are customized per code to allow more specific information to be presented to end users.
//
// The new format does not specify full error messages because the text content should be determined by the client in a
// world where we have localization. The code slugs are designed to be human readable.
//
// It is also possible to have error returns from the Microsoft libraries that don't fit either structure (e.g.
// authorization errors).  In order to handle these cases, we fall back to looking at the status code text.
//
// Finally, there is a large chunk of bespoke error handling for the legacy matchmaking service subscription system
// that has been copied and pasted in multiple locations. All of that code will be deleted shortly, so no effort has been
// made to write adapters for it in its current incarnation.

interface ServiceError {
  system: string;
  type: string;
  fields?: Dictionary<string>;
}

export function isServiceError(data: any): data is ServiceError {
  return typeof data === 'object' && typeof data?.system === 'string' && typeof data.type === 'string';
}

function convert(httpStatus: number, err: ServiceError): ErrorData {
  const title = `${err.system.replace(/([A-Z])/g, ' $1').trim()} Error`; // e.g. PlayerStatus => Player Status Error
  const message = 'The service was unable to process the request'; // TODO : lookup dictionary of slug resolvers, pass fields to result
  return {
    severity: httpStatus >= 500 ? 'critical' : 'standard',
    title,
    message,
    code: err.type
  };
}

interface FieldCode {
  Code: number;
  Message: string;
}

interface LegacyError extends FieldCode {
  FieldCodes?: FieldCode[];
}

function isLegacyError(data: any): data is LegacyError {
  return typeof data === 'object' && typeof data?.Code === 'number' && typeof data.Message === 'string';
}

function fixupLegacyTitle(code: number): [ErrorSeverity, string] {
  switch (code) {
    case FieldCodes.UserStateConflict:
    case FieldCodes.MatchmakingUserNotReady:
    case FieldCodes.MatchmakingUserAlreadyInQueue:
    case FieldCodes.MatchmakingBadGameMode:
    case FieldCodes.MatchmakingFailedToEnterQueue:
      return ['critical', 'Failed to Enter Matchmaking Queue'];
    case FieldCodes.TimeoutError:
      return ['standard', 'The Operation Timed Out'];
    default:
      return ['standard', 'Service Error'];
  }
}

function convertLegacy(err: LegacyError): ErrorData {
  const dataSource = err.FieldCodes?.length > 0 ? err.FieldCodes[0] : err;
  const [severity, title] = fixupLegacyTitle(dataSource.Code);
  return {
    severity,
    title,
    message: dataSource.Message,
    code: dataSource.Code.toString(10)
  };
}

export function convertThrownValue(title: string, data: any): ErrorData {
  // TODO : determine if there is a safe version of the message in data we can display -- we
  // should be getting reports from Sentry when this occurs
  return {
    severity: 'critical',
    title,
    message: 'Code execution failed; please contact support',
    code: 'client_exception_thrown'
  };
}

export function convertError(err: ServiceError, isCritical?: boolean): ErrorData {
  return convert(isCritical ? 500 : 400, err);
}

export function convertRequestResult(res: RequestResult): ErrorData {
  try {
    const document = res.data ? JSON.parse(res.data) : null;
    if (isServiceError(document)) {
      return convert(res.status, document);
    }
    if (isLegacyError(document)) {
      return convertLegacy(document);
    }
  } catch {}

  return {
    severity: 'standard',
    title: 'Service Error',
    message: res.statusText,
    code: res.status.toString(10)
  };
}
