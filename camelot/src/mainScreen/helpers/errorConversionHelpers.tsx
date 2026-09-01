/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';

// This is the target format used for our error dialogs

export type ErrorSeverity = 'standard' | 'critical';

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

// Allow individual error handlers to specify more contextually appropriate messages while still falling back to
// the defaults.
export type messageOverrides = (slug: string, fields: Record<string, string> | undefined) => string | undefined;

export function isServiceError(data: any): data is ServiceError {
  return typeof data === 'object' && typeof data?.system === 'string' && typeof data.type === 'string';
}

function convert(httpStatus: number, err: ServiceError, overrides?: messageOverrides): ErrorData {
  const title = `${err.system.replace(/([A-Z])/g, ' $1').trim()} Error`; // e.g. PlayerStatus => Player Status Error
  const message = convertMessage(err, overrides);
  return {
    severity: httpStatus >= 500 ? 'critical' : 'standard',
    title,
    message,
    code: err.type
  };
}

function convertMessage(err: ServiceError, overrides?: messageOverrides) {
  const slug = `${err.system}-${err.type}`;
  if (overrides) {
    const msg = overrides(slug, err.fields);
    if (msg) return msg;
  }

  const fields = err.fields ?? {};

  // TODO : move to string table
  // TODO : error strings for groups, items, player status, other new systems
  switch (`${err.system}-${err.type}`) {
    case 'Activities-ActivitiesUnavailable':
    case 'Activities-RoundServerLost':
    case 'Activities-RoundAllocationFailed':
    case 'VersionedData-RecordsUnavailable':
    case 'VersionedData-ServiceUnavailable':
      return 'Service is not available';
    case 'Activities-ActivityNotFound':
      return `Activity ${fields['name']} was not found`;
    case 'Activities-BackfillDisabled':
      return 'Late join is not available';
    case 'Activities-ConfirmationLocked':
      return 'Your choices are already locked';
    case 'Activities-ConnectionTimedOut':
    case 'Activities-RequestTimedOut':
    case 'VersionedData-ConnectionTimedOut':
    case 'VersionedData-RequestTimedOut':
      return 'The service timed out';
    case 'Activities-EntryNotFound':
    case 'Activities-ReservationNotFound':
      return 'You are no longer in the queue';
    case 'Activities-EntrySizeNotEligible':
      return 'Your group is too large';
    case 'Activities-PagingTokenInvalid':
    case 'VersionedData-PagingTokenInvalid':
      return 'Your page token was not found';
    case 'Activities-PermissionDenied':
    case 'VersionedData-PermissionDenied':
      return "You don't have permission to do that";
    case 'Activities-PlayerNotFound':
      return 'Player not found';
    case 'Activities-PlayersAlreadyQueued':
      return 'Your group is already in a queue';
    case 'Activities-PlayersNotEligible':
      return 'Your group is not eligible to join';
    case 'Activities-PlayersOffline':
      return 'Your group has offline players';
    case 'Activities-QueueNotFound':
      return `The queue ${fields['id']} was not found`;
    case 'Activities-QueuePriorityBlocked':
      return 'Your group is already queued';
    case 'Activities-RequestFieldMissing':
    case 'VersionedData-RequestFieldMissing':
      return `Field ${fields['name']} must be included`;
    case 'Activities-RequestValueInvalid':
    case 'Activities-RestrictionValueInvalid':
    case 'Activities-StatValueInvalid':
    case 'VersionedData-RequestValueInvalid':
      return `Invalid ${fields['name']}`;
    case 'Activities-RoundAlreadyCompleted':
      return 'The activity is already complete';
    case 'Activities-RoundAlreadyCreated':
      return 'The activity is already created';
    case 'Activities-RoundCanceled':
      return 'The activity has been canceled';
    case 'Activities-RoundNotFound':
      return 'The activity was not found';
    case 'Activities-StatNotFound':
      return `Stat "${fields['name']}" could not be found`;
    case 'Activities-StatsNotSupprted':
      return `Stats "${fields['names']}" are not supported`;
    case 'Activities-TeamNotFound':
      return `The team "${fields['id']}" was not found`;
    case 'Activities-TimeOutOfBounds':
      return `You can't do that now`;
    case 'VersionedData-KeyNotFound':
      return `No record found for "${fields['key']}"`;
    case 'VersionedData-RecordLimitReached':
      return 'Max records reached';
    case 'VersionedData-RecordNotFound':
      return 'Record not found';
    case 'VersionedData-RequestValueCollision':
      return `Selected ${fields['name']} is not compatible with other records`;
    case 'VersionedData-SelfRewardInvalid':
      return `You can't choose yourself`;
    default:
      return 'The service was unable to process the request'; // TODO : lookup dictionary of slug resolvers, pass fields to result
  }
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
  return ['standard', 'Service Error'];
}

function convertLegacy(err: LegacyError): ErrorData {
  const dataSource = err.FieldCodes?.length ?? 0 > 0 ? err.FieldCodes![0] : err;
  const [severity, title] = fixupLegacyTitle(dataSource.Code);
  return {
    severity,
    title,
    message: dataSource.Message,
    code: dataSource.Code.toString(10)
  };
}

export function convertError(err: ServiceError, isCritical?: boolean): ErrorData {
  return convert(isCritical ? 500 : 400, err);
}

export function convertRequestResult(res: RequestResult, overrides: messageOverrides): ErrorData {
  try {
    const document = res.data ? JSON.parse(res.data) : null;
    if (isServiceError(document)) {
      return convert(res.status, document, overrides);
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
