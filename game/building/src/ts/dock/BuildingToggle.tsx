/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface BuildingToggleProps {
  toggle: () => void;
};
export interface BuildingToggleState {
};

class BuildingToggle extends React.Component<BuildingToggleProps, BuildingToggleState> {
  public name: string = 'BuildingToggle';

  constructor(props: BuildingToggleProps) {
    super(props);
  }

  render() {
    return (
      <div className="toggle-button" onClick={this.props.toggle}>
        <div/>
      </div>
    );
  }
}

export default BuildingToggle;
