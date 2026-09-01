/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import IconAnnouncementOutageURL from '../../../images/announcement/icon-announcement-error.png';
import IconAnnouncementMaintenanceURL from '../../../images/announcement/icon-announcement-info.png';
import IconAnnouncementBroadcastURL from '../../../images/announcement/icon-announcement-warning.png';

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { CSETransition } from '../../../shared/components/CSETransition';
import { CountdownLabel } from '../CountdownLabel';
import {
  AnyBasicServerMessagePurpose,
  BasicServerMessage,
  ServerMessagePurpose,
  ServerMessagePurposePriority,
  setShowServerMessageList
} from '../../redux/notificationsSlice';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { timeStringToMs } from '@csegames/library/dist/_baseGame/utils/timeUtils';

// String IDs
const StringIDNotificationPurposePrefix = 'NotificationPurpose_';

// CSS classes
const Root = 'HUD-ServerMessages-Root';
const AnnouncementIcon = 'HUD-ServerMessages-AnnouncementIcon';
const AnnouncementWindow = 'HUD-ServerMessages-AnnouncementWindow';
const MessageRoot = 'HUD-ServerMessages-MessageRoot';
const TitleRow = 'HUD-ServerMessages-TitleRow';
const TitleLabel = 'HUD-ServerMessages-TitleLabel';
const Countdown = 'HUD-ServerMessages-Countdown';
const MessageLabel = 'HUD-ServerMessages-MessageLabel';
const SentDateLabel = 'HUD-ServerMessages-SentDateLabel';

interface ReactProps {
  isDragCopy: boolean;
  className?: string;
  openLeft?: boolean;
  openTop?: boolean;
}

interface InjectedProps {
  serverMessages: BasicServerMessage[];
  isMessageListOpen: boolean;
  hasUnseenMessages: boolean;
  stringTable: Record<string, StringTableEntryDef>;
  isSelectedWidget: boolean;
}

type Props = ReactProps & InjectedProps;

class AServerMessages extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    return this.props.serverMessages.length > 0 || this.props.isDragCopy || this.props.isSelectedWidget ? (
      <div className={`${Root} ${this.props.className ?? ''}`} onClick={this.toggleWindow.bind(this)}>
        <img
          className={`${AnnouncementIcon} ${this.props.hasUnseenMessages ? 'blink' : ''}`}
          src={this.getMostSevereIconURL()}
        />
        <CSETransition
          className={`${AnnouncementWindow} ${this.getLocationClass()}`}
          show={this.props.isMessageListOpen}
        >
          {this.getSortedMessages().map(this.renderMessage.bind(this))}
        </CSETransition>
      </div>
    ) : null;
  }

  private renderMessage(data: BasicServerMessage): React.ReactNode {
    const expiryTimestamp = new Date(data.displayTime).getTime() + timeStringToMs(data.displayDuration ?? '00:00:00');
    return (
      <div className={`${MessageRoot} ${data.purpose}`} key={data.sequenceID}>
        <div className={TitleRow}>
          <div className={`${TitleLabel} ${data.purpose}`}>
            {getStringTableValue(StringIDNotificationPurposePrefix + data.purpose, this.props.stringTable)}
          </div>
          <CountdownLabel className={`${Countdown} ${data.purpose}`} expiryTimestamp={expiryTimestamp} />
        </div>
        <div className={MessageLabel}>{data.content}</div>
        <div className={SentDateLabel}>{this.formatDateForServerMessage(new Date(data.displayTime))}</div>
      </div>
    );
  }

  private getSortedMessages(): BasicServerMessage[] {
    let messages = this.props.serverMessages.slice();
    messages.sort((a, b) => {
      return ServerMessagePurposePriority[b.purpose] - ServerMessagePurposePriority[a.purpose];
    });
    return messages;
  }

  private toggleWindow(): void {
    this.props.dispatch(setShowServerMessageList(!this.props.isMessageListOpen));
  }

  private getLocationClass(): string {
    if (this.props.openLeft) {
      return 'left';
    }
    if (this.props.openTop) {
      return 'top';
    }
    return 'left';
  }

  private getHighestSeverity(props?: Props): AnyBasicServerMessagePurpose {
    const serverMessages = props?.serverMessages ?? this.props.serverMessages;
    let mostSevere = ServerMessagePurpose.Maintenance;

    for (const message of serverMessages) {
      if (message.purpose === ServerMessagePurpose.Outage) {
        mostSevere = message.purpose;
        // Unplanned outage is the worst, so if we find one, we don't have to check any others.
        break;
      }

      if (message.purpose === ServerMessagePurpose.Broadcast) {
        mostSevere = message.purpose;
      }
    }

    return mostSevere;
  }

  private severityIcons: Record<AnyBasicServerMessagePurpose, string> = {
    [ServerMessagePurpose.Outage]: IconAnnouncementOutageURL,
    [ServerMessagePurpose.Maintenance]: IconAnnouncementMaintenanceURL,
    [ServerMessagePurpose.Broadcast]: IconAnnouncementBroadcastURL
  };
  private getMostSevereIconURL(props?: Props): string {
    if (this.props.isSelectedWidget) {
      return this.severityIcons[ServerMessagePurpose.Outage];
    }
    return this.severityIcons[this.getHighestSeverity(props)];
  }

  private formatDateForServerMessage(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    return date.toLocaleString(undefined, options);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    serverMessages: state.notifications.serverMessages,
    isMessageListOpen: state.notifications.isMessageListOpen,
    hasUnseenMessages: state.notifications.hasUnseenMessages,
    stringTable: state.stringTable.stringTable,
    isSelectedWidget: state.hud.editor.selectedWidgetID === WIDGET_ID_SERVERMESSAGES
  };
};

export const ServerMessages = connect(mapStateToProps)(AServerMessages);

export const WIDGET_ID_SERVERMESSAGES = 'Server Messages';
export const serverMessagesRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_SERVERMESSAGES,
  nameStringID: 'HUDEditorWidgetNameServerMessages',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 2.5,
    yOffset: 25
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  layerOffset: 1,
  render: (isDragCopy: boolean) => {
    return <ServerMessages isDragCopy={isDragCopy} openLeft />;
  }
};
