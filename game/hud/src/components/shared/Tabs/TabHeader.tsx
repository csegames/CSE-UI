/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

// #region HeaderFoundation constants
const HEADER_FOUNDATION_HEIGHT = 130;
const HEADER_FOUNDATION_FONT_SIZE = 40;
const HEADER_FOUNDATION_LETTER_SPACING = 6;
// #endregion
export const HeaderFoundation = `
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right,rgba(220, 141, 88, 0.60), transparent ), url(../images/inventory/title-bg.png);
  background-size: cover;
  z-index: 1;
  -webkit-mask-image: url(../images/inventory/title-mask.png);
  -webkit-mask-size: cover;
  box-shadow: inset 0px 0px 60px rgba(0,0,0,0.8);
  font-family: Caudex;
  color: #FFE7BB;
  padding: 0px 20px;
  min-height: ${HEADER_FOUNDATION_HEIGHT}px;
  height: ${HEADER_FOUNDATION_HEIGHT}px;
  font-size: ${HEADER_FOUNDATION_FONT_SIZE}px;
  letter-spacing: ${HEADER_FOUNDATION_LETTER_SPACING}px;

  @media (max-width: 2560px) {
    min-height: ${HEADER_FOUNDATION_HEIGHT * MID_SCALE}px;
    height: ${HEADER_FOUNDATION_HEIGHT * MID_SCALE}px;
    font-size: ${HEADER_FOUNDATION_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${HEADER_FOUNDATION_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    min-height: ${HEADER_FOUNDATION_HEIGHT * HD_SCALE}px;
    height: ${HEADER_FOUNDATION_HEIGHT * HD_SCALE}px;
    font-size: ${HEADER_FOUNDATION_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${HEADER_FOUNDATION_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region HeaderBorderFoundation constants
const HEADER_BORDER_FOUNDATION_ALIGNMENT = 6;
// #endregion
export const HeaderBorderFoundation = `
  position: absolute;
  top: ${HEADER_BORDER_FOUNDATION_ALIGNMENT}px;
  left: ${HEADER_BORDER_FOUNDATION_ALIGNMENT}px;
  bottom: ${HEADER_BORDER_FOUNDATION_ALIGNMENT}px;
  right: ${HEADER_BORDER_FOUNDATION_ALIGNMENT}px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 0px;
  border-style: solid;

  @media (max-width: 2560px) {
    top: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * MID_SCALE}px;
    left: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * MID_SCALE}px;
    bottom: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * MID_SCALE}px;
    right: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * HD_SCALE}px;
    left: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * HD_SCALE}px;
    bottom: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * HD_SCALE}px;
    right: ${HEADER_BORDER_FOUNDATION_ALIGNMENT * HD_SCALE}px;
  }
`;

const Container = styled.div`
  ${HeaderFoundation}
  z-index: 2;
  background: linear-gradient(to right,rgba(220,141,88,0.6),transparent),
    url(../images/inventory/title-bg.png) no-repeat;
  &:before {
    content: '';
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    border-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent) 10% 1%;
    ${HeaderBorderFoundation}
  }
`;

// #region HeaderOrnament constants
const HEADER_ORNAMENT_WIDTH = 90;
const HEADER_ORNAMENT_PADDING_VERTICAL = 40;

const HEADER_ORNAMENT_EXTRA_WIDTH = 70;
const HEADER_ORNAMENT_EXTRA_HEIGHT = 52;
// #endregion
const HeaderOrnament = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: ${HEADER_ORNAMENT_WIDTH}px;
  padding: ${HEADER_ORNAMENT_PADDING_VERTICAL}px 0;
  background-image: url(../images/inventory/title-ornament.png);
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 2;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(../images/inventory/title-ornament-top.png);
    background-size: contain;
    background-repeat: no-repeat;
    width: ${HEADER_ORNAMENT_EXTRA_WIDTH}px;
    height: ${HEADER_ORNAMENT_EXTRA_HEIGHT}px;
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(../images/inventory/title-ornament-bottom.png);
    background-size: contain;
    background-repeat: no-repeat;
    width: ${HEADER_ORNAMENT_EXTRA_WIDTH}px;
    height: ${HEADER_ORNAMENT_EXTRA_HEIGHT}px;
  }

  @media (max-width: 2560px) {
    width: ${HEADER_ORNAMENT_WIDTH * MID_SCALE}px;
    padding: ${HEADER_ORNAMENT_PADDING_VERTICAL * MID_SCALE}px 0;
    &:before {
      width: ${HEADER_ORNAMENT_EXTRA_WIDTH * MID_SCALE}px;
      height: ${HEADER_ORNAMENT_EXTRA_HEIGHT * MID_SCALE}px;
    }
    &:after {
      width: ${HEADER_ORNAMENT_EXTRA_WIDTH * MID_SCALE}px;
      height: ${HEADER_ORNAMENT_EXTRA_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${HEADER_ORNAMENT_WIDTH * HD_SCALE}px;
    padding: ${HEADER_ORNAMENT_PADDING_VERTICAL * HD_SCALE}px 0;
    &:before {
      width: ${HEADER_ORNAMENT_EXTRA_WIDTH * HD_SCALE}px;
      height: ${HEADER_ORNAMENT_EXTRA_HEIGHT * HD_SCALE}px;
    }
    &:after {
      width: ${HEADER_ORNAMENT_EXTRA_WIDTH * HD_SCALE}px;
      height: ${HEADER_ORNAMENT_EXTRA_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region HeaderTitle constants
const HEADER_TITLE_FONT_SIZE = 40;
const HEADER_TITLE_LETTER_SPACING = 6;
// #endregion
const HeaderTitle = styled.div`
  color: #ffe7bb;
  font-size: ${HEADER_TITLE_FONT_SIZE}px;
  letter-spacing: ${HEADER_TITLE_LETTER_SPACING}px;
  font-family: Caudex;

  @media (max-width: 2560px) {
    font-size: ${HEADER_TITLE_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${HEADER_TITLE_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${HEADER_TITLE_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${HEADER_TITLE_LETTER_SPACING * HD_SCALE}px;
  }
`;

export interface TabHeaderProps {
  title?: string;
}

class TabHeader extends React.Component<TabHeaderProps> {
  public render() {
    return (
      <Container>
        <HeaderOrnament />
        {this.props.title && <HeaderTitle>{this.props.title}</HeaderTitle>}
        {this.props.children}
      </Container>
    );
  }
}

export default TabHeader;
