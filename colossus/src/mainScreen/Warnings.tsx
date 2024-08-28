/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from './redux/store';
import { WarningIcons } from './WarningIcons';
import { WarningBroadcast } from './components/shared/notifications/WarningBroadcast';

const RootContainer = 'Warnings-Root';

interface State {}

interface ReactProps {}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class AWarnings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={RootContainer}>
        <WarningIcons />
        <WarningBroadcast />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  return {
    ...ownProps
  };
}

export const Warnings = connect(mapStateToProps)(AWarnings);
