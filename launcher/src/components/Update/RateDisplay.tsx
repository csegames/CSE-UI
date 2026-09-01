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

const DESIRED_SAMPLE_COUNT = 10;

interface InjectedProps {
  rate: number;
  remaining: number;
}

interface State {
  samples: number[];
  index: number;
}

type Props = ReactProps & InjectedProps;

// TODO : smoothing function should be handled by patch client
export class ARateDisplay extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = { samples: [], index: 0 };
  }

  public render() {
    const { remaining } = this.props;
    const { samples } = this.state;
    if (!remaining || !samples.length) return null;

    const sum = samples.reduce((prev, current) => prev + current);
    return ` (${Progress.bypsToString(Math.floor(sum / samples.length))})`;
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.rate === prevProps.rate) return;
    const { samples, index } = this.state;
    const updated = samples.slice();
    if (samples.length < DESIRED_SAMPLE_COUNT) {
      updated.push(this.props.rate);
    } else {
      updated[index] = this.props.rate;
    }
    this.setState({ samples: updated, index: (index + 1) % DESIRED_SAMPLE_COUNT });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { rate, remaining } = state.download;
  return {
    ...ownProps,
    rate,
    remaining
  };
};

export const RateDisplay = connect(mapStateToProps)(ARateDisplay);
