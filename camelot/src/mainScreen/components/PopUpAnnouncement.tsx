/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { PopUpAnnouncement as IPopUpAnnouncement, hidePopUpAnnouncement } from '../redux/popUpAnnouncementsSlice';

const Root = 'HUD-PopUpAnnouncement-Root';
const Message = 'HUD-PopUpAnnouncement-Message';

interface ReactProps {
  popUpAnnouncement: IPopUpAnnouncement;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APopUpAnnouncement extends React.Component<Props> {
  closeTimeout: number;

  render(): JSX.Element {
    return (
      <div className={Root}>
        <span className={Message}>{this.props.popUpAnnouncement.text}</span>
      </div>
    );
  }

  componentDidMount() {
    this.closeTimeout = window.setTimeout(this.closeSelf.bind(this), 5000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.closeTimeout);
  }

  closeSelf(): void {
    this.props.dispatch(hidePopUpAnnouncement(this.props.popUpAnnouncement.id));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const PopUpAnnouncement = connect(mapStateToProps)(APopUpAnnouncement);
