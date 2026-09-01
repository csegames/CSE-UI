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
}

type Props = ReactProps & InjectedProps;

export class ARemainingSizeDisplay extends React.Component<Props & DispatchProp> {
  public render() {
    const { estimate, remaining } = this.props;
    return Progress.bytesToString(estimate - remaining);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { estimate, remaining } = state.download;
  return {
    ...ownProps,
    estimate,
    remaining
  };
};

export const RemainingSizeDisplay = connect(mapStateToProps)(ARemainingSizeDisplay);
