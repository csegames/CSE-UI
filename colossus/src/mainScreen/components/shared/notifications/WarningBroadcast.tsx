/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { WarningBroadcastMessageData, NotificationsSeverity } from '../../../redux/notificationsSlice';
import { LifecyclePhase } from '../../../redux/navigationSlice';

const Container = 'Shared-WarningBroadcast-Container';
const Content = 'Shared-WarningBroadcast-Content';
const Countdown = 'Shared-WarningBroadcast-Countdown';
const Title = 'Shared-WarningBroadcast-Title';
const TitleCentered = 'Shared-WarningBroadcast-TitleCentered';
const Icon = 'Shared-WarningBroadcast-Icon';
const Bar = 'Shared-WarningBroadcast-Bar';

interface ReactProps {}

interface InjectedProps {
  warningBroadcastMessageData: WarningBroadcastMessageData;
  lifecyclePhase: LifecyclePhase;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AWarningBroadcast extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    // Do not render if not in-game
    if (this.props.lifecyclePhase !== LifecyclePhase.Playing) return null;
    // Do not render if no data
    if (!this.props.warningBroadcastMessageData) return null;
    const color = this.getColor();
    const backgroundColor = this.getBackgroundColor();
    return (
      <div className={Container} style={{ borderColor: color }}>
        <div className={Content}>
          {this.props.warningBroadcastMessageData.countdown && (
            <div className={Countdown} style={{ color, borderColor: color, backgroundColor }}>
              {this.props.warningBroadcastMessageData.countdown.current >
              this.props.warningBroadcastMessageData.countdown.max - 5
                ? '!'
                : this.props.warningBroadcastMessageData.countdown.current}
            </div>
          )}
          <div
            className={!this.props.warningBroadcastMessageData.countdown ? `${Title} ${TitleCentered}` : Title}
            style={{ color }}
          >
            {this.props.warningBroadcastMessageData.title}
          </div>
          {!this.props.warningBroadcastMessageData.countdown && <img className={Icon} src={this.getSRC()} />}
        </div>
        {this.props.warningBroadcastMessageData.countdown && (
          <div
            className={Bar}
            style={{
              backgroundColor: color,
              width: `${
                (100 * this.props.warningBroadcastMessageData.countdown.current) /
                this.props.warningBroadcastMessageData.countdown.max
              }%`
            }}
          />
        )}
      </div>
    );
  }

  private getSRC(): string {
    switch (this.props.warningBroadcastMessageData.severity) {
      case NotificationsSeverity.INFO:
        return 'images/alert-icons/info.png';
      case NotificationsSeverity.WARNING:
        return 'images/alert-icons/warning.png';
      case NotificationsSeverity.ERROR:
        return 'images/alert-icons/error.png';
    }
  }

  private getColor(): string {
    switch (this.props.warningBroadcastMessageData.severity) {
      case NotificationsSeverity.INFO:
        return 'rgb(99, 171, 255)';
      case NotificationsSeverity.WARNING:
        return 'rgb(255, 206, 81)';
      case NotificationsSeverity.ERROR:
        return 'rgb(255, 99, 99)';
    }
  }

  private getBackgroundColor(): string {
    switch (this.props.warningBroadcastMessageData.severity) {
      case NotificationsSeverity.INFO:
        return 'rgb(4, 27, 63)';
      case NotificationsSeverity.WARNING:
        return 'rgb(71, 25, 0)';
      case NotificationsSeverity.ERROR:
        return 'rgb(71, 0, 0)';
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { warningBroadcastMessageData } = state.notifications;
  const { lifecyclePhase } = state.navigation;
  return { ...ownProps, warningBroadcastMessageData, lifecyclePhase };
}

export const WarningBroadcast = connect(mapStateToProps)(AWarningBroadcast);
