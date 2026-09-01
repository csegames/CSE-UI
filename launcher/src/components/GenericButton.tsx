/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';
import { playSound, Sound } from '../lib/Sound';

const Button = 'GenericButton-Button';

interface ReactProps {
  onClick?: (e: React.MouseEvent<any>) => void;
  text?: string;
  className?: string;
  href?: string;
  disabled?: boolean;
  big?: boolean;
  error?: boolean;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class AGenericButton extends React.Component<Props> {
  public render() {
    const className = `${this.props.disabled ? 'disabled' : ''} ${this.props.big ? 'big' : ''} ${
      this.props.error ? 'error' : ''
    } ${this.props.className ? this.props.className : ''}`;
    return (
      <a
        className={`${Button} ${className}`}
        onClick={this.props.onClick}
        onMouseOver={() => {
          if (!this.props.disabled) playSound(Sound.SelectChange);
        }}
        href={this.props.href}
        target='_blank'
      >
        {this.props.text}
        {this.props.children}
      </a>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const GenericButton = connect(mapStateToProps)(AGenericButton);
