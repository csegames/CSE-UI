/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { LoginStatus } from '.';
import { GenericButton } from '../GenericButton';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';

const WaveText = 'Controller-Login-LoginButton-WaveText';
const FailedButton = 'Controller-Login-LoginButton-FailedButton';
const ButtonGlow = 'Controller-Login-LoginButton-ButtonGlow';
const HorizontalBorderShine = 'Controller-Login-LoginButton-HorizontalBorderShine';
const VerticalBorderShine = 'Controller-Login-LoginButton-VerticalBorderShine';

interface ReactProps {
  status: LoginStatus;
  onClick: () => void;
  className?: string;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ALoginButton extends React.Component<Props> {
  public render() {
    switch (this.props.status) {
      case LoginStatus.INVALIDINPUT:
        return <GenericButton disabled className={this.props.className} text={'Login'} onClick={this.props.onClick} />;
      case LoginStatus.IDLE:
        return <GenericButton className={this.props.className} text={'Login'} onClick={this.props.onClick} />;
      case LoginStatus.WORKING:
        return (
          <GenericButton disabled className={this.props.className} onClick={(e) => e.preventDefault()}>
            <span className={WaveText}>
              <i>{'V'}</i>
              <i>{'e'}</i>
              <i>{'r'}</i>
              <i>{'i'}</i>
              <i>{'f'}</i>
              <i>{'y'}</i>
              <i>{'i'}</i>
              <i>{'n'}</i>
              <i>{'g'}</i>
              <i>{'.'}</i>
              <i>{'.'}</i>
              <i>{'.'}</i>
            </span>
            <div className={HorizontalBorderShine} />
            <div className={VerticalBorderShine} />
            <div className={ButtonGlow} />
          </GenericButton>
        );
      case LoginStatus.SUCCESS:
        return <GenericButton disabled className={this.props.className} text='Success' onClick={() => {}} />;
      case LoginStatus.FAILED:
        return (
          <GenericButton
            disabled
            text='Login Failed'
            className={`${this.props.className ?? ''} ${FailedButton}`}
            onClick={() => {}}
          />
        );
      case LoginStatus.PRIVACYERROR:
        return (
          <GenericButton
            disabled
            text='Login Failed'
            className={`${this.props.className ?? ''} ${FailedButton}`}
            onClick={() => {}}
          />
        );
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const LoginButton = connect(mapStateToProps)(ALoginButton);
