/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { Progress } from '../../lib/Progress';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';

interface ReactProps {}

interface InjectedProps {
  estimate: number;
  remaining: number;
  started: Date | null;
}

type Props = ReactProps & InjectedProps;

export class ARemainingTimeDisplay extends React.Component<Props & DispatchProp> {
  public render() {
    const time = this.calcTime(this.props);
    if (time < 0) return 'Starting';
    if (time === 0) return 'Finalizing';
    return `${Progress.secondsToString(time)} remaining`;
  }

  // remove flicker between N and N - 1
  public shouldComponentUpdate(nextProps: Props): boolean {
    const current = this.calcTime(this.props);
    const expected = this.calcTime(nextProps);
    return current != expected && current != expected - 1;
  }

  private calcTime(props: Props): number {
    const { estimate, remaining, started } = props;
    if (!started || !estimate || remaining === estimate) {
      return -1;
    }

    if (remaining === 0) {
      return 0;
    }

    const completed = 1 - remaining / estimate;
    const elapsed = (Date.now() - started.valueOf()) / 1000;
    return Math.ceil(elapsed / completed - elapsed);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { estimate, remaining, started } = state.download;
  return {
    ...ownProps,
    estimate,
    remaining,
    started
  };
};

export const RemainingTimeDisplay = connect(mapStateToProps)(ARemainingTimeDisplay);
