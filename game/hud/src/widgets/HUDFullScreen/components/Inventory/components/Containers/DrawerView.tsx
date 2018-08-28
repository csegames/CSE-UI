/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';

import { getContainerColor } from '../../../../lib/utils';
import { colors } from '../../../../lib/constants';
import { InventoryItem } from 'gql/interfaces';

const Container = styled('div')`
  width: 100%;
  margin-top: ${(props: any) => props.marginTop}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props: any) => utils.lightenColor(colors.filterBackgroundColor, 150)};
  background-color: ${(props: any) => props.color};
`;

const Content = styled('div')`
  position: relative;
  width: 100%;
  overflow: auto;
  display: block;
  padding-top: 5px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.7);
  background-color: ${(props: any) => props.color};
  &::-webkit-scrollbar {
    width: 15px;
  }
`;

const Footer = styled('div')`
  display: flex;
  align-items: center;
  color: ${(props: any) => utils.lightenColor(colors.filterBackgroundColor, 150)};
  background-color: ${(props: any) => props.color};
  width: ${(props: any) => typeof props.footerWidth === 'number' ? `${props.footerWidth}px` : props.footerWidth};
  align-self: flex-end;
`;

const Divider = styled('div')`
  position: absolute;
  top: 0px;
  right: 0;
  left: 0;
  height: 1px;
  background: ${(props: any) => props.color};
  -webkit-mask-image: url(images/inventory/texture-over-line.png);
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
        <Content color={contentColor} innerRef={(r: HTMLDivElement) => this.props.contentRef && this.props.contentRef(r)}>
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
