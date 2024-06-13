/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { NotificationsMessageData, NotificationsMessageSeverity } from '../../../redux/notificationsSlice';

const Container = 'Shared-Notifications-Container';
const Messages = 'Shared-Notifications-Messages';
const Message = 'Shared-Notifications-Message';
const Title = 'Shared-Notifications-Title';
const Body = 'Shared-Notifications-Body';
const Time = 'Shared-Notifications-Time';
const Icon = 'Shared-Notifications-Icon';

const severityValues: Record<NotificationsMessageSeverity, number> = {
  [NotificationsMessageSeverity.INFO]: 0,
  [NotificationsMessageSeverity.WARNING]: 1,
  [NotificationsMessageSeverity.ERROR]: 2
};

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {}

interface InjectedProps {
  notificationsMessagesData: NotificationsMessageData[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
}

class ANotifications extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  public render() {
    if (this.props.notificationsMessagesData.length === 0) return null;
    return (
      <div
        className={Container}
        onMouseEnter={() => {
          this.setState({ isOpen: true });
        }}
        onMouseLeave={() => {
          this.setState({ isOpen: false });
        }}
      >
        {this.state.isOpen && (
          <div className={Messages}>
            {this.props.notificationsMessagesData.map(({ title, body, severity, time }) => {
              const color = this.getColor(severity);
              return (
                <div
                  className={Message}
                  style={{ borderColor: color, margin: this.props.notificationsMessagesData.length > 1 ? 4 : 0 }}
                >
                  <div className={Title} style={{ color }}>
                    {title}
                  </div>
                  <div className={Body}>{body}</div>
                  <div className={Time}>{time}</div>
                </div>
              );
            })}
          </div>
        )}
        <img className={Icon} src={this.getSRC()} />
      </div>
    );
  }

  private getSRC(): string {
    switch (this.getTopSeverity()) {
      case NotificationsMessageSeverity.INFO:
        return 'images/alert-icons/info.png';
      case NotificationsMessageSeverity.WARNING:
        return 'images/alert-icons/warning.png';
      case NotificationsMessageSeverity.ERROR:
        return 'images/alert-icons/error.png';
    }
  }

  private getTopSeverity(): NotificationsMessageSeverity {
    let topSeverity: NotificationsMessageSeverity = NotificationsMessageSeverity.INFO;
    for (const { severity } of this.props.notificationsMessagesData) {
      if (severityValues[severity] > severityValues[topSeverity]) {
        topSeverity = severity;
      }
    }
    return topSeverity;
  }

  private getColor(severity: NotificationsMessageSeverity): string {
    switch (severity) {
      case NotificationsMessageSeverity.INFO:
        return 'rgb(99, 171, 255)';
      case NotificationsMessageSeverity.WARNING:
        return 'rgb(255, 206, 81)';
      case NotificationsMessageSeverity.ERROR:
        return 'rgb(255, 99, 99)';
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { notificationsMessagesData } = state.notifications;
  return { ...ownProps, notificationsMessagesData };
}

export const Notifications = connect(mapStateToProps)(ANotifications);
