/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-image: url(../images/fullscreen/settings/modal-middle.png);
  background-size: 100% 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

export interface Props {
}

export interface State {
  isVisible:boolean;
  content:any;
  overlayCloseDisabled:boolean;
}

export class MiddleModal extends React.Component<Props, State> {
  private showHandle: EventHandle;
  private hideHandle: EventHandle;

  constructor(props: Props) {
    super(props)

    this.state = {
      isVisible: false,
      content: null,
      overlayCloseDisabled: false
    }
  }

  public componentDidMount() {
    this.showHandle = game.on('show-middle-modal', this.showModal);
    this.hideHandle = game.on('hide-middle-modal', this.hideModal);
  }

  public componentWillUnmount() {
    this.showHandle.clear();
    this.hideHandle.clear();
  }

  private showModal = (content: React.ReactChildren, isError:boolean, disableOverlayClose: boolean = false) => {
    if (game.isConnectedToServer && isError) {
      console.error("Tried to open the middle modal while in a game!");
      return;
    }
    console.log(`Showing middle modal ${this.state.isVisible}`);
    this.setState({content, overlayCloseDisabled: disableOverlayClose, isVisible: true }, () => {
      console.log(`Done setting up middle modal to show ${this.state.isVisible}`);
    });
  }

  private hideModal = () => {
    console.log("Middle model hiding");
    this.setState({content: null, overlayCloseDisabled: false, isVisible: false });
  }

  private onClickOverlay = () => {
    console.log(`Middle overlay clicked: Can Close? ${this.state.overlayCloseDisabled}`)
    if (!this.state.overlayCloseDisabled) return;
    this.hideModal();
  }

  public render() {
    return (
      <MiddleModalComponent isVisible={this.state.isVisible} onClickOverlay={this.onClickOverlay}>
        {this.state.content}
      </MiddleModalComponent>
    );
  }
}

export interface ComponentProps {
  isVisible: boolean;
  onClickOverlay: () => void;
}

export class MiddleModalComponent extends React.Component<ComponentProps> {
  public render() {
    const visibilityClassName = this.props.isVisible ? 'visible' : '';
    return (
      <>
        <Overlay className={visibilityClassName} onClick={this.props.onClickOverlay} />
        <Container className={visibilityClassName}>
          {this.props.children}
        </Container>
      </>
    );
  }
}
