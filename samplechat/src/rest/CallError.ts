/**
 * CallError is the expected structure returned by the API when something goes wrong. It includes an error type
 * localization slug that is meant to be converted to a user-readable string, which is what the `getMessage`
 * function below is provided to do.
 */

export type CallError = {
  system: string;
  type: string;
  fields: Record<string, string>;
};

export function isCallError(state: any): state is CallError {
  if (
    typeof state != 'object' ||
    typeof state['system'] != 'string' ||
    typeof state['type'] != 'string' ||
    typeof state['fields'] != 'object'
  ) {
    return false;
  }
  return true;
}

export function toCallError(msg: any): CallError {
  switch (typeof msg) {
    case 'string':
      return {
        system: 'Exception',
        type: 'unknown',
        fields: {
          message: msg
        }
      };
    case 'object':
      if (isCallError(msg)) {
        return msg;
      }
      if (typeof msg['message'] == 'string') {
        return {
          system: 'Exception',
          type: 'unknown',
          fields: {
            message: msg.message
          }
        };
      }
  }
  return {
    system: 'Exception',
    type: 'unknown',
    fields: {
      message: 'An unknown error occured'
    }
  };
}

export function getMessage(error: CallError): string {
  switch (error.system) {
    case 'Authorization': {
      switch (error.type) {
        case 'unauthorized':
          return 'Unauthorized';
        case 'invalid_token':
          return 'Invalid authorization token';
        case 'invalid_email_or_password':
          return 'Invalid email or password';
        case 'permission_expired':
          return 'Permissions expired';
        case 'character_not_found':
          return 'Character not found';
        case 'renewal_timer_expired':
          return 'Renewal timer expired';
        case 'require_policy_acceptance':
          return 'Policies must be accepted';
        case 'throttled':
          return 'Login attempt throttled';
        case 'no_screen_name':
          return 'No screen name';
        default: {
          const explicit = error.fields['message'];
          if (explicit) return explicit;
          return error.type;
        }
      }
    }
    case 'Notification': {
      switch (error.type) {
        case 'DurationOutOfBounds':
          return 'Duration out of bounds';
        case 'MessageNotFound':
          return `Message "${error.fields['id']}" not found`;
        case 'NotificationsUnavailable':
          return 'Notifications unavailable';
        case 'OptimisticLockFailed':
          return 'Optimistic lock failed';
        case 'PagingTokenInvalid':
          return 'Paging token invalid';
        case 'ParameterInvalid':
          return `"${error.fields['id']}" not valid`;
        case 'PermissionDenied':
          return 'Permission denied';
        case 'RequestTimedOut':
          return 'Request timed out';
        case 'ScriptNotFound':
          return `Script "${error.fields['id']}" not found`;
        case 'SequenceNotFound':
          return `Sequence "${error.fields['id']}" not found`;
        case 'TargetNotFound':
          return `Target "${error.fields['id']}" not found`;
        case 'TimeOutOfBounds':
          return 'Time out of bounds';
        default:
          return error.type;
      }
    }
    case 'Legacy': {
      if (error.fields.message) {
        return error.fields.message;
      }
      return `${error.system}: ${error.type}`;
    }
    default: {
      return `${error.system}: ${error.type}`;
    }
  }
}
