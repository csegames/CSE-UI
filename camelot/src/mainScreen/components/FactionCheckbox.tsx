/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

const Root = 'HUD-FactionCheckbox-Root';
const BoxRoot = 'HUD-FactionCheckbox-BoxRoot';
const Background = 'HUD-FactionCheckbox-Background';
const Check = 'HUD-FactionCheckbox-Check';
const LabelText = 'HUD-FactionCheckbox-LabelText';

const DEFAULT_SIZE_VMIN = 2.5;

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  isChecked: boolean;
  labelText?: string;
  heightOverrideVmin?: number;
  factionIDOverride?: string;
  onCheckedChanged?: (newIsChecked: boolean) => void;
  disabled?: boolean;
  soundEventClicked?: SoundEvents;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionCheckbox extends React.Component<Props> {
  render(): JSX.Element {
    const {
      onCheckedChanged,
      onClick,
      isChecked,
      disabled,
      dispatch,
      className,
      uiFactionID,
      factionIDOverride,
      style,
      labelText,
      soundEventClicked,
      ...otherProps
    } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div
        {...otherProps}
        className={`${Root} ${className} ${disabled ? 'disabled' : ''}`}
        onClick={
          !disabled
            ? (e) => {
                onCheckedChanged?.(!isChecked);
                onClick?.(e);
                if (soundEventClicked) {
                  clientAPI.playGameSound(soundEventClicked);
                }
              }
            : undefined
        }
        style={this.buildRootStyle()}
      >
        <div className={BoxRoot} style={this.buildBoxRootStyle()}>
          <img className={Background} src={factionData.checkboxBackgroundImage} />
          {isChecked && <div className={Check} style={{ backgroundColor: factionData.borderColor }} />}
        </div>
        {(labelText?.length ?? 0) > 0 && <div className={LabelText}>{labelText}</div>}
      </div>
    );
  }

  private getScale(): number {
    return this.props.heightOverrideVmin ? this.props.heightOverrideVmin / DEFAULT_SIZE_VMIN : 1;
  }

  private buildRootStyle(): React.CSSProperties {
    const scale = this.getScale();
    let rootStyle: React.CSSProperties = {
      ...(this.props.style ?? {}),
      height: `${DEFAULT_SIZE_VMIN * scale}vmin`
    };

    return rootStyle;
  }

  private buildBoxRootStyle(): React.CSSProperties {
    const scale = this.getScale();
    let rootStyle: React.CSSProperties = {
      ...(this.props.style ?? {}),
      width: `${DEFAULT_SIZE_VMIN * scale}vmin`,
      height: `${DEFAULT_SIZE_VMIN * scale}vmin`
    };

    return rootStyle;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionCheckbox = connect(mapStateToProps)(AFactionCheckbox);
