/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-26 10:46:57
 */

import * as React from 'react';
import { LinkAddress } from '../../services/session/navigation';

export interface PersonalContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
}

export interface PersonalContentState {

}

export class PersonalContent extends React.Component<PersonalContentProps, PersonalContentState> {

  constructor(props: PersonalContentProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='PersonalContent'>
        Personal content under construction.
        <br />
        Viewing page {this.props.address.id}.
      </div>
    )
  }
}

export default PersonalContent;
