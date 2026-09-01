/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { PerformanceWarningEntryDef } from './dataSources/manifest/performanceWarningManifest';
import { RootState } from './redux/store';

const RootContainer = 'WarningIcons-Root';

const IconsContainer = 'WarningIcons-IconContainer';

const Icon = 'WarningIcons-Icon';

interface State {}

interface ReactProps {}

interface InjectedProps {
  activePerformanceWarningIDs: string[];
  performanceWarnings: Dictionary<PerformanceWarningEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AWarningIcons extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    if (!this.props.activePerformanceWarningIDs?.length) {
      return null;
    }

    return (
      <div id='WarningIcons_HUD' className={RootContainer}>
        {this.renderWarningIcons()}
      </div>
    );
  }

  public renderWarningIcons(): JSX.Element {
    const icons: JSX.Element[] = [];

    const addIcon = (performanceWarningID: string) => {
      const performanceWarning = this.props.performanceWarnings[performanceWarningID];
      if (performanceWarning) {
        icons.push(<div className={`${Icon}`} style={{ backgroundImage: `url(${performanceWarning.iconImage})` }} />);
      }
    };

    this.props.activePerformanceWarningIDs.forEach(addIcon);

    return <div className={IconsContainer}>{icons}</div>;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  return {
    ...ownProps,
    activePerformanceWarningIDs: state.performanceWarnings.activePerformanceWarningIDs,
    performanceWarnings: state.performanceWarnings.performanceWarnings
  };
}

export const WarningIcons = connect(mapStateToProps)(AWarningIcons);
