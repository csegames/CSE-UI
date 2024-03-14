/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

const Root = 'HUD-BarHeader-Root';
const Overlay = 'HUD-BarHeader-Overlay';
const Text = 'HUD-BarHeader-Text';

interface ReactProps {
  style?: React.CSSProperties;
  className?: string;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  textClassName?: string;
  textStyle?: React.CSSProperties;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ABarHeader extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div style={this.props.style} className={this.props.className ? `${Root} ${this.props.className}` : Root}>
        {this.props.overlayClassName && (
          <div style={this.props.overlayStyle} className={`${Overlay} ${this.props.overlayClassName}`} />
        )}
        <div
          style={this.props.textStyle}
          className={this.props.textClassName ? `${Text} ${this.props.textClassName}` : Text}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const BarHeader = connect(mapStateToProps)(ABarHeader);
