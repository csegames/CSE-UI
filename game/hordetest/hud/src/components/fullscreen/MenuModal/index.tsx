/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { LeftOptions } from './LeftOptions';
import { Social } from './Social';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;

  &.visible {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }
`;

export interface State {
  isVisible: boolean;
}

export class MenuModal extends React.Component<{}, State> {
  private evh: EventHandle[] = [];
  constructor(props: {}) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  public render() {
    return (
      <Container onClick={this.hide} className={this.state.isVisible ? 'visible' : ''}></Container>
    );
  }

  public componentDidMount() {
    this.evh.push(game.on('show-menu-modal', this.show));
    this.evh.push(game.on('hide-menu-modal', this.hide));
    this.evh.push(game.on('navigate', this.handleNavigate));
  }

  public componentWillUnmount() {
    this.evh.forEach(e => e.clear());
  }

  private handleNavigate = (name: string) => {
    if (name === 'gamemenu') {
      if (this.state.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  private show = () => {
    this.setState({ isVisible: true });

    const hideOverlay = true;
    game.trigger('show-left-modal', <LeftOptions />, hideOverlay);
    game.trigger('show-right-modal', <Social />, hideOverlay);
  }

  private hide = () => {
    this.setState({ isVisible: false });
    game.trigger('hide-left-modal');
    game.trigger('hide-right-modal');
  }
}
