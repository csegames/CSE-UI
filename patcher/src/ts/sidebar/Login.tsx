/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {patcher, User} from '../api/PatcherAPI';
import Animate from '../../../../shared/components/Animate';
import LoginStatusModal from './LoginStatusModal';
import * as events from '../../../../shared/lib/events';

export interface LoginProps {
  onLogIn: () => void;
};

export interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
  showModal: boolean;
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
      showModal: false
    };

    // because patcherAPI is not ready immediately... hacky, but works enough I think
    setTimeout(() => {
      this.state = {
        email: patcher.getUserEmail(),
        password: '',
        rememberMe: patcher.hasUserEmail(),
        showModal: false
      };
    }, 500);
  }

  componentDidMount() : void {
    const emailInput: HTMLInputElement = this.refs['email'] as HTMLInputElement;
    const passwordInput: HTMLInputElement = this.refs['password'] as HTMLInputElement;
    // without this timeout, the label doesn't animate up above the input box
    setTimeout(() => {
      if (emailInput.value.length === 0) {
        emailInput.focus();
      } else {
        passwordInput.focus();
      }
    }, 500);
  }

  onEmailChanged = (evt: any) => {
    this.setState({
      email: evt.target.value,
      password: this.state.password,
      rememberMe: this.state.rememberMe,
      showModal: false
    });
  }

  onPasswordChanged = (evt: any) => {
    this.setState({
      email: this.state.email,
      password: evt.target.value,
      rememberMe: this.state.rememberMe,
      showModal: false
    });
  }

  onRememberMe = (evt: any) => {
    this.setState({
      email: this.state.email,
      password: this.state.password,
      rememberMe: !this.state.rememberMe,
      showModal: false
    });
    events.fire('play-sound', 'select');
  }

  logIn = () => {
    this.setState({
      email: this.state.email,
      password: this.state.password,
      rememberMe: this.state.rememberMe,
      showModal: true
    });
    events.fire('play-sound', 'select');
  }

  hideModal = () => {
    this.setState({
      email: this.state.email,
      password: this.state.password,
      rememberMe: this.state.rememberMe,
      showModal: false
    });
    if (patcher.hasLoginToken()) this.props.onLogIn();
  }

  onHelp = () => {
    window.open('https://api.citystateentertainment.com/Account/ForgottenPassword', '_blank');
    events.fire('play-sound', 'select');
  }

  onKeyDown = (event: any) => {
    if (event.key == 'Enter') {
      this.logIn();
    }
  }

  render() {
    let modal: any = null;
    if (this.state.showModal) {
      modal = <LoginStatusModal email={this.state.email} password={this.state.password}
        rememberMe={this.state.rememberMe} closeModal={this.hideModal} />;
    }

    return (
      <div id={this.name} className='loginbox card-panel' onKeyDown={this.onKeyDown}>
        <div className='row no-margin-bottom'>
        <div className='input-field col s12'>
          <input id='email' ref='email' type='email' className='validate' value={this.state.email || ''} onChange={this.onEmailChanged} tabIndex={1}/>
          <label htmlFor='email'>Email Address</label>
        </div>
        <div className='input-field col s12'>
          <input id='password' ref='password' type='password' className='validate' value={this.state.password || ''} onChange={this.onPasswordChanged} tabIndex={2}/>
          <label htmlFor='password'>Password</label>
        </div>
        <div className='col s12 no-padding'>
          <div className='col s8 no-padding'>
            <input type="checkbox" className="filled-in" id="remember-me" checked={this.state.rememberMe} onChange={this.onRememberMe}  tabIndex={3}/>
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div className='forgot-password col s4'>
            <a className='waves-effect btn-flat' onClick={this.onHelp}>help!</a>
          </div>
        </div>
        <div className='col s12'>
          <a className='waves-effect btn-flat right sign-in' onClick={this.logIn}  tabIndex={4}>Sign In</a>
        </div>
        </div>

        <Animate animationEnter='zoomIn' animationLeave='zommOut'
          durationEnter={500} durationLeave={300}>
          {modal}
        </Animate>
      </div>
    );
  }
};

export default Login;
