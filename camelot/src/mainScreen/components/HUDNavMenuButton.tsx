/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import TooltipSource from './TooltipSource';

// Styles.
const Root = 'HUD-NavMenu-ItemContainer';
const RootClickable = 'HUD-NavMenu-ItemContainerClickable';
const Icon = 'HUD-NavMenu-ItemIcon';
const Count = 'HUD-NavMenu-ItemCount';

interface ReactProps {
  tooltipID: string;
  tooltipContent: string | (() => React.ReactNode);
  icon: string;
  count?: number;
  onClick?: () => void;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class HUDNavMenuButton extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <TooltipSource
        key={this.props.tooltipID}
        className={this.props.onClick ? `${Root} ${RootClickable}` : Root}
        tooltipParams={{ content: this.props.tooltipContent, id: this.props.tooltipID }}
        onMouseDown={this.props.onClick}
      >
        <img className={Icon} src={this.props.icon} />
        {this.props.count !== undefined && <span className={Count}>{this.props.count}</span>}
      </TooltipSource>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export default connect(mapStateToProps)(HUDNavMenuButton);
