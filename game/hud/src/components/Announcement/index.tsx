/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

interface AnnouncementProps {}

interface AnnouncementState {
  message: string;
}

class Announcement extends React.Component<AnnouncementProps, AnnouncementState> {

  private eventHandles: EventHandle[] = [];
  private timeouts: NodeJS.Timer[] = [];

  public state = {
    message: '',
  };

  public render() {
    const messageClassNames = 'message ' + (this.state.message.length < 20 ? 'large ' : '');
    let announcement: any;
    if (this.state.message) {
      announcement = (
        <div className='announcement' key={this.state.message}>
          <div className={messageClassNames}>{this.state.message}</div>
        </div>
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
    this.eventHandles.push(game.onAnnouncement((message: string) => {
      this.setState({ message });
      this.timeouts.push(setTimeout(() => {
        this.setState({ message: '' });
      }, 20000));
    }));
    this.setState({ message: '' });
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }
}

export default Announcement;
