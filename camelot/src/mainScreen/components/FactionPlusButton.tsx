/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import TooltipSource from './TooltipSource';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

const Root = 'HUD-FactionPlusButton-Root';
const Background = 'HUD-FactionPlusButton-Background';
const Icon = 'HUD-FactionPlusButton-Icon';

const DEFAULT_SIZE_VMIN = 3;

interface State {
  id: string;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
  sizeOverrideVmin?: number;
  disabled?: boolean;
  disabledTooltip?: string;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionPlusButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { id: genID() };
  }

  render(): JSX.Element {
    const {
      sizeOverrideVmin,
      uiFactionID,
      factionIDOverride,
      onClick,
      disabled,
      disabledTooltip,
      dispatch,
      className,
      ...otherProps
    } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <TooltipSource
        {...otherProps}
        key={this.state.id}
        className={`${Root} ${className} ${disabled ? 'disabled' : ''}`}
        onClick={!disabled ? onClick : undefined}
        tooltipID={`DisabledFactionButton${this.state.id}`}
        active={this.props.disabledTooltip && disabled}
        positionType='mouse'
        style={this.buildRootStyle()}
        content={() => this.props.disabledTooltip}
      >
        <img className={Background} src={factionData.buttonSquareBackgroundImage} />
        <div className={Icon}>{'+'}</div>
      </TooltipSource>
    );
  }

  private buildRootStyle(): React.CSSProperties {
    const scale = this.props.sizeOverrideVmin ? this.props.sizeOverrideVmin / DEFAULT_SIZE_VMIN : 1;
    let rootStyle: React.CSSProperties = {};
    if (scale !== 1) {
      rootStyle = {
        width: `${DEFAULT_SIZE_VMIN * scale}vmin`,
        height: `${DEFAULT_SIZE_VMIN * scale}vmin`
      };
    }
    return rootStyle;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionPlusButton = connect(mapStateToProps)(AFactionPlusButton);
