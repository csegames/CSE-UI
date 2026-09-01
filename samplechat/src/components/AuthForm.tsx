import * as React from 'react';
import { CallStatus, getFirstError, hasPendingCall } from '../rest/callState';
import { callEmailLogin } from '../rest/calls';
import { ErrorMessage } from './utils/ErrorMessage';
import { clearAuthErrors } from '../redux/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';

import './AuthForm.css';

interface Props {
  calls: Record<string, CallStatus>;
}

class AAuthForm extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    const failureMsg = getFirstError(this.props.calls);
    const isSubmitting = hasPendingCall(this.props.calls);

    return (
      <div id='auth-form'>
        <form onSubmit={this.submitForm.bind(this)}>
          <input name='email' type='email' placeholder='Email' required disabled={isSubmitting} />
          <input name='password' type='password' placeholder='Password' required disabled={isSubmitting} />
          <button type='submit' disabled={isSubmitting}>
            Submit
          </button>
          {failureMsg && <ErrorMessage error={failureMsg} />}
        </form>
      </div>
    );
  }

  submitForm(formEvent: React.SyntheticEvent<HTMLFormElement>): void {
    const { calls, dispatch } = this.props;
    formEvent.preventDefault();
    if (!hasPendingCall(calls)) {
      const formData = new FormData(formEvent.currentTarget);
      const email: string = formData.get('email')!.toString();
      const password: string = formData.get('password')!.toString();

      dispatch(clearAuthErrors());
      (dispatch as AppDispatch)(callEmailLogin({ email, password }));
    }
  }
}

const mapStateToProps = (state: RootState): Props => {
  const { calls } = state.auth;
  return {
    calls
  };
};

export const AuthForm = connect(mapStateToProps)(AAuthForm);
