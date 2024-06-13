/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { ClientAnnouncementPopups } from './ClientAnnouncementPopups';
import { RuneModAnnouncementPopups } from './RuneModAnnouncementPopups';

const Root = 'Announcements-Popups';

interface InjectedProps {}

type Props = InjectedProps;

class AAnnouncementPopups extends React.Component<Props> {
  public render() {
    return (
      <div className={Root}>
        <ClientAnnouncementPopups />
        <RuneModAnnouncementPopups />
      </div>
    );
  }
}

function mapStateToProps(state: RootState): Props {
  return {};
}

export const AnnouncementPopups = connect(mapStateToProps)(AAnnouncementPopups);
