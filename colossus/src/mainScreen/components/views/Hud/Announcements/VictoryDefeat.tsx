/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { AnnouncementType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { game } from '@csegames/library/dist/_baseGame';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

const Container = 'Announcements-VictoryDefeat-Container';
const Message = 'Announcements-VictoryDefeat-Message';
const TransitionName = 'victory-defeat-announcement';
const TransitionEnterSeconds = 0.25;
const TransitionLeaveSeconds = 0.25;

const TransitionStyles = `
.${TransitionName}-enter {
  opacity: 0.01;
}

.${TransitionName}-enter.${TransitionName}-enter-active {
  opacity: 1.0;
  transition: opacity ${TransitionEnterSeconds}s ease-in;
}

.${TransitionName}-leave {
  opacity: 1.0;
}

.${TransitionName}-leave.${TransitionName}-leave-active {
  opacity: 0.01;
  transition: opacity ${TransitionLeaveSeconds}s ease-in;
}
`;

export interface Props {}

export interface State {
  type: AnnouncementType;
  message: string;
}

export class VictoryDefeatAnnouncement extends React.Component<Props, State> {
  private announcementEvent: ListenerHandle;
  private clearMessageTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      type: AnnouncementType.Victory,
      message: ''
    };
  }

  public render() {
    let announcement: JSX.Element = null;
    if (this.state.message) {
      if (this.state.type === AnnouncementType.Victory) {
        announcement = (
          <div className={`${Container} victory`} key={this.state.message}>
            <div className={`${Message} victory`}>{this.state.message}</div>
          </div>
        );
      } else if (this.state.type === AnnouncementType.Defeat) {
        announcement = (
          <div className={`${Container} defeat`} key={this.state.message}>
            <div className={`${Message} defeat`}>{this.state.message}</div>
          </div>
        );
      }
    }

    return (
      <CSSTransitionGroup
        transitionName={TransitionName}
        transitionEnterTimeout={TransitionEnterSeconds * 1000}
        transitionLeaveTimeout={TransitionLeaveSeconds * 1000}
      >
        {announcement}
        <style dangerouslySetInnerHTML={{ __html: TransitionStyles }} />
      </CSSTransitionGroup>
    );
  }

  public componentDidMount() {
    this.announcementEvent = clientAPI.bindAnnouncementListener(this.handleAnnouncement.bind(this));
  }

  public componentWillUnmount() {
    this.announcementEvent.close();
    window.clearTimeout(this.clearMessageTimeout);
  }

  private handleAnnouncement = (
    type: AnnouncementType,
    message: string,
    title: string,
    iconPath: string,
    soundID: number
  ) => {
    if ((type & AnnouncementType.Victory) !== 0) {
      this.setState({ type: AnnouncementType.Victory, message: message });
    } else if ((type & AnnouncementType.Defeat) !== 0) {
      this.setState({ type: AnnouncementType.Defeat, message: message });
    } else {
      return;
    }

    if (soundID !== 0) {
      game.playGameSound(soundID);
    }

    window.clearTimeout(this.clearMessageTimeout);
    this.clearMessageTimeout = window.setTimeout(() => {
      this.setState({ message: '' });
    }, 7000);
  };
}
