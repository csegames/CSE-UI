/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { ErrorNotice as IErrorNotice, hideErrorNotice } from '../redux/errorNoticesSlice';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import ErrorNoticeIconURL from '../../images/error-notice-icon.png';

const Root = 'HUD-ErrorNotice-Root';
const Icon = 'HUD-ErrorNotice-Icon';
const Text = 'HUD-ErrorNotice-Text';

interface ReactProps {
  errorNotice: IErrorNotice;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AErrorNotice extends React.Component<Props> {
  closeTimeout: number;

  render(): JSX.Element {
    return (
      <div className={Root} onClick={this.closeSelf.bind(this)}>
        <img className={Icon} src={ErrorNoticeIconURL} />
        <div className={Text}>
          <span>Oh No!</span>
          <span>{this.props.errorNotice.text}</span>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.closeTimeout = window.setTimeout(this.closeSelf.bind(this), 3000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.closeTimeout);
  }

  closeSelf(): void {
    this.props.dispatch(hideErrorNotice(this.props.errorNotice.id));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const ErrorNotice = connect(mapStateToProps)(AErrorNotice);
