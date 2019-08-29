/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  height: 100%;
  pointer-events: none;
`;

// #region Button constants
const BUTTON_WIDTH = 220;
const BUTTON_MARGIN_TOP = 4;
const BUTTON_MARGIN_RIGHT = -30;
const BUTTON_FONT_SIZE = 20;
const BUTTON_LETTER_SPACING = 2;
// #endregion
const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-clip-path: polygon(15% 0, 100% 0%, 85% 100%, 0% 100%);
  width: ${BUTTON_WIDTH}px;
  margin: ${BUTTON_MARGIN_TOP}px ${BUTTON_MARGIN_RIGHT}px 0 0;
  font-size: ${BUTTON_FONT_SIZE}px;
  letter-spacing: ${BUTTON_LETTER_SPACING}px;
  height: calc(100% - ${BUTTON_MARGIN_TOP}px);
  font-family: TitilliumWeb;
  background-color: rgba(51, 51, 51, 0.4);
  color: #666;
  pointer-events: all;
  &:hover {
    color: white;
    background-color: rgba(51, 51, 51, 0.6);
  }
  &:active {
    text-shadow: 0px 0px 5px #fff;
  }
  &.isActive {
    color: #E5E5E5;
    background: linear-gradient(transparent, rgba(91, 73, 54, 0.3), transparent);
  }

  @media (max-width: 2560px) {
    width: ${BUTTON_WIDTH * MID_SCALE}px;
    margin: ${BUTTON_MARGIN_TOP * MID_SCALE}px ${BUTTON_MARGIN_RIGHT * MID_SCALE}px 0 0;
    font-size: ${BUTTON_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${BUTTON_LETTER_SPACING * MID_SCALE}px;
    height: calc(100% - ${BUTTON_MARGIN_TOP * MID_SCALE}px);
  }

  @media (max-width: 1920px) {
    width: ${BUTTON_WIDTH * HD_SCALE}px;
    margin: ${BUTTON_MARGIN_TOP * HD_SCALE}px ${BUTTON_MARGIN_RIGHT * HD_SCALE}px 0 0;
    font-size: ${BUTTON_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${BUTTON_LETTER_SPACING * HD_SCALE}px;
    height: calc(100% - ${BUTTON_MARGIN_TOP * HD_SCALE}px);
  }
`;

// #region Icon constants
const ICON_MARGIN_RIGHT = 10;
// #endregion
const Icon = styled.div`
  margin-right: ${ICON_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    margin-right: ${ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region Glow constants
const GLOW_HEIGHT = 70;
// #endregion
const Glow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${GLOW_HEIGHT}px;
  background: url(../images/tabs/arrow-glow.png) no-repeat;
  background-size: cover;
  background-position: center;

  @media (max-width: 2560px) {
    height: ${GLOW_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${GLOW_HEIGHT * HD_SCALE}px;
  }
`;

// #region Arrow constants
const ARROW_RIGHT = 10;
const ARROW_BOTTOM = 2;
const ARROW_HEIGHT = 6;
// #endregion
const Arrow = styled.div`
  position: absolute;
  left: 0;
  right: ${ARROW_RIGHT}px;
  bottom: ${ARROW_BOTTOM}px;
  height: ${ARROW_HEIGHT}px;
  background: url(../images/tabs/arrow-tab.png) no-repeat;
  background-size: contain;
  background-position: center;

  @media (max-width: 2560px) {
    right: ${ARROW_RIGHT * MID_SCALE}px;
    bottom: ${ARROW_BOTTOM * MID_SCALE}px;
    height: ${ARROW_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    right: ${ARROW_RIGHT * HD_SCALE}px;
    bottom: ${ARROW_BOTTOM * HD_SCALE}px;
    height: ${ARROW_HEIGHT * HD_SCALE}px;
  }
`;

