/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { Progress } from '../../lib/Progress';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import { RemainingTimeDisplay } from './RemainingTimeDisplay';
import { RemainingSizeDisplay } from './RemainingSizeDisplay';
import { RateDisplay } from './RateDisplay';
import { PatcherStatus } from '../../api/patcher/patcherStatus';
import { ActiveNameDisplay } from './ActiveNameDisplay';

const Root = 'Controller-PatchButton-UpdateMessage-Root';
const UpdateLabel = 'Controller-PatchButton-UpdateMessage-UpdateLabel';

interface ReactProps {}

interface InjectedProps {
  status: number;
  estimate: number;
  started: Date | null;
}

type Props = ReactProps & InjectedProps;

export interface UpdateMessageState {}

export class AUpdateMessage extends React.Component<Props & DispatchProp, UpdateMessageState> {
  public render() {
    const { estimate, started } = this.props;

    if (!started || !estimate) {
      return <div className={Root} />;
    }

    const amnt = Progress.bytesToString(estimate);
    return (
      <div className={Root}>
        <div className={UpdateLabel}>
          {`${this.getVerb()} `}
          <ActiveNameDisplay />
          {`...`}
        </div>
        <div className={UpdateLabel}>
          <RemainingSizeDisplay />
          {`/${amnt}`}
          <RateDisplay />
        </div>
        <div className={UpdateLabel}>
          <RemainingTimeDisplay />
        </div>
      </div>
    );
  }

  private getVerb(): string {
    switch (this.props.status) {
      case PatcherStatus.Updating:
        return 'Updating';
      case PatcherStatus.Validating:
        return 'Validating';
      default:
        return 'Processing';
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { status, estimate, started } = state.download;
  return {
    ...ownProps,
    status,
    estimate,
    started
  };
};

export const UpdateMessage = connect(mapStateToProps)(AUpdateMessage);
