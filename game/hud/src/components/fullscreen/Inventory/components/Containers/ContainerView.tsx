/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { colors, HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { ContainerColor } from 'gql/interfaces';

// #region Container constants
const CONTAINER_MARGIN_BOTTOM = 10;
// #endregion
const Container = styled.div`
  width: 100%;
  margin-bottom: ${CONTAINER_MARGIN_BOTTOM}px;

  @media (max-width: 2560px) {
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region Header constants
const HEADER_PADDING_VERTICAL = 4;
const HEADER_PADDING_HORIZONTAL = 10;
// #endregion
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${HEADER_PADDING_VERTICAL}px ${HEADER_PADDING_HORIZONTAL}px;
  color: #B6AEAC;

  @media (max-width: 2560px) {
    padding: ${HEADER_PADDING_VERTICAL * MID_SCALE}px ${HEADER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${HEADER_PADDING_VERTICAL * HD_SCALE}px ${HEADER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region Content constants
const CONTENT_PADDING_VERTICAL = 10;
const CONTENT_SCROLLBAR_WIDTH = 30;
// #endregion
const Content = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${CONTENT_PADDING_VERTICAL}px 0px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.7);
  &::-webkit-scrollbar {
    width: ${CONTENT_SCROLLBAR_WIDTH}px;
  }

  @media (max-width: 2560px) {
    padding: ${CONTENT_PADDING_VERTICAL * MID_SCALE}px 0;
    &::-webkit-scrollbar {
      width: ${CONTENT_SCROLLBAR_WIDTH * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding: ${CONTENT_PADDING_VERTICAL * HD_SCALE}px 0;
    &::-webkit-scrollbar {
      width: ${CONTENT_SCROLLBAR_WIDTH * HD_SCALE}px;
    }
  }
`;

// #region Footer constants
const FOOTER_PADDING_VERTICAL = 4;
const FOOTER_PADDING_HORIZONTAL = 10;
// #endregion
const Footer = styled.div`
  display: flex;
  align-items: center;
  padding: ${FOOTER_PADDING_VERTICAL}px ${FOOTER_PADDING_HORIZONTAL}px;
  color: #B6AEAC

  @media (max-width: 2560px) {
    padding: ${FOOTER_PADDING_VERTICAL * MID_SCALE}px ${FOOTER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${FOOTER_PADDING_VERTICAL * HD_SCALE}px ${FOOTER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region CloseButton constants
const CLOSE_BUTTON_FONT_SIZE = 40;
const CLOSE_BUTTON_MARGIN_LEFT = 30;
// #endregion
export const CloseButton = styled.div`
  cursor: pointer;
  font-size: ${CLOSE_BUTTON_FONT_SIZE}px;
  margin-left: ${CLOSE_BUTTON_MARGIN_LEFT}px;
  color: #413735;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.7);

  @media (max-width: 2560px) {
    font-size: ${CLOSE_BUTTON_FONT_SIZE * MID_SCALE}px;
    margin-left: ${CLOSE_BUTTON_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${CLOSE_BUTTON_FONT_SIZE * HD_SCALE}px;
    margin-left: ${CLOSE_BUTTON_MARGIN_LEFT * HD_SCALE}px;
  }
`;

export interface ContainerViewProps {
  containerColor?: ContainerColor.Fragment;
  headerContent: () => JSX.Element;
  mainContent: () => JSX.Element | JSX.Element[];
  footerContent: () => JSX.Element;
  contentRef?: (ref: HTMLDivElement) => void;
}

class ContainerView extends React.PureComponent<ContainerViewProps> {
  public render() {
    const headerFooterColor = this.getPrimaryColor(0.5).toString();
    const contentColor = this.getPrimaryColor(0.3).toString();
    return (
      <Container>
        <Header style={{ backgroundColor: headerFooterColor }}>
          {this.props.headerContent()}
        </Header>
        <Content
          style={{ backgroundColor: contentColor }}
          ref={(r: HTMLDivElement) => this.props.contentRef && this.props.contentRef(r)}>
          {this.props.mainContent()}
        </Content>
        <Footer style={{ backgroundColor: headerFooterColor }}>
          {this.props.footerContent()}
        </Footer>
      </Container>
    );
  }

  private getPrimaryColor = (alpha: number) => {
    const { containerColor } = this.props;
    if (containerColor) {
      return `rgba(${containerColor.r}, ${containerColor.g}, ${containerColor.b}, ${alpha})`;
    } else {
      return colors.filterBackgroundColor;
    }
  }
}

export default ContainerView;
