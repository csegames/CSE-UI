/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface DisplayNameState { }
export interface DisplayNameProps {
  name: string,
}

export class DisplayName extends React.Component<DisplayNameProps, DisplayNameState> {
  constructor(props: DisplayNameProps) {
    super(props);
  }
  render() {
    return (
      <div className={'name'}>
        <label className={'label'}>{this.props.name}</label>
      </div>
    );
  }
}

export default DisplayName;
