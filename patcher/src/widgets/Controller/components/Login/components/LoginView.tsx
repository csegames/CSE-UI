/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from 'camelot-unchained';

import { LoginStatus } from '../index';
import LoginButton from './LoginButton';

const Container = styled('div')`
  display: flex;
  height: 92px;
  width: 500px;
  background-size: cover;
  z-index: 1;
  transition: all ease-out .5s;
  padding: 0 10px;
`;

const Input = styled('input')`
  width: 200px;
  margin: 5px;
  padding: 15px 10px;
  border: 1px #2c2c2c solid;
  color: #8f8f8f;
  -webkit-mask-image: url(images/controller/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  background: #2a2a2a;
  font-family:"Titillium Web";
  font-size: 1em;
  transition: border .2s;
  &:focus {
    border: 1px solid #d7bb4d !important;
    box-shadow: 0 1px 2px #d7bb4d !important;
    outline: none;
  }
  &::-webkit-input-placeholder {
    color: rgba(200, 200, 200, 0.2);
  }
`;

const Link = styled('a')`
  margin: -5px 0 0 10px;
  text-decoration: none;
  color: ${utils.darkenColor('#d7bb4d', 10)};
  transition: all 0.3s;
  font-size: 0.9em;
  display: block;
  text-align: left;
  &:hover {
    color: ${utils.lightenColor('#d7bb4d', 10)};
  }
`;

const RememberMeContainer = styled('div')`
  flex: none;
  text-align: left;
  margin: -4px 0 0 10px;
`;

const RememberMeLabel = styled('label')`
  margin-left: 10px;
  color: #8f8f8f;
  cursor: pointer !important;
`;

export interface LoginViewProps {
  email: string;
  password: string;
  rememberMe: boolean;
  status: LoginStatus;
  onEmailChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRememberMe: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
  emailRef: (ref: HTMLInputElement) => void;
  rememberRef: (ref: HTMLInputElement) => void;
  passwordRef: (ref: HTMLInputElement) => void;
}

class LoginView extends React.Component<LoginViewProps> {
  public render() {
    const disableInput = this.props.status !== LoginStatus.IDLE && this.props.status !== LoginStatus.INVALIDINPUT;
    return (
      <Container>
        <div>
          <Input
            placeholder='Your Email'
            innerRef={this.props.emailRef}
            type='email'
            value={this.props.email || ''}
            onChange={this.props.onEmailChanged}
            onKeyDown={this.props.onKeyDown}
            tabIndex={1}
            disabled={disableInput}
            required
          />
          <RememberMeContainer>
            <input
              type='checkbox'
              id='remember-me'
              ref={this.props.rememberRef}
              checked={this.props.rememberMe}
              onChange={this.props.onRememberMe}
              onKeyDown={this.props.onKeyDown}
              disabled={disableInput}
              tabIndex={3}
            />
            <RememberMeLabel htmlFor='remember-me'>Remember me</RememberMeLabel>
          </RememberMeContainer>
        </div>
        <div>
          <Input
            placeholder='Your Password'
            id='password'
            innerRef={this.props.passwordRef}
            type='password'
            value={this.props.password || ''}
            onChange={this.props.onPasswordChanged}
            onKeyDown={this.props.onKeyDown}
            tabIndex={2}
            disabled={disableInput}
            required
          />
          <Link href='https://api.citystateentertainment.com/Account/ForgottenPassword' target='_blank'>
            Forgot your password?
          </Link>
        </div>
        <div>
          <LoginButton status={this.props.status} onClick={this.props.onLogin} />
          <Link href='https://api.citystateentertainment.com/Account/Login' target='_blank'>Create a new account.</Link>
        </div>
      </Container>
    );
  }
}

export default LoginView;
