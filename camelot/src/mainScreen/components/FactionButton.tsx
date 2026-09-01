/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { FactionData, getFactionData } from '../gameData/factionData';
import { FactionBorder, BorderType } from './FactionBorder';
import TooltipSource from './TooltipSource';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

const Root = 'HUD-FactionButton-Root';
const Background = 'HUD-FactionButton-Background';
const Content = 'HUD-FactionButton-Content';
const HoverBorder = 'HUD-FactionButton-HoverBorder';

const DEFAULT_WIDTHS_VMIN = {
  s: 4.5,
  m: 10.69,
  l: 13.86
};
const DEFAULT_HEIGHTS_VMIN = {
  s: 2.25,
  m: 3.85,
  l: 3.85
};
const DEFAULT_FONT_SIZES_REM = {
  s: 1.25,
  m: 1.5,
  l: 1.5
};
const IMAGE_KEYS = {
  s: 'buttonBackgroundSmallImage',
  m: 'buttonBackgroundMediumImage',
  l: 'buttonBackgroundImage'
};

interface State {
  id: string;
  hovered: boolean;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
  widthOverrideVmin?: number;
  disabled?: boolean;
  disabledTooltip?: string;
  size?: 's' | 'm' | 'l'; // Default is 'l'.
  fontScale?: number;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hovered: false, id: genID() };
  }

  render(): JSX.Element {
    const {
      widthOverrideVmin,
      uiFactionID,
      factionIDOverride,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
      disabled,
      disabledTooltip,
      dispatch,
      className,
      size,
      ...otherProps
    } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    const scale = this.getScale();

    return (
      <TooltipSource
        {...otherProps}
        key={this.state.id}
        className={`${Root} ${className} ${disabled ? 'disabled' : ''}`}
        style={this.buildRootStyle()}
        onMouseUp={(e) => {
          if (!disabled) {
            onClick?.(e);
            onMouseUp?.(e);
          }
        }}
        onMouseEnter={(e) => {
          this.setState({ hovered: !disabled });
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          this.setState({ hovered: false });
          onMouseLeave?.(e);
        }}
        tooltipID={`DisabledFactionButton${this.state.id}`}
        active={!!this.props.disabledTooltip && !!disabled}
        content={() => this.props.disabledTooltip}
        positionType='mouse'
      >
        <img className={Background} src={factionData[IMAGE_KEYS[size ?? 'l'] as keyof FactionData] as string} />
        <div className={Content}>{this.props.children}</div>
        {this.state.hovered && (
          <FactionBorder className={HoverBorder} type={BorderType.Primary} cornerSize={`${4 * scale}vmin`} />
        )}
      </TooltipSource>
    );
  }

  private getScale(): number {
    const size = this.props.size ?? 'l';
    return this.props.widthOverrideVmin ? this.props.widthOverrideVmin / DEFAULT_WIDTHS_VMIN[size] : 1;
  }

  private buildRootStyle(): React.CSSProperties {
    const scale = this.getScale();
    const fontScale = this.props.fontScale ?? 1;
    const size = this.props.size ?? 'l';

    const rootStyle: React.CSSProperties = {
      width: `${DEFAULT_WIDTHS_VMIN[size] * scale}vmin`,
      height: `${DEFAULT_HEIGHTS_VMIN[size] * scale}vmin`,
      lineHeight: `${DEFAULT_HEIGHTS_VMIN[size] * scale}vmin`,
      fontSize: `${DEFAULT_FONT_SIZES_REM[size] * fontScale * scale}rem`
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

export const FactionButton = connect(mapStateToProps)(AFactionButton);
