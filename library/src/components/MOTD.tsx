/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from '../';

export interface Style {
  MOTD: React.CSSProperties;
  header: React.CSSProperties;
  content: React.CSSProperties;
  footer: React.CSSProperties;
  dismiss: React.CSSProperties;
  close: React.CSSProperties;
}

const Container = styled('div')`
  pointer-events: all;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  height: 450px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid ${utils.lightenColor('#202020', 30)};
  position: relative;
`;

const Header = styled('div')`
  width: 100%;
  padding: 5px 0;
  text-align: center;
  color: white;
  background-color: #202020;
  border-bottom: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Content = styled('div')`
  flex: 1;
  color: white;
  padding: 5px;
  overflow: auto;
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
    background-color: #111;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 5px;
  }
`;

const Footer = styled('div')`
  padding: 5px 0;
  background-color: #202020;
  text-align: center;
  border-top: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Dismiss = styled('div')`
  cursor: pointer;
`;

const Close = styled('div')`
  position: absolute;
  top: 2;
  right: 5;
  color: #CDCDCD;
  font-size: 20px;
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #BBB;
  }
`;

export interface Props {
  styles?: Partial<Style>;
  onClose?: () => void;
  onDismiss24?: () => void;
  children?: React.ReactNode;
}

export const MOTD = (props: Props) => {
  const customStyles = props.styles || {};
  return (
    <Container style={customStyles.MOTD}>
      <Header style={customStyles.header}>
        <div className=''>Welcome to Camelot Unchained</div>
        <Close style={customStyles.close} onClick={props.onClose}>
          <i className='fa fa-times click-effect'></i>
        </Close>
      </Header>
      <Content style={customStyles.content}>
        {props.children}
      </Content>
      <Footer style={customStyles.footer}>
        <Dismiss style={customStyles.dismiss} onClick={props.onDismiss24}>Dismiss For 24h</Dismiss>
      </Footer>
    </Container>
  );
};

export default MOTD;
