/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';

const Root = 'HUD-FlatButton-Root';
const RootDisabled = 'disabled';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
  disabled?: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFlatButton extends React.Component<Props> {
  render(): JSX.Element {
    const factionData = getFactionData(this.props.uiFactionID);

    const { onClick, disabled, dispatch, className, ...otherProps } = this.props;
    const classNames = [Root];
    if (disabled) {
      classNames.push(RootDisabled);
    }
    if (className) {
      classNames.push(className);
    }

    return (
      <div
        {...otherProps}
        className={classNames.join(' ')}
        onClick={!disabled ? onClick : undefined}
        style={{ color: factionData.borderColor, borderColor: factionData.borderColor }}
      >
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FlatButton = connect(mapStateToProps)(AFlatButton);
