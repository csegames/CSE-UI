/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import className from 'classnames';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/library/lib/_baseGame';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';

const Item = styled.a`
  pointer-events: all;
  color: #e0ddd3 !important;
  width: 26px;
  height: 26px;
  font-size: 14px !important;
  text-align: center;
  display: inline-block;
  text-shadow: 1px 1px 0px #242424;
  &:hover {
    color: #efefe6;
  }
  &.fontawesome {
    font-size: 10px !important;
  }
  .glow & {
    font-size: 16px;
    color: #e0ca91;
  }
`;

const ListHorizontal = css`
  float: left;
`;

const Tooltip = css`
`;

const Badge = styled.div`
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
    const { orientation, onClick, name, iconClass } = this.props;
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
          <Item href='#' className={iconClass.includes('fa') ? 'fontawesome' : ''}>
            {
              <i className={iconClass.includes('fa') ? className('fa', 'fa-lg', iconClass, 'click-effect') : iconClass}>
              </i>
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
