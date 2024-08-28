/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { WarningBroadcastMessageData, NotificationsSeverity } from '../../redux/notificationsSlice';
import { MatchEndSequence, setMatchEnd } from '../../redux/matchSlice';
import { updateMutedAll } from '../../redux/voiceChatSlice';
import { refreshProfile } from '../../dataSources/profileNetworking';

const StringIDLeaveMatch = 'GeneralLeaveMatch';
const StringIDCountdownSingular = 'HUDWarningBroadcastCountdownSingular';
const StringIDCountdownPlural = 'HUDWarningBroadcastCountdownPlural';

const Container = 'WarningBroadcastModal-Container';
const Icon = 'WarningBroadcastModal-Icon';
const Title = 'WarningBroadcastModal-Title';
const Body = 'WarningBroadcastModal-Body';
const CloseButton = 'WarningBroadcastModal-CloseButton';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  warningBroadcastModalMessage: WarningBroadcastMessageData;
  matchID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  countdown?: number;
}

class AWarningBroadcastModal extends React.Component<Props, State> {
  private countdownInterval: number | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      countdown: this.props.warningBroadcastModalMessage.modalCountdownSeconds
    };
  }

  public render() {
    const color = this.getColor();
    return (
      <MiddleModalDisplay borderColorOverride={color} isVisible={true}>
        <div className={Container}>
          <img className={Icon} src={this.getSRC()} />
          <div className={Title} style={{ color }}>
            {this.props.warningBroadcastModalMessage.title}
          </div>
          {this.props.warningBroadcastModalMessage.modalCountdownSeconds && (
            <div className={Body}>
              {getTokenizedStringTableValue(
                this.state.countdown === 1 ? StringIDCountdownSingular : StringIDCountdownPlural,
                this.props.stringTable,
                {
                  COUNTDOWN: String(this.state.countdown)
                }
              )}
            </div>
          )}
          <Button
            type='blue'
            text={getStringTableValue(StringIDLeaveMatch, this.props.stringTable)}
            styles={CloseButton}
            onClick={this.goToLobby.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  public componentDidMount(): void {
    if (this.props.warningBroadcastModalMessage.modalCountdownSeconds) {
      this.countdownInterval = window.setInterval(() => {
        if (this.state.countdown > 0) {
          this.setState({ countdown: this.state.countdown - 1 });
        } else {
          this.goToLobby();
        }
      }, 1000);
    }
  }

  public componentWillUnmount(): void {
    if (this.countdownInterval) {
      window.clearInterval(this.countdownInterval);
    }
  }

  private getSRC(): string {
    switch (this.props.warningBroadcastModalMessage.severity) {
      case NotificationsSeverity.INFO:
        return 'images/alert-icons/info.png';
      case NotificationsSeverity.WARNING:
        return 'images/alert-icons/warning.png';
      case NotificationsSeverity.ERROR:
        return 'images/alert-icons/error.png';
    }
  }

  private getColor(): string {
    switch (this.props.warningBroadcastModalMessage.severity) {
      case NotificationsSeverity.INFO:
        return 'rgb(99, 171, 255)';
      case NotificationsSeverity.WARNING:
        return 'rgb(255, 206, 81)';
      case NotificationsSeverity.ERROR:
        return 'rgb(255, 99, 99)';
    }
  }

  private goToLobby(): void {
    refreshProfile();
    this.props.dispatch(updateMutedAll(false));
    this.props.dispatch(
      setMatchEnd({ matchID: this.props.matchID, sequence: MatchEndSequence.GotoLobby, refresh: true })
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { warningBroadcastModalMessage } = state.notifications;
  const matchID = state.match.currentRound?.roundID;
  return {
    ...ownProps,
    stringTable,
    warningBroadcastModalMessage,
    matchID
  };
}

export const WarningBroadcastModal = connect(mapStateToProps)(AWarningBroadcastModal);
