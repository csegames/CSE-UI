/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:08:25
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-31 15:31:28
 */

import * as React from 'react';
import {events} from 'camelot-unchained';
import {patcher, User} from '../../../../services/patcher';
import LayeredDiv from '../LayeredDiv';

export interface LoginProps {
  onLogin: () => void;
};

enum LoginStatus {
  IDLE,
  INVALIDINPUT,
  WORKING,
  SUCCESS,
  FAILED
}

export interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
  status: LoginStatus;
};

class Login extends React.Component<LoginProps, LoginState> {
  public name: string = 'cse-patcher-login';
  public intervalHandle: any;
  public intervalCounter: any;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: patcher.getUserEmail(),
      password: '',
      rememberMe: patcher.hasUserEmail(),
      status: LoginStatus.INVALIDINPUT,
    };

    // because patcherAPI is not ready immediately... hacky, but works enough I think
    setTimeout(() => {
      this.state = {
        email: patcher.getUserEmail(),
        password: '',
        rememberMe: patcher.hasUserEmail(),
        status: LoginStatus.INVALIDINPUT,
      };
    }, 500);
  }

  componentDidMount() : void {
    // without this timeout, the label doesn't animate up above the input box
    if (this.emailRef.value.length === 0) {
      this.emailRef.focus();
    } else {
      this.passwordRef.focus();
    }
  }

  onEmailChanged = (evt: any) => {
    this.setState({
      email: evt.target.value,
      status: this.passwordRef.validity.valid && this.emailRef.validity.valid ? LoginStatus.IDLE : LoginStatus.INVALIDINPUT
    } as any);
  }

  onPasswordChanged = (evt: any) => {
    this.setState({
      password: evt.target.value,
      status: this.passwordRef.validity.valid && this.emailRef.validity.valid ? LoginStatus.IDLE : LoginStatus.INVALIDINPUT
    } as any);
  }

  onRememberMe = (evt: any) => {
    this.setState({rememberMe: !this.state.rememberMe} as any);
    events.fire('play-sound', 'select');
  }

  login = () => {
    events.fire('play-sound', 'server-select');
    this.setState({status: LoginStatus.WORKING} as any);
    patcher.login({
      email: this.emailRef.value,
      password: this.passwordRef.value,
      rememberMe: this.rememberRef.checked,
    });

    setTimeout(() => this.checkLoginStatus(500), 500);
  }

  checkLoginStatus = (waitTime: number) => {
    if (patcher.hasLoginToken()) {
      // success! notify, then trigger switch
      setTimeout(() => this.props.onLogin(), 1000);
      this.setState({status: LoginStatus.SUCCESS} as any);
      events.fire('logged-in');
      return;
    } else if (waitTime > 5000 || patcher.hasLoginError()) {
      this.setState({status: LoginStatus.FAILED} as any);
      setTimeout(() => this.setState({status: this.passwordRef.validity.valid && this.emailRef.validity.valid ? LoginStatus.IDLE : LoginStatus.INVALIDINPUT} as any), 1000);
      return;
    }
    setTimeout(() => this.checkLoginStatus(waitTime + 500), 500);
  }

  onHelp = () => {
    window.open('https://api.citystateentertainment.com/Account/ForgottenPassword', '_blank');
    events.fire('play-sound', 'select');
  }

  onKeyDown = (event: any) => {
    if (event.key == 'Enter') {
      this.login();
    }
  }

  private emailRef: HTMLInputElement;
  private passwordRef: HTMLInputElement;
  private rememberRef: HTMLInputElement;

  render() {

    const disableInput = this.state.status != LoginStatus.IDLE && this.state.status != LoginStatus.INVALIDINPUT;

    let LoginButton: JSX.Element = null;
    switch(this.state.status) {
      case LoginStatus.INVALIDINPUT:
        LoginButton = <div className='Login__button disabled' onClick={e => e.preventDefault()}>Login</div>;
        break;
      case LoginStatus.IDLE:
        LoginButton = <div className='Login__button' tabIndex={4} onClick={this.login}>Login</div>;
        break;
      case LoginStatus.WORKING:
        LoginButton = <div className='Login__button disabled' onClick={e => e.preventDefault()}><span className='wave-text'><i>V</i><i>e</i><i>r</i><i>i</i><i>f</i><i>y</i><i>i</i><i>n</i><i>g</i><i>.</i><i>.</i><i>.</i></span></div>;
        break;
      case LoginStatus.SUCCESS:
        LoginButton = <div className='Login__button disabled success'>Success!</div>;
        break;
      case LoginStatus.FAILED:
        LoginButton = <div className='Login__button disabled error'>Login Failed</div>
        break;
    }

    return (
      <div className='Login'>
        <div className='flex-column'>
          <label>Enter your email</label>
          <input className='flex-stretch'
                 ref={r => this.emailRef = r}
                 type='email'
                 value={this.state.email || ''}
                 onChange={this.onEmailChanged}
                 onKeyDown={this.onKeyDown}
                 tabIndex={1}
                 disabled={disableInput}
                 required/>
          
          <div className='Login__rememberMe'>
            
            <input type="checkbox"
                   className="filled-in"
                   id="remember-me"
                   ref={r => this.rememberRef = r}
                   checked={this.state.rememberMe}
                   onChange={this.onRememberMe}
                   onKeyDown={this.onKeyDown}
                   disabled={disableInput}
                   tabIndex={3}/>
            
            <label htmlFor="remember-me">Remember me</label>
          </div>
        </div>
        
        <div className='flex-column'>
          <label>Enter your password</label>
          <input id='password'
                 className='flex-stretch'
                 ref={r => this.passwordRef = r}
                 type='password'
                 value={this.state.password || ''}
                 onChange={this.onPasswordChanged}
                 onKeyDown={this.onKeyDown}
                 tabIndex={2}
                 disabled={disableInput}
                 required/>
          
          <a href='https://api.citystateentertainment.com/Account/ForgottenPassword' target='_blank'>Forgot your password?</a>
        </div>
        
        <div className='flex-column' style={{marginTop: '20px'}}>
          {LoginButton}
          <a href='https://api.citystateentertainment.com/Account/Login' target='_blank'>Create a new account.</a>
        </div>
     
      </div>
    );
  }
};

export default Login;
