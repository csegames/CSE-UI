/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { getFactionData } from '../../gameData/factionData';

const Root = 'HUD-InputBox-Root';
const InnerPadded = 'HUD-InputBox-InnerPadded';
const Background = 'HUD-InputBox-Background';
const Inner = 'HUD-InputBox-Inner';

interface ReactProps {
  text?: string;
  padded?: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInputBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root} style={{ borderColor: factionData.borderColor }}>
        <img className={Background} src={factionData.windowBackgroundImage} />
        <div className={this.props.padded ? `${Inner} ${InnerPadded}` : Inner}>
          {this.props.text && <span>{this.props.text}</span>}
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID
  };
};

export const InputBox = connect(mapStateToProps)(AInputBox);
