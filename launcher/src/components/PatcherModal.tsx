/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

const Root = 'PatcherModal-Root';

interface ReactProps extends React.HTMLProps<HTMLDivElement> {}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class APatcherModal extends React.Component<Props> {
  render(): React.ReactNode {
    const { children, ...otherProps } = this.props;

    return (
      <div className={Root} {...otherProps}>
        {children}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const PatcherModal = connect(mapStateToProps)(APatcherModal);
