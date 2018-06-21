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
`;

const ActionButton = styled('div')`
  pointer-events: ${(props: any) => props.disabled ? 'none' : 'all'};
  cursor: ${(props: any) => props.disabled ? 'not-allowed' : 'pointer'};
  position: relative;
  width: 183px;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-style: solid;
  border-image: linear-gradient(to bottom right, gold, #68482B) 10% 10%;
  border-style: solid;
  margin-left: 5px;
  font-family: Caudex;
  text-transform: uppercase;
  letter-spacing: 3px;
  -webkit-filter: brightness(100%);
  -webkit-transition: -webkit-filter 0.2s;
  &:hover {
    -webkit-filter: ${(props: any) => props.disabled ? '' : 'brightness(120%)'};
  }
  &:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  }
  &:before {
    content: '${(props: any) => props.text}';
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(${(props: any) => props.backgroundImg}) no-repeat;
    background-size: contain;
    width: 177px;
    height: 47px;
  }
`;

const ActionButtonOverlay = styled('div')`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(images/trade/button-texture.png);
  background-size: cover;
`;

export interface TradeActionButtonProps {
  text: string;
  backgroundImg: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface TradeActionButtonState {
}

class TradeActionButton extends React.Component<TradeActionButtonProps, TradeActionButtonState> {
  public render() {
    return (
      <Container>
        <ActionButton
          disabled={this.props.disabled}
          text={this.props.text}
          backgroundImg={this.props.backgroundImg}
          onClick={this.props.onClick}
        />
        <ActionButtonOverlay />
      </Container>
    );
  }
}

export default TradeActionButton;
