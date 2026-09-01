/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';

export interface SpinnerStyle {
  spinner: React.CSSProperties;
}

const Root = 'Spinner-Root';

interface ReactProps {
  styles?: Partial<SpinnerStyle>;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ASpinner extends React.Component<Props> {
  render(): React.ReactNode {
    return <div className={Root} style={this.props.styles?.spinner ?? {}} />;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const Spinner = connect(mapStateToProps)(ASpinner);
