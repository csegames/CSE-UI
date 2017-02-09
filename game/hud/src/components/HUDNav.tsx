/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 11:28:54
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-16 18:31:38
 */

import * as React from 'react';
import { Map } from 'immutable';
import { events, Tooltip, utils } from 'camelot-unchained';
import * as className from 'classnames';
import { StyleSheet, css } from 'aphrodite';
import { merge } from 'lodash';

const defaultStyles: HUDNavStyle = {
  list: {
    margin: '0',
    padding: '0',
    listStyle: 'none',
  },

  listHorizontal: {
    float: 'left',
  },

  item: {
    pointerEvents: 'all',
    color: '#4d573e',
    transition: 'all 0.2s',
    animation: 'none',
    ':hover': {
      cursor: 'pointer',
      color: 'lighten(#4d573e, 20%)',
    }
  }
};

export interface HUDNavStyle {
  list: React.CSSProperties;
  listHorizontal: React.CSSProperties;
  item: React.CSSProperties;
}

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
  style?: Partial<HUDNavStyle>;
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

  show = () => {
    this.setState({
      collapsed: false,
    });
  }

  hide = () => {
    this.setState({
      collapsed: true,
    });
  }

  render() {
    const ss = StyleSheet.create(merge(defaultStyles, this.props.style || {}));
    const containerClass = this.props.containerClass || 'HUDNav';
    return (
      <ul className={css(ss.list)}>

        {
          this.state.collapsed ?
            (<Tooltip content='Show Quick Menu' styles={{
                tooltip: {
                  backgroundColor: '#4d573e',
                }
              }}>
              <li className={className({[css(ss.listHorizontal)]: this.props.orientation == utils.Orientation.HORIZONTAL})} onClick={this.show}>
                <a href='#' className={className(css(ss.item), 'click-effect')}>
                  <span className='fa-stack click-effect'>
                    <i className='fa fa-square fa-stack-2x'></i>
                    <i className='fa fa-bars fa-stack-1x fa-inverse'></i>
                  </span>
                </a>
              </li>
            </Tooltip>) :
            (
              <div>
                {this.props.items.map(({name, tooltip, onClick, icon, iconClass}) => {
                  return (
                    <Tooltip key={name} content={tooltip} styles={{
                        tooltip: {
                          backgroundColor: '#4d573e',
                        }
                      }}>
                      <li className={className({[css(ss.listHorizontal)]: this.props.orientation == utils.Orientation.HORIZONTAL})}
                          id={name}
                          key={name}
                          onClick={onClick}>
                        <a href='#' className={className(css(ss.item), 'click-effect')}>
                          {
                            typeof icon !== 'undefined' ? icon : <i className={className('fa', 'fa-lg', iconClass, 'click-effect')}></i>
                          }
                        </a>
                      </li>
                    </Tooltip>
                  );
                })}

                <Tooltip content='Collapse Quick Menu' styles={{
                    tooltip: {
                      backgroundColor: '#4d573e',
                    }
                  }}>
                  <li className={className({[css(ss.listHorizontal)]: this.props.orientation == utils.Orientation.HORIZONTAL})} onClick={this.hide}>
                    <a href='#' className={className(css(ss.item), 'click-effect')}>
                      <span className='fa-stack click-effect'>
                        <i className='fa fa-square fa-stack-2x'></i>
                        <i className='fa fa-caret-left fa-stack-1x fa-inverse'></i>
                      </span>
                    </a>
                  </li>
                </Tooltip>
              </div>
            )
        }
      </ul>
    );
  }
}

export default HUDNav;
