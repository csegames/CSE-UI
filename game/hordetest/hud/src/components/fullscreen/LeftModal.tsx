/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: -25%;
  width: 25%;
  height: 100%;
  transition: left 0.2s;

  &.visible {
    left: 0;
  }
`;

const ScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

const ContentBackground = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url(../images/fullscreen/modal-right-bg.png);
    background-size: contain;
    transform: scaleX(-1);
    z-index: 0;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

export interface Props {
}

export interface State {
  isVisible: boolean;
  content: JSX.Element | JSX.Element[];
  hideOverlay: boolean;
}

export class LeftModal extends React.Component<Props, State> {
  private showHandle: EventHandle;
  private hideHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      content: null,
      hideOverlay: false,
    };
  }

  public render() {
    const visibleClass = this.state.isVisible ? 'visible' : '';
    return (
      <>
        {!this.state.hideOverlay && <ScreenOverlay className={visibleClass} onClick={this.hide} />}
        <Container className={visibleClass}>
          <ContentBackground>
            <ContentContainer>
              {this.state.content}
            </ContentContainer>
          </ContentBackground>
        </Container>
      </>
    );
  }

  public componentDidMount() {
    this.showHandle = game.on('show-left-modal', this.show);
    this.hideHandle = game.on('hide-left-modal', this.hide);
  }

  public componentWillUnmount() {
    this.showHandle.clear();
    this.hideHandle.clear();

    this.showHandle = null;
    this.hideHandle = null;
  }

  private show = (content: JSX.Element | JSX.Element[], hideOverlay?: boolean) => {
    this.setState({ isVisible: true, content, hideOverlay });
  }

  private hide = () => {
    this.setState({ isVisible: false, content: null, hideOverlay: false });
  }
}
