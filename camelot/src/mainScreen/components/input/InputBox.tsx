/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';

const Root = 'HUD-InputBox-Root';
const InnerPadded = 'HUD-InputBox-InnerPadded';
const Border = 'HUD-InputBox-Border';
const Inner = 'HUD-InputBox-Inner';

interface ReactProps {
  text?: string;
  padded?: boolean;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInputBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        <div className={Border}>
          <div className={this.props.padded ? `${Inner} ${InnerPadded}` : Inner}>
            {this.props.text && <span>{this.props.text}</span>}
            {this.props.children}
          </div>
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

export const InputBox = connect(mapStateToProps)(AInputBox);
