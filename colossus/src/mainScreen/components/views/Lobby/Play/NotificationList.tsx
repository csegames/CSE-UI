/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from '../../../shared/Button';
import { NotificationData, NotificationAction, removeNotifications } from '../../../../redux/teamJoinSlice';
import { RootState } from '../../../../redux/store';
import { Dispatch } from 'redux';
import { formatDurationSeconds } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const NotificationListContainer = 'StartScreen-Play-NotificationList-NotificationListContainer';
const NotificationOuter = 'StartScreen-Play-NotificationList-NotificationOuter';
const NotificationDismissButton = 'StartScreen-Play-NotificationList-NotificationDismissButton';
const NotificationText = 'StartScreen-Play-NotificationList-NotificationText';

const NotificationActionsContainer = 'StartScreen-Play-NotificationList-NotificationActionsContainer';

type ButtonTypes = 'primary' | 'secondary' | 'blue' | 'blue-outline';

interface NotificationCellProps {
  message: NotificationData;
  stringTable: Dictionary<StringTableEntryDef>;
  onHide: (idx: number) => void;
}

class NotificationCell extends React.Component<NotificationCellProps, {}> {
  constructor(props: NotificationCellProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    const extraClasses: string = this.props.message.debugMessage ? 'debug-notification' : '';

    return (
      <div className={`${NotificationOuter} ${extraClasses}`}>
        <button className={`${NotificationDismissButton} dismiss-button`} onClick={this.onDismiss.bind(this)}>
          <span className='icon-close' />
        </button>
        <div className={NotificationText}>
          {this.props.message.createText(this.props.stringTable)}
          <div dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
          {this.renderExpiryText()}
        </div>
        {this.getActions()}
      </div>
    );
  }

  private renderExpiryText(): string {
    if (this.props.message.actions === undefined || this.props.message.actions.length === 0) {
      return null;
    }

    const msRemaining: number = this.props.message.expiryTimestamp - Date.now();
    const sRemaining = Math.max(Math.ceil(msRemaining / 1000), 1);
    return `(${formatDurationSeconds(sRemaining)})`;
  }

  private actionTypeToButtonType(actionType: 'accept' | 'decline' | 'other'): ButtonTypes {
    // valid button types: 'primary' | 'secondary' | 'blue' | 'gray'
    if (actionType == 'accept') {
      return 'primary';
    } else if (actionType == 'decline') {
      return 'blue';
    } else if (actionType == 'other') {
      return 'blue-outline';
    }

    // fallback, but shouldn't ever happen
    console.warn('Unexpected Action Type For Button in Notification List');
    return 'secondary';
  }

  private getActions(): JSX.Element {
    if (this.props.message.actions === undefined || this.props.message.actions.length === 0) {
      return null;
    }

    let actions: JSX.Element[] = [];
    for (let i = 0; i < this.props.message.actions.length; i++) {
      const action: NotificationAction = this.props.message.actions[i];
      const actionIdx: number = i;
      actions.push(
        <Button
          type={this.actionTypeToButtonType(action.type)}
          text={action.createText(this.props.stringTable)}
          onClick={() => {
            this.onClickAction(actionIdx);
          }}
          disabled={action.disabled}
        />
      );
    }

    return <div className={NotificationActionsContainer}>{actions}</div>;
  }

  private onClickAction(actionIdx: number) {
    let message: NotificationData = this.props.message;
    if (!message.actions || !(actionIdx in message.actions)) {
      return;
    }

    const action: NotificationAction = message.actions[actionIdx];

    if (action.onClick) {
      action.onClick();
    }

    // default to true if not specified
    if (action.hideAfterClick === undefined || action.hideAfterClick === true) {
      this.props.onHide(message.id);
    }
  }

  private onDismiss() {
    this.props.onHide(this.props.message.id);
  }
}

interface ReactProps {
  dispatch?: Dispatch;
}

interface InjectedProps {
  currentNotifications: NotificationData[];
  stringTable: Dictionary<StringTableEntryDef>;
}

interface State {
  tickCounter: number;
}

type Props = ReactProps & InjectedProps;

class ANotificationList extends React.Component<Props, State> {
  private tickInterval: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      tickCounter: 0
    };
    this.tickInterval = null;
  }

  public render(): JSX.Element {
    return <div className={NotificationListContainer}>{this.getMessages()}</div>;
  }

  private getMessages(): JSX.Element[] {
    let result: JSX.Element[] = [];

    // add messages _with_ actions first to pin them to the top
    for (let msg of this.props.currentNotifications) {
      if (msg.actions && msg.actions.length > 0) {
        result.push(
          <NotificationCell
            message={msg}
            onHide={this.onHideNotification.bind(this)}
            stringTable={this.props.stringTable}
          />
        );
      }
    }

    // all messages _without_ actions go after the messages with actions
    for (let msg of this.props.currentNotifications) {
      if (!msg.actions || msg.actions.length == 0) {
        result.push(
          <NotificationCell
            message={msg}
            onHide={this.onHideNotification.bind(this)}
            stringTable={this.props.stringTable}
          />
        );
      }
    }

    return result;
  }

  componentDidMount() {
    this.updateMessages();
  }

  componentDidUpdate() {
    this.updateMessages();
  }

  updateMessages() {
    // Remove any notifications FROM Redux that have expired.
    const messageIdsToPrune: number[] = [];
    for (let msg of this.props.currentNotifications) {
      if (
        !this.props.currentNotifications.find((notif) => {
          return notif.id === msg.id && msg.expiryTimestamp > Date.now();
        })
      ) {
        messageIdsToPrune.push(msg.id);
      }
    }

    if (this.props.currentNotifications.length === 0 && this.tickInterval !== null) {
      // Stop the tick.
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    } else if (this.props.currentNotifications.length > 0 && this.tickInterval === null) {
      // Start the tick.
      this.tickInterval = window.setInterval(() => {
        this.setState({ tickCounter: this.state.tickCounter + 1 });
      }, 1000);
    }

    // At worst, this should trigger a single re-render.
    if (messageIdsToPrune.length > 0) {
      this.props.dispatch(removeNotifications(messageIdsToPrune));
    }
  }

  private onHideNotification(messageId: number) {
    this.props.dispatch(removeNotifications([messageId]));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  return {
    ...ownProps,
    currentNotifications: state.teamJoin.notifications,
    stringTable: state.stringTable.stringTable
  };
}

export const NotificationList = connect(mapStateToProps)(ANotificationList);
