/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface PlayerPhotoProps {
  containerClass?: string;
  photo: string;
}

export interface PlayerPhotoState {
}

class PlayerPhoto extends React.Component<PlayerPhotoProps, PlayerPhotoState> {

  constructor(props: PlayerPhotoProps) {
    super(props);
  }

  render() {
    return (
      <div className={`player-status-bar__player-photo ${this.props.containerClass || ''}`}>
        <img src={this.props.photo} />
      </div>
    )
  }
}

export default PlayerPhoto;
