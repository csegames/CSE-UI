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
import TooltipSource from './TooltipSource';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

const Root = 'HUD-FactionCornerButton-Root';
const Background = 'HUD-FactionCornerButton-Background';

const DEFAULT_SIZE_VMIN = 4;

export enum CornerButtonType {
  Close,
  Lock,
  Maximize,
  Unlock,
  Windowed
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  type: CornerButtonType;
  factionIDOverride?: string;
  sizeOverrideVmin?: number;
  disabled?: boolean;
  small?: boolean;
  tooltipText?: string;
  soundEvent?: SoundEvents;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionCornerButton extends React.Component<Props> {
  render(): JSX.Element {
    let {
      factionIDOverride,
      uiFactionID,
      sizeOverrideVmin,
      type,
      onClick,
      onMouseUp,
      disabled,
      dispatch,
      className,
      small,
      tooltipText,
      soundEvent,
      ...otherProps
    } = this.props;

    soundEvent = this.getSoundEvent();

    return (
      <TooltipSource
        {...otherProps}
        className={`${Root} ${className}${small ? ' small' : ''}${disabled ? ' disabled' : ''}`}
        onMouseUp={(e) => {
          if (!disabled) {
            onClick?.(e);
            onMouseUp?.(e);
            if (soundEvent) {
              clientAPI.playGameSound(soundEvent);
            }
          }
        }}
        style={this.buildRootStyle()}
        tooltipID='CornerButton'
        content={() => tooltipText}
        positionType='mouse'
      >
        <img className={Background} src={this.getButtonImage()} />
      </TooltipSource>
    );
  }

  private getSoundEvent(): SoundEvents {
    // If an explicit override is provided, use it.
    if (this.props.soundEvent) {
      return this.props.soundEvent;
    }

    // Otherwise we have some defaults.
    switch (this.props.type) {
      case CornerButtonType.Close:
      case CornerButtonType.Maximize:
      case CornerButtonType.Windowed: {
        return SoundEvents.PLAY_UI_GENERIC_CLOSEX;
      }
      case CornerButtonType.Lock:
      case CornerButtonType.Unlock:
        return SoundEvents.PLAY_UI_SFX_WARBAND_LOCK_TOGGLE;
      default: {
        // Unsupported types get no SFX.
        return undefined;
      }
    }
  }

  private getButtonImage(): string {
    const factionData = getFactionData(this.props.uiFactionID);
    switch (this.props.type) {
      case CornerButtonType.Close:
        return factionData.windowCloseImage;
      case CornerButtonType.Lock:
        return factionData.windowLockImage;
      case CornerButtonType.Maximize:
        return factionData.windowMaximizeImage;
      case CornerButtonType.Unlock:
        return factionData.windowUnlockImage;
      case CornerButtonType.Windowed:
        return factionData.windowWindowedImage;
    }
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

export const FactionCornerButton = connect(mapStateToProps)(AFactionCornerButton);
