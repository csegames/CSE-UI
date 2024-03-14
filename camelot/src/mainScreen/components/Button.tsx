/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

const Root = 'HUD-Button-Root';
const RootDisabled = 'HUD-Button-RootDisabled';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
  disabled?: boolean;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AButton extends React.Component<Props> {
  render(): JSX.Element {
    const { onClick, disabled, dispatch, className, ...otherProps } = this.props;
    const classNames = [Root];
    if (disabled) {
      classNames.push(RootDisabled);
    }
    if (className) {
      classNames.push(className);
    }
    return (
      <div {...otherProps} className={classNames.join(' ')} onClick={!disabled ? onClick : undefined}>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const Button = connect(mapStateToProps)(AButton);
