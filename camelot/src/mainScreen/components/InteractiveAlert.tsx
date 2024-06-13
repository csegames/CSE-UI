/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { InteractiveAlert as IInteractiveAlert, hideInteractiveAlert } from '../redux/alertsSlice';
import {
  AlertCategory,
  GroupAlert,
  ProgressionAlert,
  TradeAlert
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Button } from './Button';
import { GroupsAPI } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { game } from '@csegames/library/dist/_baseGame';
import { webConf } from '../redux/networkConfiguration';

const Root = 'HUD-InteractiveAlert-Root';
const Top = 'HUD-InteractiveAlert-Top';
const Bottom = 'HUD-InteractiveAlert-Bottom';
const BottomButton = 'HUD-InteractiveAlert-BottomButton';

interface InteractiveAlertButton {
  text: string;
  onClick: () => void;
}

interface ReactProps {
  interactiveAlert: IInteractiveAlert;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInteractiveAlert extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        <span className={Top}>{this.getText()}</span>
        <div className={Bottom}>
          {this.getButtons().map((button, buttonIndex) => (
            <Button className={BottomButton} onClick={button.onClick} key={buttonIndex}>
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  getText(): string | null {
    const groupAlert: GroupAlert | null = this.getGroupAlert();
    if (groupAlert) {
      return `${groupAlert.fromName || 'Unknown'} has invited you to the ${groupAlert.kind.replace('Invite', '')}${
        groupAlert.forGroupName ?? ''
      }`;
    }
    const tradeAlert: TradeAlert | null = this.getTradeAlert();
    if (tradeAlert) {
      return `${tradeAlert.otherName || 'Unknown'} has invited you to a Trade`;
    }
    const progressionAlert: ProgressionAlert | null = this.getProgressionAlert();
    if (progressionAlert) {
      return 'A new progression report is available!  Would you like to view it now and collect your rewards?';
    }
    return null;
  }

  getButtons(): InteractiveAlertButton[] {
    const groupAlert: GroupAlert | null = this.getGroupAlert();
    if (groupAlert) {
      return [
        {
          text: `Join ${groupAlert.kind.replace('Invite', '')}`,
          onClick: this.joinGroup.bind(this)
        },
        {
          text: 'Decline',
          onClick: this.declineGroup.bind(this)
        }
      ];
    }
    const tradeAlert: TradeAlert | null = this.getTradeAlert();
    if (tradeAlert) {
      return [
        {
          text: 'Accept',
          onClick: this.acceptTrade.bind(this)
        },
        {
          text: 'Decline',
          onClick: this.declineTrade.bind(this)
        }
      ];
    }
    const progressionAlert: ProgressionAlert | null = this.getProgressionAlert();
    if (progressionAlert) {
      return [
        {
          text: 'Yes',
          onClick: this.viewProgression.bind(this)
        },
        {
          text: 'No',
          onClick: this.dismissProgression.bind(this)
        }
      ];
    }
  }

  getGroupAlert(): GroupAlert | null {
    if (this.props.interactiveAlert.data.category === AlertCategory.Group) {
      return this.props.interactiveAlert.data as GroupAlert;
    }
    return null;
  }

  getTradeAlert(): TradeAlert | null {
    if (this.props.interactiveAlert.data.category === AlertCategory.Trade) {
      return this.props.interactiveAlert.data as TradeAlert;
    }
    return null;
  }

  getProgressionAlert(): ProgressionAlert | null {
    if (this.props.interactiveAlert.data.category === AlertCategory.Progression) {
      return this.props.interactiveAlert.data as ProgressionAlert;
    }
    return null;
  }

  joinGroup(): void {
    this.closeSelf();
    const groupAlert: GroupAlert = this.getGroupAlert();
    GroupsAPI.JoinV1(webConf, groupAlert.forGroup, groupAlert.code);
  }

  declineGroup(): void {
    this.closeSelf();
  }

  acceptTrade(): void {
    this.closeSelf();
    // TODO: Accept Trade
  }

  declineTrade(): void {
    this.closeSelf();
    // TODO: Decline trade
  }

  viewProgression(): void {
    this.closeSelf();
    game.sendSlashCommand('progressiondevui show --page DaySummary');
  }

  dismissProgression(): void {
    this.closeSelf();
  }

  closeSelf(): void {
    this.props.dispatch(hideInteractiveAlert(this.props.interactiveAlert.id));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const InteractiveAlert = connect(mapStateToProps)(AInteractiveAlert);
