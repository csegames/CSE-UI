/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ItemActionDefGQL } from '@csegames/camelot-unchained/lib/graphql/schema';

declare const toastr: any;

const Button = styled('div')`
  background-color: ${(props: any) => props.disabled ? '#434343' : 'gray' };
  color: white;
  pointer-events: all;
  border-bottom: 1px solid #222;
  max-width: 300px;
  padding: 5px;
  cursor: ${(props: any) => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }

  &:active {
    box-shadow: inset 0 0 3px rgba(0,0,0,0.5);
  }
`;

export interface Props {
  name: string;
  onActionClick: (action?: ItemActionDefGQL) => void;
  syncWithServer: () => void;
  action?: ItemActionDefGQL;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
}

export interface State {
  secondsLeft: number;
}

class ContextMenuAction extends React.Component<Props, State> {
  private cooldownTimeout: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      secondsLeft: 0,
    };
  }

  public render() {
    const { secondsLeft } = this.state;
    const { name, action } = this.props;
    return (
      <Button disabled={secondsLeft > 0 || (action && !action.enabled)} onClick={this.onActionClick}>
        {name}&nbsp;{secondsLeft > 0 ? `${secondsLeft}s` : null}
      </Button>
    );
  }

  public componentDidMount() {
    this.initTimer();
  }

  public componentWillUnmount() {
    clearTimeout(this.cooldownTimeout);
  }

  private initTimer = () => {
    if (this.props.action && this.props.action.cooldownSeconds > 0) {
      const { lastTimePerformed, cooldownSeconds } = this.props.action;
      const now = Date.parse(new Date().toISOString());
      const elapsedTime = Number(Math.floor((now - Date.parse(lastTimePerformed)) / 1000).toFixed(0));
      if (cooldownSeconds - elapsedTime > 0) {
        this.startCooldown(cooldownSeconds - elapsedTime);
      }
    }
  }

  private onActionClick = () => {
    const { action } = this.props;
    if (action) {
      if (!action.enabled || this.state.secondsLeft > 0) {
        // Handle disabled action button
        toastr.error('That action is currently disabled', 'Oh no!!', { timeout: 3000 });
      } else {
        if (action.cooldownSeconds) {
          this.startCooldown(action.cooldownSeconds);
        }
        this.props.onActionClick(action);
      }
    } else {
      this.props.onActionClick();
    }
  }

  private startCooldown = (cooldownLeft: number) => {
    this.cooldownTimeout = setTimeout(() => this.updateCooldownSeconds(cooldownLeft), 1000);
  }

  private updateCooldownSeconds = (cooldownLeft: number) => {
    const nextCooldownLeft = cooldownLeft - 1;
    this.setState({ secondsLeft: nextCooldownLeft });

    // Recursively run the update to cooldown seconds with cooldownLeft
    if (nextCooldownLeft > 0) {
      this.cooldownTimeout = setTimeout(() => this.updateCooldownSeconds(nextCooldownLeft), 1000);
    } else {
      this.clearCooldownTimeout();
    }
  }

  private clearCooldownTimeout = () => {
    clearTimeout(this.cooldownTimeout);
    this.cooldownTimeout = null;
  }
}

export default ContextMenuAction;
