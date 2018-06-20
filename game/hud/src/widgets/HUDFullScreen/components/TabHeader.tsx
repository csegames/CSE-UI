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
  background: url(images/inventory/title-bg.png);
  background-size: cover;
  padding: 0 20px;
  z-index: 1;
  -webkit-mask-image: url(images/inventory/title-mask.png);
  -webkit-mask-size: cover;
  box-shadow: inset 0 0px 67px rgba(0,0,0,0.6);
`;

export const HeaderBorderFoundation = css`
  position: absolute;
  top: 6px;
  left: 6px;
  bottom: 6px;
  width: 100%;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 0px;
  border-style: solid;
  z-index: -1;
`;

const Container = styled('div')`
  ${HeaderFoundation}
  max-height: 50px;
  min-height: 50px;
  z-index: 2;
  background: linear-gradient(to right,rgba(189,121,75,0.6),transparent),
    url(images/inventory/title-bg.png) no-repeat;
  &:before {
    content: '';
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
    border-image: linear-gradient(to right, rgba(222, 194, 146, 0.2), transparent) 10% 1%;
    ${HeaderBorderFoundation}
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const HeaderOrnament = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  height: 50px;
  width: 45px;
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
  color: #DEC292;
  font-size: 20px;
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
