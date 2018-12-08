/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import className from 'classnames';
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
  .glow & {
    i {
      font-size: 16px;
      color: #e0ca91;
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

const Badge = styled('div')`
  position: relative;
  z-index: 1;
  top: -25px;
  left: 5px;
  padding: 1px;
  width: 10px;
  height: 10px;
  line-height: 10px;
  text-align: center;
  border-radius: 5px;
  background-color: red;
  color: white;
  font-size: 10px;
`;

export interface HUDNavItemState {
  glow?: boolean;
  badge?: number;
}

export interface HUDNavBadgeEventArg extends HUDNavItemState {
  id: string;
}

export interface Props {
  orientation: utils.Orientation;
  name: string;
  tooltip: string;
  onClick: () => void;
  icon: JSX.Element;
  iconClass: string;
}

export interface State {
  glow: boolean;
  badge: number;
}

class HUDNavButton extends React.Component<Props, State> {
  private badgeEvents: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = { glow: false, badge: undefined };
  }

  public componentDidMount() {
    this.badgeEvents = game.on('hudnav--badge', (state: HUDNavBadgeEventArg) => {
      if (this.props.name === state.id) {
        this.setState(() => ({ glow: state.glow, badge: state.badge }));
      }
    });
  }

  public render() {
    const { orientation, onClick, name, icon, iconClass } = this.props;
    const { glow, badge } = this.state;
    const cls = [];
    if (orientation === utils.Orientation.HORIZONTAL) cls.push(ListHorizontal);
    if (glow) cls.push('glow');
    return (
      <li className={cls.join(' ')}>
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
        { badge ? <Badge>{badge}</Badge> : null }
      </li>
    );
  }

  public componentWillUnmount() {
    hideTooltip();
    game.off(this.badgeEvents);
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
