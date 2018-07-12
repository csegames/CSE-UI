/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';

export const HeaderFoundation = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right,rgba(220, 141, 88, 0.60), transparent ), url(images/inventory/title-bg.png);
  background-size: cover;
  padding: 20px 20px;
  z-index: 1;
  -webkit-mask-image: url(images/inventory/title-mask.png);
  -webkit-mask-size: cover;
  box-shadow: inset 0px 0px 60px rgba(0,0,0,0.8);
  font-family: Caudex;
  color: #FFE7BB;
  font-size: 18px;
  letter-spacing: 5px;
`;

export const HeaderBorderFoundation = css`
  position: absolute;
  top: 5px;
  left: 5px;
  bottom: 5px;
  width: 100%;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 0px;
  border-style: solid;
`;

const Container = styled('div')`
  ${HeaderFoundation}
  z-index: 2;
  background: linear-gradient(to right,rgba(220,141,88,0.6),transparent),
    url(images/inventory/title-bg.png) no-repeat;
  &:before {
    content: '';
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    border-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent) 10% 1%;
    ${HeaderBorderFoundation}
  }
`;

const HeaderOrnament = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 45px;
  padding: 20px 0;
  background: url(images/inventory/title-ornament.png) no-repeat;
  background-size: contain;
  z-index: 2;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: url(images/inventory/title-ornament-top.png);
    width: 35px;
    height: 26px;
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    background: url(images/inventory/title-ornament-bottom.png);
    width: 35px;
    height: 26px;
  }
`;

const HeaderTitle = styled('div')`
  color: #ffe7bb;
  font-size: 18px;
  font-family: Caudex;
  letter-spacing: 5px;
`;

export interface TabHeaderProps {
  title: string;
}

class TabHeader extends React.Component<TabHeaderProps> {
  public render() {
    return (
      <Container>
        <HeaderOrnament />
        <HeaderTitle>{this.props.title}</HeaderTitle>
        {this.props.children}
      </Container>
    );
  }
}

export default TabHeader;
