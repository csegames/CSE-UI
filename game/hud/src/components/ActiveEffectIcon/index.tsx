/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ActiveEffectIconProps {
  containerClass?: string;
  icon: string;
}

export interface ActiveEffectIconState {
}

class ActiveEffectIcon extends React.Component<ActiveEffectIconProps, ActiveEffectIconState> {
  render() {
    return (
      <div className={this.props.containerClass || 'ActiveEffectIcon'}>
        <img src={this.props.icon} />
      </div>
    )
  }
}

export default ActiveEffectIcon;
