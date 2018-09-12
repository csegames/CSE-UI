/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { colors } from '../../../../lib/constants';
import { ContainerColor } from 'gql/interfaces';

const Container = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 5px;
  color: #B6AEAC;
`;

const Content = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.7);
  &::-webkit-scrollbar {
    width: 15px;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 5px;
  color: #B6AEAC
`;

export const CloseButton = styled.div`
  cursor: pointer;
  font-size: 20px;
  color: #413735;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  margin-left: 15px;
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
