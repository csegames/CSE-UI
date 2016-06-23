/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, core} from 'camelot-unchained';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class AnnouncementState {
  public message: string = '';
}

class AnnouncementProps {}

class Announcement extends React.Component<AnnouncementProps, AnnouncementState> {
  
  constructor(props: AnnouncementProps) {
    super(props);
  }
  
  onMessage = (eventData: any) => {
    let announcement = eventData as core.Announcement;
    if (announcement.type !== core.announcementType.POPUP) return;
    this.setState({message: announcement.message});
    setTimeout(() => {
      this.setState({message: ''});
    }, 20000);
  }
  
  componentWillMount() {
    events.on(events.handlesAnnouncements.topic, this.onMessage);
    this.setState({message: ''});
  }
  
  render() {
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
      <ReactCSSTransitionGroup transitionName='announcement' transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {announcement}
      </ReactCSSTransitionGroup>
    );
  }
};

events.on('init', () => {
  ReactDom.render(<Announcement/>, document.getElementById("cse-ui-announcement"));
});