/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { HeaderBorderFoundation } from './TabHeader';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region SubHeaderContainer constants
const SUB_HEADER_CONTAINER_HEIGHT = 80;
// #endregion
const SubHeaderContainer = styled.div`
  position: relative;
  height: ${SUB_HEADER_CONTAINER_HEIGHT}px;
  background: ${(props: { color: string, className: string }) =>
    `linear-gradient(
      to right,
      ${props.color || 'rgba(188, 163, 143, 0.6)'},
      transparent
    ), url(../images/inventory/title-bg.png);`
  };
  background-size: cover;
  color: white;
  z-index: 1;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 3px;
  box-shadow: inset 0 0 67px rgba(0, 0, 0, 0.6);
  border: 1px black solid;
  &.gray-bg {
    background: ${(props: { color: string, className: string }) =>
    `linear-gradient(
      to right,
      ${props.color || 'rgba(141, 128, 119, 0.70)'},
      transparent
    ), url(../images/inventory/title-bg-grey.png);`
  }
    &:before {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.40);
    }
  }
  &.confirmed {
    background: linear-gradient(to right,rgba(255, 203, 77, 0.7), transparent ), url(../images/inventory/title-bg.png);
  }
  &:before {
    content: '';
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    border-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent 70%) 10% 1%;
    ${HeaderBorderFoundation}
  }

  @media (max-width: 2560px) {
    height: ${SUB_HEADER_CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${SUB_HEADER_CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

// #region Content constants
const CONTENT_PADDING_HORIZONTAL = 40;
const CONTENT_FONT_SIZE = 32;
// #endregion
const Content = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 ${CONTENT_PADDING_HORIZONTAL}px;
  font-size: ${CONTENT_FONT_SIZE}px;

  @media (max-width: 2560px) {
    padding: 0 ${CONTENT_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${CONTENT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${CONTENT_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${CONTENT_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface TradeWindowSubHeaderProps {
  text?: string;
  className?: string;
  contentClassName?: string;
  useGrayBG?: boolean;
  color?: string;
}

class TradeWindowSubHeader extends React.PureComponent<TradeWindowSubHeaderProps> {
  public render() {
    const { useGrayBG, text, className, contentClassName, color } = this.props;
    const containerClassName = `${useGrayBG ? 'gray-bg' : ''} ${className}`;
    return (
      <SubHeaderContainer className={containerClassName} color={color}>
        <Content className={contentClassName}>{text || this.props.children}</Content>
      </SubHeaderContainer>
    );
  }
}

export default TradeWindowSubHeader;
