/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';

const CrosshairImage = 'Crosshair-CrosshairImage';

interface Props {
  isVisible: boolean;
}

class ACrosshair extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return this.props.isVisible ? (
      <img id='CrossHair' className={CrosshairImage} src={'images/hud/crosshair.png'} />
    ) : null;
  }
}

function mapStateToProps(state: RootState) {
  return {
    isVisible: state.player.isAlive && state.navigation.overlays.length === 0
  };
}

export const Crosshair = connect(mapStateToProps)(ACrosshair);
