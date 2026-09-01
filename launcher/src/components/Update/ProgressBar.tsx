/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { RootState } from '../../redux/store';
import { PatcherStatus } from '../../api/patcher/patcherStatus';

const BarContainer = 'Controller-ProgressBar-ProgressBarView-BarContainer';
const Bar = 'Controller-ProgressBar-ProgressBarView-Bar';
const ButtonShine = 'Controller-ProgressBar-ProgressBarView-ButtonShine';
const Decoration = 'Controller-ProgressBar-ProgressBarView-Decoration';

interface ReactProps {}

interface InjectedProps {
  status: PatcherStatus;
  estimate: number;
  remaining: number;
}

type Props = ReactProps & InjectedProps;

class AProgressBar extends React.Component<Props & DispatchProp> {
  public render() {
    const { status, estimate, remaining } = this.props;

    let progress = 100;

    if (status == PatcherStatus.Updating) {
      const percentDone = estimate ? 100.0 - (remaining / estimate) * 100 : 0;
      progress = +percentDone.toFixed(0);
    }

    return (
      <div className={BarContainer} {...{ progress }}>
        <div className={Bar} style={{ left: `${-(100 - progress)}%`, width: progress === 100 ? '108%' : '100%' }} />
        <div className={`${Decoration} left`} />
        <div className={Decoration} />
        {progress === 100 && <div className={ButtonShine} />}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { status, estimate, remaining } = state.download;
  return {
    ...ownProps,
    status,
    estimate,
    remaining
  };
};

export const ProgressBar = connect(mapStateToProps)(AProgressBar);
