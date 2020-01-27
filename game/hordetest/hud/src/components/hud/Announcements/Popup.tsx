/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { CSSTransitionGroup } from 'react-transition-group';

const Container = styled.div`
  position: relative;
  font-size: 30px;
  padding: 10px;
  color: white;
  font-family: Colus;
  text-align: center;
  text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.83), 15px 0px 15px rgba(0, 0, 0, 0.84), -15px 0px 15px rgba(0, 0, 0, 0.74), 1px 0px 14px rgba(0, 0, 0, 0.73), 1px 0px 14px rgba(0, 0, 0, 0.76);
  background: linear-gradient(to right, transparent 10%, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8), transparent 90%);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent 1%, white, transparent 99%);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent 1%, white, transparent 99%);
  }
`;

export interface Props {
}

export interface State {
  message: string;
}

export class PopupAnnouncement extends React.Component<Props, State> {
  private eventHandles: EventHandle[] = [];
  private timeouts: NodeJS.Timer[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  public render() {
    let announcement: any;
    if (this.state.message) {
      announcement = (
        <Container key={this.state.message}>
          {this.state.message}
        </Container>
      );
    }

    return (
      <CSSTransitionGroup transitionName='announcement' transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {announcement}
      </CSSTransitionGroup>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.onAnnouncement(this.handleAnnouncement));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

  private handleAnnouncement = (type: AnnouncementType, message: string) => {
    if ((type & AnnouncementType.PopUp) === 0) {
      return;
    }

    this.setState({ message });

    this.timeouts.push(setTimeout(() => {
      this.setState({ message: '' });
    }, 7000));
  }
}
