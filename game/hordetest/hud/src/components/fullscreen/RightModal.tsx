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
  right: -35%;
  width: 35%;
  height: 100%;
  background-image: url(../images/fullscreen/startscreen/champion-profile/modal-right-bg.png);
  background-size: cover;
  transition: right 0.2s;

  &.visible {
    right: 0;
  }
`;

const ScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export interface Props {
}

export interface State {
  isVisible: boolean;
  content: JSX.Element | JSX.Element[];
}

export class RightModal extends React.Component<Props, State> {
  private showHandle: EventHandle;
  private hideHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      content: null,
    };
  }

  public render() {
    const visibleClass = this.state.isVisible ? 'visible' : '';
    return (
      <>
        <ScreenOverlay className={visibleClass} onClick={this.hide} />
        <Container className={visibleClass}>
          <ContentContainer>
            {this.state.content}
          </ContentContainer>
        </Container>
      </>
    );
  }

  public componentDidMount() {
    this.showHandle = game.on('show-right-modal', this.show);
    this.hideHandle = game.on('hide-right-modal', this.hide);
  }

  public componentWillUnmount() {
    this.showHandle.clear();
    this.hideHandle.clear();

    this.showHandle = null;
    this.hideHandle = null;
  }

  private show = (content: JSX.Element | JSX.Element[]) => {
    this.setState({ isVisible: true, content });
  }

  private hide = () => {
    this.setState({ isVisible: false, content: null });
  }
}
