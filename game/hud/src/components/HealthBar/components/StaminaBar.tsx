/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { getStaminaPercent } from '../lib/healthFunctions';

const Container = styled('div')`
  position: relative;
  width: 104%;
  height: 15px;
  left: -25px;
  background: linear-gradient(to top, #303030, #1D1D1D);
  -webkit-mask-size: 100% 100%;
`;

const Bar = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(to top, #C2FFC8, #4CB856);
  &.isDead {
    background: #555555;
  }
`;

export interface StaminaBarProps {
  playerState: Player;
}

class StaminaBar extends React.Component<StaminaBarProps> {
  private lastUpdatedStaminaPercent: number;
  public render() {
    const staminaPercent = getStaminaPercent(this.props.playerState);
    return (
      <Container
        percent={staminaPercent}
        style={{
          WebkitMaskImage: staminaPercent > 99.8 ? 'url(images/healthbar/regular/stamina_mask.png)' : '',
        }}>
        <Bar style={{ width: staminaPercent + '%' }} className={!this.props.playerState.isAlive ? 'isDead' : ''} />
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: StaminaBarProps) {
    return !this.lastUpdatedStaminaPercent ||
      !getStaminaPercent(nextProps.playerState).floatEquals(this.lastUpdatedStaminaPercent, 1) ||
      nextProps.playerState.isAlive !== this.props.playerState.isAlive;
  }

  public componentDidUpdate() {
    this.lastUpdatedStaminaPercent = getStaminaPercent(this.props.playerState);
  }
}

export default StaminaBar;
