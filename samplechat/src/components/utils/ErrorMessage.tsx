import * as React from 'react';
import { getMessage, isCallError } from '../../rest/CallError';

interface ErrorMessageProps {
  error: unknown;
}
export const ErrorMessage: React.FC<ErrorMessageProps> = (props: ErrorMessageProps) => {
  const { error } = props;
  const extractMessage = (): string => {
    if (isCallError(error)) {
      return getMessage(error);
    }
    if (error !== null && typeof error === 'object') {
      const obj = error as any;
      if ('message' in obj) {
        return String(obj.message);
      }
      return JSON.stringify(obj, null, 4);
    }
    return String(error);
  };

  return <span className='error'>{extractMessage()}</span>;
};
