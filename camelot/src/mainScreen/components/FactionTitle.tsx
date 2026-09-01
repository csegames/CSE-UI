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
import { FittingView } from '../../shared/components/FittingView';

const Root = 'HUD-FactionTitle-Root';
const TitleSizer = 'HUD-FactionTitle-TitleSizer';
const Title = 'HUD-FactionTitle-Title';

const DEFAULT_HEIGHT_VMIN = 12.5;
const DEFAULT_FONT_SIZE_REM = 1.5;

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
  heightOverrideVmin?: number;
  // The default font size scales with heightOverrideVmin, which gets unreadably small on compact
  // banners; FittingView still shrinks oversized text to fit.
  fontSizeOverrideRem?: number;
  secondary?: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionTitle extends React.Component<Props> {
  render(): JSX.Element {
    const {
      factionIDOverride,
      heightOverrideVmin,
      fontSizeOverrideRem,
      secondary,
      uiFactionID,
      dispatch,
      className,
      style,
      children,
      ...otherProps
    } = this.props;

    const scale = this.props.heightOverrideVmin ? this.props.heightOverrideVmin / DEFAULT_HEIGHT_VMIN : 1;

    return (
      <div className={`${Root} ${className}`} style={this.buildRootStyle(scale)} {...otherProps}>
        <FittingView className={TitleSizer} dontUpscale={true} style={this.buildSizerStyle(scale)}>
          <div className={Title} style={this.buildTitleStyle(scale)}>
            {children}
          </div>
        </FittingView>
      </div>
    );
  }

  private buildRootStyle(scale: number): React.CSSProperties {
    const factionData = getFactionData(this.props.uiFactionID);
    const headerImage = this.props.secondary ? factionData.headerBorderSecondaryImage : factionData.headerBorderImage;
    let rootStyle: React.CSSProperties = {
      backgroundImage: `url(${headerImage})`,
      top: `${-6.75 * scale}vmin`,
      height: `${DEFAULT_HEIGHT_VMIN * scale}vmin`,
      minWidth: `${DEFAULT_HEIGHT_VMIN * 2.4 * scale}vmin`,

      ...(this.props.style ?? {})
    };

    return rootStyle;
  }

  private buildSizerStyle(scale: number): React.CSSProperties {
    const style: React.CSSProperties = {
      top: `${DEFAULT_HEIGHT_VMIN * 0.384 * scale}vmin`,
      width: `${DEFAULT_HEIGHT_VMIN * 1.25 * scale}vmin`,
      height: `${DEFAULT_HEIGHT_VMIN * 0.2 * scale}vmin`
    };
    return style;
  }

  private buildTitleStyle(scale: number): React.CSSProperties {
    const style: React.CSSProperties = {
      fontSize: `${this.props.fontSizeOverrideRem ?? DEFAULT_FONT_SIZE_REM * scale}rem`
    };
    return style;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionTitle = connect(mapStateToProps)(AFactionTitle);
