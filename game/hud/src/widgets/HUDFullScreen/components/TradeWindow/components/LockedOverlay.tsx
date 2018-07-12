/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql } from '@csegames/camelot-unchained';

const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  &.locked {
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
  }
`;

const BlackOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const TopGlare = styled('div')`
  position: absolute;
  top: -150px;
  left: 0;
  right: 0;
  background: radial-gradient(rgba(189, 121, 75, 0.6), transparent 70%);
  height: 300px;
`;

const DiagnalGlare = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(images/trade/locked-glare.png) no-repeat;
  background-size: cover;
`;

const Lock = styled('div')`
  &:before {
    content: '';
    position: absolute;
    background: url(images/trade/lock-in.png) no-repeat;
    background-size: cover;
    width: 68px;
    height: 60px;
    top: 79px;
    left: 0;
    right: 0;
    margin: auto;
  }
  &:after {
    content: '';
    position: absolute;
    background: url(images/trade/lock.png) no-repeat;
    background-size: cover;
    width: 103px;
    height: 97px;
    top: 105px;
    left: 0;
    right: 0;
    margin: auto;
  }
`;

const TopRightBorder = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  background: url(images/trade/locked-top-right.png) no-repeat;
  width: 322px;
  height: 121px;
`;

const TopMiddleBorder = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  background: url(images/trade/locked-top-middle.png) no-repeat;
  background-position: center center;
  width: 100%;
  height: 45px;
`;

const TopLeftBorder = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  background: url(images/trade/locked-top-left.png) no-repeat;
  width: 322px;
  height: 121px;
`;

const BottomRightBorder = styled('div')`
  position: absolute;
  bottom: 0;
  right: 0;
  background: url(images/trade/locked-bot-right.png) no-repeat;
  width: 244px;
  height: 95px;
`;

const BottomMiddleBorder = styled('div')`
position: absolute;
bottom: 0;
right: 0;
left: 0;
background: url(images/trade/locked-bot-middle.png) no-repeat;
background-position: center center;
width: 100%;
height: 45px;
`;

const BottomLeftBorder = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  background: url(images/trade/locked-bot-left.png) no-repeat;
  width: 244px;
  height: 95px;
`;

const AcceptedText = styled('div')`
&:after {
  content: 'ACCEPTED';
  font-family: Caudex;
  letter-spacing: 1px;
  color: #A8936F;
  text-align: center;
  position: absolute;
  background: url(images/trade/accepted-bg.png) no-repeat;
  background-size: cover;
  width: 238px;
  height: 32px;
  line-height: 32px;
  top: 205px;
  left: 0;
  right: 0;
  margin: auto;
}
`;

export interface LockedOverlayProps {
  state: ql.schema.SecureTradeState;
}

class LockedOverlay extends React.Component<LockedOverlayProps> {
  public render() {
    return (
      <Container className={this.props.state === 'Locked' ? 'locked' : ''}>
        <TopRightBorder />
        <TopMiddleBorder />
        <TopLeftBorder />
        <Lock />
        <BottomRightBorder />
        <BottomMiddleBorder />
        <BottomLeftBorder />
        <BlackOverlay />
        <DiagnalGlare />
        <TopGlare />
        {this.props.state === 'Confirmed' && <AcceptedText />}
      </Container>
    );
  }
}

export default LockedOverlay;
