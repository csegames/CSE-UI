/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';

const Root = 'HUD-FactionSplitter-Root';
const Cap = 'HUD-FactionSplitter-Cap';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  factionIDOverride?: string;
}

interface InjectedProps {
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

class AFactionSplitter extends React.Component<Props> {
  render(): JSX.Element {
    let { uiFactionID, factionIDOverride, className, style, ...otherProps } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    let finalStyle: React.CSSProperties = { ...(style ?? {}), backgroundColor: factionData.borderColor };

    return (
      <div className={`${Root} ${className}`} style={finalStyle} {...otherProps}>
        <img className={`${Cap} top`} src={factionData.endcapImage} />
        <img className={`${Cap} bottom`} src={factionData.endcapImage} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionSplitter = connect(mapStateToProps)(AFactionSplitter);
