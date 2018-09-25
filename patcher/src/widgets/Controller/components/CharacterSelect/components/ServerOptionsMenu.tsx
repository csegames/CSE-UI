/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ChannelStatus } from '../../../../../services/patcher';
import { PatcherServer } from '../../../services/session/controller';

const MenuContainer = styled('div')`
  position: fixed;
  display: block;
  width: 180px;
  z-index: 5;
  line-height: 20px;
  top: ${(props: any) => props.topPos}px;
  left: ${(props: any) => props.leftPos}px;
  background: url(images/controller/dropdown-bg.png);
  border: 1px solid #525252;
  -webkit-mask-image: url(images/controller/dropdown-mask.png);
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;
    border-image: linear-gradient(180deg,#626262,#1c1c1c) stretch;
  border-image-slice: 1;
`;

const ListItem = styled('div')`
  pointer-events: ${(props: any) => props.visible ? 'all' : 'none'};
  cursor: pointer;
  text-decoration: none;
  display: block;
  height: 20px;
  padding: 5px 15px;
  color:grey;
  transition: all .3s ease;
  &:hover {
    color:white;
    background: linear-gradient(to right, rgba(128, 128, 128, 0.3), transparent);
  }
`;

const OptionsMenuOverlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export interface ServerOptionsMenuProps {
  top: number;
  left: number;
  charSelectVisible: boolean;
  serverForOptions: PatcherServer;
  handleInstallUninstall: (e: React.MouseEvent<HTMLDivElement>) => void;
  toggleMenu: (e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) => void;
}

class ServerOptionsMenu extends React.Component<ServerOptionsMenuProps> {
  public render() {
    return (
      <div>
        <MenuContainer topPos={this.props.top} leftPos={this.props.left}>
          <ListItem onClick={this.props.handleInstallUninstall} visible={this.props.charSelectVisible}>
            {this.props.serverForOptions.channelStatus === ChannelStatus.NotInstalled ? 'Install' : 'Uninstall'}
          </ListItem>
        </MenuContainer>
        <OptionsMenuOverlay onClick={this.props.toggleMenu as React.MouseEventHandler} />
      </div>
    );
  }
}

export default ServerOptionsMenu;
