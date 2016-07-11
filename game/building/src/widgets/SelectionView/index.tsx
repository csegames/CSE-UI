/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {BuildingItem, BuildingItemType} from '../../lib/BuildingItem';

export interface SelectionViewProps {
  item: BuildingItem;
}

export interface SelectionViewState {
}

class SelectionView extends React.Component<SelectionViewProps, SelectionViewState> {

  constructor(props: SelectionViewProps) {
    super(props);
  }

  render() {
    if (this.props.item == null) return null;
    return (
      <div className='building__selection-view'>
        <div className='preview'>
          <img className='icon' src={this.props.item.icon} />
        </div>
        <p>{this.props.item.name}</p>
        <hr />
        <p>{this.props.item.description}</p>
      </div>
    )
  }
}

export default SelectionView;