// #region ActiveBottomBorder constants
const ACTIVE_BOTTOM_BORDER_HEIGHT = 4;
// #endregion
const ActiveBottomBorder = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: ${ACTIVE_BOTTOM_BORDER_HEIGHT}px;
  background: linear-gradient(to right, rgba(237, 177, 115, 0) 10%, rgba(237, 177, 115, 0.5), rgba(237, 177, 115, 0) 90%);

  @media (max-width: 2560px) {
    height: ${ACTIVE_BOTTOM_BORDER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${ACTIVE_BOTTOM_BORDER_HEIGHT * HD_SCALE}px;
  }
`;

// #region TopBorder constants
const TOP_BORDER_LEFT = 36;
const TOP_BORDER_HEIGHT = 2;
const TOP_BORDER_TOP = 2;
// #endregion
const TopBorder = styled.div`
  position: absolute;
  right: 0;
  top: ${TOP_BORDER_TOP}px;
  left: ${TOP_BORDER_LEFT}px;
  height: ${TOP_BORDER_HEIGHT}px;
  background: linear-gradient(to right, ${(props: any) =>
    props.active ? 'rgba(229, 229, 229, 0.5)' : '#333'}, rgba(0,0,0,0));

  @media (max-width: 2560px) {
    top: ${TOP_BORDER_TOP * MID_SCALE}px;
    left: ${TOP_BORDER_LEFT * MID_SCALE}px;
    height: ${TOP_BORDER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${TOP_BORDER_TOP * HD_SCALE}px;
    left: ${TOP_BORDER_LEFT * HD_SCALE}px;
    height: ${TOP_BORDER_HEIGHT * HD_SCALE}px;
  }
`;

// #region LeftBorder constants
const LEFT_BORDER_LEFT = 22;
const LEFT_BORDER_WIDTH = 2;
const LEFT_BORDER_BOTTOM = 6;
// #endregion
const LeftBorder = styled.div`
  position: absolute;
  top: 0px;
  left: ${LEFT_BORDER_LEFT}px;
  width: ${LEFT_BORDER_WIDTH}px;
  bottom: ${LEFT_BORDER_BOTTOM}px;
  transform: rotate(37deg);
  -webkit-transform: rotate(37deg);
  background-color: ${(props: any) => props.active ?
    'rgba(229, 229, 229, 0.5)' : '#333'};

  @media (max-width: 2560px) {
    left: ${LEFT_BORDER_LEFT * MID_SCALE}px;
    width: ${LEFT_BORDER_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    left: ${LEFT_BORDER_LEFT * HD_SCALE}px;
    width: ${LEFT_BORDER_WIDTH * HD_SCALE}px;
  }
`;

// #region BottomBorder constants
const BOTTOM_BORDER_BOTTOM = 8;
const BOTTOM_BORDER_LEFT = 8;
const BOTTOM_BORDER_RIGHT = 20;
const BOTTOM_BORDER_HEIGHT = 2;
// #endregion
const BottomBorder = styled.div`
  position: absolute;
  bottom: ${BOTTOM_BORDER_BOTTOM}px;
  left: ${BOTTOM_BORDER_LEFT}px;
  right: ${BOTTOM_BORDER_RIGHT}px;
  height: ${BOTTOM_BORDER_HEIGHT}px;
  background: linear-gradient(to right, ${(props: any) =>
    props.active ? 'rgba(229, 229, 229, 0.5)' : '#333'}, rgba(0,0,0,0));

  @media (max-width: 2560px) {
    bottom: ${BOTTOM_BORDER_BOTTOM * MID_SCALE}px;
    left: ${BOTTOM_BORDER_LEFT * MID_SCALE}px;
    right: ${BOTTOM_BORDER_RIGHT * MID_SCALE}px;
    height: ${BOTTOM_BORDER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${BOTTOM_BORDER_BOTTOM * HD_SCALE}px;
    left: ${BOTTOM_BORDER_LEFT * HD_SCALE}px;
    right: ${BOTTOM_BORDER_RIGHT * HD_SCALE}px;
    height: ${BOTTOM_BORDER_HEIGHT * HD_SCALE}px;
  }
`;

// #region CloseButton constants
const CLOSE_BUTTON_TOP = -8;
const CLOSE_BUTTON_RIGHT = -14;
const CLOSE_BUTTON_PADDING = 8;
const CLOSE_BUTTON_FONT_SIZE = 18;
// #endregion
const CloseButton = styled.div`
  position: absolute;
  top: ${CLOSE_BUTTON_TOP}px;
  right: ${CLOSE_BUTTON_RIGHT}px;
  padding: ${CLOSE_BUTTON_PADDING}px;
  font-size: ${CLOSE_BUTTON_FONT_SIZE}px;
  font-family: Caudex;
  color: white;
  opacity: 0.25;
  pointer-events: all;
  &:hover {
    opacity: 0.75;
  }
  &:active {
    text-shadow: 0px 0px 5px #fff;
  }

  @media (max-width: 2560px) {
    top: ${CLOSE_BUTTON_TOP * MID_SCALE}px;
    right: ${CLOSE_BUTTON_RIGHT * MID_SCALE}px;
    padding: ${CLOSE_BUTTON_PADDING * MID_SCALE}px;
    font-size: ${CLOSE_BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CLOSE_BUTTON_TOP * HD_SCALE}px;
    right: ${CLOSE_BUTTON_RIGHT * HD_SCALE}px;
    padding: ${CLOSE_BUTTON_PADDING * HD_SCALE}px;
    font-size: ${CLOSE_BUTTON_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {
  title: string;
  active: boolean;
  icon?: string;
  temporary?: boolean;
  onTemporaryTabClose?: () => void;
}

export interface State {

}

class Tab extends React.Component<Props, State> {
  public render() {
    return (
      <Container>
        <TopBorder active={this.props.active} />
        <LeftBorder active={this.props.active} />
        <BottomBorder active={this.props.active} />
        <Button className={this.props.active ? 'isActive' : ''}>
          {this.props.active && <Glow />}
          {this.props.active && <Arrow />}
          {this.props.active && <ActiveBottomBorder />}
          {this.props.icon && <Icon className={this.props.icon} />}
          {this.props.title}
        </Button>
        {this.props.temporary ? <CloseButton onClick={this.onCloseClick}>X</CloseButton> : null}
      </Container>
    );
  }

  private onCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (this.props.onTemporaryTabClose) {
      this.props.onTemporaryTabClose();
    }
  }
}

export default Tab;
