/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';

import { colors } from '../../../../lib/constants';
import { ContainerColorFragment } from '../../../../../../gqlInterfaces';

const Container = styled('div')`
  width: 100%;
  margin-bottom: 5px;
`;

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 5px;
  color: ${(props: any) => utils.lightenColor(colors.filterBackgroundColor, 150)};
  background-color: ${(props: any) => props.color};
`;

const Content = styled('div')`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.7);
  background-color: ${(props: any) => props.color};
  &::-webkit-scrollbar {
    width: 15px;
  }
`;

const Footer = styled('div')`
  display: flex;
  align-items: center;
  padding: 2px 5px;
  color: ${(props: any) => utils.lightenColor(colors.filterBackgroundColor, 150)};
  background-color: ${(props: any) => props.color};
`;

export const CloseButton = styled('div')`
  cursor: pointer;
  font-size: 20px;
  color: ${(props: any) => utils.lightenColor(colors.filterBackgroundColor, 100)};
  text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  margin-left: 15px;
`;

export interface ContainerViewProps {
  containerColor?: ContainerColorFragment;
  headerContent: () => JSX.Element;
  mainContent: () => JSX.Element;
  footerContent: () => JSX.Element;
  contentRef?: (ref: HTMLDivElement) => void;
}

class ContainerView extends React.PureComponent<ContainerViewProps> {
  public render() {
    const headerFooterColor = this.getPrimaryColor(0.5).toString();
    const contentColor = this.getPrimaryColor(0.3).toString();
    return (
      <Container>
        <Header color={headerFooterColor}>
          {this.props.headerContent()}
        </Header>
        <Content color={contentColor} innerRef={(r: HTMLDivElement) => this.props.contentRef && this.props.contentRef(r)}>
          {this.props.mainContent()}
        </Content>
        <Footer color={headerFooterColor}>
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
      return utils.lightenColor(colors.filterBackgroundColor, 5);
    }
  }
}

export default ContainerView;
