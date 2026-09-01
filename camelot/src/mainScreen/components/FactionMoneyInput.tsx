/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { FactionBorder, BorderType, BorderBackground } from './FactionBorder';
import TooltipSource from './TooltipSource';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import GoldCoinURL from '../../images/icons/coin-gold.png';

const Root = 'HUD-FactionMoneyInput-Root';
const Border = 'HUD-FactionMoneyInput-Border';
const TextInput = 'HUD-FactionMoneyInput-TextInput';
const CoinIcon = 'HUD-FactionMoneyInput-CoinIcon';

interface State {
  amountString: string;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  onAmountChanged: (newAmount: number) => void;
  factionIDOverride?: string;
  disabled?: boolean;
  disabledTooltip?: string;
  continuousUpdate?: boolean;
  forceUpdate?: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionMoneyInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { amountString: props.amount.toFixed(0) };
  }

  render(): JSX.Element {
    const {
      amount,
      onAmountChanged,
      uiFactionID,
      factionIDOverride,
      disabled,
      disabledTooltip,
      dispatch,
      className,
      continuousUpdate,
      forceUpdate,
      ...otherProps
    } = this.props;

    return (
      <TooltipSource
        {...otherProps}
        className={`${Root} ${className} ${disabled ? 'disabled' : ''}`}
        tooltipID='DisabledFactionMoneyInput'
        active={this.props.disabledTooltip && this.props.disabled}
        content={() => this.props.disabledTooltip}
        positionType='mouse'
      >
        <FactionBorder
          className={Border}
          factionIDOverride={factionIDOverride}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
        >
          <input
            className={TextInput}
            type='text'
            value={this.state.amountString}
            onChange={this.handleAmountStringChange.bind(this)}
            onBlur={this.handleDoneEditing.bind(this)}
            disabled={disabled}
          />
          <img className={CoinIcon} src={GoldCoinURL} />
        </FactionBorder>
      </TooltipSource>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.forceUpdate && this.props.amount !== prevProps.amount) {
      this.setState({ amountString: this.props.amount.toFixed(0) });
    }
  }

  private handleAmountStringChange(e: Event): void {
    const target = e.target as HTMLInputElement;

    // Enforces digits only (or empty string);
    const amountString = target.value.replace(/\D/g, '');

    if (this.props.continuousUpdate && amountString !== this.state.amountString) {
      this.props.onAmountChanged(+amountString);
    }

    this.setState({ amountString });
  }

  private handleDoneEditing(): void {
    const newValue = +this.state.amountString;
    this.setState({ amountString: newValue.toFixed(0) });
    this.props.onAmountChanged(newValue);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionMoneyInput = connect(mapStateToProps)(AFactionMoneyInput);
