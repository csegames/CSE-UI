/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { getContainerColor } from 'fullscreen/lib/utils';
import { InventoryItem } from 'gql/interfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin-top: ${(props: any) => props.marginTop}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #B6AEAC;
  background-color: ${(props: any) => props.color};
`;

// #region Content constants
const CONTENT_PADDING_TOP = 10;
const CONTENT_SCROLLBAR_WIDTH = 15;
// #endregion
const Content = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
  display: block;
  padding-top: ${CONTENT_PADDING_TOP}px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.7);
  background-color: ${(props: any) => props.color};

  &::-webkit-scrollbar {
    width: ${CONTENT_SCROLLBAR_WIDTH}px;
  }

  @media (max-width: 2560px) {
    padding-top: ${CONTENT_PADDING_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-top: ${CONTENT_PADDING_TOP * HD_SCALE}px;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  color: #B6AEAC;
  background-color: ${(props: any) => props.color};
  width: 100%;
  align-self: flex-end;
`;

const Divider = styled.div`
  position: absolute;
  top: 0px;
  right: 0;
  left: 0;
  height: 1px;
  background: ${(props: any) => props.color};
  -webkit-mask-image: url(../images/inventory/texture-over-line.png);
`;

export interface DrawerViewProps {
  containerItem: InventoryItem.Fragment;
  headerContent: () => JSX.Element;
  mainContent: () => JSX.Element;
  footerContent: () => JSX.Element;
  marginTop?: number | string;
  footerWidth?: number | string;
  contentRef?: (ref: HTMLDivElement) => void;
}

class DrawerView extends React.PureComponent<DrawerViewProps> {
  public render() {
    const { containerItem } = this.props;
    const headerFooterColor = getContainerColor(containerItem, 0.3).toString();
    const contentColor = getContainerColor(containerItem, 0.2).toString();
    const subHeaderDividerColor = getContainerColor(containerItem, 0.3);
    return (
      <Container marginTop={this.props.marginTop || 0}>
        <Header>
          {this.props.headerContent()}
        </Header>
        <Content color={contentColor} ref={(r: HTMLDivElement) => this.props.contentRef && this.props.contentRef(r)}>
          <Divider color={subHeaderDividerColor} />
          {this.props.mainContent()}
        </Content>
        <Footer color={headerFooterColor} footerWidth={this.props.footerWidth}>
          {this.props.footerContent()}
        </Footer>
      </Container>
    );
  }
}

export default DrawerView;
