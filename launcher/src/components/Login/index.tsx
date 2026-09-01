/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { Sound, playSound } from '../../lib/Sound';
import { RootState } from '../../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { LoginPrivacyModal } from './LoginPrivacyModal';
import { BasicBorder } from '../BasicBorder';
import { LoginLink } from './LoginLink';
import { LoginButton } from './LoginButton';
import { clearLoginError, updateEmail, updateRemember } from '../../redux/loginSlice';

const Root = 'LoginView-Root';
const Column = 'LoginView-Column';
const Row = 'LoginView-Row';
const InputBorder = 'LoginView-InputBorder';
const Input = 'LoginView-Input';
const RememberMeContainer = 'LoginView-RememberMeContainer';
const RememberMeLabel = 'LoginView-RememberMeLabel';
const VersionNumber = 'LoginView-VersionNumber';
const HiddenCheckbox = 'LoginView-HiddenCheckbox';
const Checkbox = 'LoginView-Checkbox';
const CheckMark = 'LoginView-CheckMark';
const ActionButton = 'LoginView-ActionButton';

export enum LoginStatus {
  IDLE,
  INVALIDINPUT,
  WORKING,
  SUCCESS,
  FAILED,
  PRIVACYERROR
}

interface State {
  status: LoginStatus;
  password: string;
}

interface ReactProps {}

interface InjectedProps {
  email: string;
  remember: boolean;
  error: string;
}

type Props = ReactProps & InjectedProps;

class ALogin extends React.Component<Props & DispatchProp, State> {
  private emailRef = React.createRef<HTMLInputElement>();
  private passwordRef = React.createRef<HTMLInputElement>();
  private rememberRef = React.createRef<HTMLInputElement>();

  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = {
      status: LoginStatus.INVALIDINPUT,
      password: ''
    };
  }

  public render() {
    const { email, remember } = this.props;
    const { status, password } = this.state;
    const disableInput =
      status !== LoginStatus.IDLE && status !== LoginStatus.INVALIDINPUT && status !== LoginStatus.FAILED;
    return (
      <div className={Root}>
        {status === LoginStatus.PRIVACYERROR && (
          <LoginPrivacyModal onClick={() => this.setState({ status: LoginStatus.IDLE })} />
        )}
        <div className={Column}>
          <div className={RememberMeContainer} onMouseDown={this.onRememberMe.bind(this, null)}>
            <input
              className={HiddenCheckbox}
              type='checkbox'
              id='remember-me'
              ref={this.rememberRef}
              checked={remember}
              onKeyDown={this.onKeyDown.bind(this)}
              disabled={disableInput}
              tabIndex={3}
            />
            <div className={Checkbox}>{remember && <div className={CheckMark} />}</div>
            <label className={RememberMeLabel}>{'Remember me'}</label>
          </div>
          <BasicBorder className={InputBorder}>
            <input
              className={Input}
              placeholder='Your Email'
              ref={this.emailRef}
              type='email'
              value={email}
              onChange={this.onEmailChanged.bind(this)}
              onKeyDown={this.onKeyDown.bind(this)}
              tabIndex={1}
              disabled={disableInput}
              required
            />
          </BasicBorder>
        </div>
        <div className={Column}>
          <LoginLink href='https://api.citystateentertainment.com/Account/ForgottenPassword' margin={'-5px 0 0 10px'}>
            {'Forgot your password?'}
          </LoginLink>
          <BasicBorder className={InputBorder}>
            <input
              className={Input}
              placeholder='Your Password'
              id='password'
              ref={this.passwordRef}
              type='password'
              value={password}
              onChange={this.onPasswordChanged.bind(this)}
              onKeyDown={this.onKeyDown.bind(this)}
              tabIndex={2}
              disabled={disableInput}
              required
            />
          </BasicBorder>
        </div>
        <div className={Column}>
          <div className={Row}>
            <LoginLink href='https://api.citystateentertainment.com/Account/Login' margin={'-5px 0 0 10px'}>
              {'Create an account.'}
            </LoginLink>
            <div className={VersionNumber}>{`v${process.env.VERSION}`}</div>
          </div>
          <LoginButton className={ActionButton} status={status} onClick={this.login.bind(this)} />
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    const emailInput = this.emailRef.current;
    const passwordInput = this.passwordRef.current;
    if (emailInput?.value.length === 0) {
      emailInput.focus();
    } else {
      passwordInput?.focus();
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    if (prevProps.email != this.props.email) {
      this.setState({
        status:
          this.isEmailValid(this.props.email) && this.isPasswordValid(this.state.password)
            ? LoginStatus.IDLE
            : LoginStatus.INVALIDINPUT
      });
    }
    if (!prevProps.error && this.props.error) {
      this.setState({
        status: LoginStatus.FAILED
      });
    }
  }

  private onEmailChanged(evt: React.ChangeEvent<HTMLInputElement>) {
    this.props.dispatch(updateEmail(evt.target.value));
    this.props.dispatch(clearLoginError());
  }

  private onPasswordChanged(evt: React.ChangeEvent<HTMLInputElement>) {
    const password = evt.target.value;
    this.setState({
      password,
      status:
        this.isEmailValid(this.props.email) && this.isPasswordValid(password)
          ? LoginStatus.IDLE
          : LoginStatus.INVALIDINPUT
    });
    this.props.dispatch(clearLoginError());
  }

  private onRememberMe(evt: React.ChangeEvent<HTMLInputElement> | null) {
    const remember = evt?.target.checked ?? !this.props.remember;
    if (remember === false && this.props.remember) {
      window.patcher.forgetUser();
    }
    this.props.dispatch(updateRemember(remember));
    playSound(Sound.Select);
  }

  private login() {
    const { status, password } = this.state;
    if (status == LoginStatus.IDLE) {
      const { email, remember } = this.props;
      playSound(Sound.LaunchGame);
      this.setState({ status: LoginStatus.WORKING });
      window.patcher.performLogin(email, password, remember);
    }
  }

  private onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }

  private isPasswordValid(password: string): boolean {
    return password.length > 0;
  }

  // not an accurate email test, but better than what we had
  private isEmailValid(email: string): boolean {
    const index = email.indexOf('@');
    return email.length > 0 && index > 0 && index + 1 < email.length;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { email, remember, error } = state.login;
  return {
    ...ownProps,
    email,
    remember,
    error
  };
};

export const Login = connect(mapStateToProps)(ALogin);
