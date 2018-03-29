/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  position: relative;
  left: -5px;
  width: 100%;
  height: ${(props: any) => props.height}px;
  margin-bottom: 3px;
`;

const Bar = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #303030, #1D1D1D);
  box-shadow: inset 0 0 2px rgba(0,0,0,0.8);

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: ${(props: any) => props.percent}%;
    transition: width 0.1s;
    -webkit-transition: width 0.1s;
    height: 100%;
    background: linear-gradient(to bottom, #00A4F1, #00A4F1);
    box-shadow: inset 0 0 5px #4AD8FF;
  }
`;

const WoundContainer = styled('div')`
  display: flex;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 0;
  bottom: 0;
  left: 14px;
  z-index: 10;
`;

const WoundPill = styled('div')`
  visibility: ${(props: any) => props.shouldDisplay ? 'visible' : 'hidden'};
  width: 104px;
  height: 17px;
  background: url(images/healthbar/regular/small_lock.png);
`;

export interface SmallBarProps {
  height: number;
  isAlive: boolean;
  healthPercent: number;
  wounds: number;
}

export interface SmallBarState {

}

class SmallBar extends React.PureComponent<SmallBarProps, SmallBarState> {
  public render() {
    const { isAlive, healthPercent, wounds } = this.props;
    return (
      <Container height={this.props.height}>
        <Bar percent={healthPercent} />
        <WoundContainer>
          <WoundPill shouldDisplay={!isAlive && wounds >= 2} />
          <WoundPill shouldDisplay={wounds >= 2} />
          <WoundPill shouldDisplay={wounds >= 1} />
        </WoundContainer>
      </Container>
    );
  }
}

export default SmallBar;
