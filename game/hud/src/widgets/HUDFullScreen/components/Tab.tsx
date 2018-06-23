/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  position: relative;
  height: 100%;
  pointer-events: none;
`;

const Button = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-clip-path: polygon(15% 0, 100% 0%, 85% 100%, 0% 100%);
  width: 110px;
  margin: 2px -15px 0 0;
  font-size: 10px;
  font-family: TitilliumWeb;
  letter-spacing: 1px;
  height: calc(100% - 4px);
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
`;

const Icon = styled('div')`
  margin-right: 5px;
`;

const Glow = styled('div')`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 35px;
  background: url(images/tabs/arrow-glow.png) no-repeat;
  background-size: cover;
  background-position: center;
`;

const Arrow = styled('div')`
  position: absolute;
  left: 0;
  right: 5px;
  bottom: 1px;
  height: 3px;
  background: url(images/tabs/arrow-tab.png) no-repeat;
  background-size: contain;
  background-position: center;
`;

const ActiveBottomBorder = styled('div')`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(to right, rgba(237, 177, 115, 0) 10%, rgba(237, 177, 115, 0.5), rgba(237, 177, 115, 0) 90%);
`;

const TopBorder = styled('div')`
  position: absolute;
  top: 1px;
  right: 0;
  left: 17px;
  height: 1px;
  background: linear-gradient(to right, ${(props: any) =>
    props.active ? 'rgba(229, 229, 229, 0.5)' : '#333'}, rgba(0,0,0,0));
`;

const LeftBorder = styled('div')`
  position: absolute;
  top: 0px;
  left: 10px;
  bottom: 3px;
  width: 1px;
  transform: rotate(37deg);
  -webkit-transform: rotate(37deg);
  background-color: ${(props: any) => props.active ?
    'rgba(229, 229, 229, 0.5)' : '#333'};
`;

const BottomBorder = styled('div')`
  position: absolute;
  bottom: 5px;
  left: 4px;
  right: 10px;
  height: 1px;
  background: linear-gradient(to right, ${(props: any) =>
    props.active ? 'rgba(229, 229, 229, 0.5)' : '#333'}, rgba(0,0,0,0));
`;

const CloseButton = styled('div')`
  position: absolute;
  top: -4px;
  right: -7px;
  padding: 4px;
  font-size: 9px;
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
