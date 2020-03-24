/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: table;
  width: 293px;
  height: 97px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 0 auto;
  text-align: center;
  background: transparent url(../images/bg.png) no-repeat center center;
`;

const Message = styled.div`
  display: table-cell;
  vertical-align: middle;
  line-height: 27px;
  font-size: 24px;
  font-family: "Caudex";
  color: rgb(225, 225, 225);
`;

const Large = css`
  line-height: 37px;
  font-size: 34px;
`; 

interface AnnouncementProps {}

interface AnnouncementState {
  message: string;
}

class Announcement extends React.Component<AnnouncementProps, AnnouncementState> {

  private eventHandles: EventHandle[] = [];
  private timeout: number;

  public state = {
    message: '',
  };

  public render() {
    const messageClassName = this.state.message.length < 20 ? Large : '';
    let announcement: any;
    if (this.state.message) {
      announcement = (
        <Container>
          <Message className={messageClassName}>{this.state.message}</Message>
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
    this.setState({ message: '' });
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }

  private handleAnnouncement = (type: AnnouncementType, message: string) => {
    if ((type & AnnouncementType.PopUp) === 0) {
      return;
    }

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.setState({ message });
    this.timeout = window.setTimeout(() => {
      this.setState({ message: '' });
      this.timeout = null;
    }, 5000);
  }
}

export default Announcement;
