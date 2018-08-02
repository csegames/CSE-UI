/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as className from 'classnames';
import styled, { css } from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';

const Item = styled('a')`
  pointer-events: all;
  color: #e0ddd3 !important;
  width: 26px;
  height: 26px;
  text-align: center;
  display: inline-block;
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
    height: 26px;
    margin-top: 10px;
    margin-bottom: 5px;
    vertical-align: middle;
    i {
      color: #aba9a2;
      font-size: 14px;
    }
  }
`;

const ListHorizontal = css`
  float: left;
`;

const Tooltip = css`
  background-color: #020405;
  color: white;
  border: 1px solid #4A4A4A;
  padding: 2px 5px;
`;

export interface Props {
  orientation: utils.Orientation;
  name: string;
  tooltip: string;
  onClick: () => void;
  icon: JSX.Element;
  iconClass: string;
}

export interface State {
}

class HUDNavButton extends React.Component<Props, State> {
  public render() {
    const { orientation, onClick, name, icon, iconClass } = this.props;
    return (
      <li className={orientation === utils.Orientation.HORIZONTAL ? ListHorizontal : ''}>
        <div
          id={name}
          onClick={onClick}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}>
          <Item href='#'>
            {
              typeof icon !== 'undefined' ? icon :
                <i className={className('fa', 'fa-lg', iconClass, 'click-effect')}></i>
            }
          </Item>
        </div>
      </li>
    );
  }

  public componentWillUnmount() {
    hideTooltip();
  }

  private onMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
    const showPayload: ShowTooltipPayload = {
      content: this.props.tooltip,
      styles: { tooltip: Tooltip },
      event,
    };
    showTooltip(showPayload);
  }

  private onMouseLeave = () => {
    hideTooltip();
  }
}

export default HUDNavButton;
