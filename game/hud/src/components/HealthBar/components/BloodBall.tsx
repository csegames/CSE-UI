/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils, PlayerState } from '@csegames/camelot-unchained';
import { getBloodPercent } from '../lib/healthFunctions';

const Container = styled('div')`
  position: absolute;
  left: 30px;
  bottom: 25px;
  width: 105px;
  height: 105px;
  border-radius: 52.5px;
  background: #440000;
`;

const Ball = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 52.5px;
  background: linear-gradient(to bottom, #E30000, #2D0000);
  -webkit-mask-size: 100% 100%;
`;

// This is commented out because it will not be shown by default but will be a toggle in the options menu.
// The toggle in the options menu has not been built yet so for now just hiding this.

// const BloodCount = styled('div')`
//   position: absolute;
//   left: 15px;
//   bottom: -20px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   width: 76px;
//   height: 22px;
//   background: url(images/healthbar/regular/blood_number.png);
//   z-index: 10;
// `;

export interface BloodBallProps {
  playerState: PlayerState;
}

class BloodBall extends React.Component<BloodBallProps> {
  private lastUpdatedBloodPercent: number;
  public render() {
    const bloodPercent = getBloodPercent(this.props.playerState);
    return (
      <Container>
        <Ball
          style={{
            WebkitMaskImage: `linear-gradient(to top, black ${bloodPercent}%, transparent ${bloodPercent}%)`,
          }}
        />
        {/* <BloodCount>{this.props.currentBlood}</BloodCount> */}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: BloodBallProps) {
    return !this.lastUpdatedBloodPercent ||
      !utils.numEqualsCloseEnough(this.lastUpdatedBloodPercent, getBloodPercent(nextProps.playerState), 1);
  }

  public componentDidUpdate() {
    this.lastUpdatedBloodPercent = getBloodPercent(this.props.playerState);
  }
}

export default BloodBall;
