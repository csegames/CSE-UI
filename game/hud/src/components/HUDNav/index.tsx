/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import HUDNavButton from './components/HUDNavButton';

const List = styled('ul')`
  margin: 0 0 0 0;
  padding: 0 60px 0 6px !important;
  list-style: none;
  background: url(images/hudnav/hudnav_background.png) right top no-repeat;
  height: 45px;
  width: fit-content;
  min-width: 40px;
`;

export interface HUDNavData {
  orientation: utils.Orientation;
  items: HUDNavItem[];
}

export interface HUDNavItem {
  name: string;
  tooltip: string;
  iconClass: string;
  icon?: any;
  hidden: boolean;
  onClick: () => void;
}

export interface HUDNavProps extends HUDNavData {
  containerClass?: string;
}

export interface HUDNavState {
  collapsed: boolean;
}

export class HUDNav extends React.Component<HUDNavProps, HUDNavState> {
  constructor(props: HUDNavProps) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  public render() {
    return (
      <List>
        {
          this.state.collapsed ? (
            <HUDNavButton
              name={'hud-nav-show'}
              tooltip={'Show Quick Menu'}
              onClick={this.show}
              icon={
                <span>
                  <i className='fa fa-bars fa-stack-1x fa-inverse'></i>
                </span>
              }
              iconClass={'fa-bars'}
              orientation={this.props.orientation}
            />
          ) :
          (
            <div>
              {this.props.items.map(({ name, tooltip, onClick, icon, iconClass }) => {
                return (
                  <HUDNavButton
                    key={name}
                    name={name}
                    tooltip={tooltip}
                    onClick={onClick}
                    icon={icon}
                    iconClass={iconClass}
                    orientation={this.props.orientation}
                  />
                );
              })}
              <HUDNavButton
                name={'hud-nav-hide'}
                tooltip={'Collapse Quick Menu'}
                onClick={this.hide}
                icon={
                  <span>
                    <i className='fa fa-caret-left fa-stack-1x fa-inverse'></i>
                  </span>
                }
                iconClass={'fa-caret-left'}
                orientation={this.props.orientation}
              />
            </div>
          )
        }
      </List>
    );
  }

  private show = () => {
    this.setState({ collapsed: false });
  }

  private hide = () => {
    this.setState({ collapsed: true });
  }
}

export default HUDNav;
