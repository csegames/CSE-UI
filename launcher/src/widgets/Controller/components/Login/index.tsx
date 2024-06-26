/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import LoginView from './components/LoginView';
import { patcher } from '../../../../services/patcher';
import { Sound, playSound } from '../../../../lib/Sound';
import { globalEvents } from '../../../../lib/EventEmitter';

export interface LoginProps {}

export enum LoginStatus {
  IDLE,
  INVALIDINPUT,
  WORKING,
  SUCCESS,
  FAILED,
  PRIVACYERROR
}

export interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
  status: LoginStatus;
}

class Login extends React.Component<LoginProps, LoginState> {
  public name: string = 'cse-patcher-login';
  public intervalHandle: any;
  public intervalCounter: any;

  private emailRef: HTMLInputElement;
  private passwordRef: HTMLInputElement;
  private rememberRef: HTMLInputElement;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: patcher.getUserEmail(),
      password: '',
      rememberMe: patcher.hasUserEmail(),
      status: LoginStatus.INVALIDINPUT
    };

    // because patcherAPI is not ready immediately... hacky, but works enough I think
    window.setTimeout(() => {
      this.state = {
        email: patcher.getUserEmail(),
        password: '',
        rememberMe: patcher.hasUserEmail(),
        status: LoginStatus.INVALIDINPUT
      };
    }, 500);
  }

  public render() {
    return (
      <LoginView
        email={this.state.email}
        password={this.state.password}
        rememberMe={this.state.rememberMe}
        status={this.state.status}
        onPrivacyClick={this.onPrivacyClick}
        onEmailChanged={this.onEmailChanged}
        onKeyDown={this.onKeyDown}
        onPasswordChanged={this.onPasswordChanged}
        onRememberMe={this.onRememberMe}
        onLogin={this.login.bind(this)}
        emailRef={(r) => (this.emailRef = r)}
        rememberRef={(r) => (this.rememberRef = r)}
        passwordRef={(r) => (this.passwordRef = r)}
      />
    );
  }

  public componentDidMount(): void {
    if (this.emailRef.value.length === 0) {
      this.emailRef.focus();
    } else {
      this.passwordRef.focus();
    }
  }

  private onEmailChanged = (evt: any) => {
    this.setState({
      email: evt.target.value,
      status:
        this.passwordRef.validity.valid && this.emailRef.validity.valid ? LoginStatus.IDLE : LoginStatus.INVALIDINPUT
    });
  };

  private onPrivacyClick = () => {
    this.setState({ status: LoginStatus.IDLE });
  };

  private onPasswordChanged = (evt: any) => {
    this.setState({
      password: evt.target.value,
      status:
        this.passwordRef.validity.valid && this.emailRef.validity.valid ? LoginStatus.IDLE : LoginStatus.INVALIDINPUT
    });
  };

  private onRememberMe = (evt: any) => {
    const newRememberMe = !this.state.rememberMe;
    this.setState({ rememberMe: newRememberMe } as any);

    if (newRememberMe === false) {
      // clear email addr from client's storage too
      patcher.login({ email: null, password: null, rememberMe: false });
      // Resets form fields when remember me is unchecked
      this.setState({ email: null, password: null });
    }
    playSound(Sound.Select);
  };

  private login() {
    playSound(Sound.LaunchGame);
    this.setState({ status: LoginStatus.WORKING });
    patcher.login({
      email: this.emailRef.value,
      password: this.passwordRef.value,
      rememberMe: this.rememberRef.checked
    });

    window.setTimeout(() => this.checkLoginStatus(500), 500);
  }

  private checkLoginStatus(waitTime: number) {
    if (patcher.isLoggedIn) {
      // success! notify, then trigger switch
      this.setState({ status: LoginStatus.SUCCESS } as any);
      window.setTimeout(() => globalEvents.trigger('logged-in'), 500);
      return;
    } else if (waitTime > 10000 || patcher.hasLoginError()) {
      switch (patcher.getLoginError()) {
        case 'privacyError': {
          this.setState({ status: LoginStatus.PRIVACYERROR });
          break;
        }
        default: {
          this.setState({ status: LoginStatus.FAILED } as any);
          window.setTimeout(
            () =>
              this.setState({
                status:
                  this.passwordRef.validity.valid && this.emailRef.validity.valid
                    ? LoginStatus.IDLE
                    : LoginStatus.INVALIDINPUT
              } as any),
            1000
          );
          break;
        }
      }
      return;
    }
    window.setTimeout(() => this.checkLoginStatus(waitTime + 500), 500);
  }

  private onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      this.login();
    }
  };
}

export default Login;
