/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events} from 'camelot-unchained';
import * as React from 'react';
import RespawnLocation from './RespawnLocation';

export interface RespawnButtonProps {
  label: string;
  location: RespawnLocation;
};
export interface RespawnButtonState {
};

declare const cuAPI: any;

class RespawnButton extends React.Component<RespawnButtonProps, RespawnButtonState> {
  public name: string = 'RespawnButton';

  constructor(props: RespawnButtonProps) {
    super(props);
  }

  respawn = (): void => {
    cuAPI.Respawn(this.props.location.id);
  }

  render() {
    let distance: JSX.Element;
    if (this.props.location.distance !== undefined) {
      distance =
        <div className='distance'>
          ({Math.round(this.props.location.distance)}m)
        </div>;
    }
    return (
      <div className='button' onClick={this.respawn}>
        <div className='label'>
          {distance}
          {this.props.label}
        </div>
      </div>
    );
  }
}

export default RespawnButton;
