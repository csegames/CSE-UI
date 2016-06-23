/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Blueprint } from '../stores/BlueprintStore';

export interface BlueprintIconProps {
  blueprint: Blueprint;
  select: (blueprint: Blueprint) => void;
  selected: boolean;
};
export interface BlueprintIconState {
};

class BlueprintIcon extends React.Component<BlueprintIconProps, BlueprintIconState> {
  public name: string = 'BlueprintIcon';

  constructor(props: BlueprintIconProps) {
    super(props);
  }

  select = (): void => {
    this.props.select(this.props.blueprint);
  }

  render() {
    return (
      <div className={'blueprint-icon' + (this.props.selected ? ' selected' : '')}
           onClick={this.select}>
        { this.props.blueprint.icon ?
          <img src={'data:image/png;base64,' + this.props.blueprint.icon}/>
          : undefined
        }
        <label>{this.props.blueprint.name}</label>
      </div>
    );
  }
}

export default BlueprintIcon;
