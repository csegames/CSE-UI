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
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListHorizontal = css`
  float: left;
`;

const Item = styled('a')`
  pointer-events: all;
  color: #4D573E !important;
  transition: all 0.2s;
  animation: none;
  &:hover {
    cursor: pointer;
    color: ${utils.lightenColor('#4D573E', 20)} !important;
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
                backgroundColor: '#4d573e',
              },
            }}>
              <li
                className={this.props.orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}
                onClick={this.show}>
                <Item href='#' className={'click-effect'}>
                  <span className='fa-stack click-effect'>
                    <i className='fa fa-square fa-stack-2x'></i>
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
                        backgroundColor: '#4d573e',
                      },
                    }}>
                      <li
                        className={this.props.orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}
                        id={name}
                        key={name}
                        onClick={onClick}>
                        <Item href='#' className={'click-effect'}>
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
                    backgroundColor: '#4d573e',
                  },
                }}>
                  <li
                    className={this.props.orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}
                    onClick={this.hide}>
                    <Item href='#' className={'click-effect'}>
                      <span className='fa-stack click-effect'>
                        <i className='fa fa-square fa-stack-2x'></i>
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
