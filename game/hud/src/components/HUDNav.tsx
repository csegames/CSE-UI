/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as className from 'classnames';
import styled, { css } from 'react-emotion';
import { Tooltip, utils } from '@csegames/camelot-unchained';

const List = styled('ul')`
  margin: 0 0 0 0;
  padding: 0 60px 0 6px !important;
  list-style: none;
  background: url(images/hudnav/hudnav_background.png) right top no-repeat;
  height: 45px;
  width: fit-content;
  min-width: 40px;
`;

const ListHorizontal = css`
  float: left;
`;

const Item = styled('a')`
  pointer-events: all;
  color: #e0ddd3 !important;
  width: 26px;
  height: 42px;
  text-align: center;
  display: block;
  text-shadow: 1px 1px 0px #242424;
  &:hover {
    i {
      font-size: 14px;
      color: #efefe6;
    }
  }
  span {
    position: relative;
    display: inline-block;
    width: 26px;
    height: 42px;
    line-height: 36px;
    vertical-align: middle;
    i {
      color: #aba9a2;
      font-size: 14px;
    }
  }
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
          this.state.collapsed ?
            (<Tooltip content='Show Quick Menu' styles={{
              tooltip: {
                backgroundColor: '#020405',
              },
            }}>
              <li
                className={this.props.orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}
                onClick={this.show}>
                <Item href='#'>
                  <span>
                    <i className='fa fa-bars fa-stack-1x fa-inverse'></i>
                  </span>
                </Item>
              </li>
            </Tooltip>) :
            (
              <div>
                {this.props.items.map(({ name, tooltip, onClick, icon, iconClass }) => {
                  return (
                    <Tooltip key={name} content={tooltip} styles={{
                      tooltip: {
                        backgroundColor: '#020405',
                      },
                    }}>
                      <li
                        className={this.props.orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}
                        id={name}
                        key={name}
                        onClick={onClick}>
                        <Item href='#'>
                          {
                            typeof icon !== 'undefined' ? icon :
                              <i className={className('fa', 'fa-lg', iconClass, 'click-effect')}></i>
                          }
                        </Item>
                      </li>
                    </Tooltip>
                  );
                })}

                <Tooltip content='Collapse Quick Menu' styles={{
                  tooltip: {
                    backgroundColor: '#020405',
                  },
                }}>
                  <li
                    className={this.props.orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}
                    onClick={this.hide}>
                    <Item href='#'>
                      <span>
                        <i className='fa fa-caret-left fa-stack-1x fa-inverse'></i>
                      </span>
                    </Item>
                  </li>
                </Tooltip>
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
