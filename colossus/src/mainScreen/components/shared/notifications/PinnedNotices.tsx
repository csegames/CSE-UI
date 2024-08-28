/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { PinnedNoticeMessageData, NotificationsSeverity } from '../../../redux/notificationsSlice';

const Container = 'Shared-PinnedNotices-Container';
const Messages = 'Shared-PinnedNotices-Messages';
const Message = 'Shared-PinnedNotices-Message';
const Title = 'Shared-PinnedNotices-Title';
const Body = 'Shared-PinnedNotices-Body';
const Time = 'Shared-PinnedNotices-Time';
const Icon = 'Shared-PinnedNotices-Icon';

const severityValues: Record<NotificationsSeverity, number> = {
  [NotificationsSeverity.INFO]: 0,
  [NotificationsSeverity.WARNING]: 1,
  [NotificationsSeverity.ERROR]: 2
};

interface ReactProps {}

interface InjectedProps {
  pinnedNoticesMessagesData: PinnedNoticeMessageData[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
}

class APinnedNotices extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  public render() {
    if (this.props.pinnedNoticesMessagesData.length === 0) return null;
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
            {this.props.pinnedNoticesMessagesData.map(({ title, body, severity, time }) => {
              const color = this.getColor(severity);
              return (
                <div
                  className={Message}
                  style={{ borderColor: color, margin: this.props.pinnedNoticesMessagesData.length > 1 ? 4 : 0 }}
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
      case NotificationsSeverity.INFO:
        return 'images/alert-icons/info.png';
      case NotificationsSeverity.WARNING:
        return 'images/alert-icons/warning.png';
      case NotificationsSeverity.ERROR:
        return 'images/alert-icons/error.png';
    }
  }

  private getTopSeverity(): NotificationsSeverity {
    let topSeverity: NotificationsSeverity = NotificationsSeverity.INFO;
    for (const { severity } of this.props.pinnedNoticesMessagesData) {
      if (severityValues[severity] > severityValues[topSeverity]) {
        topSeverity = severity;
      }
    }
    return topSeverity;
  }

  private getColor(severity: NotificationsSeverity): string {
    switch (severity) {
      case NotificationsSeverity.INFO:
        return 'rgb(99, 171, 255)';
      case NotificationsSeverity.WARNING:
        return 'rgb(255, 206, 81)';
      case NotificationsSeverity.ERROR:
        return 'rgb(255, 99, 99)';
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { pinnedNoticesMessagesData } = state.notifications;
  return { ...ownProps, pinnedNoticesMessagesData };
}

export const PinnedNotices = connect(mapStateToProps)(APinnedNotices);
