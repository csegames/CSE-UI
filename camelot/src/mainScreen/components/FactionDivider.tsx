/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';

const Root = 'HUD-FactionDivider-Root';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
  position?: 'inline' | 'top' | 'bottom';
  simple?: boolean;
}

interface InjectedProps {
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

class AFactionDivider extends React.Component<Props> {
  render(): JSX.Element {
    let { uiFactionID, factionIDOverride, className, position, simple, ...otherProps } = this.props;
    position = position ?? 'inline';

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <img
        {...otherProps}
        className={`${Root} ${className} ${position}`}
        src={simple ? factionData.dividerVerticalSimpleImage : factionData.dividerVerticalImage}
      />
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionDivider = connect(mapStateToProps)(AFactionDivider);
