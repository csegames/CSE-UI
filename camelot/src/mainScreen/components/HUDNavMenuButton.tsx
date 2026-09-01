/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { FactionBorder, BorderType } from './FactionBorder';
import TooltipSource from './TooltipSource';
import { getFactionData } from '../gameData/factionData';

// CSS classes
const Root = 'HUD-NavMenu-ItemContainer';
const RootClickable = 'HUD-NavMenu-ItemContainerClickable';
const Icon = 'HUD-NavMenu-ItemIcon';
const Count = 'HUD-NavMenu-ItemCount';
const Glow = 'HUD-NavMenu-ItemGlow';

const GLOW_BOX_SHADOW = 'inset 0 0 1.2vmin 0.5vmin';

interface ReactProps {
  tooltipID: string;
  tooltipContent: string | (() => React.ReactNode);
  icon: string;
  count?: number;
  // Pulses a realm-colored inner glow around the icon, e.g. to flag unspent ability points.
  glow?: boolean;
  onClick?: () => void;
}

interface InjectedProps {
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

class HUDNavMenuButton extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <TooltipSource
        key={this.props.tooltipID}
        className={this.props.onClick ? `${Root} ${RootClickable}` : Root}
        tooltipID={this.props.tooltipID}
        content={
          typeof this.props.tooltipContent === 'function' ? this.props.tooltipContent : () => this.props.tooltipContent
        }
        yOffset={-2}
        positionType='mouse'
        onMouseDown={this.props.onClick}
      >
        <FactionBorder cornerSize='2.25vmin' type={BorderType.Secondary}>
          <>
            <img className={Icon} src={this.props.icon} />
            {this.props.count !== undefined && <span className={Count}>{this.props.count}</span>}
            {this.props.glow && (
              <div
                className={Glow}
                style={{ boxShadow: `${GLOW_BOX_SHADOW} ${getFactionData(this.props.uiFactionID).selectionGlowColor}` }}
              />
            )}
          </>
        </FactionBorder>
      </TooltipSource>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID
  };
}

export default connect(mapStateToProps)(HUDNavMenuButton);
