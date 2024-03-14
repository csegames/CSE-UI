/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';

const AutoRunTrackerContainer = 'MovementTrackers-AutoRunTracker-Container';
const AutoRunTrackerIcon = 'MovementTrackers-AutoRunTracker-Icon';

interface ReactProps {}

interface InjectedProps {
  isAutoRunning: boolean;
}

type Props = ReactProps & InjectedProps;

class AAutoRunTracker extends React.Component<Props> {
  public render() {
    if (this.props.isAutoRunning) {
      return (
        <div className={AutoRunTrackerContainer}>
          <div className={AutoRunTrackerIcon} />
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const isAutoRunning: boolean = state.baseGame.isAutoRunning;
  return {
    ...ownProps,
    isAutoRunning
  };
}

export const AutoRunTracker = connect(mapStateToProps)(AAutoRunTracker);
