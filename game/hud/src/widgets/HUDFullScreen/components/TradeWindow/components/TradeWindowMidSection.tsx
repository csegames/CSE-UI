/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client, webAPI } from '@csegames/camelot-unchained';
import { SecureTradeState } from '@csegames/camelot-unchained/lib/graphql/schema';
import TradeActionButton from './TradeActionButton';
import { tradeActionButtonIcons } from '../../../lib/constants';

declare const toastr: any;

const MidSection = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  height: 100px;
  padding: 0 30px;
  background: url(images/trade/trade-texture-bg.png), url(images/inventory/bag-bg.png);
  background-size: cover;
`;

const InstructionsContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const InstructionsText = styled('div')`
  color: #976E4C;
  font-size: 14px;
  font-family: Caudex;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: bold;
`;

const ActionButtonsContainer = styled('div')`
  display: flex;
`;

interface ActionButtonInfo {
  text: string;
  icon: string;
  disabled: boolean;
  onClick: () => void;
}

export interface TradeWindowMidSectionProps {
  myTradeState: SecureTradeState;
  theirTradeState: SecureTradeState;
  onMyTradeStateChanged: (newTradeState: SecureTradeState) => void;
  onTheirTradeStateChanged: (newTradeState: SecureTradeState) => void;
}

export interface TradeWindowMidSectionState {
  timer: number;

  // Give time for UI timer and server time to sync
  temporarilyDisabled: boolean;
}

class TradeWindowMidSection extends React.Component<TradeWindowMidSectionProps, TradeWindowMidSectionState> {
  private confirmTimer: any;
  private temporarilyDisabled: any;
  constructor(props: TradeWindowMidSectionProps) {
    super(props);
    this.state = {
      timer: 0,
      temporarilyDisabled: false,
    };
  }
  public render() {
    const { lock, accept } = this.getActionButtonInfo();
    return (
      <MidSection>
        <InstructionsContainer>
          <InstructionsText>1.&nbsp;&nbsp;Lock in your offer</InstructionsText>
          <InstructionsText>2.&nbsp;&nbsp;Review items</InstructionsText>
          <InstructionsText>3.&nbsp;&nbsp;Accept trade</InstructionsText>
        </InstructionsContainer>
        <ActionButtonsContainer>
          <TradeActionButton
            disabled={this.state.temporarilyDisabled || lock.disabled}
            text={lock.text}
            backgroundImg={lock.icon}
            onClick={lock.onClick}
          />
          <TradeActionButton
            disabled={this.state.temporarilyDisabled || accept.disabled}
            text={this.state.timer ? this.state.timer.toString() : accept.text}
            backgroundImg={accept.icon}
            onClick={accept.onClick}
          />
        </ActionButtonsContainer>
      </MidSection>
    );
  }

  public componentDidUpdate(prevProps: TradeWindowMidSectionProps) {
    if (this.props.myTradeState === 'Locked' && this.props.theirTradeState === 'Locked') {
      if (prevProps.myTradeState === 'ModifyingItems' || prevProps.theirTradeState === 'ModifyingItems' ||
          prevProps.myTradeState === 'Confirmed' || prevProps.theirTradeState === 'Confirmed') {
        this.startConfirmTimer();
      }
    }
    if (this.state.timer > 0 &&
        (this.props.myTradeState === 'ModifyingItems' || this.props.theirTradeState === 'ModifyingItems')) {
      this.clearConfirmTimer();
    }
  }

  public componentWillUnmount() {
    if (this.temporarilyDisabled) {
      clearTimeout(this.temporarilyDisabled);
      this.temporarilyDisabled = null;
    }
  }

  private startConfirmTimer = () => {
    if (this.state.timer === 0) {
      this.setState({ timer: 5 });
    }
    this.confirmTimer = setTimeout(() => {
      if (this.state.timer - 1 > 0) {
        this.setState({ timer: this.state.timer - 1 });
        this.startConfirmTimer();
      } else {
        this.setState({ timer: 0, temporarilyDisabled: true });
        this.temporarilyDisabled = setTimeout(() => this.setState({ temporarilyDisabled: false }), 500);
      }
    }, 1000);
  }

  private clearConfirmTimer = () => {
    if (this.confirmTimer) {
      clearTimeout(this.confirmTimer);
      this.confirmTimer = null;
    }

    if (this.state.timer > 0) {
      this.setState({ timer: 0 });
    }
  }

  private onLockClick = async () => {
    try {
      const res = await webAPI.SecureTradeAPI.Lock(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
      );
      if (res.ok) {
        // Handle successful Lock
        this.props.onMyTradeStateChanged('Locked');
      } else {
        const parsedResData = webAPI.parseResponseData(res).data;
        toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
      }
    } catch (err) {
      toastr.error('There was an error!', 'Oh no!!', { timeout: 2500 });
    }
  }

  private onUnlockClick = async () => {
    try {
      const res = await webAPI.SecureTradeAPI.Unlock(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
      );
      if (res.ok) {
        // Handle successful Unlock
        this.props.onMyTradeStateChanged('ModifyingItems');
        if (this.props.theirTradeState === 'Confirmed') {
          this.props.onTheirTradeStateChanged('Locked');
        }
      } else {
        const parsedResData = webAPI.parseResponseData(res).data;
        toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
      }
    } catch (err) {
      toastr.error('There was an error!', 'Oh no!!', { timeout: 2500 });
    }
  }

  private onAcceptClick = async () => {
    try {
      const res = await webAPI.SecureTradeAPI.Confirm(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
      );
      if (res.ok) {
        // Handle successful Confirm
        this.props.onMyTradeStateChanged('Confirmed');
      } else {
        const parsedResData = webAPI.parseResponseData(res).data;
        toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
      }
    } catch (err) {
      toastr.error('There was an error!', 'Oh no!!', { timeout: 2500 });
    }
  }

  private onCancelClick = async () => {
    try {
      const res = await webAPI.SecureTradeAPI.CancelTradeConfirmation(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
      );
      if (res.ok) {
        // Handle successful Cancel Confirmation
        this.props.onMyTradeStateChanged('Locked');
      } else {
        const parsedResData = webAPI.parseResponseData(res).data;
        toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
      }
    } catch (err) {
      toastr.error('There was an error!', 'Oh no!!', { timeout: 2500 });
    }
  }

  private getActionButtonInfo = (): { lock: ActionButtonInfo, accept: ActionButtonInfo } => {
    const { myTradeState, theirTradeState } = this.props;
    if (myTradeState === 'Locked' && theirTradeState === 'ModifyingItems') {
      // You locked, they are still modifying
      return {
        lock: {
          text: 'Unlock',
          icon: tradeActionButtonIcons.UNLOCKED_BUTTON,
          disabled: false,
          onClick: this.onUnlockClick,
        },
        accept: {
          text: 'Accept',
          icon: tradeActionButtonIcons.GREY_BUTTON,
          disabled: true,
          onClick: () => {},
        },
      };
    }

    if ((myTradeState === 'Locked' && theirTradeState === 'Locked') ||
        (myTradeState === 'Locked' && theirTradeState === 'Confirmed')) {
      // You both locked or you are still locked and they confirmed
      return {
        lock: {
          text: 'Unlock',
          icon: tradeActionButtonIcons.UNLOCKED_BUTTON,
          disabled: false,
          onClick: this.onUnlockClick,
        },
        accept: {
          text: 'Accept',
          icon: this.state.timer === 0 ? tradeActionButtonIcons.GOLD_BUTTON : tradeActionButtonIcons.GREY_BUTTON,
          disabled: this.state.timer === 0 ? false : true,
          onClick: this.state.timer === 0 ? this.onAcceptClick : () => {},
        },
      };
    }

    if (myTradeState === 'Confirmed' && theirTradeState === 'Locked') {
      // You confirmed, they have not
      return {
        lock: {
          text: 'Locked',
          icon: tradeActionButtonIcons.PRESSED_BUTTON,
          disabled: true,
          onClick: () => {},
        },
        accept: {
          text: 'Cancel',
          icon: tradeActionButtonIcons.UNLOCKED_BUTTON,
          disabled: false,
          onClick: this.onCancelClick,
        },
      };
    }

    if (myTradeState === 'ModifyingItems') {
      return {
        lock: {
          text: 'Lock',
          icon: tradeActionButtonIcons.GOLD_BUTTON,
          disabled: false,
          onClick: this.onLockClick,
        },
        accept: {
          text: 'Accept',
          icon: tradeActionButtonIcons.GREY_BUTTON,
          disabled: true,
          onClick: () => {},
        },
      };
    }

    return {
      lock: {
        text: 'Lock',
        icon: tradeActionButtonIcons.PRESSED_BUTTON,
        disabled: true,
        onClick: () => {},
      },
      accept: {
        text: 'Accept',
        icon: tradeActionButtonIcons.PRESSED_BUTTON,
        disabled: true,
        onClick: () => {},
      },
    };
  }
}

export default TradeWindowMidSection;
